/**
 * Services barrel export
 * Business logic and external API integrations
 */

// Re-export GestLine service
export { gestlineService } from './gestline.service';
export type { GestLineOrderData } from './gestline.service';

// Storage service (repository pattern)
export { storage } from '../storage';