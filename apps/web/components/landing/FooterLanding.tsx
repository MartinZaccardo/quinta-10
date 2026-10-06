import Image from "next/image";

export default function FooterLanding() {
  return (
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
              <li><a href="#canchas" className="hover:text-white transition-colors">Canchas</a></li>
              <li><a href="#predio" className="hover:text-white transition-colors">El predio</a></li>
              <li><a href="#como-reservar" className="hover:text-white transition-colors">Cómo reservar</a></li>
              <li><a href="#ubicacion" className="hover:text-white transition-colors">Ubicación</a></li>
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
        <div className="pt-8 text-center text-white/25 text-xs">
          <p>© {new Date().getFullYear()} La Quinta del 10 · Todos los derechos reservados</p>
        </div>
      </div>
    </footer>
  );
}
