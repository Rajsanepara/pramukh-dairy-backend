import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import 'express-async-errors';

import authRoutes from './routes/authRoutes.js';
import clientRoutes from './routes/clientRoutes.js';
import milkRoutes from './routes/milkRoutes.js';
import billingRoutes from './routes/billingRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';

import { notFound, errorHandler } from './middleware/errorMiddleware.js';

const app = express();

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not set in environment variables');
  process.exit(1);
}

// Middleware
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true
  })
);
app.use(express.json());
app.use(morgan('dev'));

// Health check
app.get("/", (req, res) => {
  res.send("Pramukh Dairy Backend Running");
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Pramukh Dairy API running' });
});


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/milk', milkRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/analytics', analyticsRoutes);

// Error handlers
app.use(notFound);
app.use(errorHandler);

// Start server
const start = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('Error starting server', err);
    process.exit(1);
  }
};

start();