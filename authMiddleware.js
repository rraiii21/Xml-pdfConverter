const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; // Extract Bearer Token

    if (!token) {
        return res.status(401).json({ message: 'Access Denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid Token' });
    }
};
