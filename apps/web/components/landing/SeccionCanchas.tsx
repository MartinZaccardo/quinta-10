import Image from "next/image";
import Link from "next/link";

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
    foto: "/fondo-parlante.jpeg",
    descripcion:
      "Césped sintético para 10 jugadores, con zona de parrillas a metros.",
    destacada: false,
  },
  {
    nombre: "Pádel",
    tag: "PÁDEL",
    precio: "$20.000",
    foto: "/padel.jpg",
    descripcion: "Cancha al aire libre con iluminación nocturna completa.",
    destacada: false,
  },
];

export default function SeccionCanchas() {
  return (
    <section id="canchas" className="py-20 sm:py-28 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <div className="mb-14 text-center">
          <p className="text-sky-400 text-xs font-bold tracking-[0.2em] uppercase mb-3">
            Nuestras canchas
          </p>
          <h2 className="font-display font-black uppercase text-[#0F1C2E] text-4xl sm:text-5xl leading-none">
            Dos deportes, un solo predio
          </h2>
          <p className="text-gray-500 mt-4 text-sm">
            Elegí tu cancha, chequeá la disponibilidad y reservá al instante.
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
  );
}
