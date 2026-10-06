import FooterLanding from "@/components/landing/FooterLanding";
import HeaderLanding from "@/components/landing/HeaderLanding";
import SeccionCanchas from "@/components/landing/SeccionCanchas";
import SeccionComoReservar from "@/components/landing/SeccionComoReservar";
import SeccionCtaBanner from "@/components/landing/SeccionCtaBanner";
import SeccionHero from "@/components/landing/SeccionHero";
import SeccionPredio from "@/components/landing/SeccionPredio";
import SeccionUbicacion from "@/components/landing/SeccionUbicacion";

export default function PaginaLanding() {
  return (
    <div className="min-h-screen bg-white">
      <HeaderLanding />
      <SeccionHero />
      <SeccionCanchas />
      <SeccionPredio />
      <SeccionComoReservar />
      <SeccionCtaBanner />
      <SeccionUbicacion />
      <FooterLanding />
    </div>
  );
}
