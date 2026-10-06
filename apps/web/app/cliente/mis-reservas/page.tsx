'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { toast } from 'sonner';
import { swrFetcher } from '@/lib/api';
import api from '@/lib/api';
import { formatearRango, formatearFecha } from '@/lib/tiempo';
import { Button } from '@/components/ui/button';

type EstadoReserva = 'PENDIENTE' | 'CONFIRMADA' | 'CANCELADA';

interface Reserva {
  id: string;
  cancha: { id: string; nombre: string };
  fechaReserva: string;
  horaInicio: number;
  horaFin: number;
  estado: EstadoReserva;
}

const BADGE_ESTADO: Record<EstadoReserva, string> = {
  PENDIENTE:  'bg-yellow-100 text-yellow-700',
  CONFIRMADA: 'bg-green-100 text-green-700',
  CANCELADA:  'bg-gray-100 text-gray-500',
};

export default function PaginaMisReservas() {
  const { data: reservas, isLoading, error, mutate } = useSWR<Reserva[]>(
    '/reservas/mis-reservas',
    swrFetcher,
  );

  const [cancelando, setCancelando] = useState<string | null>(null);

  async function cancelar(id: string) {
    setCancelando(id);
    try {
      await api.patch(`/reservas/${id}/cancelar`);
      toast.success('Reserva cancelada');
      mutate();
    } catch {
      toast.error('Error al cancelar la reserva');
    } finally {
      setCancelando(null);
    }
  }

  if (isLoading) {
    return <div className="p-6 text-muted-foreground text-sm">Cargando reservas...</div>;
  }
  if (error) {
    return <div className="p-6 text-red-500 text-sm">Error al cargar las reservas.</div>;
  }

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="mb-2">
        <p className="text-sky-400 text-xs font-bold tracking-[0.2em] uppercase mb-1">Tu historial</p>
        <h1 className="font-display font-black uppercase text-[#0F1C2E] text-4xl sm:text-5xl leading-none">
          Mis reservas
        </h1>
      </div>

      {!reservas?.length ? (
        <div className="py-16 text-center text-muted-foreground text-sm">
          No tenés reservas todavía.
        </div>
      ) : (
        <div className="space-y-3">
          {reservas.map((reserva) => (
            <div
              key={reserva.id}
              className="bg-white border rounded-lg px-4 py-4 flex items-start justify-between gap-4"
            >
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-2 flex-wrap text-sm">
                  <span className="font-medium">{reserva.cancha.nombre}</span>
                  <span className="text-muted-foreground">·</span>
                  <span className="text-muted-foreground">{formatearFecha(reserva.fechaReserva)}</span>
                  <span className="text-muted-foreground">·</span>
                  <span className="tabular-nums">{formatearRango(reserva.horaInicio, reserva.horaFin)}</span>
                </div>
                <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full mt-1 ${BADGE_ESTADO[reserva.estado]}`}>
                  {reserva.estado.charAt(0) + reserva.estado.slice(1).toLowerCase()}
                </span>
              </div>

              {reserva.estado === 'PENDIENTE' && (
                <Button
                  size="sm"
                  variant="outline"
                  disabled={cancelando === reserva.id}
                  onClick={() => cancelar(reserva.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 shrink-0"
                >
                  Cancelar
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
