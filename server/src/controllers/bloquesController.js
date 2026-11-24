const pool = require('../db/pool');

const getBloques = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM bloques WHERE usuario_id = $1 ORDER BY created_at DESC', [req.usuario.id]);
    res.json(result.rows);
  } catch (error) { res.status(500).json({ error: 'Error al obtener bloques' }); }
};

const createBloque = async (req, res) => {
  const { nombre, descripcion, raza } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO bloques (nombre, descripcion, raza, usuario_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [nombre, descripcion, raza, req.usuario.id]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) { res.status(500).json({ error: 'Error al crear bloque' }); }
};

const updateBloque = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, raza } = req.body;
  try {
    const result = await pool.query(
      'UPDATE bloques SET nombre = $1, descripcion = $2, raza = $3 WHERE id = $4 AND usuario_id = $5 RETURNING *',
      [nombre, descripcion, raza, id, req.usuario.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Bloque no encontrado o no autorizado' });
    res.json(result.rows[0]);
  } catch (error) { res.status(500).json({ error: 'Error al actualizar bloque' }); }
};

const deleteBloque = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM bloques WHERE id = $1 AND usuario_id = $2 RETURNING *', [id, req.usuario.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Bloque no encontrado o no autorizado' });
    res.json({ mensaje: 'Bloque eliminado' });
  } catch (error) {
    if (error.code === '23503') return res.status(400).json({ error: 'No se puede eliminar: el bloque tiene animales.' });
    res.status(500).json({ error: 'Error al eliminar bloque' });
  }
};

module.exports = { getBloques, createBloque, updateBloque, deleteBloque };