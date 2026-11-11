const pool = require('../db/pool');

const getAnimales = async (req, res) => {
  const { bloque_id } = req.query;
  try {
    const result = await pool.query(
      "SELECT id, codigo, bloque_id, edad_estimada, peso_actual, estado, notas, TO_CHAR(created_at, 'YYYY-MM-DD') AS created_at FROM animales WHERE bloque_id = $1 ORDER BY created_at DESC",
      [bloque_id]
    );
    
    const animalesFormateados = result.rows.map(a => ({
      id: a.id,
      codigo: a.codigo,
      bloqueId: a.bloque_id,
      edadEstimada: a.edad_estimada,
      pesoActual: Number(a.peso_actual),
      estado: a.estado,
      notas: a.notas,
      historialPesos: [{ fecha: a.created_at, peso: Number(a.peso_actual) }],
      vacunas: [],
      alimentacion: []
    }));
    
    res.json(animalesFormateados);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener animales' });
  }
};

// ... (El resto de funciones createAnimal, updateAnimal y deleteAnimal se quedan igual)
const createAnimal = async (req, res) => {
  const { bloqueId, codigo, edadEstimada, pesoActual, estado, notas } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO animales (bloque_id, codigo, edad_estimada, peso_actual, estado, notas) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, TO_CHAR(created_at, 'YYYY-MM-DD') as fecha_creacion`,
      [bloqueId, codigo, edadEstimada, pesoActual, estado, notas]
    );
    const a = result.rows[0];
    res.status(201).json({
      id: a.id,
      codigo,
      bloqueId,
      edadEstimada,
      pesoActual: Number(pesoActual),
      estado,
      notas,
      historialPesos: [{ fecha: a.fecha_creacion, peso: Number(pesoActual) }],
      vacunas: [],
      alimentacion: []
    });
  } catch (error) {
    if (error.code === '23505') return res.status(400).json({ error: 'El código ya existe en este bloque.' });
    res.status(500).json({ error: 'Error al crear animal' });
  }
};

const updateAnimal = async (req, res) => {
  const { id } = req.params;
  const { codigo, edadEstimada, pesoActual, estado, notas, bloqueId } = req.body;
  try {
    const result = await pool.query(
      `UPDATE animales SET codigo = $1, edad_estimada = $2, peso_actual = $3, estado = $4, notas = $5, bloque_id = $6 WHERE id = $7 RETURNING *`,
      [codigo, edadEstimada, pesoActual, estado, notas, bloqueId, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Animal no encontrado' });
    res.json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') return res.status(400).json({ error: 'El código ya existe en el bloque destino.' });
    res.status(500).json({ error: 'Error al actualizar animal' });
  }
};

const deleteAnimal = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM animales WHERE id = $1', [id]);
    res.json({ mensaje: 'Animal eliminado' });
  } catch (error) { res.status(500).json({ error: 'Error al eliminar animal' }); }
};

module.exports = { getAnimales, createAnimal, updateAnimal, deleteAnimal };