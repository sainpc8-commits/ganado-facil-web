const pool = require('../db/pool');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- REGISTRO DE NUEVOS USUARIOS ---
const register = async (req, res) => {
  const { username, password } = req.body;

  try {
    // 1. Verificar si el usuario ya existe
    const userExists = await pool.query('SELECT * FROM usuarios WHERE username = $1', [username]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'El nombre de usuario ya está en uso' });
    }

    // 2. Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // 3. Guardar en la base de datos
    const newUser = await pool.query(
      'INSERT INTO usuarios (username, password_hash, rol) VALUES ($1, $2, $3) RETURNING id, username, rol',
      [username, hash, 'operador'] // Por defecto, los nuevos son 'operador'
    );

    res.status(201).json({ 
      mensaje: 'Usuario registrado exitosamente',
      user: newUser.rows[0] 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en el servidor al registrar' });
  }
};

// --- LOGIN ---
const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE username = $1', [username]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }

    const user = result.rows[0];

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      mensaje: 'Login exitoso',
      token,
      user: { id: user.id, username: user.username, rol: user.rol }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

module.exports = { login, register };