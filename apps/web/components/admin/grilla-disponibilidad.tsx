'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { swrFetcher } from '@/lib/api';
import { formatearRango } from '@/lib/tiempo';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ModalCrearReserva } from './modal-crear-reserva';

type EstadoBloque = 'DISPONIBLE' | 'PENDIENTE' | 'OCUPADO';

interface BloqueHorario {
  horaInicio: number;
  horaFin: number;
  estado: EstadoBloque;
}

const ETIQUETAS: Record<EstadoBloque, string> = {
  DISPONIBLE: 'Disponible',
  PENDIENTE: 'Pendiente',
  OCUPADO: 'Ocupado',
};

const CLASES_BADGE: Record<EstadoBloque, string> = {
  DISPONIBLE: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-100',
  PENDIENTE:  'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100',
  OCUPADO:    'bg-red-100 text-red-800 border-red-200 hover:bg-red-100',
};

interface Props {
  canchaId: string;
  nombreCancha: string;
  fecha: string;
}

export function GrillaDisponibilidad({ canchaId, nombreCancha, fecha }: Props) {
  const { data: slots, isLoading, error, mutate } = useSWR<BloqueHorario[]>(
    `/reservas/slots?canchaId=${canchaId}&fecha=${fecha}`,
    swrFetcher,
  );
  const [slotSeleccionado, setSlotSeleccionado] = useState<BloqueHorario | null>(null);

  if (isLoading) {
    return <div className="py-10 text-center text-muted-foreground text-sm">Cargando horarios...</div>;
  }
  if (error) {
    return <div className="py-10 text-center text-red-500 text-sm">Error al cargar la disponibilidad.</div>;
  }
  if (!slots?.length) {
    return <div className="py-10 text-center text-muted-foreground text-sm">Sin horarios configurados para este día.</div>;
  }

  return (
    <>
      <div className="space-y-2 mt-4">
        {slots.map((slot) => (
          <div
            key={slot.horaInicio}
            className="flex items-center justify-between px-4 py-3 border rounded-lg bg-white"
          >
            <span className="font-medium tabular-nums text-sm">
              {formatearRango(slot.horaInicio, slot.horaFin)}
            </span>
            <div className="flex items-center gap-3">
              <Badge className={CLASES_BADGE[slot.estado]}>
                {ETIQUETAS[slot.estado]}
              </Badge>
              {slot.estado === 'DISPONIBLE' && (
                <Button size="sm" variant="outline" onClick={() => setSlotSeleccionado(slot)}>
                  Reservar
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {slotSeleccionado && (
        <ModalCrearReserva
          key={slotSeleccionado.horaInicio}
          canchaId={canchaId}
          nombreCancha={nombreCancha}
          fecha={fecha}
          horaInicio={slotSeleccionado.horaInicio}
          abierto={true}
          onCerrar={() => setSlotSeleccionado(null)}
          onCreada={() => {
            setSlotSeleccionado(null);
            mutate();
          }}
        />
      )}
    </>
  );
}
