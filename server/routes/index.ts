import type { Express } from "express";
import { createServer, type Server } from "http";

// Import existing routes temporarily during migration
import { registerRoutes as legacyRegisterRoutes } from "../routes.legacy";

/**
 * Main route registration function
 * Maintains API compatibility during MVC restructuring
 */
export async function registerRoutes(app: Express): Promise<Server> {
  // Temporarily delegate to existing routes.ts during migration
  // This will be gradually replaced with new modular routers
  return await legacyRegisterRoutes(app);
}

export default registerRoutes;