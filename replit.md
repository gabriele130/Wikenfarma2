# Overview

WikenFarma is a comprehensive pharmaceutical management system designed to centralize and automate various business operations. The application manages private orders, pharmacy operations, and provides advanced reporting for marketing analysis and operational control. The system includes specialized functionality for pharmaceutical sales representatives (ISF) including commission tracking and customer assignment.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The frontend is built with modern React 18 using TypeScript for type-safe user interfaces. The application uses Vite as the build tool for fast development and optimized builds. Client-side routing is handled by Wouter for lightweight and performant navigation. State management relies on TanStack React Query for intelligent server state caching and synchronization.

The UI framework consists of a custom component library built on Radix UI primitives with Tailwind CSS for styling. The design system uses CSS custom properties for advanced theming capabilities. Form handling is managed through React Hook Form with Zod validation for robust and type-safe form processing.

## Backend Architecture
The backend runs on Node.js with TypeScript for type-safe server-side development. Express.js provides the REST API framework with modular middleware architecture. The system implements a custom JWT-based authentication system with session storage fallback.

Database operations use Drizzle ORM for type-safe and performant database interactions. The API follows RESTful design principles with consistent error handling and standardized response formatting.

## Database Design
PostgreSQL serves as the primary database with connection pooling for high performance. Session storage uses a PostgreSQL-based session store via connect-pg-simple for reliability. Schema management is handled through Drizzle migrations with TypeScript schema definitions.

Key entities include Users, Customers (doctors, pharmacies, wholesalers, private), Products, Orders, Shipments, Commissions, Integrations, Activity Logs, and Informatori (sales representatives). The database supports role-based access control with specialized user types.

## Authentication and Authorization
The system implements custom JWT authentication with session fallback for reliability. User types include standard users and Informatori (pharmaceutical sales representatives). Role-based access control supports admin, manager, and user roles with route-level protection. Session management uses Express sessions with PostgreSQL storage.

## External Integrations
The system is designed to integrate with multiple external services including eBay, Gestline, Odoo, GLS shipping, PharmaEVO, e-commerce platforms, email services, and WhatsApp. These integrations enable automated data flow between systems for order processing, inventory management, and customer communications.

## Cross-Platform Compatibility
The application includes specific configurations for Windows development environments, using IPv4 binding (127.0.0.1) for network compatibility. Environment-specific configurations handle both local development and cloud deployment scenarios.

# External Dependencies

## Database Services
- **PostgreSQL**: Primary database with recommended providers including Neon (serverless PostgreSQL), Supabase (PostgreSQL with integrated auth), Railway (integrated hosting and database), and ElephantSQL (specialized PostgreSQL)
- **Drizzle ORM**: Type-safe database operations and migrations
- **connect-pg-simple**: PostgreSQL session store for Express sessions

## Authentication & Security
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT token generation and verification
- **express-session**: Session management middleware

## Frontend Libraries
- **React 18**: Core UI library with TypeScript support
- **Vite**: Build tool and development server
- **Wouter**: Lightweight client-side routing
- **TanStack React Query**: Server state management and caching
- **Radix UI**: Primitive components for accessible UI
- **Tailwind CSS**: Utility-first CSS framework
- **React Hook Form**: Form handling with Zod validation
- **Recharts**: Data visualization components

## External Service Integrations
- **Google Cloud Storage**: File storage and asset management
- **Uppy**: File upload handling with AWS S3 integration
- **Cross-env**: Cross-platform environment variable handling for Windows compatibility

## Development Tools
- **TypeScript**: Type safety across frontend and backend
- **ESBuild**: Fast JavaScript bundling for production
- **PostCSS**: CSS processing with Tailwind integration
- **TSX**: TypeScript execution for development server