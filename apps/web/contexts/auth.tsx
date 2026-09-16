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
  login: (email: string, contrasena: string) => Promise<void>;
  registro: (data: RegistroData) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  usuario: null,
  estaAutenticado: false,
  esAdmin: false,
  cargando: true,
  login: async () => {},
  registro: async () => {},
  logout: async () => {},
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

  function redirigirSegunRol(u: UsuarioAutenticado) {
    router.push(u.rol === 'ADMINISTRADOR' ? '/admin/disponibilidad' : '/cliente/disponibilidad');
  }

  async function login(email: string, contrasena: string) {
    const usuarioData = await api.post<UsuarioAutenticado>('/auth/login', { email, contrasena });
    setUsuario(usuarioData);
    redirigirSegunRol(usuarioData);
  }

  async function registro(data: RegistroData) {
    const usuarioData = await api.post<UsuarioAutenticado>('/auth/registro', data);
    setUsuario(usuarioData);
    redirigirSegunRol(usuarioData);
  }

  async function logout() {
    await api.post('/auth/logout');
    setUsuario(null);
    router.push('/login');
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
