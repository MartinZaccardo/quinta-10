'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { swrFetcher } from '@/lib/api';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GrillaDisponibilidad } from '@/components/admin/grilla-disponibilidad';

interface Cancha {
  id: string;
  nombre: string;
  tipo: string;
  activa: boolean;
}

function fechaHoy(): string {
  const hoy = new Date();
  const anio = hoy.getFullYear();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const dia = String(hoy.getDate()).padStart(2, '0');
  return `${anio}-${mes}-${dia}`;
}

export default function PaginaDisponibilidad() {
  const [fecha, setFecha] = useState(fechaHoy());
  const { data: canchas, isLoading, error } = useSWR<Cancha[]>('/canchas', swrFetcher);

  if (isLoading) {
    return <div className="p-6 text-muted-foreground text-sm">Cargando canchas...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500 text-sm">Error al cargar canchas: {error.message}</div>;
  }

  const canchasActivas = canchas?.filter((c) => c.activa) ?? [];

  if (!canchasActivas.length) {
    return <div className="p-6 text-muted-foreground text-sm">No hay canchas activas configuradas.</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Disponibilidad</h1>
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
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
            <GrillaDisponibilidad
              canchaId={cancha.id}
              nombreCancha={cancha.nombre}
              fecha={fecha}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
