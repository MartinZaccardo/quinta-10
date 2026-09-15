import { IsEmail, IsString, MinLength, IsNotEmpty } from 'class-validator';

export class RegistroDto {
  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @IsString()
  @IsNotEmpty()
  apellido!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  contrasena!: string;

  @IsString()
  @IsNotEmpty()
  numeroWhatsApp!: string;
}
