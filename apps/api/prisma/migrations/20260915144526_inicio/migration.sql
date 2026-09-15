-- CreateEnum
CREATE TYPE "TipoCancha" AS ENUM ('F5', 'F6', 'PADEL');

-- CreateEnum
CREATE TYPE "RolUsuario" AS ENUM ('CLIENTE', 'ADMINISTRADOR');

-- CreateEnum
CREATE TYPE "EstadoReserva" AS ENUM ('PENDIENTE', 'CONFIRMADA', 'CANCELADA');

-- CreateEnum
CREATE TYPE "DiaSemana" AS ENUM ('LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO');

-- CreateTable
CREATE TABLE "Cancha" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo" "TipoCancha" NOT NULL,
    "precioPorHora" DECIMAL(10,2) NOT NULL,
    "activa" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Cancha_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConfiguracionHoraria" (
    "id" TEXT NOT NULL,
    "diaSemana" "DiaSemana" NOT NULL,
    "horaApertura" INTEGER NOT NULL,
    "horaCierre" INTEGER NOT NULL,
    "intervaloMinutos" INTEGER NOT NULL DEFAULT 30,

    CONSTRAINT "ConfiguracionHoraria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "email" TEXT,
    "contrasena" TEXT,
    "numeroWhatsApp" TEXT NOT NULL,
    "rol" "RolUsuario" NOT NULL DEFAULT 'CLIENTE',
    "fotoPerfil" TEXT,
    "creadoPorAdmin" BOOLEAN NOT NULL DEFAULT false,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reserva" (
    "id" TEXT NOT NULL,
    "canchaId" TEXT NOT NULL,
    "usuarioId" TEXT,
    "nombreContacto" TEXT,
    "telefonoContacto" TEXT,
    "fechaReserva" DATE NOT NULL,
    "horaInicio" INTEGER NOT NULL,
    "horaFin" INTEGER NOT NULL,
    "estado" "EstadoReserva" NOT NULL DEFAULT 'PENDIENTE',
    "esManual" BOOLEAN NOT NULL DEFAULT false,
    "mensajeOpcional" TEXT,
    "requiereSeña" BOOLEAN NOT NULL DEFAULT false,
    "montoSeña" DECIMAL(10,2),
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reserva_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TurnoFijo" (
    "id" TEXT NOT NULL,
    "canchaId" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "diaSemana" "DiaSemana" NOT NULL,
    "horaInicio" INTEGER NOT NULL,
    "horaFin" INTEGER NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "fechaInicio" DATE NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TurnoFijo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TurnoFijoExcepcion" (
    "id" TEXT NOT NULL,
    "turnoFijoId" TEXT NOT NULL,
    "fechaExcluida" DATE NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TurnoFijoExcepcion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ConfiguracionHoraria_diaSemana_key" ON "ConfiguracionHoraria"("diaSemana");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE INDEX "Reserva_canchaId_fechaReserva_estado_idx" ON "Reserva"("canchaId", "fechaReserva", "estado");

-- CreateIndex
CREATE INDEX "TurnoFijo_canchaId_diaSemana_idx" ON "TurnoFijo"("canchaId", "diaSemana");

-- CreateIndex
CREATE UNIQUE INDEX "TurnoFijoExcepcion_turnoFijoId_fechaExcluida_key" ON "TurnoFijoExcepcion"("turnoFijoId", "fechaExcluida");

-- AddForeignKey
ALTER TABLE "Reserva" ADD CONSTRAINT "Reserva_canchaId_fkey" FOREIGN KEY ("canchaId") REFERENCES "Cancha"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reserva" ADD CONSTRAINT "Reserva_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TurnoFijo" ADD CONSTRAINT "TurnoFijo_canchaId_fkey" FOREIGN KEY ("canchaId") REFERENCES "Cancha"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TurnoFijo" ADD CONSTRAINT "TurnoFijo_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TurnoFijoExcepcion" ADD CONSTRAINT "TurnoFijoExcepcion_turnoFijoId_fkey" FOREIGN KEY ("turnoFijoId") REFERENCES "TurnoFijo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
