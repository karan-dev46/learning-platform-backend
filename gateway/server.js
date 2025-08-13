require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(helmet());
app.use(morgan('dev'));

const swaggerDocument = YAML.load(path.join(__dirname, 'swagger.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
  res.json({ message: 'API Gateway Running 🚀', docs: '/api-docs' });
});

app.use(
  '/auth',
  createProxyMiddleware({
    target: process.env.AUTH_SERVICE_URL || 'http://localhost:5001',
    changeOrigin: true,
    pathRewrite: { '^/auth': '/api/auth' },
    onProxyReq: (proxyReq, req, res) => {
      console.log("➡ Incoming:", req.originalUrl);

      if (req.body && Object.keys(req.body).length) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
    }
  })
);



app.use(
  '/courses',
  createProxyMiddleware({
    target: process.env.COURSE_SERVICE_URL || 'http://localhost:5002',
    changeOrigin: true,
    pathRewrite: { '^/courses': '/' },
    onProxyReq: (proxyReq, req, res) => {
      console.log("➡ Incoming:", req.originalUrl);

      if (req.body && Object.keys(req.body).length) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
    }
  })
);

app.use(
  '/categories',
  createProxyMiddleware({
    target: process.env.CATEGORY_SERVICE_URL || 'http://localhost:5003',
    changeOrigin: true,
    pathRewrite: { '^/categories': '/' },
    onProxyReq: (proxyReq, req, res) => {
      console.log("➡ Incoming:", req.originalUrl);

      if (req.body && Object.keys(req.body).length) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
    }
  })
);

app.use(
  '/students',
  createProxyMiddleware({
    target: process.env.STUDENT_SERVICE_URL || 'http://localhost:5004',
    changeOrigin: true,
    pathRewrite: { '^/students': '' },
    onProxyReq: (proxyReq, req, res) => {
      console.log("➡ Incoming:", req.originalUrl);

      if (req.body && Object.keys(req.body).length) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
    }
  })
);

app.use(
  '/faculties',
  createProxyMiddleware({
    target: process.env.FACULTY_SERVICE_URL || 'http://localhost:5005',
    changeOrigin: true,
    pathRewrite: {
      '^/faculties': '/api'
    }
  })
);

app.get('/health', async (_req, res) => {
  res.json({
    gateway: 'ok',
    services: {
      auth: process.env.AUTH_SERVICE_URL || 'http://localhost:5001',
      courses: process.env.COURSE_SERVICE_URL || 'http://localhost:5002',
      categories: process.env.CATEGORY_SERVICE_URL || 'http://localhost:5003',
      students: process.env.STUDENT_SERVICE_URL || 'http://localhost:5004'
    }
  });
});

const PORT = process.env.GATEWAY_PORT || 5000;
app.listen(PORT, () => console.log(`🚀 API Gateway running on port ${PORT}`));
