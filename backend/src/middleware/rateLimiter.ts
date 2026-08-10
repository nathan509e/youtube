import rateLimit from 'express-rate-limit';
import { ENV } from '../config/env.js';

export const apiRateLimiter = rateLimit({
  windowMs: ENV.RATE_LIMIT_WINDOW_MS, // e.g. 1 minute (60000ms)
  max: ENV.RATE_LIMIT_MAX, // e.g. 10 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Muitas solicitações recebidas. Aguarde um momento antes de tentar novamente.',
  },
});
