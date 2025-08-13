require('dotenv').config();
const express = require('express');
const connectDB = require('../../config/db');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');

const categoryRoutes = require('./routes/category.routes');

const app = express();
connectDB();

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(morgan('dev'));
app.use(helmet());

// Health Check
app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'category-service' }));

// Routes
app.use('/', categoryRoutes);

const PORT = process.env.CATEGORY_PORT || 5003;
app.listen(PORT, () => console.log(`Category Service running on port ${PORT}`));
3