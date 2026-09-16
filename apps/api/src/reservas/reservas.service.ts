import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DiaSemana, EstadoReserva, RolUsuario } from '../generated/prisma/client';
import { JwtPayload } from '../autenticacion/strategies/jwt.strategy';
import { ConsultarSlotsDto } from './dto/consultar-slots.dto';
import { SolicitarReservaDto } from './dto/solicitar-reserva.dto';
import { CrearReservaManualDto } from './dto/crear-reserva-manual.dto';

export type EstadoBloque = 'DISPONIBLE' | 'PENDIENTE' | 'OCUPADO';

export interface BloqueHorario {
  horaInicio: number;
  horaFin: number;
  estado: EstadoBloque;
}

const DIAS_SEMANA: DiaSemana[] = [
  DiaSemana.DOMINGO,
  DiaSemana.LUNES,
  DiaSemana.MARTES,
  DiaSemana.MIERCOLES,
  DiaSemana.JUEVES,
  DiaSemana.VIERNES,
  DiaSemana.SABADO,
];

function parsearFechaUTC(fechaStr: string): Date {
  const [anio, mes, dia] = fechaStr.split('-').map(Number);
  return new Date(Date.UTC(anio, mes - 1, dia));
}

function fechaADiaSemana(fecha: Date): DiaSemana {
  return DIAS_SEMANA[fecha.getUTCDay()];
}

// Dos intervalos [inicioA, finA) y [inicioB, finB) se superponen si y solo si:
// inicioA < finB AND finA > inicioB
function superposicion(inicioA: number, finA: number, inicioB: number, finB: number): boolean {
  return inicioA < finB && finA > inicioB;
}

@Injectable()
export class ReservasService {
  constructor(private readonly prisma: PrismaService) {}

  async calcularSlots(dto: ConsultarSlotsDto): Promise<BloqueHorario[]> {
    const fecha = parsearFechaUTC(dto.fecha);
    const diaSemana = fechaADiaSemana(fecha);

    const config = await this.prisma.db.configuracionHoraria.findUnique({ where: { diaSemana } });
    if (!config) return [];

    const [reservas, turnosFijos] = await Promise.all([
      this.prisma.db.reserva.findMany({
        where: {
          canchaId: dto.canchaId,
          fechaReserva: fecha,
          estado: { not: EstadoReserva.CANCELADA },
        },
      }),
      this.prisma.db.turnoFijo.findMany({
        where: {
          canchaId: dto.canchaId,
          diaSemana,
          activo: true,
          fechaInicio: { lte: fecha },
          excepciones: { none: { fechaExcluida: fecha } },
        },
      }),
    ]);

    const bloques: BloqueHorario[] = [];

    for (let inicio = config.horaApertura; inicio < config.horaCierre; inicio += config.intervaloMinutos) {
      const fin = inicio + config.intervaloMinutos;

      const hayConfirmada = reservas.some(
        r => r.estado === EstadoReserva.CONFIRMADA && superposicion(inicio, fin, r.horaInicio, r.horaFin),
      );

      if (hayConfirmada) {
        bloques.push({ horaInicio: inicio, horaFin: fin, estado: 'OCUPADO' });
        continue;
      }

      const hayPendiente =
        reservas.some(r => r.estado === EstadoReserva.PENDIENTE && superposicion(inicio, fin, r.horaInicio, r.horaFin)) ||
        turnosFijos.some(t => superposicion(inicio, fin, t.horaInicio, t.horaFin));

      bloques.push({ horaInicio: inicio, horaFin: fin, estado: hayPendiente ? 'PENDIENTE' : 'DISPONIBLE' });
    }

    return bloques;
  }

  async solicitar(dto: SolicitarReservaDto, usuarioId: string) {
    const fecha = parsearFechaUTC(dto.fecha);

    const hoy = new Date();
    hoy.setUTCHours(0, 0, 0, 0);
    if (fecha < hoy) throw new BadRequestException('No se pueden solicitar reservas en fechas pasadas');

    const cancha = await this.prisma.db.cancha.findUnique({ where: { id: dto.canchaId } });
    if (!cancha?.activa) throw new NotFoundException('Cancha no encontrada o inactiva');

    if (dto.horaFin <= dto.horaInicio) throw new BadRequestException('horaFin debe ser mayor que horaInicio');

    const duracion = dto.horaFin - dto.horaInicio;
    if (duracion < 60) throw new BadRequestException('La duración mínima es 1 hora');

    const diaSemana = fechaADiaSemana(fecha);
    const config = await this.prisma.db.configuracionHoraria.findUnique({ where: { diaSemana } });
    if (!config) throw new BadRequestException('No hay configuración horaria para ese día');

    if (duracion % config.intervaloMinutos !== 0) {
      throw new BadRequestException(`La duración debe ser múltiplo de ${config.intervaloMinutos} minutos`);
    }

    if ((dto.horaInicio - config.horaApertura) % config.intervaloMinutos !== 0) {
      throw new BadRequestException('La hora de inicio no está alineada al intervalo configurado');
    }

    if (dto.horaInicio < config.horaApertura || dto.horaFin > config.horaCierre) {
      throw new BadRequestException('El horario solicitado está fuera del horario del predio');
    }

    await this.validarSinConfirmada(dto.canchaId, fecha, dto.horaInicio, dto.horaFin);

    return this.prisma.db.reserva.create({
      data: {
        canchaId: dto.canchaId,
        usuarioId,
        fechaReserva: fecha,
        horaInicio: dto.horaInicio,
        horaFin: dto.horaFin,
        mensajeOpcional: dto.mensajeOpcional,
      },
    });
  }

