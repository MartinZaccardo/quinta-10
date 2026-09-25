'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { swrFetcher } from '@/lib/api';
import api from '@/lib/api';
import { formatearRango, minutosAHora } from '@/lib/tiempo';
import { type TipoCancha, type BloqueHorario, DURACIONES_POR_TIPO, agruparNoDisponibles, esDuracionValida } from '@/lib/canchas';
import { ModalCrearReserva } from './modal-crear-reserva';
import { toast } from 'sonner';

interface Props {
  canchaId: string;
  nombreCancha: string;
  tipoCancha: TipoCancha;
  fecha: string;
}

export function CalendarioDia({ canchaId, nombreCancha, tipoCancha, fecha }: Props) {
  const { data: slots, isLoading, error, mutate } = useSWR<BloqueHorario[]>(
    `/reservas/slots?canchaId=${canchaId}&fecha=${fecha}`,
    swrFetcher,
  );

  const [horaInicioSeleccionada, setHoraInicioSeleccionada] = useState<number | null>(null);
  const [duracionSeleccionada, setDuracionSeleccionada] = useState<number | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [cargandoAccion, setCargandoAccion] = useState<string | null>(null);

  async function confirmarReserva(reservaId: string) {
    setCargandoAccion(reservaId);
    try {
      await api.patch(`/reservas/${reservaId}/confirmar`);
      toast.success('Reserva confirmada');
      mutate();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Error al confirmar');
    } finally {
      setCargandoAccion(null);
    }
  }

  async function rechazarReserva(reservaId: string) {
    setCargandoAccion(reservaId + '-rechazar');
    try {
      await api.patch(`/reservas/${reservaId}/cancelar`);
      toast.success('Reserva rechazada');
      mutate();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Error al rechazar');
    } finally {
      setCargandoAccion(null);
    }
  }

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
            const etiqueta = entrada.esTurnoFijo ? 'Turno fijo' : esOcupado ? 'Ocupado' : 'Pendiente';
            const claseFondo = esOcupado
              ? 'bg-red-50 border-l-4 border-l-red-400'
              : 'bg-yellow-50 border-l-4 border-l-yellow-400';
            const claseBadge = entrada.esTurnoFijo
              ? 'bg-purple-100 text-purple-700'
              : esOcupado
              ? 'bg-red-100 text-red-700'
              : 'bg-yellow-100 text-yellow-700';
            const esPendiente = entrada.estado === 'PENDIENTE';
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
                {entrada.contacto && (
                  <p className="text-sm font-medium mt-0.5 text-gray-800">{entrada.contacto}</p>
                )}
                {entrada.telefono && (
                  <p className="text-xs text-gray-500 mt-0.5">
                    <span className="font-medium">Teléfono:</span> {entrada.telefono}
                  </p>
                )}
                {esPendiente && entrada.cantidadPendientes !== undefined && entrada.cantidadPendientes > 1 && (
                  <p className="text-xs text-yellow-700 mt-0.5">
                    +{entrada.cantidadPendientes - 1} más en espera
                  </p>
                )}
                {esPendiente && entrada.reservaId && (
                  <div className="flex gap-2 mt-2">
                    <button
                      disabled={cargandoAccion !== null}
                      onClick={() => confirmarReserva(entrada.reservaId!)}
                      className="px-3 py-1 text-xs font-medium rounded-md bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 transition-colors"
                    >
                      {cargandoAccion === entrada.reservaId ? 'Confirmando...' : 'Confirmar'}
                    </button>
                    <button
                      disabled={cargandoAccion !== null}
                      onClick={() => rechazarReserva(entrada.reservaId!)}
                      className="px-3 py-1 text-xs font-medium rounded-md bg-white text-red-600 border border-red-300 hover:bg-red-50 disabled:opacity-50 transition-colors"
                    >
                      {cargandoAccion === entrada.reservaId + '-rechazar' ? 'Rechazando...' : 'Rechazar'}
                    </button>
                  </div>
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
                      const valida = esDuracionValida(slots, entrada.horaInicio, d.minutos);
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
