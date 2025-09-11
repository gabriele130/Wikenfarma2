import { Request, Response, NextFunction } from 'express';

/**
 * Async error handler wrapper - eliminates try/catch boilerplate
 * Wraps async route handlers to automatically catch and forward errors
 */
export const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Standardized error response formatter
 */
export const formatError = (error: any, context?: string) => {
  console.error(`❌ [ERROR] ${context || 'Unknown'}:`, error);
  
  // GestLine API errors
  if (error.message?.includes('GestLine') || error.message?.includes('XML')) {
    return {
      status: 502,
      message: 'External service unavailable',
      error: 'gestline_error',
      details: error.message
    };
  }
  
  // Validation errors
  if (error.name === 'ZodError' || error.issues) {
    return {
      status: 400,
      message: 'Validation failed',
      error: 'validation_error',
      details: error.issues || error.errors
    };
  }
  
  // Database errors
  if (error.code === '23505') { // Unique constraint violation
    return {
      status: 409,
      message: 'Resource already exists',
      error: 'duplicate_error'
    };
  }
  
  // Default server error
  return {
    status: 500,
    message: error.message || 'Internal server error',
    error: 'server_error'
  };
};

export default asyncHandler;