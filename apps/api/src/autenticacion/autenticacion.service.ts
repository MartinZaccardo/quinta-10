import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { RolUsuario } from '../generated/prisma/client';
import { RegistroDto } from './dto/registro.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './strategies/jwt.strategy';

@Injectable()
export class AutenticacionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async registro(dto: RegistroDto) {
    const existe = await this.prisma.db.usuario.findUnique({
      where: { email: dto.email },
    });

    if (existe) {
      throw new ConflictException('El email ya está registrado');
    }

    const contrasenaHasheada = await bcrypt.hash(dto.contrasena, 10);

    const usuario = await this.prisma.db.usuario.create({
      data: {
        nombre: dto.nombre,
        apellido: dto.apellido,
        email: dto.email,
        contrasena: contrasenaHasheada,
        numeroWhatsApp: dto.numeroWhatsApp,
      },
    });

    return this.firmarToken(usuario.id, usuario.email!, usuario.rol);
  }

  async login(dto: LoginDto) {
    const usuario = await this.prisma.db.usuario.findUnique({
      where: { email: dto.email },
    });

    if (!usuario || !usuario.contrasena) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const contrasenaValida = await bcrypt.compare(dto.contrasena, usuario.contrasena);

    if (!contrasenaValida) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    return this.firmarToken(usuario.id, usuario.email!, usuario.rol);
  }

  private firmarToken(usuarioId: string, email: string, rol: RolUsuario) {
    const payload: JwtPayload = { sub: usuarioId, email, rol };
    return { accessToken: this.jwt.sign(payload) };
  }
}
