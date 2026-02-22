-- Sistema Inmobiliario - Database Schema

CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  telefono VARCHAR(20),
  password_hash VARCHAR(255) NOT NULL,
  rol VARCHAR(20) NOT NULL DEFAULT 'cliente' CHECK (rol IN ('admin', 'cliente')),
  verificado BOOLEAN DEFAULT FALSE,
  token_recuperacion VARCHAR(255),
  token_recuperacion_expira TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS etapas (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  orden INT NOT NULL DEFAULT 0,
  activa BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS lotes (
  id SERIAL PRIMARY KEY,
  codigo VARCHAR(20) UNIQUE NOT NULL,
  area_m2 DECIMAL(10,2) NOT NULL,
  ubicacion VARCHAR(255),
  valor DECIMAL(15,2) NOT NULL,
  estado VARCHAR(20) NOT NULL DEFAULT 'disponible' CHECK (estado IN ('disponible', 'reservado', 'vendido')),
  etapa_id INT REFERENCES etapas(id) ON DELETE SET NULL,
  descripcion TEXT,
  imagen_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS compras (
  id SERIAL PRIMARY KEY,
  cliente_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  lote_id INT NOT NULL REFERENCES lotes(id) ON DELETE CASCADE,
  valor_total DECIMAL(15,2) NOT NULL,
  cuota_inicial DECIMAL(15,2) NOT NULL DEFAULT 0,
  num_cuotas INT NOT NULL DEFAULT 1,
  valor_cuota DECIMAL(15,2) NOT NULL DEFAULT 0,
  saldo_pendiente DECIMAL(15,2) NOT NULL,
  fecha_compra DATE NOT NULL DEFAULT CURRENT_DATE,
  estado VARCHAR(20) NOT NULL DEFAULT 'activa' CHECK (estado IN ('activa', 'completada', 'cancelada')),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pagos (
  id SERIAL PRIMARY KEY,
  compra_id INT NOT NULL REFERENCES compras(id) ON DELETE CASCADE,
  monto DECIMAL(15,2) NOT NULL,
  fecha_pago DATE NOT NULL DEFAULT CURRENT_DATE,
  metodo_pago VARCHAR(50) NOT NULL DEFAULT 'transferencia',
  referencia VARCHAR(100),
  comprobante_url VARCHAR(500),
  estado VARCHAR(20) NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'aprobado', 'rechazado')),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pqrs (
  id SERIAL PRIMARY KEY,
  cliente_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('peticion', 'queja', 'reclamo', 'sugerencia')),
  asunto VARCHAR(255) NOT NULL,
  descripcion TEXT NOT NULL,
  estado VARCHAR(20) NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'en_proceso', 'resuelto', 'cerrado')),
  respuesta TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS planos (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  imagen_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW()
);
