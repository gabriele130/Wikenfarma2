# WikenFarma - Sistema Gestionale Farmaceutico

## Overview

WikenFarma is a comprehensive pharmaceutical management system designed to centralize and automate various business operations. The application manages private orders, pharmacy and wholesaler operations, customer databases (doctors, pharmacies, wholesalers), inventory management, shipments, commissions, and integrations with external systems like eBay, Gestline, Odoo, GLS, PharmaEVO, and various ecommerce platforms.

The system provides advanced reporting for marketing analysis and management control, with specialized features for pharmaceutical sales representatives (ISF - Informatori Scientifici del Farmaco) including commission tracking and territory management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack React Query for server state management
- **UI Framework**: Custom component library using Radix UI primitives with Tailwind CSS
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js for REST API
- **Authentication**: Custom JWT-based authentication system with session storage
- **Database ORM**: Drizzle ORM for type-safe database operations
- **API Design**: RESTful endpoints with consistent error handling and response formatting

### Database Design
- **Primary Database**: PostgreSQL with connection pooling
- **Session Storage**: PostgreSQL-based session store using connect-pg-simple
- **Schema Management**: Drizzle migrations with TypeScript schema definitions
- **Key Entities**: Users, Customers, Products, Orders, Shipments, Commissions, Integrations, Activity Logs, Informatori

### Authentication & Authorization
- **Authentication Method**: Custom JWT implementation with session fallback
- **User Types**: Standard users and Informatori (pharmaceutical sales representatives)
- **Role-Based Access**: Admin, manager, and user roles with route-level protection
- **Session Management**: Express sessions with PostgreSQL storage for reliability

### Code Organization
- **Monorepo Structure**: Shared TypeScript schemas between client and server
- **Path Aliases**: Configured for clean imports (@/ for client, @shared for shared code)
- **Type Safety**: End-to-end TypeScript with Zod validation schemas
- **Component Architecture**: Reusable UI components with consistent design patterns

## External Dependencies

### Database & Infrastructure
- **PostgreSQL**: Primary database (recommended providers: Neon, Supabase, Railway, ElephantSQL)
- **Neon Database**: Serverless PostgreSQL with @neondatabase/serverless client

### UI & Design System
- **Radix UI**: Comprehensive set of UI primitives (@radix-ui/react-*)
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **Lucide React**: Icon library for consistent iconography

### Third-Party Integrations
- **Google Cloud Storage**: File storage and management (@google-cloud/storage)
- **Uppy**: File upload handling (@uppy/core, @uppy/dashboard, @uppy/aws-s3)

### Development Tools
- **Replit Integration**: Development environment optimizations and error handling
- **ESBuild**: Fast bundling for production builds
- **TSX**: TypeScript execution for development server

### External APIs & Services
- **eBay Integration**: Automated order processing from eBay marketplace
- **Gestline**: ERP system integration for order management
- **Odoo**: Business management software integration
- **GLS**: Shipping and logistics provider integration
- **PharmaEVO**: Pharmaceutical industry-specific integrations
- **IQVIA Data**: Healthcare data analytics integration
- **Email & WhatsApp**: Communication automation systems

### Analytics & Monitoring
- **Recharts**: Data visualization library for analytics dashboards
- **Commission Tracking**: Automated calculation and reporting for sales representatives
- **Activity Logging**: Comprehensive audit trail for all system operations