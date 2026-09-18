'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { toast } from 'sonner';
import { swrFetcher } from '@/lib/api';
import api from '@/lib/api';
import { formatearRango, formatearFecha } from '@/lib/tiempo';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ModalCrearTurnoFijo } from '@/components/admin/modal-crear-turno-fijo';
import { ModalCancelacionPuntual } from '@/components/admin/modal-cancelacion-puntual';

type DiaSemana = 'LUNES' | 'MARTES' | 'MIERCOLES' | 'JUEVES' | 'VIERNES' | 'SABADO' | 'DOMINGO';

const ORDEN_DIAS: DiaSemana[] = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'];

const NOMBRE_DIA: Record<DiaSemana, string> = {
  LUNES: 'Lunes', MARTES: 'Martes', MIERCOLES: 'Miércoles',
  JUEVES: 'Jueves', VIERNES: 'Viernes', SABADO: 'Sábado', DOMINGO: 'Domingo',
};

interface Cancha { id: string; nombre: string }

interface TurnoFijo {
  id: string;
  diaSemana: DiaSemana;
  horaInicio: number;
  horaFin: number;
  fechaInicio: string;
  cancha: { id: string; nombre: string };
  usuario: { nombre: string; apellido: string; numeroWhatsApp: string };
}

interface CancelacionPendiente {
  turnoFijoId: string;
  diaSemana: DiaSemana;
}

export default function PaginaTurnosFijos() {
  const { data: canchas } = useSWR<Cancha[]>('/canchas', swrFetcher);
  const { data: turnos, isLoading, error, mutate } = useSWR<TurnoFijo[]>('/turnos-fijos', swrFetcher);

  const [modalCrearAbierto, setModalCrearAbierto]       = useState(false);
  const [cancelacionPendiente, setCancelacionPendiente] = useState<CancelacionPendiente | null>(null);
  const [desactivando, setDesactivando]                 = useState<string | null>(null);

  async function desactivar(id: string) {
    setDesactivando(id);
    try {
      await api.patch(`/turnos-fijos/${id}/desactivar`);
      toast.success('Turno fijo desactivado');
      mutate();
    } catch {
      toast.error('Error al desactivar el turno fijo');
    } finally {
      setDesactivando(null);
    }
  }

  if (isLoading) {
    return <div className="p-6 text-muted-foreground text-sm">Cargando turnos fijos...</div>;
  }
  if (error) {
    return <div className="p-6 text-red-500 text-sm">Error al cargar los turnos fijos.</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Turnos fijos</h1>
        <Button onClick={() => setModalCrearAbierto(true)}>+ Nuevo turno fijo</Button>
      </div>

      {canchas?.length ? (
        <Tabs defaultValue={canchas[0].id}>
          <TabsList>
            {canchas.map(c => (
              <TabsTrigger key={c.id} value={c.id}>{c.nombre}</TabsTrigger>
            ))}
          </TabsList>

          {canchas.map(cancha => {
            const turnosDeCancha = (turnos ?? []).filter(t => t.cancha.id === cancha.id);
            const diasConTurnos  = ORDEN_DIAS.filter(dia => turnosDeCancha.some(t => t.diaSemana === dia));

            return (
              <TabsContent key={cancha.id} value={cancha.id} className="mt-4">
                {!diasConTurnos.length ? (
                  <div className="py-16 text-center text-muted-foreground text-sm">
                    No hay turnos fijos para {cancha.nombre}.
                  </div>
                ) : (
                  <div className="space-y-8">
                    {diasConTurnos.map(dia => (
                      <div key={dia}>
                        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                          {NOMBRE_DIA[dia]}
                        </h2>
                        <div className="space-y-2">
                          {turnosDeCancha
                            .filter(t => t.diaSemana === dia)
                            .map(turno => (
                              <div
                                key={turno.id}
                                className="bg-white border rounded-lg px-4 py-4 flex items-start justify-between gap-4"
                              >
                                <div className="space-y-0.5 min-w-0">
                                  <span className="tabular-nums text-sm font-medium">
                                    {formatearRango(turno.horaInicio, turno.horaFin)}
                                  </span>
                                  <p className="text-sm font-medium text-gray-800">
                                    {turno.usuario.nombre} {turno.usuario.apellido}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    <span className="font-medium">Teléfono:</span> {turno.usuario.numeroWhatsApp}
                                  </p>
                                  <p className="text-xs text-gray-400">
                                    Desde {formatearFecha(turno.fechaInicio)}
                                  </p>
                                </div>

                                <div className="flex gap-2 shrink-0">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setCancelacionPendiente({ turnoFijoId: turno.id, diaSemana: turno.diaSemana })}
                                  >
                                    Cancelar día
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    disabled={desactivando === turno.id}
                                    onClick={() => desactivar(turno.id)}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                                  >
                                    Desactivar
                                  </Button>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            );
          })}
        </Tabs>
      ) : (
        <div className="py-16 text-center text-muted-foreground text-sm">
          No hay canchas configuradas.
        </div>
      )}

      <ModalCrearTurnoFijo
        abierto={modalCrearAbierto}
        onCerrar={() => setModalCrearAbierto(false)}
        onCreado={() => { setModalCrearAbierto(false); mutate(); }}
      />

      {cancelacionPendiente && (
        <ModalCancelacionPuntual
          turnoFijoId={cancelacionPendiente.turnoFijoId}
          diaSemana={cancelacionPendiente.diaSemana}
          abierto={true}
          onCerrar={() => setCancelacionPendiente(null)}
          onConfirmada={() => { setCancelacionPendiente(null); mutate(); }}
        />
      )}
    </div>
  );
}
