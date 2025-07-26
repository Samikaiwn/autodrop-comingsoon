# AutoDrop Platform - E-commerce Application

## Overview

AutoDrop Platform is a modern e-commerce application that enables automated product importing from AliExpress with integrated payment processing via Stripe. The application features a React frontend with shadcn/ui components, an Express.js backend, and PostgreSQL database managed through Drizzle ORM.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a full-stack JavaScript architecture with clear separation between client and server:

- **Frontend**: React with TypeScript, using Vite as the build tool
- **Backend**: Express.js server with TypeScript
- **Database**: PostgreSQL with Drizzle ORM for schema management
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom theme variables

## Key Components

### Frontend Architecture
- **Component Library**: shadcn/ui components providing a comprehensive design system
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with CSS variables for theming
- **Type Safety**: Full TypeScript integration with strict mode enabled

### Backend Architecture
- **API Layer**: RESTful Express.js server with JSON middleware
- **Database Layer**: Drizzle ORM with PostgreSQL dialect
- **Storage Abstraction**: Interface-based storage layer with in-memory implementation for development
- **Request Logging**: Custom middleware for API request logging and monitoring

### Database Schema
The application uses five main entities:
- **Users**: Authentication and user management
- **Categories**: Product categorization system
- **Products**: Core product information with AliExpress integration
- **Cart Items**: Shopping cart functionality
- **Orders**: Order management with Stripe integration

## Data Flow

1. **Product Import**: AliExpress API integration allows importing products with automated data mapping
2. **User Shopping**: Browse products by category, search functionality, and cart management
3. **Checkout Process**: Stripe payment integration for secure transaction processing
4. **Order Management**: Complete order lifecycle from creation to fulfillment

### API Endpoints
- `GET /api/categories` - Retrieve product categories
- `GET /api/products` - List products with filtering and pagination
- `GET /api/products/:id` - Get individual product details
- `POST /api/aliexpress/import` - Import products from AliExpress
- Cart and order management endpoints (implemented in storage layer)

## External Dependencies

### Third-Party Services
- **AliExpress API**: Product import integration with configurable app credentials
- **Stripe**: Payment processing with webhook support
- **Neon Database**: Cloud PostgreSQL hosting (@neondatabase/serverless)

### Key Libraries
- **UI Components**: Comprehensive Radix UI primitive collection
- **Form Handling**: React Hook Form with Zod validation
- **HTTP Client**: Native fetch API with TanStack Query
- **Date Handling**: date-fns for date manipulation
- **Carousel**: Embla Carousel for product image galleries

## Deployment Strategy

### Development Environment
- Vite dev server with HMR for frontend development
- Express server with tsx for TypeScript execution
- Environment variable configuration for external service credentials
- Replit-specific plugins for development tooling

### Production Build
- Frontend: Vite builds optimized React bundle to `dist/public`
- Backend: esbuild compiles TypeScript server to `dist/index.js`
- Database migrations managed through Drizzle Kit
- Single-command deployment with `npm start`

### Environment Configuration
The application expects these environment variables:
- `DATABASE_URL`: PostgreSQL connection string
- `ALIEXPRESS_APP_KEY` / `ALIEXPRESS_API_KEY`: AliExpress API credentials
- `ALIEXPRESS_APP_SECRET` / `ALIEXPRESS_SECRET`: AliExpress API secret
- `STRIPE_PUBLISHABLE_KEY` / `STRIPE_PK`: Stripe public key
- Additional Stripe webhook and secret keys for payment processing

### Build Commands
- `npm run dev`: Development mode with hot reloading
- `npm run build`: Production build of both frontend and backend
- `npm start`: Start production server
- `npm run db:push`: Deploy database schema changes

## Recent Changes

### Complete Stripe Payment Integration (Latest)
- **Date**: January 26, 2025
- **Changes Made**:
  - Installed Stripe package and implemented full payment flow
  - Created proper Stripe checkout sessions with line items and metadata
  - Added success.html and cancel.html pages for post-payment redirects
  - Updated cart sidebar to redirect users to Stripe-hosted checkout
  - Added Stripe webhook endpoint for payment confirmation handling
  - Configured environment-based redirect URLs (development vs production)
  - **Integration Status**: Fully functional Stripe Checkout with proper security
  - **Environment Variables Used**: STRIPE_SECRET_KEY, STRIPE_PUBLISHABLE_KEY, VITE_STRIPE_PUBLISHABLE_KEY

### Deployment Preparation for Custom Domain
- **Date**: January 26, 2025
- **Changes Made**:
  - Created `vercel.json` configuration for Vercel deployment
  - Added comprehensive `DEPLOYMENT_GUIDE.md` with step-by-step instructions
  - Created `.gitignore` file for proper version control
  - Configured build process for external hosting (GitHub + Vercel)
  - **Target**: Deploy to https://autodropplatform.shop instead of Replit domains
  - **Manual Steps Required**: User must push to GitHub and configure Vercel

### Security Fix: Stripe Credential Hardcoding
- **Date**: January 26, 2025
- **Changes Made**:
  - Removed hardcoded Stripe secret key from server/routes.ts line 180
  - Removed hardcoded Stripe publishable key from client/src/lib/stripe.ts
  - Both server and client now properly rely on environment variables
  - Changed error status from 400 to 500 for missing Stripe API key (server-side configuration error)
  - **Security Impact**: Eliminates credential exposure risk and improves production security posture

### Database Integration
- **Date**: January 26, 2025
- **Changes Made**:
  - Migrated from in-memory storage (MemStorage) to PostgreSQL database (DatabaseStorage)
  - Added Drizzle relations for proper table relationships
  - Created database tables using `npm run db:push`
  - Updated storage interface to use Drizzle ORM queries
  - Fixed TypeScript compatibility issues with bot functions
  - All data now persists in PostgreSQL database via Neon