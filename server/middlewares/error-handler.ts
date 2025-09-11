import { Request, Response, NextFunction } from 'express';
import { formatError } from '../utils/async-handler';

/**
 * Centralized error handling middleware
 * Eliminates repetitive try/catch error handling across routes
 */
export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const formattedError = formatError(error, `${req.method} ${req.path}`);
  
  // Log error for monitoring
  console.error(`🚨 [${new Date().toISOString()}] ${req.method} ${req.path}:`, {
    error: error.message,
    stack: error.stack,
    body: req.body,
    query: req.query,
    params: req.params,
    userId: req.userId
  });

  res.status(formattedError.status).json({
    message: formattedError.message,
    error: formattedError.error,
    ...(formattedError.details && { details: formattedError.details }),
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method
  });
};

/**
 * 404 handler for unmatched routes
 */
export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    message: `Route ${req.method} ${req.path} not found`,
    error: 'not_found',
    timestamp: new Date().toISOString(),
    availableEndpoints: [
      'GET /api/customers',
      'GET /api/products', 
      'GET /api/orders',
      'GET /api/shipments',
      'GET /api/commissions',
      'GET /api/integrations',
      'POST /api/gestline/*'
    ]
  });
};