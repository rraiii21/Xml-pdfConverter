const express = require('express');
const multer = require('multer');
const { convertPdfToXml } = require('../controllers/conversionController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', verifyToken, upload.single('file'), convertPdfToXml);

module.exports = router;
