'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

interface Props {
  abierto: boolean;
  onCerrar: () => void;
  onCreado: () => void;
}

export function ModalNuevoUsuario({ abierto, onCerrar, onCreado }: Props) {
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    numeroWhatsApp: '',
    email: '',
    contrasena: '',
  });
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
      await api.post('/usuarios', {
        nombre: form.nombre,
        apellido: form.apellido,
        numeroWhatsApp: form.numeroWhatsApp,
        ...(form.email ? { email: form.email } : {}),
        ...(form.contrasena ? { contrasena: form.contrasena } : {}),
      });
      toast.success('Usuario creado');
      onCreado();
    } catch (err) {
      const mensaje = err instanceof Error ? err.message : 'Error al crear el usuario';
      setError(mensaje);
      toast.error(mensaje);
    } finally {
      setCargando(false);
    }
  }

  function cerrar() {
    setForm({ nombre: '', apellido: '', numeroWhatsApp: '', email: '', contrasena: '' });
    setError('');
    onCerrar();
  }

  return (
    <Dialog open={abierto} onOpenChange={(open) => !open && cerrar()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nuevo usuario</DialogTitle>
        </DialogHeader>

        <form onSubmit={manejarSubmit} className="space-y-4">
          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {error}
            </p>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="nu-nombre">Nombre</Label>
              <Input
                id="nu-nombre"
                value={form.nombre}
                onChange={actualizar('nombre')}
                placeholder="Juan"
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="nu-apellido">Apellido</Label>
              <Input
                id="nu-apellido"
                value={form.apellido}
                onChange={actualizar('apellido')}
                placeholder="García"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="nu-whatsapp">WhatsApp</Label>
            <Input
              id="nu-whatsapp"
              value={form.numeroWhatsApp}
              onChange={actualizar('numeroWhatsApp')}
              placeholder="+5491112345678"
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="nu-email">
              Email{' '}
              <span className="text-muted-foreground font-normal">(opcional)</span>
            </Label>
            <Input
              id="nu-email"
              type="email"
              value={form.email}
              onChange={actualizar('email')}
              placeholder="juan@email.com"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="nu-contrasena">
              Contraseña{' '}
              <span className="text-muted-foreground font-normal">(opcional)</span>
            </Label>
            <Input
              id="nu-contrasena"
              type="password"
              value={form.contrasena}
              onChange={actualizar('contrasena')}
              placeholder="Mínimo 6 caracteres"
              minLength={6}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={cerrar} disabled={cargando}>
              Cancelar
            </Button>
            <Button type="submit" disabled={cargando}>
              {cargando ? 'Guardando...' : 'Crear usuario'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
