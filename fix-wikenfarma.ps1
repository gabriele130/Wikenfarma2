# Script PowerShell per risolvere tutti i problemi WikenFarma
Write-Host "Risoluzione problemi WikenFarma..." -ForegroundColor Green

# 1. Ferma il server se in esecuzione
Write-Host "1. Preparazione ambiente..." -ForegroundColor Yellow
if (Get-Process -Name "node" -ErrorAction SilentlyContinue) {
    Stop-Process -Name "node" -Force
}

# 2. Rimuovi file problematici
if (Test-Path "tailwind.config.ts") { Remove-Item "tailwind.config.ts" }
if (Test-Path "node_modules") { Remove-Item -Recurse -Force "node_modules" }
if (Test-Path "package-lock.json") { Remove-Item "package-lock.json" }

# 3. Crea package.json corretto
Write-Host "2. Creazione package.json..." -ForegroundColor Yellow
@'
{
  "name": "wikenfarma",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "@tanstack/react-query": "^5.60.5",
    "wouter": "^3.3.5",
    "lucide-react": "^0.453.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.6.0",
    "class-variance-authority": "^0.7.1",
    "@radix-ui/react-slot": "^1.2.0",
    "@radix-ui/react-tabs": "^1.1.1",
    "@radix-ui/react-select": "^2.1.2",
    "@radix-ui/react-dialog": "^1.1.2",
    "@radix-ui/react-label": "^2.1.0",
    "react-hook-form": "^7.53.2",
    "@hookform/resolvers": "^3.9.1",
    "recharts": "^2.13.3",
    "zod": "^3.24.1"
  },
  "devDependencies": {
    "@types/node": "^20.16.11",
    "@types/react": "^18.3.11",
    "@types/react-dom": "^18.3.1",
    "@vitejs/plugin-react": "^4.3.2",
    "typescript": "^5.6.3",
    "vite": "^5.4.19",
    "tailwindcss": "^3.4.15",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.5.1"
  }
}
'@ | Out-File -FilePath "package.json" -Encoding UTF8

# 4. Crea tailwind.config.js semplice
Write-Host "3. Creazione tailwind.config.js..." -ForegroundColor Yellow
@'
export default {
  content: [
    "./client/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
}
'@ | Out-File -FilePath "tailwind.config.js" -Encoding UTF8

# 5. Crea vite.config.ts corretto
Write-Host "4. Creazione vite.config.ts..." -ForegroundColor Yellow
@'
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
    },
  },
  root: "client",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    host: true
  }
});
'@ | Out-File -FilePath "vite.config.ts" -Encoding UTF8

# 6. Crea struttura cartelle se mancante
Write-Host "5. Creazione struttura cartelle..." -ForegroundColor Yellow
New-Item -ItemType Directory -Path "client\src\components\ui" -Force
New-Item -ItemType Directory -Path "client\src\components\modals" -Force
New-Item -ItemType Directory -Path "client\src\pages" -Force
New-Item -ItemType Directory -Path "client\src\lib" -Force
New-Item -ItemType Directory -Path "client\src\hooks" -Force

# 7. Installa dipendenze
Write-Host "6. Installazione dipendenze..." -ForegroundColor Yellow
npm install

Write-Host "Setup completato! Esegui 'npm run dev' per avviare l'applicazione." -ForegroundColor Green