import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AutenticacionModule } from './autenticacion/autenticacion.module';

@Module({
  imports: [PrismaModule, AutenticacionModule],
})
export class AppModule {}
