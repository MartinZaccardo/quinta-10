import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { TurnosFijosService } from './turnos-fijos.service';
import { CrearTurnoFijoDto } from './dto/crear-turno-fijo.dto';
import { CrearExcepcionTurnoFijoDto } from './dto/crear-excepcion-turno-fijo.dto';
import { JwtGuard } from '../autenticacion/guards/jwt.guard';
import { RolesGuard } from '../autenticacion/guards/roles.guard';
import { Roles } from '../autenticacion/decorators/roles.decorator';
import { RolUsuario } from '../generated/prisma/client';

@Controller('turnos-fijos')
@UseGuards(JwtGuard, RolesGuard)
@Roles(RolUsuario.ADMINISTRADOR)
export class TurnosFijosController {
  constructor(private readonly turnosFijos: TurnosFijosService) {}

  @Get()
  listar(@Query('canchaId') canchaId?: string, @Query('diaSemana') diaSemana?: string) {
    return this.turnosFijos.listar({ canchaId, diaSemana });
  }

  @Get(':id')
  obtener(@Param('id') id: string) {
    return this.turnosFijos.obtener(id);
  }

  @Post()
  crear(@Body() dto: CrearTurnoFijoDto) {
    return this.turnosFijos.crear(dto);
  }

  @Patch(':id/desactivar')
  desactivar(@Param('id') id: string) {
    return this.turnosFijos.desactivar(id);
  }

  @Post(':id/excepciones')
  agregarExcepcion(@Param('id') id: string, @Body() dto: CrearExcepcionTurnoFijoDto) {
    return this.turnosFijos.agregarExcepcion(id, dto);
  }
}