  async crearManual(dto: CrearReservaManualDto) {
    const fecha = parsearFechaUTC(dto.fecha);

    const cancha = await this.prisma.db.cancha.findUnique({ where: { id: dto.canchaId } });
    if (!cancha?.activa) throw new NotFoundException('Cancha no encontrada o inactiva');

    if (dto.horaFin <= dto.horaInicio) throw new BadRequestException('horaFin debe ser mayor que horaInicio');
    if (dto.horaFin - dto.horaInicio < 60) throw new BadRequestException('La duración mínima es 1 hora');

    if (!dto.usuarioId && (!dto.nombreContacto || !dto.telefonoContacto)) {
      throw new BadRequestException('Debe indicar un usuario o un nombre y teléfono de contacto');
    }

    if (dto.usuarioId) {
      const usuario = await this.prisma.db.usuario.findUnique({ where: { id: dto.usuarioId } });
      if (!usuario) throw new NotFoundException(`Usuario ${dto.usuarioId} no encontrado`);
    }

    await this.validarSinConfirmada(dto.canchaId, fecha, dto.horaInicio, dto.horaFin);

    return this.prisma.db.reserva.create({
      data: {
        canchaId: dto.canchaId,
        usuarioId: dto.usuarioId ?? null,
        nombreContacto: dto.nombreContacto ?? null,
        telefonoContacto: dto.telefonoContacto ?? null,
        fechaReserva: fecha,
        horaInicio: dto.horaInicio,
        horaFin: dto.horaFin,
        mensajeOpcional: dto.mensajeOpcional,
        requiereSena: dto.requiereSena ?? false,
        montoSena: dto.montoSena ?? null,
        esManual: true,
        estado: EstadoReserva.CONFIRMADA,
      },
    });
  }

  async obtener(id: string) {
    const reserva = await this.prisma.db.reserva.findUnique({ where: { id } });
    if (!reserva) throw new NotFoundException(`Reserva ${id} no encontrada`);
    return reserva;
  }

  async confirmar(id: string) {
    const reserva = await this.obtener(id);

    if (reserva.estado !== EstadoReserva.PENDIENTE) {
      throw new BadRequestException('Solo se pueden confirmar reservas en estado PENDIENTE');
    }

    return this.prisma.db.$transaction(async (tx) => {
      const confirmada = await tx.reserva.update({
        where: { id },
        data: { estado: EstadoReserva.CONFIRMADA },
      });

      await tx.reserva.updateMany({
        where: {
          id: { not: id },
          canchaId: reserva.canchaId,
          fechaReserva: reserva.fechaReserva,
          estado: EstadoReserva.PENDIENTE,
          horaInicio: { lt: reserva.horaFin },
          horaFin: { gt: reserva.horaInicio },
        },
        data: { estado: EstadoReserva.CANCELADA },
      });

      return confirmada;
    });
  }

  async cancelar(id: string, solicitante: JwtPayload) {
    const reserva = await this.obtener(id);

    if (reserva.estado === EstadoReserva.CANCELADA) {
      throw new BadRequestException('La reserva ya está cancelada');
    }

    if (solicitante.rol !== RolUsuario.ADMINISTRADOR && reserva.usuarioId !== solicitante.sub) {
      throw new ForbiddenException('No tenés permiso para cancelar esta reserva');
    }

    return this.prisma.db.reserva.update({
      where: { id },
      data: { estado: EstadoReserva.CANCELADA },
    });
  }

  listar(filtros: { canchaId?: string; fecha?: string; estado?: string }) {
    return this.prisma.db.reserva.findMany({
      where: {
        canchaId: filtros.canchaId,
        fechaReserva: filtros.fecha ? parsearFechaUTC(filtros.fecha) : undefined,
        estado: filtros.estado as EstadoReserva | undefined,
      },
      include: {
        cancha: { select: { id: true, nombre: true, tipo: true } },
        usuario: { select: { id: true, nombre: true, apellido: true, email: true, numeroWhatsApp: true } },
      },
      orderBy: [{ fechaReserva: 'asc' }, { horaInicio: 'asc' }],
    });
  }

  listarPropias(usuarioId: string) {
    return this.prisma.db.reserva.findMany({
      where: { usuarioId },
      include: { cancha: { select: { id: true, nombre: true, tipo: true } } },
      orderBy: [{ fechaReserva: 'desc' }, { horaInicio: 'asc' }],
    });
  }

  private async validarSinConfirmada(canchaId: string, fecha: Date, horaInicio: number, horaFin: number) {
    const solapada = await this.prisma.db.reserva.findFirst({
      where: {
        canchaId,
        fechaReserva: fecha,
        estado: EstadoReserva.CONFIRMADA,
        horaInicio: { lt: horaFin },
        horaFin: { gt: horaInicio },
      },
    });

    if (solapada) throw new ConflictException('El slot ya está confirmado por otra reserva');
  }
}
