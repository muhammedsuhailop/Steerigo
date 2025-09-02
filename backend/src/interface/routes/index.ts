import { Router } from 'express';
import { authRoutes } from './authRoutes';

const router = Router();

// Mount auth routes
router.use('/auth', authRoutes);

// Test Server endpoint
router.get('/test', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is stable',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
    });
});

export { router as apiRoutes };
