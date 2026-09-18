'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';

interface Usuario { id: string; nombre: string; apellido: string }

interface Props {
  usuarios: Usuario[] | undefined;
  value: string;
  onChange: (id: string) => void;
}

export function ComboboxUsuario({ usuarios, value, onChange }: Props) {
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
