const pool = require('../db/pool');

const getPesos = async (req, res) => {
  const { id } = req.params;
  try {
    // Usamos TO_CHAR para que Postgres devuelva un String en vez de un objeto Date
    const result = await pool.query("SELECT id, peso, TO_CHAR(fecha, 'YYYY-MM-DD') AS fecha FROM pesos WHERE animal_id = $1 ORDER BY fecha DESC", [id]);
    res.json(result.rows);
  } catch (error) { res.status(500).json({ error: 'Error al obtener pesos' }); }
};

const createPeso = async (req, res) => {
  const { id } = req.params;
  const { peso, fecha } = req.body;
  try {
    await pool.query(
      'INSERT INTO pesos (animal_id, peso, fecha) VALUES ($1, $2, $3)',
      [id, peso, fecha || new Date()]
    );
    await pool.query('UPDATE animales SET peso_actual = $1 WHERE id = $2', [peso, id]);
    res.status(201).json({ mensaje: 'Peso registrado', peso });
  } catch (error) { 
    console.error(error);
    res.status(500).json({ error: 'Error al registrar peso' }); 
  }
};

module.exports = { getPesos, createPeso };