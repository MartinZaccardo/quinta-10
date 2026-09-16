'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth';

export default function ClienteLayout({ children }: { children: React.ReactNode }) {
  const { estaAutenticado } = useAuth();
  const router = useRouter();
  const [montado, setMontado] = useState(false);

  useEffect(() => { setMontado(true); }, []);

  useEffect(() => {
    if (montado && !estaAutenticado) router.replace('/login');
  }, [montado, estaAutenticado, router]);

  if (!montado || !estaAutenticado) {
    return <div className="flex items-center justify-center h-screen text-muted-foreground">Cargando...</div>;
  }

  return <>{children}</>;
}
