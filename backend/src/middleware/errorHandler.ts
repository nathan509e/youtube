import { Request, Response, NextFunction } from 'express';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error('[Error Middleware]:', err?.message || err);

  const status = err.status || 500;
  const message = err.userMessage || 'Algo deu errado. Tente novamente em alguns instantes.';

  res.status(status).json({
    success: false,
    error: message,
  });
}
