'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { swrFetcher } from '@/lib/api';
import { type TipoCancha } from '@/lib/canchas';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarioCliente } from '@/components/cliente/calendario-cliente';

interface Cancha {
  id: string;
  nombre: string;
  tipo: TipoCancha;
  activa: boolean;
}

const STORAGE_KEY = 'cliente-disponibilidad-fecha';

function fechaHoy(): string {
  const hoy = new Date();
  return `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;
}

function fechaInicial(): string {
  if (typeof window !== 'undefined') {
    const guardada = sessionStorage.getItem(STORAGE_KEY);
    if (guardada && guardada >= fechaHoy()) return guardada;
  }
  return fechaHoy();
}

export default function PaginaDisponibilidadCliente() {
  const [fecha, setFecha] = useState<string>(fechaInicial);
  const { data: canchas, isLoading, error } = useSWR<Cancha[]>('/canchas', swrFetcher);

  function cambiarFecha(nuevaFecha: string) {
    setFecha(nuevaFecha);
    sessionStorage.setItem(STORAGE_KEY, nuevaFecha);
  }

  if (isLoading) {
    return <div className="p-6 text-muted-foreground text-sm">Cargando canchas...</div>;
  }
  if (error) {
    return <div className="p-6 text-red-500 text-sm">Error al cargar canchas.</div>;
  }

  const canchasActivas = canchas?.filter((c) => c.activa) ?? [];

  if (!canchasActivas.length) {
    return <div className="p-6 text-muted-foreground text-sm">No hay canchas disponibles.</div>;
  }

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Disponibilidad</h1>
        <input
          type="date"
          value={fecha}
          min={fechaHoy()}
          onChange={(e) => cambiarFecha(e.target.value)}
          className="border rounded-md px-3 py-1.5 text-sm bg-white"
        />
      </div>

      <Tabs defaultValue={canchasActivas[0].id}>
        <TabsList>
          {canchasActivas.map((cancha) => (
            <TabsTrigger key={cancha.id} value={cancha.id}>
              {cancha.nombre}
            </TabsTrigger>
          ))}
        </TabsList>

        {canchasActivas.map((cancha) => (
          <TabsContent key={cancha.id} value={cancha.id}>
            <CalendarioCliente
              canchaId={cancha.id}
              nombreCancha={cancha.nombre}
              tipoCancha={cancha.tipo}
              fecha={fecha}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
