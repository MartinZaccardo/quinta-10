import { Controller, Post, Get, Body, HttpCode, HttpStatus, Res, UseGuards } from '@nestjs/common';
import { Response, CookieOptions } from 'express';
import { Throttle } from '@nestjs/throttler';
import { AutenticacionService } from './autenticacion.service';
import { RegistroDto } from './dto/registro.dto';
import { LoginDto } from './dto/login.dto';
import { JwtGuard } from './guards/jwt.guard';
import { UsuarioActual } from './decorators/usuario-actual.decorator';
import { JwtPayload } from './strategies/jwt.strategy';

const OPCIONES_COOKIE: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días en ms
  path: '/',
};

@Controller('auth')
export class AutenticacionController {
  constructor(private readonly autenticacion: AutenticacionService) {}

  @Post('registro')
  @Throttle({ default: { ttl: 600_000, limit: 5 } })
  async registro(
    @Body() dto: RegistroDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, usuario } = await this.autenticacion.registro(dto);
    res.cookie('token', accessToken, OPCIONES_COOKIE);
    return usuario;
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { ttl: 600_000, limit: 10 } })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, usuario } = await this.autenticacion.login(dto);
    res.cookie('token', accessToken, OPCIONES_COOKIE);
    return usuario;
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('token', { path: '/' });
    return { mensaje: 'Sesión cerrada' };
  }

  @Get('me')
  @UseGuards(JwtGuard)
  me(@UsuarioActual() usuario: JwtPayload) {
    return usuario;
  }
}
