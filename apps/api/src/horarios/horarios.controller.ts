import { Controller, Get, Patch, Body, Param, UseGuards, ParseEnumPipe } from '@nestjs/common';
import { HorariosService } from './horarios.service';
import { ActualizarHorarioDto } from './dto/actualizar-horario.dto';
import { JwtGuard } from '../autenticacion/guards/jwt.guard';
import { RolesGuard } from '../autenticacion/guards/roles.guard';
import { Roles } from '../autenticacion/decorators/roles.decorator';
import { DiaSemana, RolUsuario } from '../generated/prisma/client';

@Controller('horarios')
export class HorariosController {
  constructor(private readonly horarios: HorariosService) {}

  @Get()
  listar() {
    return this.horarios.listar();
  }

  @Get(':diaSemana')
  obtener(@Param('diaSemana', new ParseEnumPipe(DiaSemana)) diaSemana: DiaSemana) {
    return this.horarios.obtener(diaSemana);
  }

  @Patch(':diaSemana')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(RolUsuario.ADMINISTRADOR)
  actualizar(
    @Param('diaSemana', new ParseEnumPipe(DiaSemana)) diaSemana: DiaSemana,
    @Body() dto: ActualizarHorarioDto,
  ) {
    return this.horarios.actualizar(diaSemana, dto);
  }
}
