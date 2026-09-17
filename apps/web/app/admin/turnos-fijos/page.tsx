'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { swrFetcher } from '@/lib/api';
import api from '@/lib/api';
import { formatearRango, formatearFecha } from '@/lib/tiempo';
import { Button } from '@/components/ui/button';
import { ModalCrearTurnoFijo } from '@/components/admin/modal-crear-turno-fijo';
import { ModalAgregarExcepcion } from '@/components/admin/modal-agregar-excepcion';

type DiaSemana = 'LUNES' | 'MARTES' | 'MIERCOLES' | 'JUEVES' | 'VIERNES' | 'SABADO' | 'DOMINGO';

const ORDEN_DIAS: DiaSemana[] = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'];

const NOMBRE_DIA: Record<DiaSemana, string> = {
  LUNES: 'Lunes', MARTES: 'Martes', MIERCOLES: 'Miércoles',
  JUEVES: 'Jueves', VIERNES: 'Viernes', SABADO: 'Sábado', DOMINGO: 'Domingo',
};

interface TurnoFijo {
  id: string;
  diaSemana: DiaSemana;
  horaInicio: number;
  horaFin: number;
  fechaInicio: string;
  cancha: { nombre: string };
  usuario: { nombre: string; apellido: string; numeroWhatsApp: string };
}

interface ExcepcionPendiente {
  turnoFijoId: string;
  diaSemana: DiaSemana;
}

export default function PaginaTurnosFijos() {
  const { data: turnos, isLoading, error, mutate } = useSWR<TurnoFijo[]>(
    '/turnos-fijos',
    swrFetcher,
  );

  const [modalCrearAbierto, setModalCrearAbierto] = useState(false);
  const [excepcionPendiente, setExcepcionPendiente] = useState<ExcepcionPendiente | null>(null);
  const [desactivando, setDesactivando] = useState<string | null>(null);

  async function desactivar(id: string) {
    setDesactivando(id);
    try {
      await api.patch(`/turnos-fijos/${id}/desactivar`);
      mutate();
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

  const porDia = ORDEN_DIAS.reduce<Record<DiaSemana, TurnoFijo[]>>((acc, dia) => {
    acc[dia] = turnos?.filter(t => t.diaSemana === dia) ?? [];
    return acc;
  }, {} as Record<DiaSemana, TurnoFijo[]>);

  const diasConTurnos = ORDEN_DIAS.filter(d => porDia[d].length > 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Turnos fijos</h1>
        <Button onClick={() => setModalCrearAbierto(true)}>+ Nuevo turno fijo</Button>
      </div>

      {!diasConTurnos.length ? (
        <div className="py-16 text-center text-muted-foreground text-sm">
          No hay turnos fijos activos.
        </div>
      ) : (
        <div className="space-y-8">
          {diasConTurnos.map((dia) => (
            <div key={dia}>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                {NOMBRE_DIA[dia]}
              </h2>
              <div className="space-y-2">
                {porDia[dia].map((turno) => (
                  <div
                    key={turno.id}
                    className="bg-white border rounded-lg px-4 py-4 flex items-start justify-between gap-4"
                  >
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap text-sm">
                        <span className="font-medium">{turno.cancha.nombre}</span>
                        <span className="text-muted-foreground">·</span>
                        <span className="tabular-nums">{formatearRango(turno.horaInicio, turno.horaFin)}</span>
                      </div>
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
                        onClick={() => setExcepcionPendiente({ turnoFijoId: turno.id, diaSemana: turno.diaSemana })}
                      >
                        Excepción
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

      <ModalCrearTurnoFijo
        abierto={modalCrearAbierto}
        onCerrar={() => setModalCrearAbierto(false)}
        onCreado={() => {
          setModalCrearAbierto(false);
          mutate();
        }}
      />

      {excepcionPendiente && (
        <ModalAgregarExcepcion
          turnoFijoId={excepcionPendiente.turnoFijoId}
          diaSemana={excepcionPendiente.diaSemana}
          abierto={true}
          onCerrar={() => setExcepcionPendiente(null)}
          onAgregada={() => {
            setExcepcionPendiente(null);
            mutate();
          }}
        />
      )}
    </div>
  );
}
