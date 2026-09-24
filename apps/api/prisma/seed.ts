import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, DiaSemana, TipoCancha, RolUsuario } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

// Minutos desde medianoche. horaCierre = último momento en que puede TERMINAR una reserva.
// Viernes: último slot posible termina a las 02:00 AM del día siguiente (1560 min).
const HORARIOS: Record<DiaSemana, { apertura: number; cierre: number }> = {
  LUNES:     { apertura: 540, cierre: 1440 }, // 09:00 - 00:00
  MARTES:    { apertura: 540, cierre: 1440 },
  MIERCOLES: { apertura: 540, cierre: 1440 },
  JUEVES:    { apertura: 540, cierre: 1440 },
  VIERNES:   { apertura: 540, cierre: 1560 }, // 09:00 - 02:00 (+1 día)
  SABADO:    { apertura: 540, cierre: 1440 }, // 09:00 - 00:00
  DOMINGO:   { apertura: 540, cierre: 1440 },
};

async function main() {
  console.log("Iniciando seed...");

  // ── Canchas ──────────────────────────────────────────────────────────────
  await prisma.cancha.upsert({
    where: { id: "cancha-1" },
    update: {},
    create: {
      id: "cancha-1",
      nombre: "Cancha 1",
      tipo: TipoCancha.F6,
      precioPorHora: 35000,
      activa: true,
    },
  });

  await prisma.cancha.upsert({
    where: { id: "cancha-2" },
    update: {},
    create: {
      id: "cancha-2",
      nombre: "Cancha 2",
      tipo: TipoCancha.F5,
      precioPorHora: 30000,
      activa: true,
    },
  });

  await prisma.cancha.upsert({
    where: { id: "cancha-3" },
    update: {},
    create: {
      id: "cancha-3",
      nombre: "Pádel",
      tipo: TipoCancha.PADEL,
      precioPorHora: 20000,
      intervaloMinutos: 30,
      activa: true,
    },
  });

  console.log("✓ Canchas creadas");

  // ── Configuración horaria ────────────────────────────────────────────────
  for (const [dia, horario] of Object.entries(HORARIOS)) {
    await prisma.configuracionHoraria.upsert({
      where: { diaSemana: dia as DiaSemana },
      update: {},
      create: {
        diaSemana: dia as DiaSemana,
        horaApertura: horario.apertura,
        horaCierre: horario.cierre,
      },
    });
  }

  console.log("✓ Configuración horaria creada");

  // ── Usuario administrador ────────────────────────────────────────────────
  const contrasenaHasheada = await bcrypt.hash("admin123", 10);

  await prisma.usuario.upsert({
    where: { email: "admin@quintadel10.com" },
    update: {},
    create: {
      nombre: "Admin",
      apellido: "La Quinta",
      email: "admin@quintadel10.com",
      contrasena: contrasenaHasheada,
      numeroWhatsApp: "5491100000000",
      rol: RolUsuario.ADMINISTRADOR,
      activo: true,
    },
  });

  console.log("✓ Usuario administrador creado");
  console.log("\nSeed completado.");
  console.log("Admin → email: admin@quintadel10.com | contraseña: admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
