'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export type Rol = 'CLIENTE' | 'ADMINISTRADOR';

export interface UsuarioAutenticado {
  sub: string;
  email: string;
  rol: Rol;
}

interface RegistroData {
  nombre: string;
  apellido: string;
  email: string;
  contrasena: string;
  numeroWhatsApp: string;
}

interface AuthContextType {
  usuario: UsuarioAutenticado | null;
  estaAutenticado: boolean;
  esAdmin: boolean;
  cargando: boolean;
  login: (email: string, contrasena: string, redirect?: string) => Promise<void>;
  registro: (data: RegistroData, redirect?: string) => Promise<void>;
  logout: (redirect?: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  usuario: null,
  estaAutenticado: false,
  esAdmin: false,
  cargando: true,
  login: async () => {},
  registro: async () => {},
  logout: async (_redirect?: string) => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<UsuarioAutenticado | null>(null);
  const [cargando, setCargando] = useState(true);
  const router = useRouter();

  useEffect(() => {
    api.get<UsuarioAutenticado>('/auth/me')
      .then(setUsuario)
      .catch(() => setUsuario(null))
      .finally(() => setCargando(false));
  }, []);

  function redirigirSegunRol(u: UsuarioAutenticado, redirect?: string) {
    if (redirect && u.rol === 'CLIENTE') {
      router.push(redirect);
      return;
    }
    router.push(u.rol === 'ADMINISTRADOR' ? '/admin/disponibilidad' : '/disponibilidad');
  }

  async function login(email: string, contrasena: string, redirect?: string) {
    const usuarioData = await api.post<UsuarioAutenticado>('/auth/login', { email, contrasena });
    setUsuario(usuarioData);
    redirigirSegunRol(usuarioData, redirect);
  }

  async function registro(data: RegistroData, redirect?: string) {
    const usuarioData = await api.post<UsuarioAutenticado>('/auth/registro', data);
    setUsuario(usuarioData);
    redirigirSegunRol(usuarioData, redirect);
  }

  async function logout(redirect: string = '/login') {
    await api.post('/auth/logout');
    setUsuario(null);
    router.push(redirect);
  }

  return (
    <AuthContext.Provider value={{
      usuario,
      estaAutenticado: !!usuario,
      esAdmin: usuario?.rol === 'ADMINISTRADOR',
      cargando,
      login,
      registro,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
