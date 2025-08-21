# WikenFarma - Sistema Gestionale Farmaceutico

## Overview

WikenFarma is a comprehensive pharmaceutical management system designed to centralize and automate various commercial operations. The application manages private orders, pharmacy operations, and provides specialized functionality for pharmaceutical sales representatives (ISF - Informatori Scientifici del Farmaco) including commission tracking and performance analytics.

The system provides advanced reporting for marketing analysis and management control, with integrated support for external systems like eBay, Gestline, Odoo, GLS, PharmaEVO, and various communication platforms.

## Recent Changes (January 2025)

✓ **ISF Compensation System Complete**: Full implementation of ISF compensation management with distinction between employees (fixed salary only) and freelancers (fixed + cut-off + percentage)
✓ **Database Schema Enhanced**: Complete schema for ISF compensations with customizable cut-offs per area and informatore
✓ **Backend API Complete**: All routes for compensation calculations, commission logs, and performance tracking implemented with proper authentication middleware
✓ **Frontend Integration**: React hooks (use-compensations.ts) for seamless frontend integration of compensation management
✓ **ISF Dashboard Operational**: Complete dashboard for informatori with personal compensation views, commission logs, and performance analytics
✓ **Bug Fixes Complete**: Resolved all compilation errors in commissions and informatori pages, integrated new hooks with proper error handling and loading states
✓ **Informatori Page Enhanced**: Complete redesign with CRUD operations, advanced filtering, statistics dashboard, and full ISF compensation system integration

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for modern, type-safe user interfaces
- **Build System**: Vite for fast development and optimized builds
- **Routing**: Wouter for lightweight, performant client-side navigation
- **State Management**: TanStack React Query for server state management with intelligent caching
- **UI Components**: Custom component library built on Radix UI primitives with Tailwind CSS
- **Styling**: Tailwind CSS with custom CSS properties for advanced theming
- **Form Management**: React Hook Form with Zod validation for robust, type-safe forms

### Backend Architecture
- **Runtime**: Node.js with TypeScript for type-safe server-side development
- **Framework**: Express.js for REST API with modular middleware approach
- **Authentication**: Custom JWT-based authentication system with session storage fallback
- **Database ORM**: Drizzle ORM for type-safe, performant database operations
- **API Design**: RESTful endpoints with consistent error handling and standardized response formatting

### Database Design
- **Primary Database**: PostgreSQL with connection pooling for high performance
- **Session Storage**: PostgreSQL-based session store using connect-pg-simple
- **Schema Management**: Drizzle migrations with TypeScript schema definitions
- **Key Entities**: Users, Customers, Products, Orders, Shipments, Commissions, Integrations, Activity Logs, Informatori (Sales Representatives)

### Authentication and Authorization
- **Authentication Method**: Custom JWT implementation with session fallback
- **User Types**: Standard users and Informatori (pharmaceutical sales representatives)
- **Role-Based Access**: Admin, manager, and user roles with route-level protection
- **Session Management**: Express sessions with PostgreSQL storage for reliability

## External Dependencies

### Database Services
- **Neon PostgreSQL** (Primary): Serverless PostgreSQL for production deployment
- **Alternative Options**: Supabase, Railway, ElephantSQL for different deployment scenarios
- **Session Storage**: PostgreSQL-based session management with automatic table creation

### Third-Party Integrations
- **GLS**: Shipping and logistics integration for order fulfillment
- **Gestline**: ERP system integration for business process automation
- **Odoo**: Enterprise resource planning integration
- **PharmaEVO**: Pharmaceutical industry-specific system integration
- **eBay**: E-commerce platform integration for order management
- **Email Systems**: Automated email communications and newsletters
- **WhatsApp**: Customer communication integration

### UI and Development Dependencies
- **Radix UI**: Unstyled, accessible UI primitives for component foundation
- **Recharts**: Data visualization and charting library for analytics
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **Google Cloud Storage**: File storage and management for attachments
- **Uppy**: File upload handling with cloud storage integration

### Authentication and Security
- **bcryptjs**: Password hashing and security
- **jsonwebtoken**: JWT token generation and validation
- **connect-pg-simple**: PostgreSQL session store for Express sessions
- **Custom Security**: Role-based access control and route protection

### Cross-Platform Support
- **cross-env**: Environment variable management across different platforms
- **Windows Compatibility**: IPv4 binding (127.0.0.1) for Windows development environment compatibility
- **ESBuild**: Fast bundling for production builds
- **TSX**: TypeScript execution for development server