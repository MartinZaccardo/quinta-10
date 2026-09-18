'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function PaginaRegistro() {
  const { registro } = useAuth();
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    email: '',
    contrasena: '',
    numeroWhatsApp: '',
  });
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  function actualizar(campo: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [campo]: e.target.value }));
  }

  async function manejarSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setCargando(true);
    try {
      await registro(form);
      toast.success('Cuenta creada correctamente');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrarse');
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

        <form onSubmit={manejarSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                {error}
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
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="apellido">Apellido</Label>
                <Input
                  id="apellido"
                  value={form.apellido}
                  onChange={actualizar('apellido')}
                  placeholder="García"
                  required
                />
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
                required
                autoComplete="email"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input
                id="whatsapp"
                type="tel"
                value={form.numeroWhatsApp}
                onChange={actualizar('numeroWhatsApp')}
                placeholder="+5491112345678"
                required
              />
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
                  required
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
