import {
  IsString,
  IsNotEmpty,
  IsInt,
  Min,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsPositive,
  Matches,
} from "class-validator";

export class CrearReservaManualDto {
  @IsString()
  @IsNotEmpty()
  canchaId!: string;

  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: "fecha debe tener formato YYYY-MM-DD",
  })
  fecha!: string;

  @IsInt()
  @Min(0)
  horaInicio!: number;

  @IsInt()
  @Min(30)
  horaFin!: number;

  @IsString()
  @IsOptional()
  usuarioId?: string;

  @IsString()
  @IsOptional()
  nombreContacto?: string;

  @IsString()
  @IsOptional()
  telefonoContacto?: string;

  @IsString()
  @IsOptional()
  mensajeOpcional?: string;

  @IsBoolean()
  @IsOptional()
  requiereSena?: boolean;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @IsOptional()
  montoSena?: number;
}
