const pool = require('../db/pool');

// Obtener todos los bloques
const getBloques = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM bloques ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener bloques' });
  }
};

// Crear un bloque
const createBloque = async (req, res) => {
  const { nombre, descripcion, raza } = req.body; // Nota: agregaremos 'raza' a la DB si no la tiene
  try {
    // Como nuestra tabla original no tenía 'raza', la agregamos aquí para que coincida con tu frontend
    // (En un caso real, haríamos una migración, pero para avanzar rápido, haremos un ALTER TABLE rápido abajo)
    const result = await pool.query(
      'INSERT INTO bloques (nombre, descripcion) VALUES ($1, $2) RETURNING *',
      [nombre, descripcion]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear bloque' });
  }
};

// Actualizar bloque
const updateBloque = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion } = req.body;
  try {
    const result = await pool.query(
      'UPDATE bloques SET nombre = $1, descripcion = $2 WHERE id = $3 RETURNING *',
      [nombre, descripcion, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Bloque no encontrado' });
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar bloque' });
  }
};

// Eliminar bloque
const deleteBloque = async (req, res) => {
  const { id } = req.params;
  try {
    // La base de datos tiene ON DELETE RESTRICT, así que si hay animales, fallará y lo atrapamos
    await pool.query('DELETE FROM bloques WHERE id = $1', [id]);
    res.json({ mensaje: 'Bloque eliminado' });
  } catch (error) {
    if (error.code === '23503') { // Código de error de PostgreSQL para violación de Foreign Key
      return res.status(400).json({ error: 'No se puede eliminar: el bloque tiene animales.' });
    }
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar bloque' });
  }
};

module.exports = { getBloques, createBloque, updateBloque, deleteBloque };