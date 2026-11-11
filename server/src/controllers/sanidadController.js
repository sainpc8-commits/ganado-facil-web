const pool = require('../db/pool');

const getSanidad = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT id, producto, TO_CHAR(fecha_aplicacion, 'YYYY-MM-DD') AS fecha_aplicacion, notas FROM sanidad WHERE animal_id = $1 ORDER BY fecha_aplicacion DESC", [id]);
    res.json(result.rows);
  } catch (error) { res.status(500).json({ error: 'Error al obtener sanidad' }); }
};

const createSanidad = async (req, res) => {
  const { id } = req.params;
  const { tipo, producto, fecha_aplicacion, proxima_dosis } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO sanidad (animal_id, tipo, producto, fecha_aplicacion, proxima_dosis) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [id, tipo, producto, fecha_aplicacion, proxima_dosis]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) { 
    console.error(error);
    res.status(500).json({ error: 'Error al registrar sanidad' }); 
  }
};

const deleteSanidad = async (req, res) => {
  const { id, sanidadId } = req.params;
  try {
    await pool.query('DELETE FROM sanidad WHERE id = $1 AND animal_id = $2', [sanidadId, id]);
    res.json({ mensaje: 'Registro eliminado' });
  } catch (error) { res.status(500).json({ error: 'Error al eliminar' }); }
};

module.exports = { getSanidad, createSanidad, deleteSanidad };