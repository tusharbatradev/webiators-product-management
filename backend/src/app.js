const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'https://webiators-product-management.netlify.app',
  ...(process.env.CLIENT_URL ? [process.env.CLIENT_URL] : []),
];

app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
