// src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import ApiError from '../utils/ApiError';


const ErrorHandler = (err: ApiError, req: Request, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode || 500;

  res.status(err.statusCode).json({
    message: err.message,
    success : err.success,
  });
};

export default ErrorHandler;
