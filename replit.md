# WikenFarma - Sistema Gestionale Farmaceutico

## Overview

WikenFarma is a comprehensive pharmaceutical management system designed to centralize and automate various commercial operations. The application manages private orders, pharmacy operations, inventory, shipments, commissions, and advanced reporting for marketing analysis and management control. The system includes specialized functionality for pharmaceutical sales representatives (ISF - Informatori Scientifici del Farmaco) with commission tracking and doctor visit management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client-side application is built with modern React 18 and TypeScript for type-safe user interfaces. Vite serves as the build tool for fast development and optimized production builds. Client-side routing is handled by Wouter for lightweight, performant navigation. State management leverages TanStack React Query for intelligent server state caching and synchronization.

The UI framework uses a custom component library built on Radix UI primitives with Tailwind CSS for styling. This provides accessible, customizable components with consistent design patterns. Form handling is implemented with React Hook Form combined with Zod validation for robust, type-safe form processing.

### Backend Architecture
The server runs on Node.js with TypeScript and Express.js for RESTful API endpoints. A custom JWT-based authentication system provides secure user sessions with PostgreSQL session storage. The API follows RESTful design principles with consistent error handling and standardized response formatting.

Middleware includes CORS configuration optimized for the wikenship.it domain, request logging, and authentication token validation. The server is configured for cross-platform Windows development with IPv4 binding for localhost compatibility.

### Database Design
PostgreSQL serves as the primary database with connection pooling for high performance. The system uses Drizzle ORM for type-safe database operations and schema management. Database migrations are handled through Drizzle with TypeScript schema definitions.

Key entities include Users, Customers (private and pharmacy types), Products, Orders, Order Items, Shipments, Commissions, Integrations, Activity Logs, and Informatori (sales representatives). Session storage uses a dedicated PostgreSQL table via connect-pg-simple.

### Authentication and Authorization
Authentication is implemented through a custom JWT system with Express session fallback. The system supports two user types: standard users and "informatori" (pharmaceutical sales representatives). Role-based access control includes admin, manager, and user roles with route-level protection.

Session management uses Express sessions with PostgreSQL storage for reliability. The authentication flow includes user registration, login, token management, and automatic session renewal.

## External Dependencies

### Database Services
- **PostgreSQL**: Primary database using Neon serverless PostgreSQL for production
- **Drizzle ORM**: Type-safe database operations and schema management
- **connect-pg-simple**: PostgreSQL session store for Express sessions

### UI and Component Libraries
- **Radix UI**: Accessible component primitives (dialogs, dropdowns, forms, tabs, etc.)
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **Lucide React**: Icon library for consistent iconography
- **React Hook Form**: Form state management and validation
- **Zod**: TypeScript-first schema validation

### Development and Build Tools
- **Vite**: Fast build tool and development server
- **TypeScript**: Type safety across frontend and backend
- **ESBuild**: JavaScript bundler for production builds
- **Cross-env**: Cross-platform environment variable support

### Authentication and Security
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT token generation and validation
- **express-session**: Session middleware for Express

### External API Integrations
The system is designed to integrate with:
- **eBay**: E-commerce order synchronization
- **GestLine**: ERP system integration
- **Odoo**: Business management system
- **PharmaEVO**: Pharmaceutical industry platform
- **GLS**: Shipping and logistics provider
- **Google Cloud Storage**: File and asset storage
- **Email services**: Marketing and notification systems
- **WhatsApp**: Customer communication

### Development Environment
- **Replit**: Development platform with cartographer and error modal plugins
- **PostCSS**: CSS processing with Autoprefixer
- **ESLint/TypeScript**: Code quality and type checking tools