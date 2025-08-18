import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Custom PostgreSQL connection (no Replit dependencies)
const client = postgres(process.env.DATABASE_URL, { 
  max: 20,
  idle_timeout: 20,
  max_lifetime: 60 * 30
});

export const db = drizzle(client, { schema });