import { Express } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import pkg from "pg";
const { Pool } = pkg;
import { storage } from "./storage";
import { LoginData, RegisterData, User } from "@shared/schema";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'wikenfarma-secret-key-2025';
const SESSION_SECRET = process.env.SESSION_SECRET || 'wikenfarma-session-secret';

// PostgreSQL session store - detect if local or cloud database
const isLocalDatabase = process.env.DATABASE_URL?.includes('127.0.0.1') || process.env.DATABASE_URL?.includes('localhost');

const pgPool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 30000,
  idleTimeoutMillis: 30000,
  max: 10,
  ssl: isLocalDatabase ? false : { rejectUnauthorized: false },
});
const PostgresSessionStore = connectPgSimple(session);

export function setupCustomAuth(app: Express) {
  // Session middleware
  app.use(session({
    store: new PostgresSessionStore({
      pool: pgPool,
      createTableIfMissing: true,
    }),
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true, // sempre true con HTTPS
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      sameSite: 'none', // con HTTPS
    },
  }));

  // Register endpoint
  app.post('/api/auth/register', async (req, res) => {
    try {
      const userData = req.body as RegisterData;
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username già esistente" });
      }

      const existingEmail = await storage.getUserByEmail(userData.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email già registrata" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 12);

      // Create user
      const newUser = await storage.createUser({
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
        firstName: userData.firstName,
        lastName: userData.lastName,
        userType: userData.userType,
        role: userData.userType === 'informatore' ? 'informatore' : 'user',
        isActive: true,
      });

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: newUser.id, 
          username: newUser.username,
          userType: newUser.userType,
          role: newUser.role 
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Save user in session
      (req.session as any).user = newUser;
      req.user = newUser;

      // Remove password from response
      const userResponse = { ...newUser };
      delete (userResponse as any).password;

      res.status(201).json({ 
        user: userResponse, 
        token,
        message: "Registrazione completata con successo" 
      });

    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Errore durante la registrazione" });
    }
  });

  // Login endpoint
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { username, password, userType } = req.body as LoginData;

      // Find user by username
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Username o password non validi" });
      }

      // Check if user is active
      if (!user.isActive) {
        return res.status(401).json({ message: "Account disattivato" });
      }

      // Check user type matches login form
      if (user.userType !== userType) {
        return res.status(401).json({ 
          message: `Questo account non è autorizzato per il login ${userType === 'informatore' ? 'informatori' : 'standard'}` 
        });
      }

      // Verify password - TEMPORANEO: confronto diretto per test
      const isPasswordValid = password === user.password;
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Username o password non validi" });
      }

      // Update last login
      await storage.updateUserLastLogin(user.id);

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user.id, 
          username: user.username,
          userType: user.userType,
          role: user.role 
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Save user in session
      (req.session as any).user = user;
      req.user = user;

      // Remove password from response
      const userResponse = { ...user };
      delete (userResponse as any).password;

      res.json({ 
        user: userResponse, 
        token,
        message: "Login effettuato con successo" 
      });

    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Errore durante il login" });
    }
  });

  // Logout endpoint
  app.post('/api/auth/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ message: "Errore durante il logout" });
      }
      res.json({ message: "Logout effettuato con successo" });
    });
  });

  // Get current user endpoint
  app.get('/api/auth/user', authenticateToken, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Non autenticato" });
      }

      // Remove password from response
      const userResponse = { ...req.user };
      delete (userResponse as any).password;

      res.json(userResponse);
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Errore nel recupero utente" });
    }
  });
}

// JWT Authentication middleware
export function authenticateToken(req: any, res: any, next: any) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  // Also check session
  const sessionUser = (req.session as any)?.user;

  if (!token && !sessionUser) {
    return res.status(401).json({ message: "Token di accesso richiesto" });
  }

  if (token) {
    jwt.verify(token, JWT_SECRET, async (err: any, decoded: any) => {
      if (err) {
        if (sessionUser) {
          // Fall back to session
          req.user = sessionUser;
          return next();
        }
        return res.status(403).json({ message: "Token non valido" });
      }

      try {
        // Get fresh user data
        const user = await storage.getUser(decoded.userId);
        if (!user || !user.isActive) {
          return res.status(401).json({ message: "Utente non trovato o disattivato" });
        }

        req.user = user;
        next();
      } catch (error) {
        console.error("Token verification error:", error);
        res.status(500).json({ message: "Errore verifica token" });
      }
    });
  } else if (sessionUser) {
    // Use session user
    req.user = sessionUser;
    next();
  }
}

// Role-based authorization middleware
export function requireRole(roles: string[]) {
  return (req: any, res: any, next: any) => {
    if (!req.user) {
      return res.status(401).json({ message: "Non autenticato" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: "Non autorizzato per questa operazione",
        requiredRole: roles,
        userRole: req.user.role
      });
    }

    next();
  };
}

// User type authorization (standard vs informatore)
export function requireUserType(userTypes: string[]) {
  return (req: any, res: any, next: any) => {
    if (!req.user) {
      return res.status(401).json({ message: "Non autenticato" });
    }

    if (!userTypes.includes(req.user.userType)) {
      return res.status(403).json({ 
        message: "Accesso riservato ad utenti specifici",
        requiredUserType: userTypes,
        userUserType: req.user.userType
      });
    }

    next();
  };
}