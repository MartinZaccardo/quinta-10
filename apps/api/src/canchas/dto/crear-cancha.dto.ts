import { IsString, IsNotEmpty, IsEnum, IsNumber, IsPositive } from 'class-validator';
import { TipoCancha } from '../../generated/prisma/client';

export class CrearCanchaDto {
  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @IsEnum(TipoCancha)
  tipo!: TipoCancha;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  precioPorHora!: number;
}
