'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

type DiaSemana = 'LUNES' | 'MARTES' | 'MIERCOLES' | 'JUEVES' | 'VIERNES' | 'SABADO' | 'DOMINGO';

const NOMBRE_DIA: Record<DiaSemana, string> = {
  LUNES: 'lunes', MARTES: 'martes', MIERCOLES: 'miércoles',
  JUEVES: 'jueves', VIERNES: 'viernes', SABADO: 'sábado', DOMINGO: 'domingo',
};

interface Props {
  turnoFijoId: string;
  diaSemana: DiaSemana;
  abierto: boolean;
  onCerrar: () => void;
  onConfirmada: () => void;
}

export function ModalCancelacionPuntual({ turnoFijoId, diaSemana, abierto, onCerrar, onConfirmada }: Props) {
  const [fecha, setFecha]       = useState('');
  const [error, setError]       = useState('');
  const [cargando, setCargando] = useState(false);

  async function manejarSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setCargando(true);
    try {
      await api.post(`/turnos-fijos/${turnoFijoId}/excepciones`, { fecha });
      toast.success('Cancelación registrada');
      onConfirmada();
    } catch (err) {
      const mensaje = err instanceof Error ? err.message : 'Error al registrar la cancelación';
      setError(mensaje);
      toast.error(mensaje);
    } finally {
      setCargando(false);
    }
  }

  return (
    <Dialog open={abierto} onOpenChange={(open) => !open && onCerrar()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Cancelación puntual</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          Indicá el {NOMBRE_DIA[diaSemana]} puntual en que el equipo no se presenta. El turno sigue activo para las demás semanas.
        </p>

        <form onSubmit={manejarSubmit} className="space-y-4">
          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">{error}</p>
          )}

          <div className="space-y-1">
            <Label htmlFor="fecha">Fecha</Label>
            <input
              id="fecha"
              type="date"
              value={fecha}
              onChange={e => setFecha(e.target.value)}
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCerrar} disabled={cargando}>Cancelar</Button>
            <Button type="submit" disabled={cargando}>{cargando ? 'Guardando...' : 'Confirmar'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
