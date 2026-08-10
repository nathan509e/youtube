import app from './app.js';
import { ENV } from './config/env.js';

const PORT = ENV.PORT;

app.listen(PORT, () => {
  console.log(`🚀 VideoDrop Backend API live at http://localhost:${PORT}`);
  console.log(`🔒 Allowed Frontend URL: ${ENV.FRONTEND_URL}`);
  console.log(`⏱️ Rate Limit: ${ENV.RATE_LIMIT_MAX} req / ${ENV.RATE_LIMIT_WINDOW_MS / 1000}s`);
  console.log(`⚡ Max Concurrent Downloads: ${ENV.MAX_CONCURRENT_DOWNLOADS}`);
});
