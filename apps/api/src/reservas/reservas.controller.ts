import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ReservasService } from './reservas.service';
import { ConsultarSlotsDto } from './dto/consultar-slots.dto';
import { SolicitarReservaDto } from './dto/solicitar-reserva.dto';
import { CrearReservaManualDto } from './dto/crear-reserva-manual.dto';
import { JwtGuard } from '../autenticacion/guards/jwt.guard';
import { RolesGuard } from '../autenticacion/guards/roles.guard';
import { Roles } from '../autenticacion/decorators/roles.decorator';
import { UsuarioActual } from '../autenticacion/decorators/usuario-actual.decorator';
import { JwtPayload } from '../autenticacion/strategies/jwt.strategy';
import { RolUsuario } from '../generated/prisma/client';

@Controller('reservas')
export class ReservasController {
  constructor(private readonly reservas: ReservasService) {}

  // Rutas fijas antes que las parametrizadas (:id) para evitar conflictos de resolución

  @Get('slots')
  slots(@Query() dto: ConsultarSlotsDto) {
    return this.reservas.calcularSlots(dto);
  }

  @Get('mis-reservas')
  @UseGuards(JwtGuard)
  misReservas(@UsuarioActual() usuario: JwtPayload) {
    return this.reservas.listarPropias(usuario.sub);
  }

  @Get()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(RolUsuario.ADMINISTRADOR)
  listar(
    @Query('canchaId') canchaId?: string,
    @Query('fecha') fecha?: string,
    @Query('estado') estado?: string,
  ) {
    return this.reservas.listar({ canchaId, fecha, estado });
  }

  @Get(':id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(RolUsuario.ADMINISTRADOR)
  obtener(@Param('id') id: string) {
    return this.reservas.obtener(id);
  }

  @Post()
  @UseGuards(JwtGuard)
  solicitar(@Body() dto: SolicitarReservaDto, @UsuarioActual() usuario: JwtPayload) {
    return this.reservas.solicitar(dto, usuario.sub);
  }

  @Post('manual')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(RolUsuario.ADMINISTRADOR)
  crearManual(@Body() dto: CrearReservaManualDto) {
    return this.reservas.crearManual(dto);
  }

  @Patch(':id/confirmar')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(RolUsuario.ADMINISTRADOR)
  confirmar(@Param('id') id: string) {
    return this.reservas.confirmar(id);
  }

  @Patch(':id/cancelar')
  @UseGuards(JwtGuard)
  cancelar(@Param('id') id: string, @UsuarioActual() usuario: JwtPayload) {
    return this.reservas.cancelar(id, usuario);
  }
}
