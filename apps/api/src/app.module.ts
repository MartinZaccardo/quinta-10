import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AutenticacionModule } from './autenticacion/autenticacion.module';
import { CanchasModule } from './canchas/canchas.module';
import { HorariosModule } from './horarios/horarios.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { ReservasModule } from './reservas/reservas.module';

@Module({
  imports: [PrismaModule, AutenticacionModule, CanchasModule, HorariosModule, UsuariosModule, ReservasModule],
})
export class AppModule {}
