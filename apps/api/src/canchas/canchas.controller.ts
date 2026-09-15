import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { CanchasService } from './canchas.service';
import { CrearCanchaDto } from './dto/crear-cancha.dto';
import { ActualizarCanchaDto } from './dto/actualizar-cancha.dto';
import { JwtGuard } from '../autenticacion/guards/jwt.guard';
import { RolesGuard } from '../autenticacion/guards/roles.guard';
import { Roles } from '../autenticacion/decorators/roles.decorator';
import { RolUsuario } from '../generated/prisma/client';

@Controller('canchas')
export class CanchasController {
  constructor(private readonly canchas: CanchasService) {}

  @Get()
  listar() {
    return this.canchas.listar();
  }

  @Get(':id')
  obtener(@Param('id') id: string) {
    return this.canchas.obtener(id);
  }

  @Post()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(RolUsuario.ADMINISTRADOR)
  crear(@Body() dto: CrearCanchaDto) {
    return this.canchas.crear(dto);
  }

  @Patch(':id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(RolUsuario.ADMINISTRADOR)
  actualizar(@Param('id') id: string, @Body() dto: ActualizarCanchaDto) {
    return this.canchas.actualizar(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(RolUsuario.ADMINISTRADOR)
  desactivar(@Param('id') id: string) {
    return this.canchas.desactivar(id);
  }
}
