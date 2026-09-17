'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { swrFetcher } from '@/lib/api';
import { formatearRango, minutosAHora } from '@/lib/tiempo';
import { ModalCrearReserva } from './modal-crear-reserva';

type TipoCancha = 'F5' | 'F6' | 'PADEL';
type EstadoBloque = 'DISPONIBLE' | 'PENDIENTE' | 'OCUPADO';

interface BloqueHorario {
  horaInicio: number;
  horaFin: number;
  estado: EstadoBloque;
  contacto?: string;
  telefono?: string;
}

const DURACIONES_POR_TIPO: Record<TipoCancha, { minutos: number; etiqueta: string }[]> = {
  F5:    [{ minutos: 60, etiqueta: '1 hora' }, { minutos: 120, etiqueta: '2 horas' }],
  F6:    [{ minutos: 60, etiqueta: '1 hora' }, { minutos: 120, etiqueta: '2 horas' }],
  PADEL: [{ minutos: 60, etiqueta: '1 hora' }, { minutos: 90, etiqueta: '1:30 hs' }, { minutos: 120, etiqueta: '2 horas' }],
};

interface Props {
  canchaId: string;
  nombreCancha: string;
  tipoCancha: TipoCancha;
  fecha: string;
}

// Agrupa bloques OCUPADO/PENDIENTE consecutivos del mismo contacto en una sola entrada visual.
// Los bloques DISPONIBLE se dejan individualmente (cada uno es un horario de inicio clickeable).
function agruparNoDisponibles(slots: BloqueHorario[]): BloqueHorario[] {
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

export function CalendarioDia({ canchaId, nombreCancha, tipoCancha, fecha }: Props) {
  const { data: slots, isLoading, error, mutate } = useSWR<BloqueHorario[]>(
    `/reservas/slots?canchaId=${canchaId}&fecha=${fecha}`,
    swrFetcher,
  );

  const [horaInicioSeleccionada, setHoraInicioSeleccionada] = useState<number | null>(null);
  const [duracionSeleccionada, setDuracionSeleccionada] = useState<number | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);

  if (isLoading) {
    return <div className="py-10 text-center text-muted-foreground text-sm">Cargando horarios...</div>;
  }
  if (error) {
    return <div className="py-10 text-center text-red-500 text-sm">Error al cargar la disponibilidad.</div>;
  }
  if (!slots?.length) {
    return <div className="py-10 text-center text-muted-foreground text-sm">Sin horarios configurados para este día.</div>;
  }

  const entradas = agruparNoDisponibles(slots);
  const duraciones = DURACIONES_POR_TIPO[tipoCancha];

  function esDuracionValida(horaInicio: number, duracionMinutos: number): boolean {
    const horaFin = horaInicio + duracionMinutos;
    if (horaFin > slots![slots!.length - 1].horaFin) return false;
    return !slots!.some(s => s.estado !== 'DISPONIBLE' && s.horaInicio < horaFin && s.horaFin > horaInicio);
  }

  function seleccionarSlot(horaInicio: number) {
    if (horaInicioSeleccionada === horaInicio) {
      setHoraInicioSeleccionada(null);
      setDuracionSeleccionada(null);
    } else {
      setHoraInicioSeleccionada(horaInicio);
      setDuracionSeleccionada(null);
    }
  }

  function cerrarModal() {
    setModalAbierto(false);
    setHoraInicioSeleccionada(null);
    setDuracionSeleccionada(null);
  }

  return (
    <>
      <div className="mt-4 border rounded-lg overflow-hidden divide-y">
        {entradas.map((entrada) => {
          if (entrada.estado !== 'DISPONIBLE') {
            const esOcupado = entrada.estado === 'OCUPADO';
            return (
              <div
                key={entrada.horaInicio}
                className={`px-4 py-3 ${
                  esOcupado
                    ? 'bg-red-50 border-l-4 border-l-red-400'
                    : 'bg-yellow-50 border-l-4 border-l-yellow-400'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="tabular-nums text-sm font-medium text-muted-foreground">
                    {formatearRango(entrada.horaInicio, entrada.horaFin)}
                  </span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${
                    esOcupado ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {esOcupado ? 'Ocupado' : 'Pendiente'}
                  </span>
                </div>
                {entrada.contacto && (
                  <p className="text-sm font-medium mt-0.5 text-gray-800">{entrada.contacto}</p>
                )}
                {entrada.telefono && (
                  <p className="text-xs text-gray-500 mt-0.5">
                    <span className="font-medium">Teléfono:</span> {entrada.telefono}
                  </p>
                )}
              </div>
            );
          }

          const estaSeleccionado = horaInicioSeleccionada === entrada.horaInicio;

          return (
            <div key={entrada.horaInicio}>
              <button
                className={`w-full px-4 py-3 flex items-center justify-between text-left transition-colors ${
                  estaSeleccionado ? 'bg-blue-50' : 'bg-white hover:bg-gray-50'
                }`}
                onClick={() => seleccionarSlot(entrada.horaInicio)}
              >
                <span className="tabular-nums text-sm font-medium">{minutosAHora(entrada.horaInicio)}</span>
                <span className="text-xs font-medium text-green-600">Disponible</span>
              </button>

              {estaSeleccionado && (
                <div className="px-4 py-3 bg-blue-50 border-t border-blue-100 space-y-3">
                  <p className="text-sm font-medium text-gray-700">¿Cuánto tiempo?</p>
                  <div className="flex gap-2 flex-wrap">
                    {duraciones.map((d) => {
                      const valida = esDuracionValida(entrada.horaInicio, d.minutos);
                      const seleccionada = duracionSeleccionada === d.minutos;
                      return (
                        <button
                          key={d.minutos}
                          disabled={!valida}
                          onClick={() => setDuracionSeleccionada(d.minutos)}
                          className={`px-3 py-1.5 rounded-md text-sm border transition-colors ${
                            seleccionada
                              ? 'bg-blue-600 text-white border-blue-600'
                              : valida
                              ? 'bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-700'
                              : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed line-through'
                          }`}
                        >
                          {d.etiqueta}
                        </button>
                      );
                    })}
                  </div>

                  {duracionSeleccionada && (
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-sm text-gray-500">
                        {formatearRango(entrada.horaInicio, entrada.horaInicio + duracionSeleccionada)}
                      </span>
                      <button
                        className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                        onClick={() => setModalAbierto(true)}
                      >
                        Reservar →
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {horaInicioSeleccionada !== null && duracionSeleccionada !== null && modalAbierto && (
        <ModalCrearReserva
          key={`${horaInicioSeleccionada}-${duracionSeleccionada}`}
          canchaId={canchaId}
          nombreCancha={nombreCancha}
          fecha={fecha}
          horaInicio={horaInicioSeleccionada}
          horaFin={horaInicioSeleccionada + duracionSeleccionada}
          abierto={true}
          onCerrar={cerrarModal}
          onCreada={() => {
            cerrarModal();
            mutate();
          }}
        />
      )}
    </>
  );
}
