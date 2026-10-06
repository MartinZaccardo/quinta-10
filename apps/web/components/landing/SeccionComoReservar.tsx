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

export default function SeccionComoReservar() {
  return (
    <section id="como-reservar" className="py-20 sm:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <div className="text-center mb-14">
          <p className="text-sky-400 text-xs font-bold tracking-[0.2em] uppercase mb-3">
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
  );
}
