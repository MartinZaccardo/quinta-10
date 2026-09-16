import { Matches } from 'class-validator';

export class CrearExcepcionTurnoFijoDto {
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'fecha debe tener formato YYYY-MM-DD' })
  fecha!: string;
}
