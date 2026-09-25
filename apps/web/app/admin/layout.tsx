'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import useSWR from 'swr';
import { useAuth } from '@/contexts/auth';
import { swrFetcher } from '@/lib/api';

const NAV = [
  { href: '/admin/disponibilidad', label: 'Disponibilidad' },
  { href: '/admin/reservas',       label: 'Reservas' },
  { href: '/admin/turnos-fijos',   label: 'Turnos fijos' },
  { href: '/admin/usuarios',       label: 'Usuarios' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { estaAutenticado, esAdmin, cargando } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const { data: conteo } = useSWR<{ total: number }>(
    estaAutenticado && esAdmin ? '/reservas/pendientes/count' : null,
    swrFetcher,
    { refreshInterval: 30_000 },
  );
  const pendientes = conteo?.total ?? 0;

  useEffect(() => {
    if (cargando) return;
    if (!estaAutenticado) router.replace('/login');
    else if (!esAdmin) router.replace('/cliente/disponibilidad');
  }, [cargando, estaAutenticado, esAdmin, router]);

  if (cargando || !estaAutenticado || !esAdmin) {
    return <div className="flex items-center justify-center h-screen text-muted-foreground">Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 flex items-center gap-6 h-14">
          <span className="font-semibold text-sm text-gray-900 shrink-0">La Quinta del 10</span>
          <nav className="flex gap-1">
            {NAV.map(({ href, label }) => {
              const activo = pathname.startsWith(href);
              const mostrarBadge = href === '/admin/reservas' && pendientes > 0;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`relative px-3 py-1.5 rounded-md text-sm transition-colors ${
                    activo
                      ? 'bg-gray-100 text-gray-900 font-medium'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {label}
                  {mostrarBadge && (
                    <span className="absolute -top-1 -right-1 min-w-[1.1rem] h-[1.1rem] flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold px-1 leading-none">
                      {pendientes > 99 ? '99+' : pendientes}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <main className="max-w-5xl mx-auto">{children}</main>
    </div>
  );
}
