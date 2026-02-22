-- Migración: Agregar campos adicionales a la tabla lotes
ALTER TABLE lotes ADD COLUMN IF NOT EXISTS cuartos INT DEFAULT 0;
ALTER TABLE lotes ADD COLUMN IF NOT EXISTS baños INT DEFAULT 0;
ALTER TABLE lotes ADD COLUMN IF NOT EXISTS parqueaderos INT DEFAULT 0;
ALTER TABLE lotes ADD COLUMN IF NOT EXISTS foto_url VARCHAR(500);

-- Actualizar tabla compras para almacenar datos de reserva y pago
ALTER TABLE compras ADD COLUMN IF NOT EXISTS numero_cuenta VARCHAR(50);
ALTER TABLE compras ADD COLUMN IF NOT EXISTS metodo_pago VARCHAR(50) DEFAULT 'transferencia';
ALTER TABLE compras ADD COLUMN IF NOT EXISTS tipo_reserva VARCHAR(20) DEFAULT 'reserva' CHECK (tipo_reserva IN ('reserva', 'compra'));
