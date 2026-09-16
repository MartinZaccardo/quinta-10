import { IsString, IsNotEmpty, IsInt, IsEnum, Min, Max, Matches } from 'class-validator';
import { DiaSemana } from '../../generated/prisma/client';

export class CrearTurnoFijoDto {
  @IsString()
  @IsNotEmpty()
  canchaId!: string;

  @IsString()
  @IsNotEmpty()
  usuarioId!: string;

  @IsEnum(DiaSemana)
  diaSemana!: DiaSemana;

  @IsInt()
  @Min(0)
  @Max(1439)
  horaInicio!: number;

  @IsInt()
  @Min(60)
  @Max(1560)
  horaFin!: number;

  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'fechaInicio debe tener formato YYYY-MM-DD' })
  fechaInicio!: string;
}
