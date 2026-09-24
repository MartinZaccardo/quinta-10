'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { swrFetcher } from '@/lib/api';
import { formatearRango, minutosAHora } from '@/lib/tiempo';
import { type TipoCancha, type BloqueHorario, DURACIONES_POR_TIPO, agruparNoDisponibles, esDuracionValida } from '@/lib/canchas';
import { ModalSolicitarReserva } from './modal-solicitar-reserva';

interface MiReserva {
  cancha: { id: string };
  fechaReserva: string;
  horaInicio: number;
  horaFin: number;
  estado: string;
}

interface Props {
  canchaId: string;
  nombreCancha: string;
  tipoCancha: TipoCancha;
  fecha: string;
}

export function CalendarioCliente({ canchaId, nombreCancha, tipoCancha, fecha }: Props) {
  const { data: slots, isLoading, error, mutate } = useSWR<BloqueHorario[]>(
    `/reservas/slots?canchaId=${canchaId}&fecha=${fecha}`,
    swrFetcher,
  );
  const { data: misReservas } = useSWR<MiReserva[]>('/reservas/mis-reservas', swrFetcher);

  function esSlotPropio(horaInicio: number, horaFin: number): boolean {
    return (misReservas ?? []).some(
      r =>
        r.cancha.id === canchaId &&
        r.estado === 'CONFIRMADA' &&
        r.fechaReserva.startsWith(fecha) &&
        r.horaInicio <= horaInicio &&
        r.horaFin >= horaFin,
    );
  }

  function esSlotPendientePropio(horaInicio: number, horaFin: number): boolean {
    return (misReservas ?? []).some(
      r =>
        r.cancha.id === canchaId &&
        r.estado === 'PENDIENTE' &&
        r.fechaReserva.startsWith(fecha) &&
        r.horaInicio <= horaInicio &&
        r.horaFin >= horaFin,
    );
  }

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

  const slotsMostrados = slots.map(slot => {
    if (slot.estado !== 'PENDIENTE') return slot;
    return esSlotPendientePropio(slot.horaInicio, slot.horaFin)
      ? slot
      : { ...slot, estado: 'DISPONIBLE' as const };
  });
  const entradas = agruparNoDisponibles(slotsMostrados);
  const duraciones = DURACIONES_POR_TIPO[tipoCancha];

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
            const esOcupado          = entrada.estado === 'OCUPADO';
            const esPropio           = esOcupado && esSlotPropio(entrada.horaInicio, entrada.horaFin);
            const esPendientePropio  = !esOcupado && esSlotPendientePropio(entrada.horaInicio, entrada.horaFin);

            const claseFondo = esPropio
              ? 'bg-green-50 border-l-4 border-l-green-500'
              : esPendientePropio
              ? 'bg-yellow-50 border-l-4 border-l-yellow-400'
              : esOcupado
              ? 'bg-red-50 border-l-4 border-l-red-400'
              : 'bg-gray-50 border-l-4 border-l-gray-300';

            const claseBadge = esPropio
              ? 'bg-green-100 text-green-700'
              : esPendientePropio
              ? 'bg-yellow-100 text-yellow-700'
              : esOcupado
              ? 'bg-red-100 text-red-700'
              : 'bg-gray-100 text-gray-500';

            const etiqueta = esPropio
              ? 'Confirmada ✓'
              : esPendientePropio
              ? 'Tu solicitud — pendiente'
              : esOcupado
              ? 'Ocupado'
              : 'No disponible';

            return (
              <div key={entrada.horaInicio} className={`px-4 py-3 ${claseFondo}`}>
                <div className="flex items-center justify-between gap-2">
                  <span className="tabular-nums text-sm font-medium text-muted-foreground">
                    {formatearRango(entrada.horaInicio, entrada.horaFin)}
                  </span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${claseBadge}`}>
                    {etiqueta}
                  </span>
                </div>
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
                      const valida = esDuracionValida(slotsMostrados, entrada.horaInicio, d.minutos);
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
                        Solicitar →
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
        <ModalSolicitarReserva
          key={`${horaInicioSeleccionada}-${duracionSeleccionada}`}
          canchaId={canchaId}
          nombreCancha={nombreCancha}
          fecha={fecha}
          horaInicio={horaInicioSeleccionada}
          horaFin={horaInicioSeleccionada + duracionSeleccionada}
          abierto={true}
          onCerrar={cerrarModal}
          onSolicitada={() => {
            cerrarModal();
            mutate();
          }}
        />
      )}
    </>
  );
}
