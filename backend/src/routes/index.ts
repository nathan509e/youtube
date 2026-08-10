import { Router } from 'express';
import apiRoutes from './api.routes.js';

const router = Router();

// Health Check
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
router.use('/api', apiRoutes);

export default router;
