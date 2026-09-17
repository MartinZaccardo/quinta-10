'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/auth';
import { Button } from '@/components/ui/button';

const NAV = [
  { href: '/cliente/disponibilidad', label: 'Disponibilidad' },
  { href: '/cliente/mis-reservas',   label: 'Mis reservas' },
];

export default function ClienteLayout({ children }: { children: React.ReactNode }) {
  const { estaAutenticado, cargando, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!cargando && !estaAutenticado) router.replace('/login');
  }, [cargando, estaAutenticado, router]);

  if (cargando || !estaAutenticado) {
    return <div className="flex items-center justify-center h-screen text-muted-foreground">Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 flex items-center justify-between h-14">
          <div className="flex items-center gap-6">
            <span className="font-semibold text-sm text-gray-900 shrink-0">La Quinta del 10</span>
            <nav className="flex gap-1">
              {NAV.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                    pathname.startsWith(href)
                      ? 'bg-gray-100 text-gray-900 font-medium'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
          <Button variant="ghost" size="sm" onClick={logout} className="text-gray-500">
            Salir
          </Button>
        </div>
      </header>
      <main className="max-w-3xl mx-auto">{children}</main>
    </div>
  );
}
