// Convierte minutos desde medianoche a string "HH:MM".
// Maneja horarios post-medianoche: 1560 → "02:00" (no "26:00").
export function minutosAHora(minutos: number): string {
  const h = Math.floor(minutos / 60) % 24;
  const m = minutos % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

export function formatearRango(horaInicio: number, horaFin: number): string {
  return `${minutosAHora(horaInicio)} – ${minutosAHora(horaFin)}`;
}
