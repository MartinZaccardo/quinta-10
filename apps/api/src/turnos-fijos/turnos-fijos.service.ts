import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DiaSemana } from '../generated/prisma/client';
import { parsearFechaUTC, fechaADiaSemana } from '../common/tiempo.util';
import { CrearTurnoFijoDto } from './dto/crear-turno-fijo.dto';
import { CrearExcepcionTurnoFijoDto } from './dto/crear-excepcion-turno-fijo.dto';

const INCLUDE_RELACIONES = {
  cancha: { select: { id: true, nombre: true, tipo: true } },
  usuario: { select: { id: true, nombre: true, apellido: true, email: true, numeroWhatsApp: true } },
} as const;

@Injectable()
export class TurnosFijosService {
  constructor(private readonly prisma: PrismaService) {}

  listar(filtros: { canchaId?: string; diaSemana?: string }) {
    return this.prisma.db.turnoFijo.findMany({
      where: {
        activo: true,
        canchaId: filtros.canchaId,
        diaSemana: filtros.diaSemana as DiaSemana | undefined,
      },
      include: INCLUDE_RELACIONES,
      orderBy: [{ diaSemana: 'asc' }, { horaInicio: 'asc' }],
    });
  }

  async obtener(id: string) {
    const turnoFijo = await this.prisma.db.turnoFijo.findUnique({
      where: { id },
      include: INCLUDE_RELACIONES,
    });
    if (!turnoFijo) throw new NotFoundException(`Turno fijo ${id} no encontrado`);
    return turnoFijo;
  }

  async crear(dto: CrearTurnoFijoDto) {
    const cancha = await this.prisma.db.cancha.findUnique({ where: { id: dto.canchaId } });
    if (!cancha?.activa) throw new NotFoundException('Cancha no encontrada o inactiva');

    const usuario = await this.prisma.db.usuario.findUnique({ where: { id: dto.usuarioId } });
    if (!usuario) throw new NotFoundException(`Usuario ${dto.usuarioId} no encontrado`);

    if (dto.horaFin <= dto.horaInicio) throw new BadRequestException('horaFin debe ser mayor que horaInicio');
    if (dto.horaFin - dto.horaInicio < 60) throw new BadRequestException('La duración mínima es 1 hora');

    const solapado = await this.prisma.db.turnoFijo.findFirst({
      where: {
        canchaId: dto.canchaId,
        diaSemana: dto.diaSemana,
        activo: true,
        horaInicio: { lt: dto.horaFin },
        horaFin: { gt: dto.horaInicio },
      },
    });

    if (solapado) throw new ConflictException('Ya existe un turno fijo activo que ocupa ese horario ese día');

    return this.prisma.db.turnoFijo.create({
      data: {
        canchaId: dto.canchaId,
        usuarioId: dto.usuarioId,
        diaSemana: dto.diaSemana,
        horaInicio: dto.horaInicio,
        horaFin: dto.horaFin,
        fechaInicio: parsearFechaUTC(dto.fechaInicio),
      },
      include: INCLUDE_RELACIONES,
    });
  }

  async desactivar(id: string) {
    await this.obtener(id);
    return this.prisma.db.turnoFijo.update({
      where: { id },
      data: { activo: false },
      include: INCLUDE_RELACIONES,
    });
  }

  async agregarExcepcion(turnoFijoId: string, dto: CrearExcepcionTurnoFijoDto) {
    const turnoFijo = await this.obtener(turnoFijoId);

    if (!turnoFijo.activo) throw new BadRequestException('El turno fijo está desactivado');

    const fecha = parsearFechaUTC(dto.fecha);

    if (fechaADiaSemana(fecha) !== turnoFijo.diaSemana) {
      throw new BadRequestException(
        `La fecha ${dto.fecha} no cae en ${turnoFijo.diaSemana} — el turno aplica los ${turnoFijo.diaSemana}`,
      );
    }

    try {
      return await this.prisma.db.turnoFijoExcepcion.create({
        data: { turnoFijoId, fechaExcluida: fecha },
      });
    } catch (e: any) {
      if (e?.code === 'P2002') throw new ConflictException(`Ya existe una excepción para el ${dto.fecha}`);
      throw e;
    }
  }
}
