import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../errors/httpErrors';

export function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json({ error: 'Маршрут не найден' });
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof HttpError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  const message = err instanceof Error ? err.message : String(err);
  console.error('Необработанная ошибка:', message);
  res.status(500).json({ error: 'Внутренняя ошибка сервера' });
}
