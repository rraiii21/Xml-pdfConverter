const Conversion = require('../models/Conversion');

exports.getConversionHistory = async (req, res) => {
    try {
        const history = await Conversion.find({ userId: req.userId }).sort({ createdAt: -1 });

        res.json(history);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching history' });
    }
};
