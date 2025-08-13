require('dotenv').config();
const express = require('express');
const connectDB = require('../../config/db');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');

const authRoutes = require('./routes/auth.routes');

const app = express();
connectDB();

app.use(cors({ origin: '*' }));

// app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json());
app.use(morgan('dev'));
app.use(helmet());
app.use('/', authRoutes);
console.log("Test====================>")

const PORT = process.env.AUTH_PORT || 5001;
app.listen(PORT, () => console.log(`Auth Service running on port ${PORT}`));
