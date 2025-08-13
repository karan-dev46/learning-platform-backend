require('dotenv').config();
const express = require('express');
const connectDB = require('../../config/db');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');

const studentRoutes = require('./routes/student.routes');

const app = express();
connectDB();

app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());
app.use(morgan('dev'));
app.use(helmet());

// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'student-service' }));

// Routes
app.use('/', studentRoutes);

const PORT = process.env.STUDENT_PORT || 5004;
app.listen(PORT, () => console.log(`Student Service running on port ${PORT}`));
