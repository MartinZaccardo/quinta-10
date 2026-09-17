'use client';

import { useState } from 'react';
import api from '@/lib/api';
import { formatearRango } from '@/lib/tiempo';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface Props {
  canchaId: string;
  nombreCancha: string;
  fecha: string;
  horaInicio: number;
  horaFin: number;
  abierto: boolean;
  onCerrar: () => void;
  onSolicitada: () => void;
}

export function ModalSolicitarReserva({
  canchaId,
  nombreCancha,
  fecha,
  horaInicio,
  horaFin,
  abierto,
  onCerrar,
  onSolicitada,
}: Props) {
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  async function manejarSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setCargando(true);
    try {
      await api.post('/reservas', {
        canchaId,
        fecha,
        horaInicio,
        horaFin,
        mensajeOpcional: mensaje || undefined,
      });
      onSolicitada();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al solicitar la reserva');
    } finally {
      setCargando(false);
    }
  }

  return (
    <Dialog open={abierto} onOpenChange={(open) => !open && onCerrar()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Solicitar reserva</DialogTitle>
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
            <Label htmlFor="mensaje">Mensaje opcional</Label>
            <Textarea
              id="mensaje"
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              placeholder="Ej: somos 6 personas, necesitamos pecheras..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCerrar} disabled={cargando}>
              Cancelar
            </Button>
            <Button type="submit" disabled={cargando}>
              {cargando ? 'Solicitando...' : 'Solicitar reserva'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
