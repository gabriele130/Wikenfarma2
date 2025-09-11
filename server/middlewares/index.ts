/**
 * Middlewares barrel export
 * Authentication, logging, error handling
 */

// Re-export auth middlewares
export { 
  setupCustomAuth, 
  authenticateToken, 
  requireRole, 
  requireUserType 
} from './auth';

// DRY middleware utilities
export { validate, validateQuery, validateParams } from './validation';
export { normalizeUser, logActivity } from './user-context';