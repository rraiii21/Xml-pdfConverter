require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const conversionRoutes = require('./routes/conversionRoutes');
const historyRoutes = require('./routes/historyRoutes');

const app = express();
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error(err));

app.use('/api/auth', authRoutes);
app.use('/api/conversion', conversionRoutes);
app.use('/api/history', historyRoutes);

app.listen(5000, () => console.log('Server running on port 5000'));
