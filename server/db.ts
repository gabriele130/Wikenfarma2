import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from "@shared/schema";
import { config } from 'dotenv';

// Load environment variables from .env file
config();

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL richiesto. Crea un file .env con l'URL del database o configura le variabili d'ambiente.",
  );
}

// PostgreSQL connection optimized for Neon database
const client = postgres(process.env.DATABASE_URL, { 
  max: 10,
  idle_timeout: 20,
  max_lifetime: 60 * 30,
  connect_timeout: 30,
  ssl: 'require',
  onnotice: () => {}, // Disable notices to reduce log noise
});

export const db = drizzle(client, { schema });