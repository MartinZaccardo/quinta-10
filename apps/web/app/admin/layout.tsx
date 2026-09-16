'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { estaAutenticado, esAdmin, cargando } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (cargando) return;
    if (!estaAutenticado) router.replace('/login');
    else if (!esAdmin) router.replace('/cliente/disponibilidad');
  }, [cargando, estaAutenticado, esAdmin, router]);

  if (cargando || !estaAutenticado || !esAdmin) {
    return <div className="flex items-center justify-center h-screen text-muted-foreground">Cargando...</div>;
  }

  return <>{children}</>;
}
