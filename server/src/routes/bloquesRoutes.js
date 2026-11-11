const express = require('express');
const router = express.Router();
const { getBloques, createBloque, updateBloque, deleteBloque } = require('../controllers/bloquesController');

router.get('/', getBloques);
router.post('/', createBloque);
router.put('/:id', updateBloque);
router.delete('/:id', deleteBloque);

module.exports = router;