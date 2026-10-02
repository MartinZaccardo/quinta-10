import Image from "next/image";
import Link from "next/link";
import { FaBeer, FaDrumstickBite, FaFutbol } from "react-icons/fa";
import { GiTennisRacket } from "react-icons/gi";

const CANCHAS = [
  {
    nombre: "Fútbol 6",
    tag: "F6",
    precio: "$40.000",
    foto: "/cancha-f6.jpg",
    descripcion:
      "Césped sintético para partidos de 6 contra 6. La cancha estrella del predio.",
    destacada: true,
  },
  {
    nombre: "Fútbol 5",
    tag: "F5",
    precio: "$30.000",
    foto: "/afuera-dia.jpeg",
    descripcion:
      "Cancha rápida y versátil, ideal para grupos de hasta 10 jugadores.",
    destacada: false,
  },
  {
    nombre: "Pádel",
    tag: "PAD",
    precio: "$20.000",
    foto: "/padel-noche.jpeg",
    descripcion: "Cancha al aire libre con iluminación nocturna completa.",
    destacada: false,
  },
];

const PASOS = [
  {
    numero: "01",
    icono: (
      <svg
        className="w-7 h-7"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
        />
      </svg>
    ),
    titulo: "Creá tu cuenta",
    descripcion:
      "Registrate gratis en menos de un minuto. Solo necesitás tu nombre y WhatsApp.",
  },
  {
    numero: "02",
    icono: (
      <svg
        className="w-7 h-7"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
        />
      </svg>
    ),
    titulo: "Elegí tu horario",
    descripcion:
      "Ves la disponibilidad en tiempo real y elegís el día y la hora que más te conviene.",
  },
  {
    numero: "03",
    icono: (
      <svg
        className="w-7 h-7"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    titulo: "Confirmamos y listo",
    descripcion:
      "Recibís la confirmación y te esperamos en la cancha. Sin vueltas, sin llamadas.",
  },
];

const FEATURES_PREDIO = [
  {
    icono: (
      <svg
        className="w-5 h-5 text-[#C9A21F]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"
        />
      </svg>
    ),
    texto: "Bar con tragos, cervezas y snacks",
  },
  {
    icono: (
      <svg
        className="w-5 h-5 text-[#C9A21F]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 01-1.125-1.125v-3.75zM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-8.25zM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-2.25z"
        />
      </svg>
    ),
    texto: "Mesas al aire libre e interiores",
  },
  {
    icono: (
      <svg
        className="w-5 h-5 text-[#C9A21F]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
        />
      </svg>
    ),
    texto: "Iluminación LED en todas las canchas",
  },
  {
    icono: (
      <svg
        className="w-5 h-5 text-[#C9A21F]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
        />
      </svg>
    ),
    texto: "Ambiente familiar para quedarse",
  },
];

const BADGES_HERO = [
  { texto: "Fútbol 5", icono: <FaFutbol className="w-3.5 h-3.5" /> },
  { texto: "Fútbol 6", icono: <FaFutbol className="w-3.5 h-3.5" /> },
  { texto: "Pádel", icono: <GiTennisRacket className="w-3.5 h-3.5" /> },
  { texto: "Bar & tercer tiempo", icono: <FaBeer className="w-3.5 h-3.5" /> },
  {
    texto: "Zona de parrillas",
    icono: <FaDrumstickBite className="w-3.5 h-3.5" />,
  },
];

export default function PaginaLanding() {
  return (
    <div className="min-h-screen bg-white">
      {/* ── Header ─────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0F1C2E]/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/quinta-logo.jpeg"
              alt="La Quinta del 10"
              width={34}
              height={34}
              className="rounded-full"
            />
            <span className="text-white font-bold text-sm hidden sm:block tracking-wide">
              La Quinta del 10
            </span>
          </div>

          <nav className="hidden sm:flex items-center gap-7 text-sm text-white/60">
            <a href="#canchas" className="hover:text-white transition-colors">
              Canchas
            </a>
            <a href="#predio" className="hover:text-white transition-colors">
              El predio
            </a>
            <a
              href="#como-reservar"
              className="hover:text-white transition-colors"
            >
              Cómo reservar
            </a>
            <a href="#ubicacion" className="hover:text-white transition-colors">
              Ubicación
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-white/70 hover:text-white text-sm transition-colors hidden sm:block"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/registro"
              className="bg-[#C9A21F] hover:bg-[#B8911A] text-[#0F1C2E] font-bold text-sm px-5 py-2 rounded-md transition-colors"
            >
              Reservar
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ───────────────────────────────────────────────── */}
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
            <h1 className="font-display font-black uppercase leading-none text-white text-6xl sm:text-7xl lg:text-8xl">
              Reservá tu cancha
              <br />
              <span className="text-[#C9A21F]">en segundos</span>
            </h1>
            <p className="text-white/70 text-base sm:text-lg max-w-md leading-relaxed">
              Fútbol 5, Fútbol 6 y Pádel en un solo predio.
              <br />
              Reservá online las 24hs, sin llamadas ni mensajes.
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <Link
                href="/registro"
                className="bg-[#C9A21F] hover:bg-[#B8911A] text-[#0F1C2E] font-bold px-8 py-3.5 rounded-full transition-colors text-sm tracking-wide"
              >
                Reservar ahora
              </Link>
              <Link
                href="/login"
                className="border border-white/40 text-white hover:bg-white/10 px-8 py-3.5 rounded-full transition-colors text-sm"
              >
                Ya tengo cuenta
              </Link>
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

      {/* ── Canchas ────────────────────────────────────────────── */}
      <section id="canchas" className="py-20 sm:py-28 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="mb-14">
            <p className="text-[#C9A21F] text-xs font-bold tracking-[0.2em] uppercase mb-3">
              Nuestras instalaciones
            </p>
            <h2 className="font-display font-black uppercase text-[#0F1C2E] text-4xl sm:text-5xl leading-none">
              Tres deportes,
              <br />
              un solo predio
            </h2>
            <p className="text-gray-500 mt-4 text-sm">
              Precio por hora · Disponibilidad en tiempo real
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {CANCHAS.map((cancha) => (
              <div
                key={cancha.nombre}
                className={`bg-white rounded-2xl overflow-hidden shadow-sm border transition-all hover:shadow-md hover:-translate-y-1 ${
                  cancha.destacada ? "border-[#C9A21F]/40" : "border-gray-100"
                }`}
              >
                <div className="relative h-52">
                  <Image
                    src={cancha.foto}
                    alt={cancha.nombre}
                    fill
                    className="object-cover"
                  />
                  <span className="absolute top-3 left-3 bg-[#0F1C2E] text-[#C9A21F] font-display font-black text-xs px-2.5 py-1 rounded-md tracking-widest">
                    {cancha.tag}
                  </span>
                  <span className="absolute top-3 right-3 bg-[#C9A21F] text-[#0F1C2E] font-bold text-sm px-3 py-1 rounded-full shadow">
                    {cancha.precio}/h
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="font-display font-black uppercase text-[#0F1C2E] text-xl leading-none">
                    {cancha.nombre}
                  </h3>
                  <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                    {cancha.descripcion}
                  </p>
                  <Link
                    href="/registro"
                    className="mt-5 block text-center bg-[#0F1C2E] hover:bg-[#1C3A5E] text-white text-sm font-bold px-4 py-2.5 rounded-md transition-colors tracking-wide"
                  >
                    Reservar
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── El predio ──────────────────────────────────────────── */}
      <section id="predio" className="py-20 sm:py-28 bg-[#0F1C2E]">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <p className="text-[#C9A21F] text-xs font-bold tracking-[0.2em] uppercase mb-3">
                  Más que fútbol
                </p>
                <h2 className="font-display font-black uppercase text-white text-4xl sm:text-5xl leading-none">
                  Todo listo
                  <br />
                  para el
                  <br />
                  <span className="text-[#C9A21F]">tercer tiempo</span>
                </h2>
              </div>
              <p className="text-white/60 text-sm leading-relaxed max-w-sm">
                Después del partido, el predio sigue. Bar, mesas y un ambiente
                ideal para cerrar la noche con el equipo.
              </p>
              <ul className="space-y-4">
                {FEATURES_PREDIO.map((f, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                      {f.icono}
                    </div>
                    <span className="text-white/80 text-sm">{f.texto}</span>
                  </li>
                ))}
              </ul>
              <a
                href="https://wa.me/5491171314155"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-white/20 text-white/70 hover:text-white hover:border-white/40 text-sm px-5 py-2.5 rounded-md transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Escribinos por WhatsApp
              </a>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { src: "/mesas-afuera.jpeg", alt: "Mesas al aire libre" },
                { src: "/mesas-adentro.jpeg", alt: "Bar interior" },
                { src: "/mates.jpeg", alt: "Ambiente del predio", span: true },
              ].map((img) => (
                <div
                  key={img.src}
                  className={`relative rounded-xl overflow-hidden ${img.span ? "col-span-2 h-44" : "h-40"}`}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Cómo reservar ──────────────────────────────────────── */}
      <section id="como-reservar" className="py-20 sm:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="text-center mb-14">
            <p className="text-[#C9A21F] text-xs font-bold tracking-[0.2em] uppercase mb-3">
              Simple y rápido
            </p>
            <h2 className="font-display font-black uppercase text-[#0F1C2E] text-4xl sm:text-5xl leading-none">
              Reservá en 3 pasos
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {PASOS.map((paso) => (
              <div key={paso.numero} className="relative">
                <div className="bg-gray-50 rounded-2xl p-8 h-full space-y-4 border border-gray-100">
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-xl bg-[#C9A21F]/10 text-[#C9A21F] flex items-center justify-center">
                      {paso.icono}
                    </div>
                    <span className="font-display font-black text-4xl text-gray-100 leading-none">
                      {paso.numero}
                    </span>
                  </div>
                  <h3 className="font-display font-black uppercase text-[#0F1C2E] text-xl leading-none">
                    {paso.titulo}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {paso.descripcion}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ─────────────────────────────────────────── */}
      <section className="bg-[#C9A21F] py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-8 text-center space-y-6">
          <h2 className="font-display font-black uppercase text-[#0F1C2E] text-4xl sm:text-5xl leading-none">
            ¿Listo para jugar?
          </h2>
          <p className="text-[#0F1C2E]/70 text-base">
            Creá tu cuenta gratis y reservá tu cancha en segundos.
          </p>
          <Link
            href="/registro"
            className="inline-block bg-[#0F1C2E] hover:bg-[#1C3A5E] text-white font-bold px-10 py-4 rounded-md transition-colors text-sm tracking-wide"
          >
            Crear cuenta gratis
          </Link>
        </div>
      </section>

      {/* ── Ubicación ──────────────────────────────────────────── */}
      <section id="ubicacion" className="py-20 sm:py-28 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <p className="text-[#C9A21F] text-xs font-bold tracking-[0.2em] uppercase mb-3">
                  Encontranos
                </p>
                <h2 className="font-display font-black uppercase text-[#0F1C2E] text-4xl sm:text-5xl leading-none">
                  ¿Dónde
                  <br />
                  estamos?
                </h2>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#0F1C2E]/5 flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-[#0F1C2E]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-[#0F1C2E] text-sm">
                      Dirección
                    </p>
                    <p className="text-gray-500 text-sm mt-0.5">
                      Totoral 386, entre Puerto Argentino y Tonelero
                    </p>
                    <p className="text-gray-400 text-xs mt-0.5">
                      González Catán, Buenos Aires
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#0F1C2E]/5 flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-[#0F1C2E]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-[#0F1C2E] text-sm">Horarios</p>
                    <div className="space-y-0.5 mt-0.5">
                      <p className="text-gray-500 text-sm">
                        Lun a Jue: 8:00 – 23:00
                      </p>
                      <p className="text-gray-500 text-sm">
                        Vie y Sáb: 8:00 – 02:00
                      </p>
                      <p className="text-gray-500 text-sm">
                        Domingo: 8:00 – 23:00
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#0F1C2E]/5 flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-[#0F1C2E]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-[#0F1C2E] text-sm">WhatsApp</p>
                    <a
                      href="https://wa.me/5491171314155"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#C9A21F] hover:underline font-semibold text-sm mt-0.5 inline-block"
                    >
                      +54 9 11 7131-4155
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative h-72 sm:h-[420px] rounded-2xl overflow-hidden shadow-sm">
              <Image
                src="/afuera-dia.jpeg"
                alt="Vista del predio La Quinta del 10"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="bg-[#0F1C2E] py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 pb-10 border-b border-white/10">
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <Image
                  src="/quinta-logo.jpeg"
                  alt="La Quinta del 10"
                  width={36}
                  height={36}
                  className="rounded-full opacity-90"
                />
                <span className="text-white font-display font-black uppercase text-base">
                  La Quinta del 10
                </span>
              </div>
              <p className="text-white/40 text-sm leading-relaxed max-w-xs">
                Predio deportivo en González Catán. Fútbol 5, Fútbol 6 y Pádel
                con reservas online.
              </p>
            </div>

            <div className="space-y-4">
              <p className="text-white/80 font-bold text-sm uppercase tracking-wider">
                Navegación
              </p>
              <ul className="space-y-2 text-white/40 text-sm">
                <li>
                  <a
                    href="#canchas"
                    className="hover:text-white transition-colors"
                  >
                    Canchas
                  </a>
                </li>
                <li>
                  <a
                    href="#predio"
                    className="hover:text-white transition-colors"
                  >
                    El predio
                  </a>
                </li>
                <li>
                  <a
                    href="#como-reservar"
                    className="hover:text-white transition-colors"
                  >
                    Cómo reservar
                  </a>
                </li>
                <li>
                  <a
                    href="#ubicacion"
                    className="hover:text-white transition-colors"
                  >
                    Ubicación
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <p className="text-white/80 font-bold text-sm uppercase tracking-wider">
                Contacto
              </p>
              <ul className="space-y-2 text-white/40 text-sm">
                <li>Totoral 386, González Catán</li>
                <li>Entre Puerto Argentino y Tonelero</li>
                <li>
                  <a
                    href="https://wa.me/5491171314155"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    +54 9 11 7131-4155
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-white/25 text-xs">
            <p>© 2024 La Quinta del 10 · Todos los derechos reservados</p>
            <div className="flex gap-5">
              <Link
                href="/login"
                className="hover:text-white/60 transition-colors"
              >
                Iniciar sesión
              </Link>
              <Link
                href="/registro"
                className="hover:text-white/60 transition-colors"
              >
                Registrarse
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
