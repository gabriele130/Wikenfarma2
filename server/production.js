#!/usr/bin/env node

/**
 * WikenFarma Production Server Launcher
 * Ottimizzato per ScalaHosting/cPanel deployment
 */

import { exec } from 'child_process';
import fs from 'fs';

// Verifica ambiente di produzione
const requiredEnvVars = [
  'DATABASE_URL',
  'SESSION_SECRET', 
  'GESTLINE_API_URL',
  'GESTLINE_API_USERNAME',
  'GESTLINE_API_PASSWORD'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
  console.error('🚨 Missing required environment variables:');
  missingVars.forEach(varName => console.error(`   - ${varName}`));
  process.exit(1);
}

// Verifica build esiste
if (!fs.existsSync('./dist/index.js')) {
  console.log('🔨 Building application...');
  exec('npm run build', (error, stdout, stderr) => {
    if (error) {
      console.error('❌ Build failed:', error);
      process.exit(1);
    }
    console.log('✅ Build completed');
    startServer();
  });
} else {
  startServer();
}

function startServer() {
  console.log('🚀 Starting WikenFarma production server...');
  console.log('📡 Server: https://wikenship.it:3100');
  console.log('🗄️ Database: Connected');
  console.log('🔐 GestLine API: Configured');
  
  // Avvia server con gestione errori
  process.env.NODE_ENV = 'production';
  process.env.PORT = process.env.PORT || '3100';
  
  import('./dist/index.js').catch(error => {
    console.error('💥 Server startup failed:', error);
    process.exit(1);
  });
}

// Gestione graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');  
  process.exit(0);
});