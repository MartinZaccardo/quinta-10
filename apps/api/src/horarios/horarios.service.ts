import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DiaSemana } from '../generated/prisma/client';
import { ActualizarHorarioDto } from './dto/actualizar-horario.dto';

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
    const cierre = dto.horaCierre ?? horario.horaCierre;

    if (cierre <= apertura) {
      throw new BadRequestException('horaCierre debe ser mayor que horaApertura');
    }

    return this.prisma.db.configuracionHoraria.update({
      where: { diaSemana },
      data: dto,
    });
  }
}
