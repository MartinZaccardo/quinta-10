import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Clock,
  MessageCircle,
  LayoutGrid,
  CalendarCheck,
  Zap,
} from "lucide-react";
import HeaderLanding from "@/components/landing/header-landing";

const CANCHAS = [
  {
    nombre: "Fútbol 6",
    precio: "$40.000",
    foto: "/cancha-f6.jpg",
    descripcion: "Cancha de césped sintético para 6 vs 6.",
  },
  {
    nombre: "Fútbol 5",
    precio: "$30.000",
    foto: "/afuera-dia.jpeg",
    descripcion: "Cancha rápida, ideal para grupos de 5.",
  },
  {
    nombre: "Pádel",
    precio: "$20.000",
    foto: "/padel.jpg",
    descripcion: "Cancha al aire libre con iluminación nocturna.",
  },
];

const PASOS = [
  {
    Icono: LayoutGrid,
    numero: "01",
    titulo: "Elegí tu cancha",
    descripcion:
      "Fútbol 5, Fútbol 6 o Pádel. Elegí el deporte y el horario que mejor te queda.",
  },
  {
    Icono: CalendarCheck,
    numero: "02",
    titulo: "Reservá online",
    descripcion:
      "Confirmá tu reserva en segundos, sin llamadas ni mensajes de WhatsApp.",
  },
  {
    Icono: Zap,
    numero: "03",
    titulo: "¡A jugar!",
    descripcion:
      "Recibís la confirmación al instante y solo tenés que presentarte a jugar.",
  },
];

export default function PaginaLanding() {
  return (
    <div className="min-h-screen bg-white">
      {/* ── Header ─────────────────────────────────────────────── */}
      <HeaderLanding />

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center">
        <Image
          src="/cancha-f6-arco.jpeg"
          alt="Cancha de fútbol La Quinta del 10"
          fill
          className="object-cover object-[center_65%]"
          priority
        />
        {/* Gradiente: azul sólido a la izquierda, se desvanece mostrando la cancha a la derecha */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1C3A5E] from-35% via-[#1C3A5E]/85 via-60% to-[#1C3A5E]/10" />

        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 sm:px-8">
          <div className="max-w-lg space-y-6">
            <p className="text-[#C9A21F] font-semibold tracking-widest text-xs uppercase">
              Fútbol 5 · Fútbol 6 · Pádel
            </p>
            <h1 className="text-white text-4xl sm:text-6xl font-bold leading-tight">
              Reservá tu cancha online
            </h1>
            <p className="text-white/75 text-lg sm:text-xl leading-relaxed">
              Sin llamadas, sin esperas.
              <br className="hidden sm:block" />
              Elegí el horario que mejor te queda y confirmá en segundos.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href="/registro"
                className="bg-[#C9A21F] hover:bg-[#B8911A] text-[#1C3A5E] font-bold px-8 py-3.5 rounded-md transition-colors text-base text-center"
              >
                Reservar ahora
              </Link>
              <Link
                href="/login"
                className="border border-white/40 text-white hover:bg-white/10 px-8 py-3.5 rounded-md transition-colors text-base text-center"
              >
                Ya tengo cuenta
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 animate-bounce">
          <svg
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </section>

      {/* ── Cómo funciona ──────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1C3A5E]">
              ¿Cómo funciona?
            </h2>
            <p className="text-gray-500 mt-2 text-sm">
              Tres pasos y estás en la cancha
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {PASOS.map(({ Icono, numero, titulo, descripcion }) => (
              <div
                key={numero}
                className="flex flex-col items-center text-center gap-4"
              >
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-[#1C3A5E]/5 flex items-center justify-center">
                    <Icono className="w-7 h-7 text-[#1C3A5E]" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[#C9A21F] text-[#1C3A5E] text-[10px] font-bold flex items-center justify-center">
                    {numero.slice(1)}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-[#1C3A5E] text-lg">{titulo}</h3>
                  <p className="text-gray-500 text-sm mt-1 leading-relaxed">
                    {descripcion}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Canchas ────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1C3A5E]">
              Nuestras canchas
            </h2>
            <p className="text-gray-500 mt-2 text-sm">
              Precio por hora · Disponibilidad en tiempo real
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {CANCHAS.map((cancha) => (
              <div
                key={cancha.nombre}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="relative h-48">
                  <Image
                    src={cancha.foto}
                    alt={cancha.nombre}
                    fill
                    className="object-cover"
                  />
                  <span className="absolute top-3 right-3 bg-[#C9A21F] text-[#1C3A5E] font-bold text-sm px-3 py-1 rounded-full shadow">
                    {cancha.precio}/h
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-[#1C3A5E] text-lg">
                    {cancha.nombre}
                  </h3>
                  <p className="text-gray-500 text-sm mt-1">
                    {cancha.descripcion}
                  </p>
                  <Link
                    href="/registro"
                    className="mt-4 block text-center bg-[#1C3A5E] hover:bg-[#162D4A] text-white text-sm font-semibold px-4 py-2.5 rounded-md transition-colors"
                  >
                    Reservar
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Info / Ubicación ───────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-[#1C3A5E]">
                ¿Dónde estamos?
              </h2>

              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-lg bg-[#1C3A5E]/5 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 text-[#1C3A5E]" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Dirección</p>
                    <p className="text-gray-600 text-sm mt-0.5">
                      Totoral 386, entre Puerto Argentino y Tonelero
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-lg bg-[#1C3A5E]/5 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-4 h-4 text-[#1C3A5E]" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Horarios</p>
                    <p className="text-gray-600 text-sm mt-0.5">
                      Lunes a Jueves: 8:00 – 23:00
                    </p>
                    <p className="text-gray-600 text-sm">
                      Viernes y Sábado: 8:00 – 02:00
                    </p>
                    <p className="text-gray-600 text-sm">
                      Domingo: 8:00 – 23:00
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-lg bg-[#1C3A5E]/5 flex items-center justify-center shrink-0 mt-0.5">
                    <MessageCircle className="w-4 h-4 text-[#1C3A5E]" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">WhatsApp</p>
                    <a
                      href="https://wa.me/5491171314155"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#1C3A5E] hover:underline font-medium text-sm mt-0.5 inline-block"
                    >
                      +54 9 11 7131-4155
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden shadow-sm">
              <Image
                src="/mesas-afuera.jpeg"
                alt="Instalaciones La Quinta del 10"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="bg-[#1C3A5E] py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-white/60 text-sm">
          <div className="flex items-center gap-2">
            <Image
              src="/quinta-logo.jpeg"
              alt="La Quinta del 10"
              width={28}
              height={28}
              className="rounded-full opacity-80"
            />
            <span className="text-white/80 font-medium">La Quinta del 10</span>
          </div>
          <p>Totoral 386 · Entre Puerto Argentino y Tonelero</p>
          <a
            href="https://wa.me/5491171314155"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            +54 9 11 7131-4155
          </a>
        </div>
      </footer>
    </div>
  );
}
