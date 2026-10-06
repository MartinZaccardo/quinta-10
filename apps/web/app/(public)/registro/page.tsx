'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

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
  else if (!/^\+\d{10,15}$/.test(form.numeroWhatsApp)) errores.numeroWhatsApp = 'Formato requerido: +549XXXXXXXXXX';

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
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">La Quinta del 10</CardTitle>
          <CardDescription>Creá tu cuenta para reservar</CardDescription>
        </CardHeader>

        <form onSubmit={manejarSubmit} noValidate>
          <CardContent className="space-y-4">
            {errorGeneral && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                {errorGeneral}
              </p>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  value={form.nombre}
                  onChange={actualizar('nombre')}
                  placeholder="Juan"
                />
                {errores.nombre && <p className="text-xs text-red-600 mt-1">{errores.nombre}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="apellido">Apellido</Label>
                <Input
                  id="apellido"
                  value={form.apellido}
                  onChange={actualizar('apellido')}
                  placeholder="García"
                />
                {errores.apellido && <p className="text-xs text-red-600 mt-1">{errores.apellido}</p>}
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={actualizar('email')}
                placeholder="tu@email.com"
                autoComplete="email"
              />
              {errores.email && <p className="text-xs text-red-600 mt-1">{errores.email}</p>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input
                id="whatsapp"
                type="tel"
                value={form.numeroWhatsApp}
                onChange={actualizar('numeroWhatsApp')}
                placeholder="+549XXXXXXXXXX"
              />
              {errores.numeroWhatsApp && <p className="text-xs text-red-600 mt-1">{errores.numeroWhatsApp}</p>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="contrasena">Contraseña</Label>
              <div className="relative">
                <Input
                  id="contrasena"
                  type={mostrarContrasena ? 'text' : 'password'}
                  value={form.contrasena}
                  onChange={actualizar('contrasena')}
                  placeholder="Mínimo 6 caracteres"
                  autoComplete="new-password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setMostrarContrasena(v => !v)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {mostrarContrasena ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errores.contrasena && <p className="text-xs text-red-600 mt-1">{errores.contrasena}</p>}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3">
            <Button type="submit" className="w-full" disabled={cargando}>
              {cargando ? 'Creando cuenta...' : 'Crear cuenta'}
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              ¿Ya tenés cuenta?{' '}
              <Link href="/login" className="text-primary underline-offset-4 hover:underline">
                Iniciá sesión
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
