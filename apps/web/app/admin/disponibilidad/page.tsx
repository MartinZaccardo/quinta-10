'use client';

import { Suspense } from 'react';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import { swrFetcher } from '@/lib/api';
import { type TipoCancha } from '@/lib/canchas';
import { FaFutbol } from 'react-icons/fa';
import { GiTennisBall } from 'react-icons/gi';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarioDia } from '@/components/admin/calendario-dia';

interface Cancha {
  id: string;
  nombre: string;
  tipo: TipoCancha;
  activa: boolean;
}

const ETIQUETA_TIPO: Record<TipoCancha, { label: string; icono: React.ReactNode }> = {
  F5:    { label: 'Fútbol 5', icono: <FaFutbol className="w-3.5 h-3.5" /> },
  F6:    { label: 'Fútbol 6', icono: <FaFutbol className="w-3.5 h-3.5" /> },
  PADEL: { label: 'Pádel',    icono: <GiTennisBall className="w-3.5 h-3.5" /> },
};

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
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sky-400 text-xs font-bold tracking-[0.2em] uppercase mb-1">Vista diaria</p>
          <h1 className="font-display font-black uppercase text-[#0F1C2E] text-4xl sm:text-5xl leading-none">Disponibilidad</h1>
        </div>
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
            <TabsTrigger key={cancha.id} value={cancha.id} className="flex items-center gap-1.5">
              {ETIQUETA_TIPO[cancha.tipo]?.icono}
              {ETIQUETA_TIPO[cancha.tipo]?.label ?? cancha.nombre}
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
