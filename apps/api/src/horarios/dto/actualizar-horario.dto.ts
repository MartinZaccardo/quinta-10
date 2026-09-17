import { IsInt, IsOptional, Min, Max } from 'class-validator';

export class ActualizarHorarioDto {
  @IsInt()
  @Min(0)
  @Max(1439)
  @IsOptional()
  horaApertura?: number;

  @IsInt()
  @Min(60)
  @Max(1560)
  @IsOptional()
  horaCierre?: number;
}
