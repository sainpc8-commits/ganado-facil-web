const express = require('express');
const router = express.Router();
const { getAnimales, createAnimal, updateAnimal, deleteAnimal } = require('../controllers/animalesController');
const { getPesos, createPeso } = require('../controllers/pesosController');
const { getSanidad, createSanidad, deleteSanidad } = require('../controllers/sanidadController');
const { getAlimentacion, createAlimentacion } = require('../controllers/alimentacionController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/', verifyToken, getAnimales);
router.post('/', verifyToken, createAnimal);
router.put('/:id', verifyToken, updateAnimal);
router.delete('/:id', verifyToken, deleteAnimal);

router.get('/:id/pesos', verifyToken, getPesos);
router.post('/:id/pesos', verifyToken, createPeso);

router.get('/:id/sanidad', verifyToken, getSanidad);
router.post('/:id/sanidad', verifyToken, createSanidad);
router.delete('/:id/sanidad/:sanidadId', verifyToken, deleteSanidad);

router.get('/:id/alimentacion', verifyToken, getAlimentacion);
router.post('/:id/alimentacion', verifyToken, createAlimentacion);

module.exports = router;