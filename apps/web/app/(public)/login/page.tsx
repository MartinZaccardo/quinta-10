'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { FaArrowLeft } from 'react-icons/fa';
import { useAuth } from '@/contexts/auth';

function validarEmail(valor: string): string {
  if (!valor.trim()) return 'El email es requerido';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)) return 'Ingresá un email válido';
  return '';
}

function validarContrasena(valor: string): string {
  if (!valor) return 'La contraseña es requerida';
  if (valor.length < 6) return 'Mínimo 6 caracteres';
  return '';
}

export default function PaginaLogin() {
  const { login } = useAuth();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') ?? undefined;
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [errorGeneral, setErrorGeneral] = useState('');
  const [cargando, setCargando] = useState(false);

  function limpiarError(campo: string) {
    setErrores(prev => ({ ...prev, [campo]: '' }));
  }

  async function manejarSubmit(e: React.FormEvent) {
    e.preventDefault();

    const nuevosErrores = {
      email: validarEmail(email),
      contrasena: validarContrasena(contrasena),
    };

    if (Object.values(nuevosErrores).some(Boolean)) {
      setErrores(nuevosErrores);
      return;
    }

    setErrorGeneral('');
    setCargando(true);
    try {
      await login(email, contrasena, redirect);
    } catch (err) {
      setErrorGeneral(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0F1C2E] flex flex-col">
      <div className="p-6">
        <Link
          href="/"
          className="text-white/40 hover:text-white/70 text-sm transition-colors flex items-center gap-1.5 w-fit"
        >
          <FaArrowLeft className="w-3 h-3" /> Inicio
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="font-display font-black uppercase text-white text-3xl tracking-wide">
              La Quinta del 10
            </h1>
            <p className="text-white/40 text-sm mt-1">Iniciá sesión para continuar</p>
          </div>

          <form onSubmit={manejarSubmit} noValidate>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
              {errorGeneral && (
                <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                  {errorGeneral}
                </p>
              )}

              <div className="space-y-1.5">
                <label htmlFor="email" className="text-white/60 text-sm">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); limpiarError('email'); }}
                  placeholder="tu@email.com"
                  autoComplete="email"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-amber-400 transition-colors"
                />
                {errores.email && <p className="text-xs text-red-400">{errores.email}</p>}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="contrasena" className="text-white/60 text-sm">Contraseña</label>
                <div className="relative">
                  <input
                    id="contrasena"
                    type={mostrarContrasena ? 'text' : 'password'}
                    value={contrasena}
                    onChange={(e) => { setContrasena(e.target.value); limpiarError('contrasena'); }}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2.5 pr-10 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-amber-400 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarContrasena(v => !v)}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-white/30 hover:text-white/60 transition-colors"
                    tabIndex={-1}
                  >
                    {mostrarContrasena ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errores.contrasena && <p className="text-xs text-red-400">{errores.contrasena}</p>}
              </div>

              <button
                type="submit"
                disabled={cargando}
                className="w-full bg-amber-400 hover:bg-amber-500 disabled:opacity-60 text-[#0F1C2E] font-bold py-3 rounded-lg transition-colors text-sm mt-2"
              >
                {cargando ? 'Ingresando...' : 'Ingresar'}
              </button>
            </div>
          </form>

          <p className="text-white/40 text-sm text-center mt-6">
            ¿No tenés cuenta?{' '}
            <Link
              href={redirect ? `/registro?redirect=${redirect}` : '/registro'}
              className="text-amber-400 hover:text-amber-300 transition-colors"
            >
              Registrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
