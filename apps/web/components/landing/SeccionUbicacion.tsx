import Image from "next/image";

export default function SeccionUbicacion() {
  return (
    <section id="ubicacion" className="py-20 sm:py-28 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div>
              <p className="text-[#C9A21F] text-xs font-bold tracking-[0.2em] uppercase mb-3">
                Encontranos
              </p>
              <h2 className="font-display font-black uppercase text-[#0F1C2E] text-4xl sm:text-5xl leading-none">
                ¿Dónde estamos?
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
                  <p className="font-bold text-[#0F1C2E] text-sm">Dirección</p>
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
                      Lunes a domingo desde las 16:00 hs
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      Los horarios pueden variar. Consultá disponibilidad online.
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
                    href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#C9A21F] hover:underline font-semibold text-sm mt-0.5 inline-block"
                  >
                    Escribinos por WhatsApp
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
  );
}
