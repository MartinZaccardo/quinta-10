import { IsString, IsNotEmpty, IsEmail, IsEnum, IsOptional, MinLength } from 'class-validator';
import { RolUsuario } from '../../generated/prisma/client';

export class CrearUsuarioDto {
  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @IsString()
  @IsNotEmpty()
  apellido!: string;

  @IsString()
  @IsNotEmpty()
  numeroWhatsApp!: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @MinLength(6)
  @IsOptional()
  contrasena?: string;

  @IsEnum(RolUsuario)
  @IsOptional()
  rol?: RolUsuario;
}
