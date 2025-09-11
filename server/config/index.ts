/**
 * Centralized configuration management
 */

export const config = {
  // Server configuration
  server: {
    port: parseInt(process.env.PORT || '3100', 10),
    host: process.env.NODE_ENV === 'production' ? '0.0.0.0' : '127.0.0.1',
    additionalPort: parseInt(process.env.ADDITIONAL_PORT || '8080', 10),
  },

  // CORS configuration  
  cors: {
    origin: process.env.CORS_ORIGIN || "https://wikenship.it",
    credentials: true,
  },

  // Database configuration
  database: {
    url: process.env.DATABASE_URL,
  },

  // Authentication configuration
  auth: {
    jwtSecret: process.env.JWT_SECRET || 'default-dev-secret-change-in-production',
    sessionSecret: process.env.SESSION_SECRET || 'default-session-secret',
    sessionMaxAge: 24 * 60 * 60 * 1000, // 24 hours
  },

  // GestLine API configuration
  gestline: {
    apiUrl: process.env.GESTLINE_API_URL,
    username: process.env.GESTLINE_API_USERNAME,
    password: process.env.GESTLINE_API_PASSWORD,
    tlsInsecure: process.env.GESTLINE_TLS_INSECURE === 'true',
  },

  // Application configuration
  app: {
    version: '1.0.0',
    domain: 'wikenship.it',
    environment: process.env.NODE_ENV || 'development',
  },
};

/**
 * Validate required environment variables
 */
export function validateConfig() {
  const required = [
    'DATABASE_URL',
    'SESSION_SECRET',
  ];

  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('🚨 Missing required environment variables:', missing);
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }

  // Warn about insecure defaults in production
  if (process.env.NODE_ENV === 'production') {
    if (!process.env.JWT_SECRET) {
      console.warn('⚠️ Using default JWT_SECRET in production!');
    }
    if (config.gestline.tlsInsecure) {
      console.warn('⚠️ GESTLINE_TLS_INSECURE=true in production!');
    }
  }
}

export default config;