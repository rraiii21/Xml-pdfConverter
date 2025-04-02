const express = require('express');
const { getConversionHistory } = require('../controllers/historyController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();
router.get('/history', verifyToken, getConversionHistory);

module.exports = router;
