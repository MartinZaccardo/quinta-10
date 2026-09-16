'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { estaAutenticado, esAdmin } = useAuth();
  const router = useRouter();
  const [montado, setMontado] = useState(false);

  useEffect(() => { setMontado(true); }, []);

  useEffect(() => {
    if (!montado) return;
    if (!estaAutenticado) router.replace('/login');
    else if (!esAdmin) router.replace('/cliente/disponibilidad');
  }, [montado, estaAutenticado, esAdmin, router]);

  if (!montado || !estaAutenticado || !esAdmin) {
    return <div className="flex items-center justify-center h-screen text-muted-foreground">Cargando...</div>;
  }

  return <>{children}</>;
}
