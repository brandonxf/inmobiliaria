-- Seed data for Sistema Inmobiliario

-- Etapas del proyecto
INSERT INTO etapas (nombre, descripcion, orden, activa) VALUES
('Lanzamiento', 'Fase inicial del proyecto con preventa exclusiva y precios de lanzamiento.', 1, TRUE),
('Preventa', 'Etapa de preventa con descuentos especiales para primeros compradores.', 2, TRUE),
('Construccion', 'Fase de construccion activa del proyecto urbanistico.', 3, FALSE),
('Entrega', 'Etapa final de entrega de lotes y escrituracion.', 4, FALSE);

-- Lotes de ejemplo
INSERT INTO lotes (codigo, area_m2, ubicacion, valor, estado, etapa_id, descripcion) VALUES
('L-001', 120.00, 'Manzana A, Lote 1 - Esquinero', 85000000.00, 'disponible', 1, 'Lote esquinero con vista al parque principal. Excelente ubicacion y ventilacion.'),
('L-002', 100.00, 'Manzana A, Lote 2', 72000000.00, 'disponible', 1, 'Lote intermedio con acceso directo a via principal.'),
('L-003', 150.00, 'Manzana A, Lote 3 - Esquinero', 98000000.00, 'reservado', 1, 'Amplio lote esquinero ideal para casa de dos pisos.'),
('L-004', 110.00, 'Manzana B, Lote 1', 76000000.00, 'disponible', 2, 'Lote con excelente orientacion solar y cercania a zona verde.'),
('L-005', 130.00, 'Manzana B, Lote 2', 89000000.00, 'disponible', 2, 'Lote amplio con posibilidad de ampliacion futura.'),
('L-006', 200.00, 'Manzana B, Lote 3 - Premium', 135000000.00, 'disponible', 2, 'Lote premium de gran tamanio con vista panoramica.'),
('L-007', 95.00, 'Manzana C, Lote 1', 65000000.00, 'vendido', 1, 'Lote compacto ideal para vivienda unifamiliar.'),
('L-008', 140.00, 'Manzana C, Lote 2', 92000000.00, 'disponible', 3, 'Lote con frente amplio y acceso a zona comunal.'),
('L-009', 160.00, 'Manzana C, Lote 3 - Esquinero', 108000000.00, 'disponible', 3, 'Lote esquinero premium en zona tranquila.'),
('L-010', 180.00, 'Manzana D, Lote 1 - Premium', 125000000.00, 'disponible', 4, 'Lote de gran tamanio con todos los servicios incluidos.');

-- Admin user (password: Admin123!)
-- bcrypt hash for "Admin123!"
INSERT INTO usuarios (nombre, apellido, email, telefono, password_hash, rol, verificado) VALUES
('Admin', 'Sistema', 'admin@inmobiliaria.com', '3001234567', '$2a$10$rQZJxPMfVt0wH8FkYd8GqeYjKjGkZ8RnH5MQoHF0VQxX5v0kz3K2y', 'admin', TRUE);

-- Planos de vivienda
INSERT INTO planos (nombre, descripcion, imagen_url) VALUES
('Casa Tipo A - Clasica', 'Vivienda de un piso, 3 habitaciones, 2 banos, sala-comedor, cocina integral, patio trasero. Area: 85m2.', NULL),
('Casa Tipo B - Moderna', 'Vivienda de dos pisos, 4 habitaciones, 3 banos, estudio, sala-comedor amplia, cocina integral, garaje. Area: 120m2.', NULL),
('Casa Tipo C - Premium', 'Vivienda de dos pisos con terraza, 4 habitaciones, 3 banos, estudio, sala-comedor, cocina integral, garaje doble, zona BBQ. Area: 160m2.', NULL);
