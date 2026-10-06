'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { toast } from 'sonner';
import { swrFetcher } from '@/lib/api';
import api from '@/lib/api';
import { formatearRango } from '@/lib/tiempo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ComboboxUsuario } from '@/components/admin/combobox-usuario';

type Modo = 'registrado' | 'externo';

interface Usuario { id: string; nombre: string; apellido: string }

interface RespuestaUsuarios { datos: Usuario[] }

interface Props {
  canchaId: string;
  nombreCancha: string;
  fecha: string;
  horaInicio: number;
  horaFin: number;
  abierto: boolean;
  onCerrar: () => void;
  onCreada: () => void;
}

export function ModalCrearReserva({
  canchaId, nombreCancha, fecha, horaInicio, horaFin, abierto, onCerrar, onCreada,
}: Props) {
  const { data: respuesta } = useSWR<RespuestaUsuarios>('/usuarios?limite=1000', swrFetcher);
  const usuarios = respuesta?.datos;

  const [modo, setModo]         = useState<Modo>('registrado');
  const [usuarioId, setUsuarioId] = useState('');
  const [nombre, setNombre]     = useState('');
  const [telefono, setTelefono] = useState('');
  const [error, setError]       = useState('');
  const [cargando, setCargando] = useState(false);

  function cambiarModo(nuevoModo: Modo) {
    setModo(nuevoModo);
    setUsuarioId('');
    setNombre('');
    setTelefono('');
    setError('');
  }

  async function manejarSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (modo === 'registrado' && !usuarioId) {
      setError('Seleccioná un cliente');
      return;
    }
    setError('');
    setCargando(true);
    try {
      await api.post('/reservas/manual', {
        canchaId,
        fecha,
        horaInicio,
        horaFin,
        ...(modo === 'registrado'
          ? { usuarioId }
          : { nombreContacto: nombre, telefonoContacto: telefono }
        ),
      });
      toast.success('Reserva creada y confirmada');
      onCreada();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear la reserva');
      toast.error('Error al crear la reserva');
    } finally {
      setCargando(false);
    }
  }

  return (
    <Dialog open={abierto} onOpenChange={(open) => !open && onCerrar()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display font-black uppercase text-[#0F1C2E] text-xl">Nueva reserva</DialogTitle>
        </DialogHeader>

        <div className="text-sm text-muted-foreground space-y-0.5 pb-2">
          <p><span className="font-medium text-foreground">Cancha:</span> {nombreCancha}</p>
          <p><span className="font-medium text-foreground">Fecha:</span> {fecha}</p>
          <p><span className="font-medium text-foreground">Horario:</span> {formatearRango(horaInicio, horaFin)}</p>
        </div>

        <div className="flex rounded-md border overflow-hidden text-sm">
          <button
            type="button"
            onClick={() => cambiarModo('registrado')}
            className={`flex-1 py-2 transition-colors ${
              modo === 'registrado'
                ? 'bg-amber-400 text-[#0F1C2E] font-medium'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            Cliente registrado
          </button>
          <button
            type="button"
            onClick={() => cambiarModo('externo')}
            className={`flex-1 py-2 transition-colors ${
              modo === 'externo'
                ? 'bg-amber-400 text-[#0F1C2E] font-medium'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            Sin cuenta
          </button>
        </div>

        <form onSubmit={manejarSubmit} className="space-y-4">
          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">{error}</p>
          )}

          {modo === 'registrado' ? (
            <div className="space-y-1">
              <Label>Cliente</Label>
              <ComboboxUsuario usuarios={usuarios} value={usuarioId} onChange={setUsuarioId} />
            </div>
          ) : (
            <>
              <div className="space-y-1">
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  value={nombre}
                  onChange={e => setNombre(e.target.value)}
                  placeholder="Juan García"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="telefono">Teléfono / WhatsApp</Label>
                <Input
                  id="telefono"
                  value={telefono}
                  onChange={e => setTelefono(e.target.value)}
                  placeholder="+5491112345678"
                  required
                />
              </div>
            </>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCerrar} disabled={cargando}>
              Cancelar
            </Button>
            <Button type="submit" disabled={cargando} className="bg-amber-400 hover:bg-amber-500 text-[#0F1C2E] font-bold border-0">
              {cargando ? 'Reservando...' : 'Confirmar reserva'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
