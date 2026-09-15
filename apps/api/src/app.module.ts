import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AutenticacionModule } from './autenticacion/autenticacion.module';
import { CanchasModule } from './canchas/canchas.module';

@Module({
  imports: [PrismaModule, AutenticacionModule, CanchasModule],
})
export class AppModule {}
