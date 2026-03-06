# Attaie Cigars - Premium Cigar E-Commerce

## Overview

Attaie Cigars is a premium full-stack TypeScript e-commerce platform offering a luxurious dark-themed experience with vibrant Dominican Republic-inspired branding for cigar enthusiasts. The project aims to provide a sophisticated online retail environment featuring a curated product catalog, age verification, and rich interactive content exploring the world of cigars. This platform is designed to be a leading online destination for premium cigars, emphasizing brand heritage and product quality.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter
- **State Management**: TanStack React Query
- **Styling**: Tailwind CSS with a luxury dark theme and vibrant Caribbean color palette (Teal, Gold, Coral, Lavender, Peach, Cream, Mint)
- **UI Components**: shadcn/ui built on Radix UI
- **Animations**: Framer Motion for interactive elements and transitions
- **Key Features**:
    - Age verification gate (localStorage-based)
    - Product catalog with filtering and individual product pages
    - Interactive elements: Humidor Gauge, Ring Gauge Comparison, Age Meter, Dominican Republic Map, Transformation Slider, Cigar Anatomy Diagram
    - Premium branding: Founder's Note, Certificate of Authenticity
    - Lifestyle sections: Master Rollers, Lifestyle Gallery, Rolling Process video
    - Comprehensive navigation with glassmorphism effects and animated flourishes
    - Dedicated pages for Heritage, Cigar Guide, Accessories, Contact, Cart, and Retailer Locator
    - Optimized image loading with `LazyImage` component

### Backend
- **Framework**: Express 5 on Node.js with TypeScript
- **API Pattern**: RESTful endpoints with Zod validation schemas
- **Admin Dashboard**:
    - Accessible at `/admin`
    - Session-based authentication with role-based access control
    - Features: Dashboard metrics, order management (status, fulfillment, shipping), product CRUD, promo code management, site settings, user management, activity logs, data export.
    - Integrated USPS and UPS shipping APIs for real-time rates, label generation, and tracking.

### Data Storage
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM with Drizzle Kit for migrations
- **Schema**: Defined in `shared/schema.ts`
- **Session Management**: Secure cookie-based sessions with bcrypt password hashing

### Project Structure
- `client/`: React frontend
- `server/`: Express backend
- `shared/`: Shared types, schemas, and API route definitions for type safety across the stack.

### Key Design Decisions
- **Shared Types**: Ensures type safety and consistency between frontend and backend.
- **Storage Abstraction**: Database operations handled by `DatabaseStorage` class.
- **API Contract**: Zod schemas enforce API request/response validation.
- **Accessibility**: UI components built on Radix primitives with full keyboard navigation and ARIA support.
- **Visual Design**: Dark theme with vibrant Caribbean accents, multi-color gradients, custom CSS utilities for animations, hover effects, and unique typographic styles (e.g., `Cormorant Garamond`, `Bebas Neue`).

## External Dependencies

### Database
- **PostgreSQL**: Primary database.

### Frontend Libraries
- **@tanstack/react-query**: Server state management.
- **framer-motion**: UI animations.
- **wouter**: Client-side routing.
- **lucide-react**: Icons.
- **date-fns**: Date utilities.

### UI Framework Components
- **Radix UI**: Accessible UI primitives.
- **shadcn/ui**: Component library.

### Build & Development Tools
- **Vite**: Frontend build tool.
- **esbuild**: Server bundling.
- **drizzle-kit**: Database migration tooling.

### Shipping Integrations
- **USPS API**: For shipping rates, label generation, and tracking.
- **UPS API**: For shipping rates, label generation, and tracking.