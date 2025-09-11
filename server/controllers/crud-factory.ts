import { Request, Response } from 'express';
import { ZodSchema } from 'zod';
import { asyncHandler } from '../utils/async-handler';
import { logActivity } from '../middlewares/user-context';

/**
 * Generic CRUD Controller Factory
 * Eliminates repetitive CRUD pattern across resources
 */

interface CrudOptions {
  entityName: string;
  storage: {
    getAll: (page?: number, limit?: number, search?: string) => Promise<{ data: any[]; total: number }>;
    getById: (id: string) => Promise<any | undefined>;
    create: (data: any) => Promise<any>;
    update: (id: string, data: any) => Promise<any>;
    delete: (id: string) => Promise<void>;
  };
  insertSchema: ZodSchema;
  updateSchema: ZodSchema;
  listParams?: {
    defaultLimit?: number;
    maxLimit?: number;
    searchFields?: string[];
  };
}

export function createCrudController(options: CrudOptions) {
  const { entityName, storage, insertSchema, updateSchema, listParams = {} } = options;
  const { defaultLimit = 10, maxLimit = 100 } = listParams;

  return {
    // GET /api/{resource} - List with pagination and search
    list: asyncHandler(async (req: Request, res: Response) => {
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.min(maxLimit, parseInt(req.query.limit as string) || defaultLimit);
      const search = req.query.search as string;

      const result = await storage.getAll(page, limit, search);
      
      res.json({
        data: result.data,
        pagination: {
          page,
          limit,
          total: result.total,
          pages: Math.ceil(result.total / limit)
        }
      });
    }),

    // GET /api/{resource}/:id - Get single resource
    get: asyncHandler(async (req: Request, res: Response) => {
      const { id } = req.params;
      const item = await storage.getById(id);
      
      if (!item) {
        return res.status(404).json({
          message: `${entityName} not found`,
          error: 'not_found'
        });
      }
      
      res.json(item);
    }),

    // POST /api/{resource} - Create new resource
    create: asyncHandler(async (req: Request, res: Response) => {
      const validatedData = insertSchema.parse(req.body);
      const newItem = await storage.create(validatedData);
      
      // Log activity
      await logActivity(req, 'create', entityName, newItem.id, `Created ${entityName}`);
      
      res.status(201).json(newItem);
    }),

    // PUT /api/{resource}/:id - Update resource
    update: asyncHandler(async (req: Request, res: Response) => {
      const { id } = req.params;
      const validatedData = updateSchema.parse(req.body);
      
      // Check if exists
      const existing = await storage.getById(id);
      if (!existing) {
        return res.status(404).json({
          message: `${entityName} not found`,
          error: 'not_found'
        });
      }
      
      const updatedItem = await storage.update(id, validatedData);
      
      // Log activity
      await logActivity(req, 'update', entityName, id, `Updated ${entityName}`);
      
      res.json(updatedItem);
    }),

    // DELETE /api/{resource}/:id - Delete resource
    remove: asyncHandler(async (req: Request, res: Response) => {
      const { id } = req.params;
      
      // Check if exists
      const existing = await storage.getById(id);
      if (!existing) {
        return res.status(404).json({
          message: `${entityName} not found`,
          error: 'not_found'
        });
      }
      
      await storage.delete(id);
      
      // Log activity
      await logActivity(req, 'delete', entityName, id, `Deleted ${entityName}`);
      
      res.status(204).send();
    })
  };
}