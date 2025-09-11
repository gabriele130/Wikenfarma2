import { Request, Response, NextFunction } from 'express';
import type { User } from '@shared/schema';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userRole?: string;
      userType?: string;
    }
  }
}

/**
 * Normalizes user context from JWT token
 * Eliminates inconsistent req.user access patterns
 */
export const normalizeUser = (req: Request, res: Response, next: NextFunction) => {
  if (req.user) {
    const user = req.user as any;
    
    // Standardize user ID extraction
    req.userId = user.id || user.claims?.sub || user.sub;
    req.userRole = user.role || user.claims?.role;
    req.userType = user.userType || user.claims?.userType;
    
    // Ensure we have a valid user ID
    if (!req.userId) {
      return res.status(401).json({
        message: 'Invalid user context',
        error: 'user_context_error'
      });
    }
  }
  
  next();
};

/**
 * Activity logging helper - DRY pattern for audit trails
 */
export const logActivity = async (
  req: Request,
  action: string,
  entityType: string,
  entityId?: string,
  description?: string
) => {
  try {
    if (!req.userId) return;
    
    const { storage } = await import('../storage');
    
    await storage.createActivityLog({
      userId: req.userId,
      action,
      entityType,
      entityId: entityId || null,
      description: description || `${action} ${entityType}`,
      metadata: {
        userAgent: req.get('User-Agent'),
        ip: req.ip,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    // Log but don't fail the request for activity logging errors
    console.warn('⚠️ Failed to log activity:', error);
  }
};