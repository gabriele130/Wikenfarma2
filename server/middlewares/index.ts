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