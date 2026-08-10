import { Router } from 'express';
import { getVideoInfo, processDownload } from '../controllers/video.controller.js';
import { apiRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// POST /api/info
router.post('/info', apiRateLimiter, getVideoInfo);

// POST /api/download and GET /api/download
router.post('/download', apiRateLimiter, processDownload);
router.get('/download', apiRateLimiter, processDownload);

export default router;
