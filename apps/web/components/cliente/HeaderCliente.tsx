'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '@/contexts/auth';

const NAV = [
  { href: '/',                     label: 'Inicio',        exacto: true },
  { href: '/disponibilidad',       label: 'Disponibilidad' },
  { href: '/cliente/mis-reservas', label: 'Mis reservas'  },
];

export default function HeaderCliente() {
  const { logout } = useAuth();
  const pathname = usePathname();

  function esActivo(href: string, exacto?: boolean) {
    return exacto ? pathname === href : pathname.startsWith(href);
  }

  return (
    <header className="bg-[#0F1C2E] sticky top-0 z-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
        <div className="flex items-center gap-6">
          <span className="hidden sm:block font-display font-black uppercase text-white text-base tracking-wide shrink-0">
            La Quinta del 10
          </span>
          <nav className="flex gap-1">
            {NAV.map(({ href, label, exacto }) => (
              <Link
                key={href}
                href={href}
                className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                  esActivo(href, exacto)
                    ? 'bg-white/10 text-white font-medium'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <button
          onClick={() => logout('/')}
          className="flex items-center gap-1.5 text-red-400/70 hover:text-red-400 text-sm transition-colors"
        >
          <FaSignOutAlt className="w-3.5 h-3.5" />
          <span className="hidden sm:block">Cerrar sesión</span>
        </button>
      </div>
    </header>
  );
}
