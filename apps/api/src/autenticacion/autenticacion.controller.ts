import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AutenticacionService } from './autenticacion.service';
import { RegistroDto } from './dto/registro.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AutenticacionController {
  constructor(private readonly autenticacion: AutenticacionService) {}

  @Post('registro')
  registro(@Body() dto: RegistroDto) {
    return this.autenticacion.registro(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto) {
    return this.autenticacion.login(dto);
  }
}
