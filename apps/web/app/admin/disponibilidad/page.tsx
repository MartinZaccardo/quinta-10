'use client';

import { Suspense } from 'react';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import { swrFetcher } from '@/lib/api';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarioDia } from '@/components/admin/calendario-dia';

type TipoCancha = 'F5' | 'F6' | 'PADEL';

interface Cancha {
  id: string;
  nombre: string;
  tipo: TipoCancha;
  activa: boolean;
}

const STORAGE_KEY = 'admin-disponibilidad-fecha';

function fechaHoy(): string {
  const hoy = new Date();
  const anio = hoy.getFullYear();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const dia = String(hoy.getDate()).padStart(2, '0');
  return `${anio}-${mes}-${dia}`;
}

function ContenidoDisponibilidad() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [fecha, setFecha] = useState<string>(() => {
    const desdeUrl = searchParams.get('fecha');
    if (desdeUrl) return desdeUrl;
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem(STORAGE_KEY) ?? fechaHoy();
    }
    return fechaHoy();
  });

  const { data: canchas, isLoading, error } = useSWR<Cancha[]>('/canchas', swrFetcher);

  function cambiarFecha(nuevaFecha: string) {
    setFecha(nuevaFecha);
    sessionStorage.setItem(STORAGE_KEY, nuevaFecha);
    const params = new URLSearchParams(searchParams.toString());
    params.set('fecha', nuevaFecha);
    router.replace(`/admin/disponibilidad?${params.toString()}`);
  }

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
            <CalendarioDia
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

export default function PaginaDisponibilidad() {
  return (
    <Suspense fallback={<div className="p-6 text-muted-foreground text-sm">Cargando...</div>}>
      <ContenidoDisponibilidad />
    </Suspense>
  );
}
