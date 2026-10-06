import Image from "next/image";
import Link from "next/link";
import { FaBeer, FaFutbol } from "react-icons/fa";
import { GiBarbecue, GiTennisBall } from "react-icons/gi";

const BADGES_HERO = [
  { texto: "Fútbol 5", icono: <FaFutbol className="w-3.5 h-3.5" /> },
  { texto: "Fútbol 6", icono: <FaFutbol className="w-3.5 h-3.5" /> },
  { texto: "Pádel", icono: <GiTennisBall className="w-3.5 h-3.5" /> },
  { texto: "Bar & tercer tiempo", icono: <FaBeer className="w-3.5 h-3.5" /> },
  { texto: "Zona de parrillas", icono: <GiBarbecue className="w-3.5 h-3.5" /> },
];

export default function SeccionHero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <Image
        src="/cancha-f6.jpg"
        alt="Cancha F6 — La Quinta del 10"
        fill
        className="object-cover object-top"
        priority
        quality={90}
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-[#0F1C2E]/35" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0F1C2E]/95 via-[#0F1C2E]/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0F1C2E]/65 to-transparent" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-8 w-full pt-24 pb-16">
        <div className="max-w-2xl space-y-5">
          <p className="text-[#C9A21F] text-xs font-bold tracking-[0.25em] uppercase">
            Predio deportivo · González Catán
          </p>
          <h1 className="font-display font-black uppercase leading-none text-white text-6xl sm:text-7xl lg:text-7xl">
            <span className="block">Reservá tu cancha</span>
            en<span className="text-[#C9A21F]"> segundos</span>
          </h1>
          <p className="text-white/70 text-base sm:text-lg max-w-md leading-relaxed">
            Fútbol 5, Fútbol 6 y Pádel en un solo predio.
            <br />
            Reservá online las 24hs, sin llamadas ni mensajes.
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <Link
              href="/cliente/disponibilidad"
              className="bg-amber-400 hover:bg-amber-500 text-[#0F1C2E] font-bold px-8 py-3.5 rounded-full transition-colors text-sm tracking-wide"
            >
              Ver horarios disponibles
            </Link>
            <a
              href="#como-reservar"
              className="border border-white/40 text-white hover:bg-white/10 px-8 py-3.5 rounded-full transition-colors text-sm"
            >
              Cómo funciona
            </a>
          </div>
          <div className="flex flex-wrap gap-2 pt-3">
            {BADGES_HERO.map((badge) => (
              <div
                key={badge.texto}
                className="flex items-center gap-1.5 bg-black/35 backdrop-blur-sm border border-white/15 rounded-full px-3 py-1.5"
              >
                <span className="text-[#C9A21F]">{badge.icono}</span>
                <span className="text-white/75 text-xs font-medium">
                  {badge.texto}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
