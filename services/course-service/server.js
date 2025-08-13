require('dotenv').config();
const express = require('express');
const connectDB = require('../../config/db');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');

const courseRoutes = require('./routes/course.routes');

const app = express();
connectDB();

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(morgan('dev'));
app.use(helmet());

// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'course-service' }));

// Routes
app.use('/', courseRoutes);

const PORT = process.env.COURSE_PORT || 5002;
app.listen(PORT, () => console.log(`Course Service running on port ${PORT}`));
