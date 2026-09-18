'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import { toast } from 'sonner';
import api, { swrFetcher } from '@/lib/api';
import { minutosAHora } from '@/lib/tiempo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

type DiaSemana = 'LUNES' | 'MARTES' | 'MIERCOLES' | 'JUEVES' | 'VIERNES' | 'SABADO' | 'DOMINGO';

const DIAS: { value: DiaSemana; label: string }[] = [
  { value: 'LUNES',     label: 'Lunes' },
  { value: 'MARTES',    label: 'Martes' },
  { value: 'MIERCOLES', label: 'Miércoles' },
  { value: 'JUEVES',    label: 'Jueves' },
  { value: 'VIERNES',   label: 'Viernes' },
  { value: 'SABADO',    label: 'Sábado' },
  { value: 'DOMINGO',   label: 'Domingo' },
];

const OPCIONES_HORARIO = Array.from({ length: (1560 - 540) / 30 + 1 }, (_, i) => {
  const minutos = 540 + i * 30;
  return { minutos, etiqueta: minutosAHora(minutos) };
});

interface Cancha  { id: string; nombre: string }
interface Usuario { id: string; nombre: string; apellido: string }

// ─── Combobox de usuarios ──────────────────────────────────────────────────────

interface ComboboxUsuarioProps {
  usuarios: Usuario[] | undefined;
  value: string;
  onChange: (id: string) => void;
}

function ComboboxUsuario({ usuarios, value, onChange }: ComboboxUsuarioProps) {
  const [busqueda, setBusqueda] = useState('');
  const [abierto, setAbierto]   = useState(false);
  const contenedorRef           = useRef<HTMLDivElement>(null);

  const seleccionado = usuarios?.find(u => u.id === value);

  const filtrados = (usuarios ?? []).filter(u =>
    `${u.nombre} ${u.apellido}`.toLowerCase().includes(busqueda.toLowerCase())
  );

  useEffect(() => {
    function cerrarAlClickAfuera(e: MouseEvent) {
      if (contenedorRef.current && !contenedorRef.current.contains(e.target as Node)) {
        setAbierto(false);
      }
    }
    document.addEventListener('mousedown', cerrarAlClickAfuera);
    return () => document.removeEventListener('mousedown', cerrarAlClickAfuera);
  }, []);

  function seleccionar(usuario: Usuario) {
    onChange(usuario.id);
    setBusqueda('');
    setAbierto(false);
  }

  return (
    <div ref={contenedorRef} className="relative">
      <Input
        value={abierto ? busqueda : (seleccionado ? `${seleccionado.nombre} ${seleccionado.apellido}` : '')}
        onChange={e => { setBusqueda(e.target.value); onChange(''); }}
        onFocus={() => { setBusqueda(''); setAbierto(true); }}
        placeholder="Buscar cliente..."
        autoComplete="off"
      />

      {abierto && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-48 overflow-y-auto rounded-md border bg-white shadow-lg">
          {filtrados.length === 0 ? (
            <p className="px-3 py-2 text-sm text-muted-foreground">Sin resultados</p>
          ) : (
            filtrados.map(u => (
              <button
                key={u.id}
                type="button"
                onMouseDown={() => seleccionar(u)}
                className="w-full px-3 py-2 text-left text-sm hover:bg-accent"
              >
                {u.nombre} {u.apellido}
              </button>
            ))
          )}
        </div>
      )}

      <p className="mt-1 text-xs text-muted-foreground">
        ¿No encontrás al cliente?{' '}
        <Link href="/admin/usuarios" className="text-primary hover:underline underline-offset-2">
          Crear nuevo usuario →
        </Link>
      </p>
    </div>
  );
}

// ─── Modal principal ───────────────────────────────────────────────────────────

interface Props {
  abierto: boolean;
  onCerrar: () => void;
  onCreado: () => void;
}

export function ModalCrearTurnoFijo({ abierto, onCerrar, onCreado }: Props) {
  const { data: canchas }  = useSWR<Cancha[]>('/canchas', swrFetcher);
  const { data: usuarios } = useSWR<Usuario[]>('/usuarios', swrFetcher);

  const [canchaId,    setCanchaId]    = useState('');
  const [usuarioId,   setUsuarioId]   = useState('');
  const [diaSemana,   setDiaSemana]   = useState('');
  const [horaInicio,  setHoraInicio]  = useState('');
  const [horaFin,     setHoraFin]     = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [error,       setError]       = useState('');
  const [cargando,    setCargando]    = useState(false);

  const opcionesFin = OPCIONES_HORARIO.filter(o => horaInicio ? o.minutos > Number(horaInicio) : true);

  async function manejarSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!usuarioId) { setError('Seleccioná un cliente'); return; }
    setError('');
    setCargando(true);
    try {
      await api.post('/turnos-fijos', {
        canchaId,
        usuarioId,
        diaSemana,
        horaInicio: Number(horaInicio),
        horaFin: Number(horaFin),
        fechaInicio,
      });
      toast.success('Turno fijo creado');
      onCreado();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear el turno fijo');
      toast.error('Error al crear el turno fijo');
    } finally {
      setCargando(false);
    }
  }

  return (
    <Dialog open={abierto} onOpenChange={(open) => !open && onCerrar()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nuevo turno fijo</DialogTitle>
        </DialogHeader>

        <form onSubmit={manejarSubmit} className="space-y-4">
          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">{error}</p>
          )}

          <div className="space-y-1">
            <Label>Cancha</Label>
            <Select value={canchaId} onValueChange={setCanchaId} required>
              <SelectTrigger><SelectValue placeholder="Seleccioná una cancha" /></SelectTrigger>
              <SelectContent>
                {canchas?.map(c => <SelectItem key={c.id} value={c.id}>{c.nombre}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label>Cliente</Label>
            <ComboboxUsuario usuarios={usuarios} value={usuarioId} onChange={setUsuarioId} />
          </div>

          <div className="space-y-1">
            <Label>Día de semana</Label>
            <Select value={diaSemana} onValueChange={setDiaSemana} required>
              <SelectTrigger><SelectValue placeholder="Seleccioná el día" /></SelectTrigger>
              <SelectContent>
                {DIAS.map(d => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Hora inicio</Label>
              <Select value={horaInicio} onValueChange={(v) => { setHoraInicio(v); setHoraFin(''); }} required>
                <SelectTrigger><SelectValue placeholder="Desde" /></SelectTrigger>
                <SelectContent>
                  {OPCIONES_HORARIO.map(o => (
                    <SelectItem key={o.minutos} value={String(o.minutos)}>{o.etiqueta}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label>Hora fin</Label>
              <Select value={horaFin} onValueChange={setHoraFin} disabled={!horaInicio} required>
                <SelectTrigger><SelectValue placeholder="Hasta" /></SelectTrigger>
                <SelectContent>
                  {opcionesFin.map(o => (
                    <SelectItem key={o.minutos} value={String(o.minutos)}>{o.etiqueta}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="fechaInicio">Vigente desde</Label>
            <input
              id="fechaInicio"
              type="date"
              value={fechaInicio}
              onChange={e => setFechaInicio(e.target.value)}
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCerrar} disabled={cargando}>Cancelar</Button>
            <Button type="submit" disabled={cargando}>{cargando ? 'Guardando...' : 'Crear turno fijo'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
