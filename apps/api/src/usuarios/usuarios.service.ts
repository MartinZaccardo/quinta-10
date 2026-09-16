import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';
import { ActualizarUsuarioDto } from './dto/actualizar-usuario.dto';

const CAMPOS_SEGUROS = {
  id: true,
  nombre: true,
  apellido: true,
  email: true,
  numeroWhatsApp: true,
  rol: true,
  fotoPerfil: true,
  creadoPorAdmin: true,
  activo: true,
  creadoEn: true,
} as const;

@Injectable()
export class UsuariosService {
  constructor(private readonly prisma: PrismaService) {}

  listar() {
    return this.prisma.db.usuario.findMany({
      select: CAMPOS_SEGUROS,
      orderBy: { nombre: 'asc' },
    });
  }

  async obtener(id: string) {
    const usuario = await this.prisma.db.usuario.findUnique({
      where: { id },
      select: CAMPOS_SEGUROS,
    });
    if (!usuario) throw new NotFoundException(`Usuario ${id} no encontrado`);
    return usuario;
  }

  async crearDesdeAdmin(dto: CrearUsuarioDto) {
    if (dto.email) {
      const existe = await this.prisma.db.usuario.findUnique({
        where: { email: dto.email },
      });
      if (existe) throw new ConflictException('El email ya está registrado');
    }

    const contrasena = dto.contrasena ? await bcrypt.hash(dto.contrasena, 10) : null;

    return this.prisma.db.usuario.create({
      data: {
        nombre: dto.nombre,
        apellido: dto.apellido,
        numeroWhatsApp: dto.numeroWhatsApp,
        email: dto.email ?? null,
        contrasena,
        rol: dto.rol,
        creadoPorAdmin: true,
      },
      select: CAMPOS_SEGUROS,
    });
  }

  async actualizar(id: string, dto: ActualizarUsuarioDto) {
    await this.obtener(id);

    if (dto.email) {
      const existeOtro = await this.prisma.db.usuario.findFirst({
        where: { email: dto.email, NOT: { id } },
      });
      if (existeOtro) throw new ConflictException('El email ya está registrado');
    }

    const { contrasena: contrasenaPlana, ...resto } = dto;
    const contrasena = contrasenaPlana ? await bcrypt.hash(contrasenaPlana, 10) : undefined;

    return this.prisma.db.usuario.update({
      where: { id },
      data: {
        ...resto,
        ...(contrasena !== undefined ? { contrasena } : {}),
      },
      select: CAMPOS_SEGUROS,
    });
  }

  async desactivar(id: string) {
    await this.obtener(id);
    return this.prisma.db.usuario.update({
      where: { id },
      data: { activo: false },
      select: CAMPOS_SEGUROS,
    });
  }

  async activar(id: string) {
    await this.obtener(id);
    return this.prisma.db.usuario.update({
      where: { id },
      data: { activo: true },
      select: CAMPOS_SEGUROS,
    });
  }
}
