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

// PostgreSQL connection - detect if local or cloud database
const isLocalDatabase = process.env.DATABASE_URL?.includes('127.0.0.1') || process.env.DATABASE_URL?.includes('localhost');

const client = postgres(process.env.DATABASE_URL, { 
  max: 10,
  idle_timeout: 20,
  max_lifetime: 60 * 30,
  connect_timeout: 30,
  ssl: isLocalDatabase ? false : 'require',
  onnotice: () => {}, // Disable notices to reduce log noise
});

export const db = drizzle(client, { schema });