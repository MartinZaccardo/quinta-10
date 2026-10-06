import Link from "next/link";

export default function SeccionCtaBanner() {
  return (
    <section className="bg-sky-400 py-16 sm:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-8 text-center space-y-6">
        <h2 className="font-display font-black uppercase text-white text-4xl sm:text-5xl leading-none">
          ¿Listo para jugar?
        </h2>
        <p className="text-white/80 text-base">
          Sin llamadas, sin WhatsApp. Tu cancha reservada en segundos, las 24 horas.
        </p>
        <Link
          href="/disponibilidad"
          className="inline-block bg-amber-400 hover:bg-amber-500 text-[#0F1C2E] font-bold px-10 py-4 rounded-md transition-colors text-sm tracking-wide"
        >
          Reservar ahora
        </Link>
      </div>
    </section>
  );
}
