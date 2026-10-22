import { DiaSemana } from '../generated/prisma/client';
import { parsearFechaUTC, fechaADiaSemana, superposicion } from './tiempo.util';

describe('parsearFechaUTC', () => {
  it('crea la fecha UTC correcta a partir de un string YYYY-MM-DD', () => {
    const fecha = parsearFechaUTC('2026-09-15');
    expect(fecha.getUTCFullYear()).toBe(2026);
    expect(fecha.getUTCMonth()).toBe(8); // 0-indexed
    expect(fecha.getUTCDate()).toBe(15);
    expect(fecha.getUTCHours()).toBe(0);
    expect(fecha.getUTCMinutes()).toBe(0);
  });

  it('no desplaza la fecha por zona horaria local', () => {
    const fecha = parsearFechaUTC('2026-01-01');
    expect(fecha.getUTCDate()).toBe(1);
    expect(fecha.getUTCMonth()).toBe(0);
  });
});

describe('fechaADiaSemana', () => {
  it.each([
    ['2026-09-14', DiaSemana.LUNES],
    ['2026-09-15', DiaSemana.MARTES],
    ['2026-09-16', DiaSemana.MIERCOLES],
    ['2026-09-17', DiaSemana.JUEVES],
    ['2026-09-18', DiaSemana.VIERNES],
    ['2026-09-19', DiaSemana.SABADO],
    ['2026-09-20', DiaSemana.DOMINGO],
  ])('%s → %s', (fechaStr, diaSemana) => {
    expect(fechaADiaSemana(parsearFechaUTC(fechaStr))).toBe(diaSemana);
  });
});

describe('superposicion', () => {
  it('detecta superposición parcial (A empieza antes, B termina después)', () => {
    expect(superposicion(600, 720, 660, 780)).toBe(true);
  });

  it('detecta superposición cuando los intervalos son idénticos', () => {
    expect(superposicion(600, 720, 600, 720)).toBe(true);
  });

  it('detecta superposición cuando B está contenido dentro de A', () => {
    expect(superposicion(600, 780, 660, 720)).toBe(true);
  });

  it('detecta superposición cuando A está contenido dentro de B', () => {
    expect(superposicion(660, 720, 600, 780)).toBe(true);
  });

  it('no hay superposición cuando A termina justo donde B empieza (adyacentes)', () => {
    expect(superposicion(600, 720, 720, 840)).toBe(false);
  });

  it('no hay superposición cuando B termina justo donde A empieza', () => {
    expect(superposicion(720, 840, 600, 720)).toBe(false);
  });

  it('no hay superposición cuando están separados', () => {
    expect(superposicion(600, 660, 720, 780)).toBe(false);
  });
});
