import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CrearCanchaDto } from './dto/crear-cancha.dto';
import { ActualizarCanchaDto } from './dto/actualizar-cancha.dto';

@Injectable()
export class CanchasService {
  constructor(private readonly prisma: PrismaService) {}

  listar() {
    return this.prisma.db.cancha.findMany({ where: { activa: true }, orderBy: { nombre: 'asc' } });
  }

  async obtener(id: string) {
    const cancha = await this.prisma.db.cancha.findUnique({ where: { id } });
    if (!cancha) throw new NotFoundException(`Cancha ${id} no encontrada`);
    return cancha;
  }

  crear(dto: CrearCanchaDto) {
    return this.prisma.db.cancha.create({ data: dto });
  }

  async actualizar(id: string, dto: ActualizarCanchaDto) {
    await this.obtener(id);
    return this.prisma.db.cancha.update({ where: { id }, data: dto });
  }

  async desactivar(id: string) {
    await this.obtener(id);
    return this.prisma.db.cancha.update({ where: { id }, data: { activa: false } });
  }
}
