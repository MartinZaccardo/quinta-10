'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { toast } from 'sonner';
import { swrFetcher } from '@/lib/api';
import api from '@/lib/api';
import { formatearRango, formatearFecha } from '@/lib/tiempo';
import { Button } from '@/components/ui/button';

interface Cancha {
  id: string;
  nombre: string;
  tipo: string;
}

interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  numeroWhatsApp: string;
}

interface Reserva {
  id: string;
  cancha: Cancha;
  usuario?: Usuario;
  nombreContacto?: string;
  telefonoContacto?: string;
  fechaReserva: string;
  horaInicio: number;
  horaFin: number;
  esManual: boolean;
}

export default function PaginaReservas() {
  const { data: reservas, isLoading, error, mutate } = useSWR<Reserva[]>(
    '/reservas?estado=PENDIENTE',
    swrFetcher,
  );

  const [procesando, setProcesando] = useState<string | null>(null);

  async function confirmar(id: string) {
    setProcesando(id);
    try {
      await api.patch(`/reservas/${id}/confirmar`);
      toast.success('Reserva confirmada');
      mutate();
    } catch {
      toast.error('Error al confirmar la reserva');
    } finally {
      setProcesando(null);
    }
  }

  async function rechazar(id: string) {
    setProcesando(id);
    try {
      await api.patch(`/reservas/${id}/cancelar`);
      toast.success('Reserva rechazada');
      mutate();
    } catch {
      toast.error('Error al rechazar la reserva');
    } finally {
      setProcesando(null);
    }
  }

  if (isLoading) {
    return <div className="p-6 text-muted-foreground text-sm">Cargando reservas...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500 text-sm">Error al cargar las reservas.</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Reservas pendientes</h1>

      {!reservas?.length ? (
        <div className="py-16 text-center text-muted-foreground text-sm">
          No hay reservas pendientes.
        </div>
      ) : (
        <div className="space-y-3">
          {reservas.map((reserva) => {
            const nombre = reserva.usuario
              ? `${reserva.usuario.nombre} ${reserva.usuario.apellido}`
              : reserva.nombreContacto;
            const telefono = reserva.usuario?.numeroWhatsApp ?? reserva.telefonoContacto;
            const ocupado = procesando === reserva.id;

            return (
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
                  {nombre && <p className="text-sm font-medium text-gray-800">{nombre}</p>}
                  {telefono && (
                    <p className="text-xs text-gray-500">
                      <span className="font-medium">Teléfono:</span> {telefono}
                    </p>
                  )}
                </div>

                <div className="flex gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={ocupado}
                    onClick={() => rechazar(reserva.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                  >
                    Rechazar
                  </Button>
                  <Button
                    size="sm"
                    disabled={ocupado}
                    onClick={() => confirmar(reserva.id)}
                  >
                    Confirmar
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
