'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import api from '@/lib/api';
import { formatearRango } from '@/lib/tiempo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

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
  canchaId,
  nombreCancha,
  fecha,
  horaInicio,
  horaFin,
  abierto,
  onCerrar,
  onCreada,
}: Props) {
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  async function manejarSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setCargando(true);
    try {
      await api.post('/reservas/manual', {
        canchaId,
        fecha,
        horaInicio,
        horaFin,
        nombreContacto: nombre,
        telefonoContacto: telefono,
      });
      toast.success('Reserva creada');
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
          <DialogTitle>Nueva reserva</DialogTitle>
        </DialogHeader>

        <div className="text-sm text-muted-foreground space-y-0.5 pb-2">
          <p><span className="font-medium text-foreground">Cancha:</span> {nombreCancha}</p>
          <p><span className="font-medium text-foreground">Fecha:</span> {fecha}</p>
          <p><span className="font-medium text-foreground">Horario:</span> {formatearRango(horaInicio, horaFin)}</p>
        </div>

        <form onSubmit={manejarSubmit} className="space-y-4">
          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {error}
            </p>
          )}

          <div className="space-y-1">
            <Label htmlFor="nombre">Nombre del cliente</Label>
            <Input
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Juan García"
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="telefono">Teléfono / WhatsApp</Label>
            <Input
              id="telefono"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="+5491112345678"
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCerrar} disabled={cargando}>
              Cancelar
            </Button>
            <Button type="submit" disabled={cargando}>
              {cargando ? 'Reservando...' : 'Confirmar reserva'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
