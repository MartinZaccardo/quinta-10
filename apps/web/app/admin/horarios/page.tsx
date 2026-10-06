'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { toast } from 'sonner';
import { swrFetcher } from '@/lib/api';
import api from '@/lib/api';
import { minutosAHora } from '@/lib/tiempo';
import { Button } from '@/components/ui/button';

type DiaSemana = 'LUNES' | 'MARTES' | 'MIERCOLES' | 'JUEVES' | 'VIERNES' | 'SABADO' | 'DOMINGO';

interface ConfiguracionHoraria {
  diaSemana: DiaSemana;
  horaApertura: number;
  horaCierre: number;
}

const ETIQUETAS: Record<DiaSemana, string> = {
  LUNES:     'Lunes',
  MARTES:    'Martes',
  MIERCOLES: 'Miércoles',
  JUEVES:    'Jueves',
  VIERNES:   'Viernes',
  SABADO:    'Sábado',
  DOMINGO:   'Domingo',
};

function horaAMinutos(hora: string): number {
  const [h, m] = hora.split(':').map(Number);
  return h * 60 + m;
}

export default function PaginaHorarios() {
  const { data: horarios, isLoading, error, mutate } = useSWR<ConfiguracionHoraria[]>(
    '/horarios',
    swrFetcher,
  );

  const [editando, setEditando]   = useState<DiaSemana | null>(null);
  const [form, setForm]           = useState({ apertura: '', cierre: '' });
  const [guardando, setGuardando] = useState(false);

  function iniciarEdicion(horario: ConfiguracionHoraria) {
    setEditando(horario.diaSemana);
    setForm({
      apertura: minutosAHora(horario.horaApertura),
      cierre:   minutosAHora(horario.horaCierre),
    });
  }

  async function guardar(diaSemana: DiaSemana) {
    setGuardando(true);
    try {
      const horaApertura = horaAMinutos(form.apertura);
      let   horaCierre   = horaAMinutos(form.cierre);

      // Si cierre <= apertura en minutos, es del día siguiente (ej: apertura 08:00, cierre 02:00 → +24hs)
      if (horaCierre <= horaApertura) horaCierre += 1440;

      await api.patch(`/horarios/${diaSemana}`, { horaApertura, horaCierre });
      toast.success('Horario actualizado');
      setEditando(null);
      mutate();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Error al guardar');
    } finally {
      setGuardando(false);
    }
  }

  if (isLoading) {
    return <div className="p-6 text-muted-foreground text-sm">Cargando horarios...</div>;
  }
  if (error) {
    return <div className="p-6 text-red-500 text-sm">Error al cargar los horarios.</div>;
  }

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div>
        <p className="text-sky-400 text-xs font-bold tracking-[0.2em] uppercase mb-1">Configuración del predio</p>
        <h1 className="font-display font-black uppercase text-[#0F1C2E] text-4xl sm:text-5xl leading-none">Horarios</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Apertura y cierre del predio por día de la semana. Para cierres después de medianoche ingresá la hora del día siguiente (ej: 02:00).
        </p>
      </div>

      <div className="border rounded-lg overflow-hidden divide-y bg-white">
        {horarios?.map((horario) => {
          const estaEditando        = editando === horario.diaSemana;
          const esCierrePostMedianoche = horario.horaCierre > 1440;

          return (
            <div key={horario.diaSemana} className="px-4 py-3">
              {estaEditando ? (
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="w-28 text-sm font-medium shrink-0">
                    {ETIQUETAS[horario.diaSemana]}
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="time"
                      value={form.apertura}
                      onChange={e => setForm(f => ({ ...f, apertura: e.target.value }))}
                      className="border rounded-md px-2 py-1 text-sm"
                    />
                    <span className="text-muted-foreground text-sm">–</span>
                    <input
                      type="time"
                      value={form.cierre}
                      onChange={e => setForm(f => ({ ...f, cierre: e.target.value }))}
                      className="border rounded-md px-2 py-1 text-sm"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      disabled={guardando}
                      onClick={() => guardar(horario.diaSemana)}
                      className="bg-amber-400 hover:bg-amber-500 text-[#0F1C2E] font-bold border-0"
                    >
                      {guardando ? 'Guardando...' : 'Guardar'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={guardando}
                      onClick={() => setEditando(null)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className="w-28 text-sm font-medium shrink-0">
                      {ETIQUETAS[horario.diaSemana]}
                    </span>
                    <span className="tabular-nums text-sm text-muted-foreground">
                      {minutosAHora(horario.horaApertura)} – {minutosAHora(horario.horaCierre)}
                    </span>
                    {esCierrePostMedianoche && (
                      <span className="text-xs bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full">
                        cierra día siguiente
                      </span>
                    )}
                  </div>
                  <Button size="sm" variant="outline" onClick={() => iniciarEdicion(horario)}>
                    Editar
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
