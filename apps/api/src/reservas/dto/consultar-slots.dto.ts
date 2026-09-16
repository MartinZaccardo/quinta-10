import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class ConsultarSlotsDto {
  @IsString()
  @IsNotEmpty()
  canchaId!: string;

  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'fecha debe tener formato YYYY-MM-DD' })
  fecha!: string;
}
