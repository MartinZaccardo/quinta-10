"use client";

import Link from "next/link";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { useAuth } from "@/contexts/auth";

const ENLACES_NAV = [
  { href: "#canchas", texto: "Canchas" },
  { href: "#predio", texto: "El predio" },
  { href: "#como-reservar", texto: "Cómo reservar" },
  { href: "#ubicacion", texto: "Ubicación" },
];

export default function HeaderLanding() {
  const { estaAutenticado, esAdmin, cargando } = useAuth();
  const [menuAbierto, setMenuAbierto] = useState(false);

  const panelUrl = esAdmin
    ? "/admin/disponibilidad"
    : "/cliente/disponibilidad";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0F1C2E]/95 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="font-display font-black uppercase text-white text-lg tracking-wide"
        >
          La Quinta del 10
        </Link>

        <nav className="hidden sm:flex items-center gap-7 text-sm text-white/60">
          {ENLACES_NAV.map((e) => (
            <a
              key={e.href}
              href={e.href}
              className="hover:text-white transition-colors"
            >
              {e.texto}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {cargando ? (
            <div className="h-8 w-28 bg-white/10 rounded-md animate-pulse" />
          ) : estaAutenticado ? (
            <Link
              href={panelUrl}
              className="bg-amber-400 hover:bg-amber-500 text-[#0F1C2E] font-bold text-sm px-5 py-2 rounded-md transition-colors"
            >
              Mi panel
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-white/70 hover:text-white text-sm transition-colors hidden sm:block"
              >
                Iniciar sesión
              </Link>
              <Link
                href="/registro"
                className="bg-amber-400 hover:bg-amber-500 text-[#0F1C2E] font-bold text-sm px-5 py-2 rounded-md transition-colors"
              >
                Reservar
              </Link>
            </>
          )}

          <button
            className="sm:hidden text-white/70 hover:text-white p-1 transition-colors"
            onClick={() => setMenuAbierto(!menuAbierto)}
            aria-label="Menú"
          >
            {menuAbierto ? (
              <FaTimes className="w-5 h-5" />
            ) : (
              <FaBars className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {menuAbierto && (
        <div className="sm:hidden bg-[#0F1C2E] border-t border-white/10 px-4 py-4 flex flex-col gap-4">
          {ENLACES_NAV.map((e) => (
            <a
              key={e.href}
              href={e.href}
              className="text-white/70 hover:text-white text-sm transition-colors"
              onClick={() => setMenuAbierto(false)}
            >
              {e.texto}
            </a>
          ))}
          {!estaAutenticado && !cargando && (
            <Link
              href="/login"
              className="text-white/70 hover:text-white text-sm transition-colors"
              onClick={() => setMenuAbierto(false)}
            >
              Iniciar sesión
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
