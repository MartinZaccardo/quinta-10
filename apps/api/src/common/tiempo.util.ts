import { DiaSemana } from '../generated/prisma/client';

export const DIAS_SEMANA: DiaSemana[] = [
  DiaSemana.DOMINGO,
  DiaSemana.LUNES,
  DiaSemana.MARTES,
  DiaSemana.MIERCOLES,
  DiaSemana.JUEVES,
  DiaSemana.VIERNES,
  DiaSemana.SABADO,
];

export function parsearFechaUTC(fechaStr: string): Date {
  const [anio, mes, dia] = fechaStr.split('-').map(Number);
  return new Date(Date.UTC(anio, mes - 1, dia));
}

export function fechaADiaSemana(fecha: Date): DiaSemana {
  return DIAS_SEMANA[fecha.getUTCDay()];
}

// Dos intervalos [inicioA, finA) y [inicioB, finB) se superponen si y solo si:
// inicioA < finB AND finA > inicioB
export function superposicion(inicioA: number, finA: number, inicioB: number, finB: number): boolean {
  return inicioA < finB && finA > inicioB;
}
