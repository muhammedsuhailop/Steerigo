import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// import authRoutes from './interface/routes/authRoutes.js';
// import otpRoutes from './interface/routes/otpRoutes.js';

import authRoutes from './interface/routes/authRoutes.ts';
import otpRoutes from './interface/routes/otpRoutes.ts';

dotenv.config();
const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI as string)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Mount routes
app.use('/api/auth', authRoutes);   // /api/auth/signup, /api/auth/login
app.use('/api/auth', otpRoutes);    // /api/auth/send-otp

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
