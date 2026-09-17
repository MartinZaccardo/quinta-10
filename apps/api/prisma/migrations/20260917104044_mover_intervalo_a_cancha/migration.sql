-- Mueve intervalo_minutos de configuracion_horaria a cancha.
-- F5 y F6 usan slots de 60 minutos; Pádel usa 30 minutos.
ALTER TABLE "cancha" ADD COLUMN "intervalo_minutos" INTEGER NOT NULL DEFAULT 60;

-- Actualiza pádel a 30 minutos antes de quitar el default
UPDATE "cancha" SET "intervalo_minutos" = 30 WHERE "tipo" = 'PADEL';

ALTER TABLE "configuracion_horaria" DROP COLUMN "intervalo_minutos";
