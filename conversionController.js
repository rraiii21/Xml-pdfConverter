const fs = require("fs");
const pdf = require("pdf-parse");
const Conversion = require("../models/Conversion");

// ✅ Convert PDF to XML and Save to Database
exports.convertPdfToXml = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    try {
        // Read PDF content
        const pdfBuffer = fs.readFileSync(req.file.path);
        const data = await pdf(pdfBuffer);

        // Convert text content to XML format
        const xml = `<document>\n  <content>\n    ${data.text.replace(/\n/g, '\n    ')}\n  </content>\n</document>`;

        // Save conversion to the database
        const conversion = new Conversion({
            userId: req.userId,  // Retrieved from verifyToken middleware
            pdfFilename: req.file.originalname,
            xmlContent: xml,
        });

        await conversion.save();

        // Return converted XML
        res.json({ xml });

    } catch (error) {
        console.error("Conversion error:", error);
        res.status(500).json({ error: "Failed to convert PDF" });

    } finally {
        fs.unlinkSync(req.file.path); // Delete uploaded PDF after conversion
    }
};

