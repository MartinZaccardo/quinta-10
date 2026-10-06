'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { FaArrowLeft } from 'react-icons/fa';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth';

type CamposForm = {
  nombre: string;
  apellido: string;
  email: string;
  contrasena: string;
  numeroWhatsApp: string;
};

function validarForm(form: CamposForm): Record<string, string> {
  const errores: Record<string, string> = {};

  if (!form.nombre.trim()) errores.nombre = 'El nombre es requerido';
  else if (form.nombre.trim().length < 2) errores.nombre = 'Mínimo 2 caracteres';

  if (!form.apellido.trim()) errores.apellido = 'El apellido es requerido';
  else if (form.apellido.trim().length < 2) errores.apellido = 'Mínimo 2 caracteres';

  if (!form.email.trim()) errores.email = 'El email es requerido';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errores.email = 'Ingresá un email válido';

  if (!form.numeroWhatsApp.trim()) errores.numeroWhatsApp = 'El número de WhatsApp es requerido';
  else if (!/^\+\d{10,15}$/.test(form.numeroWhatsApp)) errores.numeroWhatsApp = 'Formato: +549XXXXXXXXXX';

  if (!form.contrasena) errores.contrasena = 'La contraseña es requerida';
  else if (form.contrasena.length < 6) errores.contrasena = 'Mínimo 6 caracteres';

  return errores;
}

export default function PaginaRegistro() {
  const { registro } = useAuth();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') ?? undefined;
  const [form, setForm] = useState<CamposForm>({
    nombre: '',
    apellido: '',
    email: '',
    contrasena: '',
    numeroWhatsApp: '',
  });
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [errorGeneral, setErrorGeneral] = useState('');
  const [cargando, setCargando] = useState(false);

  function actualizar(campo: keyof CamposForm) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm(prev => ({ ...prev, [campo]: e.target.value }));
      setErrores(prev => ({ ...prev, [campo]: '' }));
    };
  }

  async function manejarSubmit(e: React.FormEvent) {
    e.preventDefault();

    const nuevosErrores = validarForm(form);
    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    setErrorGeneral('');
    setCargando(true);
    try {
      await registro(form, redirect);
      toast.success('Cuenta creada correctamente');
    } catch (err) {
      setErrorGeneral(err instanceof Error ? err.message : 'Error al registrarse');
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
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="font-display font-black uppercase text-white text-3xl tracking-wide">
              La Quinta del 10
            </h1>
            <p className="text-white/40 text-sm mt-1">Creá tu cuenta para reservar</p>
          </div>

          <form onSubmit={manejarSubmit} noValidate>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
              {errorGeneral && (
                <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                  {errorGeneral}
                </p>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label htmlFor="nombre" className="text-white/60 text-sm">Nombre</label>
                  <input
                    id="nombre"
                    value={form.nombre}
                    onChange={actualizar('nombre')}
                    placeholder="Juan"
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-amber-400 transition-colors"
                  />
                  {errores.nombre && <p className="text-xs text-red-400">{errores.nombre}</p>}
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="apellido" className="text-white/60 text-sm">Apellido</label>
                  <input
                    id="apellido"
                    value={form.apellido}
                    onChange={actualizar('apellido')}
                    placeholder="García"
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-amber-400 transition-colors"
                  />
                  {errores.apellido && <p className="text-xs text-red-400">{errores.apellido}</p>}
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="email" className="text-white/60 text-sm">Email</label>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={actualizar('email')}
                  placeholder="tu@email.com"
                  autoComplete="email"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-amber-400 transition-colors"
                />
                {errores.email && <p className="text-xs text-red-400">{errores.email}</p>}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="whatsapp" className="text-white/60 text-sm">WhatsApp</label>
                <input
                  id="whatsapp"
                  type="tel"
                  value={form.numeroWhatsApp}
                  onChange={actualizar('numeroWhatsApp')}
                  placeholder="+549XXXXXXXXXX"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-amber-400 transition-colors"
                />
                {errores.numeroWhatsApp && <p className="text-xs text-red-400">{errores.numeroWhatsApp}</p>}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="contrasena" className="text-white/60 text-sm">Contraseña</label>
                <div className="relative">
                  <input
                    id="contrasena"
                    type={mostrarContrasena ? 'text' : 'password'}
                    value={form.contrasena}
                    onChange={actualizar('contrasena')}
                    placeholder="Mínimo 6 caracteres"
                    autoComplete="new-password"
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
                {cargando ? 'Creando cuenta...' : 'Crear cuenta'}
              </button>
            </div>
          </form>

          <p className="text-white/40 text-sm text-center mt-6">
            ¿Ya tenés cuenta?{' '}
            <Link
              href={redirect ? `/login?redirect=${redirect}` : '/login'}
              className="text-amber-400 hover:text-amber-300 transition-colors"
            >
              Iniciá sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
