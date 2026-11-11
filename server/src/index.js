const express = require('express');
const cors = require('cors');
const pool = require('./db/pool');
require('dotenv').config();

// 1. IMPORTAR LAS RUTAS
const authRoutes = require('./routes/authRoutes');
const bloquesRoutes = require('./routes/bloquesRoutes');
const animalesRoutes = require('./routes/animalesRoutes'); // <-- NUEVA RUTA DE ANIMALES

const app = express();
app.use(cors());
app.use(express.json());

// 2. CONECTAR LAS RUTAS
app.use('/api/auth', authRoutes);
app.use('/api/bloques', bloquesRoutes);
app.use('/api/animales', animalesRoutes); // <-- NUEVA CONEXIÓN

// Ruta para probar la conexión a la base de datos
app.get('/api/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ mensaje: '¡Conexión a Neon exitosa! 🐂', hora: result.rows[0].now });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error conectando a la base de datos' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
