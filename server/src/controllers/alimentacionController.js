const pool = require('../db/pool');

const getAlimentacion = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT id, tipo, cantidad, TO_CHAR(fecha, 'YYYY-MM-DD') AS fecha FROM alimentacion WHERE animal_id = $1 ORDER BY fecha DESC", [id]);
    res.json(result.rows);
  } catch (error) { res.status(500).json({ error: 'Error al obtener alimentación' }); }
};

const createAlimentacion = async (req, res) => {
  const { id } = req.params;
  const { tipo, cantidad, fecha } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO alimentacion (animal_id, tipo, cantidad, fecha) VALUES ($1, $2, $3, $4) RETURNING id',
      [id, tipo, cantidad, fecha || new Date()]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) { 
    console.error(error);
    res.status(500).json({ error: 'Error al registrar alimentación' }); 
  }
};

module.exports = { getAlimentacion, createAlimentacion };