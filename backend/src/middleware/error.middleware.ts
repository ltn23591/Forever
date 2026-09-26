import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { ResponseHelper } from '../utils/ResponseHelper';

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('[Error Middleware]:', err);

  if (err instanceof AppError) {
    res.status(err.statusCode).json(ResponseHelper.fromAppError(err));
    return;
  }

  res.status(500).json(ResponseHelper.error(err.message || 'Internal server error', 'INTERNAL_ERROR', 500));
};
