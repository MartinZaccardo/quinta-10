/*
  Warnings:

  - You are about to drop the `Cancha` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ConfiguracionHoraria` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Reserva` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TurnoFijo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TurnoFijoExcepcion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Usuario` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Reserva" DROP CONSTRAINT "Reserva_canchaId_fkey";

-- DropForeignKey
ALTER TABLE "Reserva" DROP CONSTRAINT "Reserva_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "TurnoFijo" DROP CONSTRAINT "TurnoFijo_canchaId_fkey";

-- DropForeignKey
ALTER TABLE "TurnoFijo" DROP CONSTRAINT "TurnoFijo_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "TurnoFijoExcepcion" DROP CONSTRAINT "TurnoFijoExcepcion_turnoFijoId_fkey";

-- DropTable
DROP TABLE "Cancha";

-- DropTable
DROP TABLE "ConfiguracionHoraria";

-- DropTable
DROP TABLE "Reserva";

-- DropTable
DROP TABLE "TurnoFijo";

-- DropTable
DROP TABLE "TurnoFijoExcepcion";

-- DropTable
DROP TABLE "Usuario";

-- CreateTable
CREATE TABLE "cancha" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo" "TipoCancha" NOT NULL,
    "precio_por_hora" DECIMAL(10,2) NOT NULL,
    "activa" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "cancha_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "configuracion_horaria" (
    "id" TEXT NOT NULL,
    "dia_semana" "DiaSemana" NOT NULL,
    "hora_apertura" INTEGER NOT NULL,
    "hora_cierre" INTEGER NOT NULL,
    "intervalo_minutos" INTEGER NOT NULL DEFAULT 30,

    CONSTRAINT "configuracion_horaria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuario" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "email" TEXT,
    "contrasena" TEXT,
    "numero_whatsapp" TEXT NOT NULL,
    "rol" "RolUsuario" NOT NULL DEFAULT 'CLIENTE',
    "foto_perfil" TEXT,
    "creado_por_admin" BOOLEAN NOT NULL DEFAULT false,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reserva" (
    "id" TEXT NOT NULL,
    "cancha_id" TEXT NOT NULL,
    "usuario_id" TEXT,
    "nombre_contacto" TEXT,
    "telefono_contacto" TEXT,
    "fecha_reserva" DATE NOT NULL,
    "hora_inicio" INTEGER NOT NULL,
    "hora_fin" INTEGER NOT NULL,
    "estado" "EstadoReserva" NOT NULL DEFAULT 'PENDIENTE',
    "es_manual" BOOLEAN NOT NULL DEFAULT false,
    "mensaje_opcional" TEXT,
    "requiere_sena" BOOLEAN NOT NULL DEFAULT false,
    "monto_sena" DECIMAL(10,2),
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reserva_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "turno_fijo" (
    "id" TEXT NOT NULL,
    "cancha_id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "dia_semana" "DiaSemana" NOT NULL,
    "hora_inicio" INTEGER NOT NULL,
    "hora_fin" INTEGER NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "fecha_inicio" DATE NOT NULL,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "turno_fijo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "turno_fijo_excepcion" (
    "id" TEXT NOT NULL,
    "turno_fijo_id" TEXT NOT NULL,
    "fecha_excluida" DATE NOT NULL,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "turno_fijo_excepcion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "configuracion_horaria_dia_semana_key" ON "configuracion_horaria"("dia_semana");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");

-- CreateIndex
CREATE INDEX "reserva_cancha_id_fecha_reserva_estado_idx" ON "reserva"("cancha_id", "fecha_reserva", "estado");

-- CreateIndex
CREATE INDEX "turno_fijo_cancha_id_dia_semana_idx" ON "turno_fijo"("cancha_id", "dia_semana");

-- CreateIndex
CREATE UNIQUE INDEX "turno_fijo_excepcion_turno_fijo_id_fecha_excluida_key" ON "turno_fijo_excepcion"("turno_fijo_id", "fecha_excluida");

-- AddForeignKey
ALTER TABLE "reserva" ADD CONSTRAINT "reserva_cancha_id_fkey" FOREIGN KEY ("cancha_id") REFERENCES "cancha"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reserva" ADD CONSTRAINT "reserva_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "turno_fijo" ADD CONSTRAINT "turno_fijo_cancha_id_fkey" FOREIGN KEY ("cancha_id") REFERENCES "cancha"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "turno_fijo" ADD CONSTRAINT "turno_fijo_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "turno_fijo_excepcion" ADD CONSTRAINT "turno_fijo_excepcion_turno_fijo_id_fkey" FOREIGN KEY ("turno_fijo_id") REFERENCES "turno_fijo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
