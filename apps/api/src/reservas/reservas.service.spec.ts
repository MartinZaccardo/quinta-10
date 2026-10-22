import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { ReservasService } from './reservas.service';
import { PrismaService } from '../prisma/prisma.service';
import { EstadoReserva, RolUsuario } from '../generated/prisma/client';

// ── Helpers ───────────────────────────────────────────────────────────────────

const CONFIG_ESTANDAR = { horaApertura: 540, horaCierre: 1440 }; // 09:00 – 00:00
const INTERVALO_60 = 60;

function reservaFake(overrides: Record<string, unknown> = {}) {
  return {
    id: 'res-1',
    canchaId: 'cancha-1',
    usuarioId: 'usuario-1',
    fechaReserva: new Date('2026-09-21'),
    horaInicio: 600,
    horaFin: 660,
    estado: EstadoReserva.PENDIENTE,
    nombreContacto: null,
    telefonoContacto: null,
    usuario: null,
    ...overrides,
  };
}

// ── Mock de PrismaService ─────────────────────────────────────────────────────

const mockDb = {
  cancha: { findUnique: jest.fn() },
  configuracionHoraria: { findUnique: jest.fn() },
  reserva: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
    count: jest.fn(),
  },
  turnoFijo: { findMany: jest.fn() },
  usuario: { findUnique: jest.fn() },
  $transaction: jest.fn(),
};

// ── Suite principal ───────────────────────────────────────────────────────────

