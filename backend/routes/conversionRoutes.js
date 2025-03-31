const express = require('express');
const multer = require('multer');
const fs = require('fs');
const pdf = require('pdf-parse');
const Conversion = require('../models/Conversion');
const jwt = require('jsonwebtoken');
require("dotenv").config();

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) return res.status(401).send('Access denied');

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = verified.userId;
        next();
    } catch (error) {
        res.status(400).send('Invalid token');
    }
};

// Upload and Convert PDF
router.post('/upload', verifyToken, upload.single('file'), async (req, res) => {
    const pdfBuffer = fs.readFileSync(req.file.path);

    try {
        const data = await pdf(pdfBuffer);
        const xml = `<document>\n  <content>\n    ${data.text.replace(/\n/g, '\n    ')}\n  </content>\n</document>`;

        const conversion = new Conversion({
            userId: req.userId,
            pdfFilename: req.file.originalname,
            xmlContent: xml
        });

        await conversion.save();

        res.json({ xml });
    } catch (error) {
        res.status(500).send('Failed to convert PDF');
    } finally {
        fs.unlinkSync(req.file.path);  // Clean up the uploaded PDF
    }
});

// Get Conversion History
router.get('/history', verifyToken, async (req, res) => {
    try {
        const conversions = await Conversion.find({ userId: req.userId })
                                            .sort({ createdAt: -1 });
        res.json(conversions);
    } catch (error) {
        res.status(500).send('Failed to fetch history');
    }
});

module.exports = router;
