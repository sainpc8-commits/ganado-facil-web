const express = require('express');
const router = express.Router();
const { getAnimales, createAnimal, updateAnimal, deleteAnimal } = require('../controllers/animalesController');
const { getPesos, createPeso } = require('../controllers/pesosController');
const { getSanidad, createSanidad, deleteSanidad } = require('../controllers/sanidadController');
const { getAlimentacion, createAlimentacion } = require('../controllers/alimentacionController');

// Rutas de animales
router.get('/', getAnimales);
router.post('/', createAnimal);
router.put('/:id', updateAnimal);
router.delete('/:id', deleteAnimal);

// Rutas de sub-recursos (Pesos, Sanidad, Alimentación)
router.get('/:id/pesos', getPesos);
router.post('/:id/pesos', createPeso);

router.get('/:id/sanidad', getSanidad);
router.post('/:id/sanidad', createSanidad);
router.delete('/:id/sanidad/:sanidadId', deleteSanidad);

router.get('/:id/alimentacion', getAlimentacion);
router.post('/:id/alimentacion', createAlimentacion);

module.exports = router;