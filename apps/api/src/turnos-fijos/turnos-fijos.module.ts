import { Module } from '@nestjs/common';
import { TurnosFijosService } from './turnos-fijos.service';
import { TurnosFijosController } from './turnos-fijos.controller';

@Module({
  controllers: [TurnosFijosController],
  providers: [TurnosFijosService],
})
export class TurnosFijosModule {}
