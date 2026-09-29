'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { toast } from 'sonner';
import { swrFetcher } from '@/lib/api';
import api from '@/lib/api';
import { formatearRango, formatearFecha } from '@/lib/tiempo';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

type Vista = 'PENDIENTE' | 'CONFIRMADA';

interface Cancha  { id: string; nombre: string; activa: boolean }
interface Usuario { id: string; nombre: string; apellido: string; numeroWhatsApp: string }

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

function fechaHoy(): string {
  const hoy = new Date();
  return `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;
}

// ─── Lista de reservas (pendientes o confirmadas de una cancha/fecha) ──────────

interface ListaReservasProps {
  url: string;
  vista: Vista;
  onCambio: () => void;
}

function ListaReservas({ url, vista, onCambio }: ListaReservasProps) {
  const { data: reservas, isLoading, error, mutate } = useSWR<Reserva[]>(url, swrFetcher);
  const [procesando, setProcesando] = useState<string | null>(null);

  async function confirmar(id: string) {
    setProcesando(id);
    try {
      await api.patch(`/reservas/${id}/confirmar`);
      toast.success('Reserva confirmada');
      mutate();
      onCambio();
    } catch {
      toast.error('Error al confirmar la reserva');
    } finally {
      setProcesando(null);
    }
  }

  async function cancelar(id: string) {
    setProcesando(id);
    try {
      await api.patch(`/reservas/${id}/cancelar`);
      toast.success(vista === 'PENDIENTE' ? 'Reserva rechazada' : 'Reserva cancelada');
      mutate();
      onCambio();
    } catch {
      toast.error('Error al cancelar la reserva');
    } finally {
      setProcesando(null);
    }
  }

  if (isLoading) return <div className="py-8 text-center text-muted-foreground text-sm">Cargando...</div>;
  if (error)     return <div className="py-8 text-center text-red-500 text-sm">Error al cargar las reservas.</div>;

  if (!reservas?.length) {
    return (
      <div className="py-16 text-center text-muted-foreground text-sm">
        No hay reservas {vista === 'PENDIENTE' ? 'pendientes' : 'confirmadas'}.
      </div>
    );
  }

  return (
    <div className="space-y-3 mt-4">
      {reservas.map((reserva) => {
        const nombre   = reserva.usuario
          ? `${reserva.usuario.nombre} ${reserva.usuario.apellido}`
          : reserva.nombreContacto;
        const telefono = reserva.usuario?.numeroWhatsApp ?? reserva.telefonoContacto;
        const ocupado  = procesando === reserva.id;

        return (
          <div
            key={reserva.id}
            className="bg-white border rounded-lg px-4 py-4 flex items-start justify-between gap-4"
          >
            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center gap-2 flex-wrap text-sm">
                {vista === 'PENDIENTE' && (
                  <>
                    <span className="font-medium">{reserva.cancha.nombre}</span>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-muted-foreground">{formatearFecha(reserva.fechaReserva)}</span>
                    <span className="text-muted-foreground">·</span>
                  </>
                )}
                <span className="tabular-nums">{formatearRango(reserva.horaInicio, reserva.horaFin)}</span>
              </div>
              {nombre   && <p className="text-sm font-medium text-gray-800">{nombre}</p>}
              {telefono && <p className="text-xs text-gray-500"><span className="font-medium">Tel:</span> {telefono}</p>}
            </div>

            <div className="flex gap-2 shrink-0">
              <Button
                size="sm"
                variant="outline"
                disabled={ocupado}
                onClick={() => cancelar(reserva.id)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
              >
                {vista === 'PENDIENTE' ? 'Rechazar' : 'Cancelar'}
              </Button>
              {vista === 'PENDIENTE' && (
                <Button size="sm" disabled={ocupado} onClick={() => confirmar(reserva.id)}>
                  Confirmar
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Vista pendientes ──────────────────────────────────────────────────────────

function VistaPendientes() {
  const [, setVersion] = useState(0);
  return (
    <ListaReservas
      url="/reservas?estado=PENDIENTE"
      vista="PENDIENTE"
      onCambio={() => setVersion(v => v + 1)}
    />
  );
}

// ─── Vista confirmadas (por fecha y cancha) ────────────────────────────────────

function VistaConfirmadas() {
  const [fecha, setFecha] = useState(fechaHoy());
  const { data: canchas } = useSWR<Cancha[]>('/canchas', swrFetcher);
  const [, setVersion]    = useState(0);

  const canchasActivas = canchas?.filter(c => c.activa) ?? [];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">Fecha</span>
        <input
          type="date"
          value={fecha}
          onChange={e => setFecha(e.target.value)}
          className="border rounded-md px-3 py-1.5 text-sm bg-white"
        />
      </div>

      {canchasActivas.length > 0 && (
        <Tabs defaultValue={canchasActivas[0].id}>
          <TabsList>
            {canchasActivas.map(c => (
              <TabsTrigger key={c.id} value={c.id}>{c.nombre}</TabsTrigger>
            ))}
          </TabsList>

          {canchasActivas.map(c => (
            <TabsContent key={c.id} value={c.id}>
              <ListaReservas
                url={`/reservas?estado=CONFIRMADA&fecha=${fecha}&canchaId=${c.id}`}
                vista="CONFIRMADA"
                onCambio={() => setVersion(v => v + 1)}
              />
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
}

// ─── Página ────────────────────────────────────────────────────────────────────

export default function PaginaReservas() {
  const [vista, setVista] = useState<Vista>('PENDIENTE');

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <h1 className="text-2xl font-semibold">Reservas</h1>

      <div className="flex rounded-md border overflow-hidden text-sm w-fit">
        {(['PENDIENTE', 'CONFIRMADA'] as Vista[]).map((v) => (
          <button
            key={v}
            onClick={() => setVista(v)}
            className={`px-4 py-2 transition-colors ${
              vista === v
                ? 'bg-primary text-primary-foreground font-medium'
                : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            {v === 'PENDIENTE' ? 'Pendientes' : 'Confirmadas'}
          </button>
        ))}
      </div>

      {vista === 'PENDIENTE' ? <VistaPendientes /> : <VistaConfirmadas />}
    </div>
  );
}
