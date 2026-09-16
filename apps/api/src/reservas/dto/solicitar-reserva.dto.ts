import { IsString, IsNotEmpty, IsInt, Min, IsOptional, Matches } from 'class-validator';

export class SolicitarReservaDto {
  @IsString()
  @IsNotEmpty()
  canchaId!: string;

  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'fecha debe tener formato YYYY-MM-DD' })
  fecha!: string;

  @IsInt()
  @Min(0)
  horaInicio!: number;

  @IsInt()
  @Min(30)
  horaFin!: number;

  @IsString()
  @IsOptional()
  mensajeOpcional?: string;
}
