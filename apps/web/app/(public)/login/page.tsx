'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

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
      await login(email, contrasena);
    } catch (err) {
      setErrorGeneral(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">La Quinta del 10</CardTitle>
          <CardDescription>Iniciá sesión para continuar</CardDescription>
        </CardHeader>

        <form onSubmit={manejarSubmit} noValidate>
          <CardContent className="space-y-4">
            {errorGeneral && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                {errorGeneral}
              </p>
            )}

            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); limpiarError('email'); }}
                placeholder="tu@email.com"
                autoComplete="email"
              />
              {errores.email && <p className="text-xs text-red-600 mt-1">{errores.email}</p>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="contrasena">Contraseña</Label>
              <div className="relative">
                <Input
                  id="contrasena"
                  type={mostrarContrasena ? 'text' : 'password'}
                  value={contrasena}
                  onChange={(e) => { setContrasena(e.target.value); limpiarError('contrasena'); }}
                  placeholder="••••••••"
                  autoComplete="current-password"
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
              {cargando ? 'Ingresando...' : 'Ingresar'}
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              ¿No tenés cuenta?{' '}
              <Link href="/registro" className="text-primary underline-offset-4 hover:underline">
                Registrate
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
