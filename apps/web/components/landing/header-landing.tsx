'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth';

export default function HeaderLanding() {
  const { estaAutenticado, esAdmin, cargando } = useAuth();

  const panelUrl = esAdmin ? '/admin/disponibilidad' : '/cliente/disponibilidad';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#1C3A5E]/90 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="/quinta-logo.jpeg"
            alt="La Quinta del 10"
            width={36}
            height={36}
            className="rounded-full"
          />
          <span className="text-white font-semibold text-sm hidden sm:block">
            La Quinta del 10
          </span>
        </div>

        {cargando ? (
          <div className="h-8 w-28 bg-white/10 rounded-md animate-pulse" />
        ) : estaAutenticado ? (
          <Link
            href={panelUrl}
            className="bg-[#C9A21F] hover:bg-[#B8911A] text-[#1C3A5E] font-semibold text-sm px-4 py-2 rounded-md transition-colors"
          >
            Mi panel
          </Link>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-white/80 hover:text-white text-sm transition-colors hidden sm:block"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/registro"
              className="bg-[#C9A21F] hover:bg-[#B8911A] text-[#1C3A5E] font-semibold text-sm px-4 py-2 rounded-md transition-colors"
            >
              Reservar
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
