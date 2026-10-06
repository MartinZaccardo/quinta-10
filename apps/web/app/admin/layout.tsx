'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { FaSignOutAlt } from 'react-icons/fa';
import useSWR from 'swr';
import { useAuth } from '@/contexts/auth';
import { swrFetcher } from '@/lib/api';

const NAV = [
  { href: '/admin/disponibilidad', label: 'Disponibilidad' },
  { href: '/admin/reservas',       label: 'Reservas' },
  { href: '/admin/turnos-fijos',   label: 'Turnos fijos' },
  { href: '/admin/usuarios',       label: 'Usuarios' },
  { href: '/admin/horarios',       label: 'Horarios' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { estaAutenticado, esAdmin, cargando, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [menuAbierto, setMenuAbierto] = useState(false);

  const { data: conteo } = useSWR<{ total: number }>(
    estaAutenticado && esAdmin ? '/reservas/pendientes/count' : null,
    swrFetcher,
    { refreshInterval: 30_000 },
  );
  const pendientes = conteo?.total ?? 0;

  useEffect(() => {
    setMenuAbierto(false);
  }, [pathname]);

  useEffect(() => {
    if (cargando) return;
    if (!estaAutenticado) router.replace('/login');
    else if (!esAdmin) router.replace('/disponibilidad');
  }, [cargando, estaAutenticado, esAdmin, router]);

  if (cargando || !estaAutenticado || !esAdmin) {
    return <div className="flex items-center justify-center h-screen text-muted-foreground">Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#0F1C2E] sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          <div className="flex items-center gap-4">
            <span className="font-display font-black uppercase text-white text-base tracking-wide shrink-0">
              La Quinta del 10
            </span>

            <nav className="hidden md:flex gap-1">
              {NAV.map(({ href, label }) => {
                const activo = pathname.startsWith(href);
                const mostrarBadge = href === '/admin/reservas' && pendientes > 0;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`relative px-3 py-1.5 rounded-md text-sm transition-colors ${
                      activo
                        ? 'bg-white/10 text-white font-medium'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
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

          <div className="flex items-center gap-3">
            <button
              onClick={() => logout()}
              className="hidden md:flex items-center gap-1.5 text-red-400/70 hover:text-red-400 text-sm transition-colors"
            >
              <FaSignOutAlt className="w-3.5 h-3.5" />
              Cerrar sesión
            </button>

            <button
              className="md:hidden p-2 rounded-md text-white/60 hover:text-white hover:bg-white/5 transition-colors"
              onClick={() => setMenuAbierto((v) => !v)}
              aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
            >
              {menuAbierto ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {menuAbierto && (
          <div className="md:hidden border-t border-white/10 bg-[#0F1C2E]">
            <nav className="max-w-5xl mx-auto px-4 py-2 flex flex-col gap-1">
              {NAV.map(({ href, label }) => {
                const activo = pathname.startsWith(href);
                const mostrarBadge = href === '/admin/reservas' && pendientes > 0;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-md text-sm transition-colors ${
                      activo
                        ? 'bg-white/10 text-white font-medium'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {label}
                    {mostrarBadge && (
                      <span className="min-w-[1.25rem] h-5 flex items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold px-1 leading-none">
                        {pendientes > 99 ? '99+' : pendientes}
                      </span>
                    )}
                  </Link>
                );
              })}
              <button
                onClick={() => logout()}
                className="flex items-center gap-1.5 px-3 py-2.5 text-red-400/70 hover:text-red-400 text-sm transition-colors"
              >
                <FaSignOutAlt className="w-3.5 h-3.5" />
                Cerrar sesión
              </button>
            </nav>
          </div>
        )}
      </header>

      <main className="max-w-5xl mx-auto">{children}</main>
    </div>
  );
}
