import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional } from 'class-validator';
import { CrearCanchaDto } from './crear-cancha.dto';

export class ActualizarCanchaDto extends PartialType(CrearCanchaDto) {
  @IsBoolean()
  @IsOptional()
  activa?: boolean;
}
