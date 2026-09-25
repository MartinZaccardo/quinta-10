export type TipoCancha = 'F5' | 'F6' | 'PADEL';

export type EstadoBloque = 'DISPONIBLE' | 'PENDIENTE' | 'OCUPADO';

export interface BloqueHorario {
  horaInicio: number;
  horaFin: number;
  estado: EstadoBloque;
  contacto?: string;
  telefono?: string;
  esTurnoFijo?: boolean;
  reservaId?: string;
  cantidadPendientes?: number;
}

export const DURACIONES_POR_TIPO: Record<TipoCancha, { minutos: number; etiqueta: string }[]> = {
  F5:    [{ minutos: 60, etiqueta: '1 hora' }, { minutos: 120, etiqueta: '2 horas' }],
  F6:    [{ minutos: 60, etiqueta: '1 hora' }, { minutos: 120, etiqueta: '2 horas' }],
  PADEL: [{ minutos: 60, etiqueta: '1 hora' }, { minutos: 90, etiqueta: '1:30 hs' }, { minutos: 120, etiqueta: '2 horas' }],
};

// Agrupa bloques OCUPADO/PENDIENTE consecutivos del mismo contacto en una sola entrada visual.
// Los bloques DISPONIBLE se dejan individualmente (cada uno es un horario de inicio clickeable).
export function agruparNoDisponibles(slots: BloqueHorario[]): BloqueHorario[] {
  const resultado: BloqueHorario[] = [];
  let i = 0;
  while (i < slots.length) {
    const slot = slots[i];
    if (slot.estado === 'DISPONIBLE') {
      resultado.push(slot);
      i++;
      continue;
    }
    let j = i + 1;
    while (
      j < slots.length &&
      slots[j].estado === slot.estado &&
      slots[j].contacto === slot.contacto &&
      slots[j].horaInicio === slots[j - 1].horaFin
    ) {
      j++;
    }
    resultado.push({ ...slot, horaFin: slots[j - 1].horaFin });
    i = j;
  }
  return resultado;
}

export function esDuracionValida(slots: BloqueHorario[], horaInicio: number, duracionMinutos: number): boolean {
  const horaFin = horaInicio + duracionMinutos;
  if (horaFin > slots[slots.length - 1].horaFin) return false;
  return !slots.some(s => s.estado !== 'DISPONIBLE' && s.horaInicio < horaFin && s.horaFin > horaInicio);
}
