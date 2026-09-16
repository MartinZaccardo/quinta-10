import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';
import { ActualizarUsuarioDto } from './dto/actualizar-usuario.dto';
import { JwtGuard } from '../autenticacion/guards/jwt.guard';
import { RolesGuard } from '../autenticacion/guards/roles.guard';
import { Roles } from '../autenticacion/decorators/roles.decorator';
import { RolUsuario } from '../generated/prisma/client';

@Controller('usuarios')
@UseGuards(JwtGuard, RolesGuard)
@Roles(RolUsuario.ADMINISTRADOR)
export class UsuariosController {
  constructor(private readonly usuarios: UsuariosService) {}

  @Get()
  listar() {
    return this.usuarios.listar();
  }

  @Get(':id')
  obtener(@Param('id') id: string) {
    return this.usuarios.obtener(id);
  }

  @Post()
  crear(@Body() dto: CrearUsuarioDto) {
    return this.usuarios.crearDesdeAdmin(dto);
  }

  @Patch(':id')
  actualizar(@Param('id') id: string, @Body() dto: ActualizarUsuarioDto) {
    return this.usuarios.actualizar(id, dto);
  }

  @Patch(':id/desactivar')
  desactivar(@Param('id') id: string) {
    return this.usuarios.desactivar(id);
  }

  @Patch(':id/activar')
  activar(@Param('id') id: string) {
    return this.usuarios.activar(id);
  }
}