describe('ReservasService', () => {
  let service: ReservasService;

  beforeEach(async () => {
    jest.resetAllMocks();

    // $transaction delega al mismo mockDb para que update/updateMany sean rastreables
    mockDb.$transaction.mockImplementation((cb: (tx: typeof mockDb) => Promise<unknown>) =>
      cb(mockDb),
    );

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservasService,
        { provide: PrismaService, useValue: { db: mockDb } },
      ],
    }).compile();

    service = module.get<ReservasService>(ReservasService);
  });

  // ── generarBloques ──────────────────────────────────────────────────────────
  // Método privado puro (sin IO): se accede vía cast a any para poder testearlo directamente.

  describe('generarBloques', () => {
    const generar = (reservas: unknown[], turnosFijos: unknown[]) =>
      (service as any).generarBloques(CONFIG_ESTANDAR, INTERVALO_60, reservas, turnosFijos);

    it('devuelve todos los slots DISPONIBLE cuando no hay reservas ni turnos fijos', () => {
      const bloques = generar([], []);
      const totalEsperado = (CONFIG_ESTANDAR.horaCierre - CONFIG_ESTANDAR.horaApertura) / INTERVALO_60;
      expect(bloques).toHaveLength(totalEsperado);
      expect(bloques.every((b: any) => b.estado === 'DISPONIBLE')).toBe(true);
    });

    it('marca OCUPADO el slot de una reserva CONFIRMADA', () => {
      const reservas = [reservaFake({ estado: EstadoReserva.CONFIRMADA, horaInicio: 600, horaFin: 660 })];
      const slot = generar(reservas, []).find((b: any) => b.horaInicio === 600);
      expect(slot.estado).toBe('OCUPADO');
    });

    it('marca PENDIENTE el slot de una reserva PENDIENTE e incluye el id', () => {
      const reservas = [reservaFake({ id: 'res-p1', estado: EstadoReserva.PENDIENTE })];
      const slot = generar(reservas, []).find((b: any) => b.horaInicio === 600);
      expect(slot.estado).toBe('PENDIENTE');
      expect(slot.reservaId).toBe('res-p1');
    });

    it('marca OCUPADO con esTurnoFijo=true cuando hay un turno fijo activo', () => {
      const turnosFijos = [{ horaInicio: 720, horaFin: 780, usuario: null }];
      const slot = generar([], turnosFijos).find((b: any) => b.horaInicio === 720);
      expect(slot.estado).toBe('OCUPADO');
      expect(slot.esTurnoFijo).toBe(true);
    });

    it('CONFIRMADA tiene prioridad sobre PENDIENTE en el mismo slot', () => {
      const reservas = [
        reservaFake({ id: 'conf-1', estado: EstadoReserva.CONFIRMADA }),
        reservaFake({ id: 'pend-1', estado: EstadoReserva.PENDIENTE }),
      ];
      const slot = generar(reservas, []).find((b: any) => b.horaInicio === 600);
      expect(slot.estado).toBe('OCUPADO');
    });

    it('expone nombre y teléfono del usuario registrado en un slot OCUPADO', () => {
      const reservas = [
        reservaFake({
          estado: EstadoReserva.CONFIRMADA,
          usuario: { nombre: 'Juan', apellido: 'Pérez', numeroWhatsApp: '5491100000000' },
        }),
      ];
      const slot = generar(reservas, []).find((b: any) => b.horaInicio === 600);
      expect(slot.contacto).toBe('Juan Pérez');
      expect(slot.telefono).toBe('5491100000000');
    });

    it('informa la cantidad de solicitudes pendientes en un mismo slot', () => {
      const reservas = [
        reservaFake({ id: 'p1', estado: EstadoReserva.PENDIENTE }),
        reservaFake({ id: 'p2', estado: EstadoReserva.PENDIENTE }),
        reservaFake({ id: 'p3', estado: EstadoReserva.PENDIENTE }),
      ];
      const slot = generar(reservas, []).find((b: any) => b.horaInicio === 600);
      expect(slot.cantidadPendientes).toBe(3);
    });

    it('genera el número correcto de slots con intervalo de 30 minutos (pádel)', () => {
      const configPadel = { horaApertura: 540, horaCierre: 600 };
      const bloques = (service as any).generarBloques(configPadel, 30, [], []);
      expect(bloques).toHaveLength(2);
    });
  });

  // ── confirmar ───────────────────────────────────────────────────────────────

  describe('confirmar', () => {
    it('confirma la reserva y cancela automáticamente las pendientes solapadas', async () => {
      const reserva = reservaFake({ estado: EstadoReserva.PENDIENTE });
      mockDb.reserva.findUnique.mockResolvedValue(reserva);
      mockDb.reserva.update.mockResolvedValue({ ...reserva, estado: EstadoReserva.CONFIRMADA });
      mockDb.reserva.updateMany.mockResolvedValue({ count: 2 });

      const resultado = await service.confirmar('res-1');

      expect(resultado.estado).toBe(EstadoReserva.CONFIRMADA);
      expect(mockDb.reserva.updateMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            id: { not: 'res-1' },
            estado: EstadoReserva.PENDIENTE,
          }),
          data: { estado: EstadoReserva.CANCELADA },
        }),
      );
    });

    it('lanza BadRequestException si la reserva no está en estado PENDIENTE', async () => {
      mockDb.reserva.findUnique.mockResolvedValue(
        reservaFake({ estado: EstadoReserva.CONFIRMADA }),
      );
      await expect(service.confirmar('res-1')).rejects.toThrow(BadRequestException);
    });

    it('lanza NotFoundException si la reserva no existe', async () => {
      mockDb.reserva.findUnique.mockResolvedValue(null);
      await expect(service.confirmar('res-inexistente')).rejects.toThrow(NotFoundException);
    });
  });

  // ── solicitar ───────────────────────────────────────────────────────────────

  describe('solicitar', () => {
    const DTO_BASE = {
      canchaId: 'cancha-1',
      fecha: '2099-12-31',
      horaInicio: 600,
      horaFin: 660,
    };

    beforeEach(() => {
      mockDb.cancha.findUnique.mockResolvedValue({
        id: 'cancha-1',
        activa: true,
        intervaloMinutos: 60,
      });
      mockDb.configuracionHoraria.findUnique.mockResolvedValue(CONFIG_ESTANDAR);
      mockDb.reserva.findFirst.mockResolvedValue(null);
      mockDb.reserva.create.mockResolvedValue(reservaFake());
    });

    it('crea la reserva cuando el slot está libre', async () => {
      await service.solicitar(DTO_BASE, 'usuario-1');
      expect(mockDb.reserva.create).toHaveBeenCalledTimes(1);
    });

    it('lanza BadRequestException para una fecha en el pasado', async () => {
      await expect(
        service.solicitar({ ...DTO_BASE, fecha: '2000-01-01' }, 'usuario-1'),
      ).rejects.toThrow(BadRequestException);
    });

    it('lanza BadRequestException si horaFin es menor o igual a horaInicio', async () => {
      await expect(
        service.solicitar({ ...DTO_BASE, horaFin: 540 }, 'usuario-1'),
      ).rejects.toThrow(BadRequestException);
    });

    it('lanza BadRequestException si la duración es menor a 60 minutos', async () => {
      await expect(
        service.solicitar({ ...DTO_BASE, horaInicio: 600, horaFin: 630 }, 'usuario-1'),
      ).rejects.toThrow(BadRequestException);
    });

    it('lanza BadRequestException si el horario está fuera del rango del predio', async () => {
      await expect(
        service.solicitar({ ...DTO_BASE, horaInicio: 60, horaFin: 120 }, 'usuario-1'),
      ).rejects.toThrow(BadRequestException);
    });

    it('lanza ConflictException si ya existe una reserva confirmada en ese slot', async () => {
      mockDb.reserva.findFirst.mockResolvedValue(
        reservaFake({ estado: EstadoReserva.CONFIRMADA }),
      );
      await expect(service.solicitar(DTO_BASE, 'usuario-1')).rejects.toThrow(ConflictException);
    });
  });

  // ── cancelar ────────────────────────────────────────────────────────────────

  describe('cancelar', () => {
    it('lanza ForbiddenException si un cliente intenta cancelar una reserva ajena', async () => {
      mockDb.reserva.findUnique.mockResolvedValue(
        reservaFake({ usuarioId: 'otro-usuario' }),
      );
      await expect(
        service.cancelar('res-1', { sub: 'usuario-1', rol: RolUsuario.CLIENTE, email: 'a@b.com' }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('el administrador puede cancelar cualquier reserva', async () => {
      mockDb.reserva.findUnique.mockResolvedValue(
        reservaFake({ usuarioId: 'otro-usuario', estado: EstadoReserva.CONFIRMADA }),
      );
      mockDb.reserva.update.mockResolvedValue(reservaFake({ estado: EstadoReserva.CANCELADA }));

      const resultado = await service.cancelar('res-1', {
        sub: 'admin-1',
        rol: RolUsuario.ADMINISTRADOR,
        email: 'admin@test.com',
      });

      expect(resultado.estado).toBe(EstadoReserva.CANCELADA);
    });

    it('lanza BadRequestException si la reserva ya estaba cancelada', async () => {
      mockDb.reserva.findUnique.mockResolvedValue(
        reservaFake({ estado: EstadoReserva.CANCELADA }),
      );
      await expect(
        service.cancelar('res-1', {
          sub: 'admin-1',
          rol: RolUsuario.ADMINISTRADOR,
          email: 'admin@test.com',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
