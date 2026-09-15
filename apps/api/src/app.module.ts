import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AutenticacionModule } from './autenticacion/autenticacion.module';
import { CanchasModule } from './canchas/canchas.module';
import { HorariosModule } from './horarios/horarios.module';

@Module({
  imports: [PrismaModule, AutenticacionModule, CanchasModule, HorariosModule],
})
export class AppModule {}
