-- Migración: Agregar campos adicionales a la tabla lotes
ALTER TABLE lotes ADD COLUMN IF NOT EXISTS cuartos INTEGER NOT NULL DEFAULT 0;
ALTER TABLE lotes ADD COLUMN IF NOT EXISTS banos INTEGER NOT NULL DEFAULT 0;
ALTER TABLE lotes ADD COLUMN IF NOT EXISTS parqueaderos INTEGER NOT NULL DEFAULT 0;
-- Nota: la tabla ya tiene imagen_url VARCHAR(500) desde la creación inicial

-- Actualizar tabla compras para almacenar datos de reserva y pago
ALTER TABLE compras ADD COLUMN IF NOT EXISTS numero_cuenta VARCHAR(50);
ALTER TABLE compras ADD COLUMN IF NOT EXISTS metodo_pago VARCHAR(50) DEFAULT 'transferencia';
ALTER TABLE compras ADD COLUMN IF NOT EXISTS tipo_reserva VARCHAR(20) DEFAULT 'reserva' CHECK (tipo_reserva IN ('reserva', 'compra'));
