'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth';
import HeaderCliente from '@/components/cliente/HeaderCliente';

export default function ClienteLayout({ children }: { children: React.ReactNode }) {
  const { estaAutenticado, cargando } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!cargando && !estaAutenticado) router.replace('/login');
  }, [cargando, estaAutenticado, router]);

  if (cargando || !estaAutenticado) {
    return <div className="flex items-center justify-center h-screen text-muted-foreground">Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderCliente />
      <main className="max-w-3xl mx-auto">{children}</main>
    </div>
  );
}
