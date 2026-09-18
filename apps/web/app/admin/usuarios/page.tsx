'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { toast } from 'sonner';
import { swrFetcher } from '@/lib/api';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  email: string | null;
  numeroWhatsApp: string;
  rol: 'CLIENTE' | 'ADMINISTRADOR';
  activo: boolean;
  creadoPorAdmin: boolean;
}

// ─── Modal: Nuevo usuario ─────────────────────────────────────────────────────

interface ModalNuevoUsuarioProps {
  abierto: boolean;
  onCerrar: () => void;
  onCreado: () => void;
}

function ModalNuevoUsuario({ abierto, onCerrar, onCreado }: ModalNuevoUsuarioProps) {
  const [form, setForm] = useState({
    nombre: '', apellido: '', numeroWhatsApp: '', email: '', contrasena: '',
  });
  const [error, setError]       = useState('');
  const [cargando, setCargando] = useState(false);

  function actualizar(campo: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(prev => ({ ...prev, [campo]: e.target.value }));
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
        ...(form.email     ? { email:     form.email }     : {}),
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

  return (
    <Dialog open={abierto} onOpenChange={open => !open && onCerrar()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nuevo usuario</DialogTitle>
        </DialogHeader>

        <form onSubmit={manejarSubmit} className="space-y-4">
          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">{error}</p>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="nu-nombre">Nombre</Label>
              <Input id="nu-nombre" value={form.nombre} onChange={actualizar('nombre')} placeholder="Juan" required />
            </div>
            <div className="space-y-1">
              <Label htmlFor="nu-apellido">Apellido</Label>
              <Input id="nu-apellido" value={form.apellido} onChange={actualizar('apellido')} placeholder="García" required />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="nu-whatsapp">WhatsApp</Label>
            <Input id="nu-whatsapp" value={form.numeroWhatsApp} onChange={actualizar('numeroWhatsApp')} placeholder="+5491112345678" required />
          </div>

          <div className="space-y-1">
            <Label htmlFor="nu-email">Email <span className="text-muted-foreground font-normal">(opcional)</span></Label>
            <Input id="nu-email" type="email" value={form.email} onChange={actualizar('email')} placeholder="juan@email.com" />
          </div>

          <div className="space-y-1">
            <Label htmlFor="nu-contrasena">Contraseña <span className="text-muted-foreground font-normal">(opcional)</span></Label>
            <Input id="nu-contrasena" type="password" value={form.contrasena} onChange={actualizar('contrasena')} placeholder="Mínimo 6 caracteres" minLength={6} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCerrar} disabled={cargando}>Cancelar</Button>
            <Button type="submit" disabled={cargando}>{cargando ? 'Guardando...' : 'Crear usuario'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Modal: Asignar acceso ────────────────────────────────────────────────────

interface ModalAsignarAccesoProps {
  usuario: Usuario;
  onCerrar: () => void;
  onGuardado: () => void;
}

function ModalAsignarAcceso({ usuario, onCerrar, onGuardado }: ModalAsignarAccesoProps) {
  const [email, setEmail]       = useState(usuario.email ?? '');
  const [contrasena, setContrasena] = useState('');
  const [error, setError]       = useState('');
  const [cargando, setCargando] = useState(false);

  async function manejarSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setCargando(true);
    try {
      await api.patch(`/usuarios/${usuario.id}`, { email, contrasena });
      toast.success('Acceso asignado correctamente');
      onGuardado();
    } catch (err) {
      const mensaje = err instanceof Error ? err.message : 'Error al asignar el acceso';
      setError(mensaje);
      toast.error(mensaje);
    } finally {
      setCargando(false);
    }
  }

  return (
    <Dialog open onOpenChange={open => !open && onCerrar()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Asignar acceso</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          {usuario.nombre} {usuario.apellido} podrá iniciar sesión con estas credenciales.
        </p>

        <form onSubmit={manejarSubmit} className="space-y-4">
          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">{error}</p>
          )}

          <div className="space-y-1">
            <Label htmlFor="aa-email">Email</Label>
            <Input id="aa-email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="juan@email.com" required />
          </div>

          <div className="space-y-1">
            <Label htmlFor="aa-contrasena">Contraseña</Label>
            <Input id="aa-contrasena" type="password" value={contrasena} onChange={e => setContrasena(e.target.value)} placeholder="Mínimo 6 caracteres" minLength={6} required />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCerrar} disabled={cargando}>Cancelar</Button>
            <Button type="submit" disabled={cargando}>{cargando ? 'Guardando...' : 'Guardar'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────

export default function PaginaUsuarios() {
  const { data: usuarios, isLoading, error, mutate } = useSWR<Usuario[]>('/usuarios', swrFetcher);

  const [modalNuevoAbierto, setModalNuevoAbierto] = useState(false);
  const [usuarioParaAcceso, setUsuarioParaAcceso] = useState<Usuario | null>(null);
  const [cambiandoEstado, setCambiandoEstado]     = useState<string | null>(null);

  async function toggleActivo(usuario: Usuario) {
    setCambiandoEstado(usuario.id);
    const accion = usuario.activo ? 'desactivar' : 'activar';
    try {
      await api.patch(`/usuarios/${usuario.id}/${accion}`);
      toast.success(usuario.activo ? 'Usuario desactivado' : 'Usuario activado');
      mutate();
    } catch {
      toast.error(`Error al ${accion} el usuario`);
    } finally {
      setCambiandoEstado(null);
    }
  }

  if (isLoading) {
    return <div className="p-6 text-muted-foreground text-sm">Cargando usuarios...</div>;
  }
  if (error) {
    return <div className="p-6 text-red-500 text-sm">Error al cargar los usuarios.</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Usuarios</h1>
        <Button onClick={() => setModalNuevoAbierto(true)}>+ Nuevo usuario</Button>
      </div>

      {!usuarios?.length ? (
        <div className="py-16 text-center text-muted-foreground text-sm">No hay usuarios registrados.</div>
      ) : (
        <div className="space-y-2">
          {usuarios.map((u) => (
            <div
              key={u.id}
              className="bg-white border rounded-lg px-4 py-4 flex items-start justify-between gap-4"
            >
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-sm">{u.nombre} {u.apellido}</span>
                  {!u.activo && (
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Inactivo</span>
                  )}
                  {u.creadoPorAdmin && (
                    <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">Creado por admin</span>
                  )}
                </div>
                <p className="text-xs text-gray-500">{u.email ?? <span className="italic">Sin email</span>}</p>
                <p className="text-xs text-gray-500">
                  <span className="font-medium">WhatsApp:</span> {u.numeroWhatsApp}
                </p>
              </div>

              <div className="flex gap-2 shrink-0">
                {!u.email && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setUsuarioParaAcceso(u)}
                  >
                    Asignar acceso
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  disabled={cambiandoEstado === u.id}
                  onClick={() => toggleActivo(u)}
                  className={u.activo
                    ? 'text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200'
                    : 'text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200'
                  }
                >
                  {u.activo ? 'Desactivar' : 'Activar'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ModalNuevoUsuario
        abierto={modalNuevoAbierto}
        onCerrar={() => setModalNuevoAbierto(false)}
        onCreado={() => {
          setModalNuevoAbierto(false);
          mutate();
        }}
      />

      {usuarioParaAcceso && (
        <ModalAsignarAcceso
          usuario={usuarioParaAcceso}
          onCerrar={() => setUsuarioParaAcceso(null)}
          onGuardado={() => {
            setUsuarioParaAcceso(null);
            mutate();
          }}
        />
      )}
    </div>
  );
}
