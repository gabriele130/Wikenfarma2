import express, { type Request, Response, NextFunction } from "express";
import cors from "cors";
import path from "path";
import { registerRoutes } from "./routes";
// LAZY IMPORT: vite solo in development per bypassare vite.config.ts corrotto
const log = (...args: any[]) => console.log(...args);

const app = express();

// Trust proxy - importante dietro Nginx
app.set("trust proxy", 1);

// CORS configuration per wikenship.it
app.use(cors({ 
  origin: "https://wikenship.it", 
  credentials: true 
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    log(`🚨 [ERROR] ${status}: ${message}`);
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    try {
      const { setupVite, log: viteLog } = await import("./vite");
      (viteLog ?? log)("🚀 Starting Vite development server...");
      await setupVite(app, server);
    } catch (error) {
      log("⚠️ Vite setup failed (maybe vite.config.ts issue), serving API only:", (error as Error).message);
    }
  } else {
    // In production, serve static files from dist/public
    const staticPath = path.resolve(import.meta.dirname, '../dist/public');
    app.use(express.static(staticPath));
    
    // Serve React app for all non-API routes
    app.get('*', (req, res) => {
      if (req.path.startsWith('/api')) return;
      res.sendFile(path.join(staticPath, 'index.html'));
    });
  }

  // Server configuration - single port from environment
  const port = parseInt(process.env.PORT || '3100', 10);
  const host = process.env.NODE_ENV === 'production' ? '0.0.0.0' : '127.0.0.1';
  
  // Start server on configured port
  server.listen(port, host, () => {
    if (process.env.NODE_ENV === 'production') {
      log(`🚀 WikenFarma server running on https://wikenship.it:${port}`);
      log(`📡 API endpoints available at https://wikenship.it/api/*`);
      log(`🎯 Configure your NodeJS manager to use port ${port}`);
    } else {
      log(`🔧 Development server running on http://${host}:${port}`);
      log(`📡 Will be accessible at https://wikenship.it in production`);
    }
  });
})();
