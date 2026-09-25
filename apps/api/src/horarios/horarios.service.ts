import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DiaSemana, EstadoReserva } from '../generated/prisma/client';
import { fechaADiaSemana } from '../common/tiempo.util';
import { ActualizarHorarioDto } from './dto/actualizar-horario.dto';

function formatHora(minutos: number): string {
  const h = Math.floor(minutos / 60) % 24;
  const m = minutos % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

@Injectable()
export class HorariosService {
  constructor(private readonly prisma: PrismaService) {}

  listar() {
    return this.prisma.db.configuracionHoraria.findMany({
      orderBy: { diaSemana: 'asc' },
    });
  }

  async obtener(diaSemana: DiaSemana) {
    const horario = await this.prisma.db.configuracionHoraria.findUnique({
      where: { diaSemana },
    });
    if (!horario) throw new NotFoundException(`No existe configuración para ${diaSemana}`);
    return horario;
  }

  async actualizar(diaSemana: DiaSemana, dto: ActualizarHorarioDto) {
    const horario = await this.obtener(diaSemana);

    const apertura = dto.horaApertura ?? horario.horaApertura;
    const cierre   = dto.horaCierre   ?? horario.horaCierre;

    if (cierre <= apertura) {
      throw new BadRequestException('horaCierre debe ser mayor que horaApertura');
    }

    await this.verificarConflictosHorario(diaSemana, apertura, cierre);

    return this.prisma.db.configuracionHoraria.update({
      where: { diaSemana },
      data: dto,
    });
  }

  private async verificarConflictosHorario(
    diaSemana: DiaSemana,
    newApertura: number,
    newCierre: number,
  ): Promise<void> {
    const hoy = new Date();
    hoy.setUTCHours(0, 0, 0, 0);

    const [todasReservas, turnosFijos] = await Promise.all([
      this.prisma.db.reserva.findMany({
        where: {
          fechaReserva: { gte: hoy },
          estado: { not: EstadoReserva.CANCELADA },
          OR: [
            { horaInicio: { lt: newApertura } },
            { horaFin:    { gt: newCierre   } },
          ],
        },
        select: {
          fechaReserva: true,
          horaInicio:   true,
          horaFin:      true,
          nombreContacto: true,
          usuario: { select: { nombre: true, apellido: true } },
        },
      }),
      this.prisma.db.turnoFijo.findMany({
        where: {
          diaSemana,
          activo: true,
          OR: [
            { horaInicio: { lt: newApertura } },
            { horaFin:    { gt: newCierre   } },
          ],
        },
        select: {
          horaInicio: true,
          horaFin:    true,
          usuario: { select: { nombre: true, apellido: true } },
        },
      }),
    ]);

    const reservas = todasReservas.filter(r => fechaADiaSemana(r.fechaReserva) === diaSemana);

    if (reservas.length === 0 && turnosFijos.length === 0) return;

    const partes: string[] = [];

    if (reservas.length > 0) {
      const detalle = reservas.map(r => {
        const fecha    = r.fechaReserva.toISOString().split('T')[0];
        const contacto = r.usuario
          ? `${r.usuario.nombre} ${r.usuario.apellido}`
          : (r.nombreContacto ?? 'Sin contacto');
        return `${fecha} ${contacto} ${formatHora(r.horaInicio)}–${formatHora(r.horaFin)}`;
      });
      partes.push(`${reservas.length} reserva(s) futura(s): ${detalle.join('; ')}`);
    }

    if (turnosFijos.length > 0) {
      const detalle = turnosFijos.map(t => {
        const contacto = t.usuario
          ? `${t.usuario.nombre} ${t.usuario.apellido}`
          : 'Sin contacto';
        return `${contacto} ${formatHora(t.horaInicio)}–${formatHora(t.horaFin)}`;
      });
      partes.push(`${turnosFijos.length} turno(s) fijo(s): ${detalle.join('; ')}`);
    }

    throw new BadRequestException(
      `No se puede aplicar este horario porque quedarían fuera del rango — ${partes.join(' / ')}`,
    );
  }
}
