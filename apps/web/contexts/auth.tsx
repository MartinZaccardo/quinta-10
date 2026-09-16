'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export type Rol = 'CLIENTE' | 'ADMINISTRADOR';

export interface UsuarioAutenticado {
  sub: string;
  email: string;
  rol: Rol;
}

interface AuthContextType {
  usuario: UsuarioAutenticado | null;
  estaAutenticado: boolean;
  esAdmin: boolean;
  login: (token: string) => void;
  logout: () => void;
}

function decodificarToken(token: string): UsuarioAutenticado {
  const payload = token.split('.')[1];
  return JSON.parse(atob(payload)) as UsuarioAutenticado;
}

function guardarToken(token: string) {
  localStorage.setItem('token', token);
  // Cookie sin httpOnly para que el middleware de Next.js pueda leerla
  document.cookie = `token=${token}; path=/; max-age=604800; SameSite=Lax`;
}

function eliminarToken() {
  localStorage.removeItem('token');
  document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
}

export const AuthContext = createContext<AuthContextType>({
  usuario: null,
  estaAutenticado: false,
  esAdmin: false,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<UsuarioAutenticado | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        setUsuario(decodificarToken(token));
      } catch {
        eliminarToken();
      }
    }
  }, []);

  function login(token: string) {
    guardarToken(token);
    const payload = decodificarToken(token);
    setUsuario(payload);
    router.push(payload.rol === 'ADMINISTRADOR' ? '/admin/disponibilidad' : '/cliente/disponibilidad');
  }

  function logout() {
    eliminarToken();
    setUsuario(null);
    router.push('/login');
  }

  return (
    <AuthContext.Provider value={{
      usuario,
      estaAutenticado: !!usuario,
      esAdmin: usuario?.rol === 'ADMINISTRADOR',
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
