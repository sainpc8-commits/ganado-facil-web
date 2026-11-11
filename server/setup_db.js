const pool = require('./src/db/pool');

const sql = `
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  rol VARCHAR(20) NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bloques (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  raza VARCHAR(80) DEFAULT 'Brahman',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS animales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bloque_id UUID NOT NULL REFERENCES bloques(id) ON DELETE RESTRICT,
  codigo VARCHAR(50) NOT NULL,
  raza VARCHAR(80),
  sexo VARCHAR(10),
  edad_estimada VARCHAR(50),
  peso_actual NUMERIC(8,2),
  estado VARCHAR(20) DEFAULT 'activo',
  notas TEXT, -- <-- ¡ESTA ES LA COLUMNA QUE FALTABA!
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(bloque_id, codigo)
);

-- Por si la tabla ya existía sin la columna
ALTER TABLE animales ADD COLUMN IF NOT EXISTS notas TEXT;
ALTER TABLE bloques ADD COLUMN IF NOT EXISTS raza VARCHAR(80) DEFAULT 'Brahman';
`;

async function crearTablas() {
  try {
    console.log('Conectando a Neon y actualizando tablas...');
    await pool.query(sql);
    console.log('✅ ¡Tablas actualizadas exitosamente en la nube!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error actualizando tablas:', error);
    process.exit(1);
  }
}

crearTablas();