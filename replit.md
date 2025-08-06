# WikenFarma - Sistema Gestionale Farmaceutico

## Overview

WikenFarma is a comprehensive pharmaceutical management system designed to centralize and automate various business operations including order management, customer relations, inventory control, and integrations with external services. The system handles multiple customer types (private customers, pharmacies, wholesalers, and doctors) and provides complete workflow automation from order placement to delivery tracking.

### Latest Requirements (January 2025)
- **WIKENSHIP**: Integration of private orders (WooCommerce + eBay) → GestLine frontier table + ODOO analytics
- **Commission System**: 15% revenue-based for Informatori, point-based system for Doctors
- **ISF Management**: Dipendenti (fixed salary) vs Liberi Professionisti (fixed + cut-off + percentage)
- **Pharmacy Orders**: PharmaEVO integration with GestLine bridge + ODOO tagging
- **Analytics Dashboard**: Multi-dimensional revenue analysis with temporal comparisons
- **Shareable Medical Reports**: Read-only informatori dashboards with individual doctor tables

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Library**: Shadcn/UI components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system variables
- **Routing**: Wouter for client-side navigation
- **State Management**: TanStack Query for server state management and caching
- **Forms**: React Hook Form with Zod validation

The frontend follows a component-based architecture with a clear separation between UI components, pages, and business logic. The design system uses CSS variables for theming and provides both light and dark mode support.

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js for REST API endpoints
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Authentication**: Replit-based OAuth with session management
- **File Structure**: Monolithic structure with separate client/server/shared directories

The backend implements a RESTful API pattern with middleware for authentication, logging, and error handling. The shared directory contains common schemas and types used by both frontend and backend.

### Database Design
- **Primary Database**: PostgreSQL via Neon Database
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Key Entities**:
  - Users (authentication and roles)
  - Customers (private, pharmacy, wholesaler, doctor types)
  - Products (inventory management)
  - Orders and OrderItems (multi-type order processing)
  - Shipments (delivery tracking)
  - Commissions (ISF and sales tracking)
  - Integrations (external service status)
  - Activity Logs (audit trail)

### Authentication & Authorization
- **Provider**: Replit OAuth integration
- **Session Storage**: PostgreSQL-based session store
- **Security**: HTTP-only cookies with secure flags
- **User Roles**: Role-based access control (user, admin, manager)

The authentication system integrates with Replit's OAuth service and maintains user sessions in the database for scalability and persistence.

### API Architecture
- **Pattern**: RESTful API with consistent error handling
- **Validation**: Zod schemas for request/response validation
- **Middleware**: Request logging, authentication checks, and error handling
- **File Uploads**: Integration with Google Cloud Storage and Uppy

## External Dependencies

### Core Services
- **Neon Database**: PostgreSQL hosting with serverless architecture
- **Replit Authentication**: OAuth provider for user management
- **Google Cloud Storage**: File and document storage

### Planned Integrations
The system is designed to integrate with multiple external services:
- **eBay**: E-commerce platform integration
- **Gestline**: ERP system integration
- **Odoo**: Business management suite
- **GLS**: Shipping and logistics provider
- **PharmaEVO**: Pharmaceutical industry-specific system
- **Email Services**: Newsletter and communication automation
- **WhatsApp**: Customer communication channel

### Development Tools
- **Build System**: Vite with ESBuild for production builds
- **Type Checking**: TypeScript with strict configuration
- **Code Quality**: ESLint and Prettier (implied from standard setup)
- **Development**: Hot module replacement and runtime error overlay

### UI/UX Libraries
- **Component Library**: Radix UI primitives for accessibility
- **Icons**: Font Awesome integration
- **File Upload**: Uppy with AWS S3 and Google Cloud Storage adapters
- **Styling**: Tailwind CSS with PostCSS processing

The architecture prioritizes modularity, type safety, and integration capabilities to support the complex workflow requirements of pharmaceutical business operations.