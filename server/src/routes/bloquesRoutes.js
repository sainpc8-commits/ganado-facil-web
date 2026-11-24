const express = require('express');
const router = express.Router();
const { getBloques, createBloque, updateBloque, deleteBloque } = require('../controllers/bloquesController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/', verifyToken, getBloques);
router.post('/', verifyToken, createBloque);
router.put('/:id', verifyToken, updateBloque);
router.delete('/:id', verifyToken, deleteBloque);

module.exports = router;