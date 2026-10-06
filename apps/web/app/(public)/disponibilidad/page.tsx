'use client';

import { useState } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import { FaFutbol } from 'react-icons/fa';
import { GiTennisBall } from 'react-icons/gi';
import { swrFetcher } from '@/lib/api';
import { type TipoCancha } from '@/lib/canchas';
import { useAuth } from '@/contexts/auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarioCliente } from '@/components/cliente/calendario-cliente';
import HeaderCliente from '@/components/cliente/HeaderCliente';

const ETIQUETA_TIPO: Record<TipoCancha, { label: string; icono: React.ReactNode }> = {
  F5:    { label: 'Fútbol 5', icono: <FaFutbol className="w-3.5 h-3.5" /> },
  F6:    { label: 'Fútbol 6', icono: <FaFutbol className="w-3.5 h-3.5" /> },
  PADEL: { label: 'Pádel',    icono: <GiTennisBall className="w-3.5 h-3.5" /> },
};

const STORAGE_KEY = 'disponibilidad-fecha';

interface Cancha {
  id: string;
  nombre: string;
  tipo: TipoCancha;
  activa: boolean;
}

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

export default function PaginaDisponibilidad() {
  const { estaAutenticado, cargando: cargandoAuth } = useAuth();
  const [fecha, setFecha] = useState<string>(fechaInicial);
  const { data: canchas, isLoading, error } = useSWR<Cancha[]>('/canchas', swrFetcher);

  const canchasActivas = canchas?.filter((c) => c.activa) ?? [];

  function cambiarFecha(nuevaFecha: string) {
    setFecha(nuevaFecha);
    sessionStorage.setItem(STORAGE_KEY, nuevaFecha);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {estaAutenticado
        ? <HeaderCliente />
        : (
          <header className="sticky top-0 z-50 bg-[#0F1C2E]">
            <div className="max-w-4xl mx-auto px-4 sm:px-8 h-14 flex items-center justify-between">
              <span className="font-display font-black uppercase text-white text-base tracking-wide">
                La Quinta del 10
              </span>
              <Link href="/" className="text-white/60 hover:text-white text-sm transition-colors">
                Inicio
              </Link>
            </div>
          </header>
        )
      }

      <div className="max-w-4xl mx-auto px-4 sm:px-8 pt-8 pb-16">
        <div className="mb-8">
          <p className="text-sky-400 text-xs font-bold tracking-[0.2em] uppercase mb-2">
            Disponibilidad en tiempo real
          </p>
          <h1 className="font-display font-black uppercase text-[#0F1C2E] text-4xl sm:text-5xl leading-none">
            Elegí tu cancha
            <br />
            y tu horario
          </h1>
        </div>

        {!cargandoAuth && !estaAutenticado && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 mb-8 flex items-center justify-between gap-4 flex-wrap">
            <p className="text-sm text-amber-800">
              Para confirmar una reserva necesitás una cuenta gratuita.
            </p>
            <div className="flex gap-3 shrink-0">
              <Link
                href="/registro?redirect=/disponibilidad"
                className="bg-amber-400 hover:bg-amber-500 text-[#0F1C2E] font-bold text-sm px-4 py-2 rounded-md transition-colors"
              >
                Crear cuenta
              </Link>
              <Link
                href="/login?redirect=/disponibilidad"
                className="border border-amber-300 text-amber-800 hover:bg-amber-100 text-sm px-4 py-2 rounded-md transition-colors"
              >
                Iniciar sesión
              </Link>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="text-sm text-gray-400 py-10 text-center">Cargando canchas...</div>
        )}
        {error && (
          <div className="text-sm text-red-500 py-10 text-center">Error al cargar canchas.</div>
        )}

        {canchasActivas.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-500">
                {canchasActivas.length} {canchasActivas.length === 1 ? 'cancha disponible' : 'canchas disponibles'}
              </p>
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
                  <TabsTrigger key={cancha.id} value={cancha.id} className="flex items-center gap-1.5">
                    {ETIQUETA_TIPO[cancha.tipo]?.icono}
                    {ETIQUETA_TIPO[cancha.tipo]?.label ?? cancha.nombre}
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
                    esPublico={!estaAutenticado}
                  />
                </TabsContent>
              ))}
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
}
