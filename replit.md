# Cubic Technologies Business Website

## Overview

This is a multi-page business website for "Cubic Technologies," a digital agency offering web development, UI/UX design, AI solutions, and digital marketing services. The application is built as a full-stack TypeScript project with a React frontend and Express backend, featuring a contact form that stores consultation requests in a PostgreSQL database.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with custom design tokens and CSS variables
- **UI Components**: shadcn/ui component library (New York style) built on Radix UI primitives
- **Animations**: Framer Motion for page transitions and scroll animations
- **Form Handling**: React Hook Form with Zod validation

The frontend follows a pages-based structure with reusable components. Pages include Home, Services (with 6 sub-pages for each service), About, and Contact. Custom typography uses Outfit for display and Plus Jakarta Sans for body text.

### Backend Architecture
- **Framework**: Express 5 on Node.js
- **API Design**: Type-safe REST endpoints defined in `shared/routes.ts` with Zod schemas for request/response validation
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Development Server**: Vite dev server with HMR, proxied through Express

The backend is minimal, currently exposing a single POST endpoint for contact form submissions. The shared routes pattern ensures type safety between frontend and backend.

### Data Storage
- **Database**: PostgreSQL (connection via `DATABASE_URL` environment variable)
- **Schema**: Single table `consultation_requests` for storing contact form submissions
- **Migrations**: Drizzle Kit for schema management (`db:push` command)

### Build System
- **Frontend Build**: Vite with React plugin, outputs to `dist/public`
- **Backend Build**: esbuild bundling server code to `dist/index.cjs`
- **Development**: `tsx` for running TypeScript directly

### Path Aliases
- `@/*` → `./client/src/*` (frontend code)
- `@shared/*` → `./shared/*` (shared types and schemas)
- `@assets` → `./attached_assets` (static assets)

## External Dependencies

### Database
- **PostgreSQL**: Required, connection string must be provided via `DATABASE_URL` environment variable
- **connect-pg-simple**: Session storage (available but not currently used)

### UI/Component Libraries
- **Radix UI**: Headless UI primitives for accessibility
- **shadcn/ui**: Pre-styled component library
- **Lucide React**: Icon library
- **react-icons**: Additional icons (WhatsApp via SiWhatsapp)

### Animation & Interaction
- **Framer Motion**: Page and scroll animations
- **Embla Carousel**: Carousel component

### Form & Validation
- **React Hook Form**: Form state management
- **Zod**: Schema validation
- **drizzle-zod**: Auto-generate Zod schemas from Drizzle tables

### Date Handling
- **date-fns**: Date formatting utilities

### Development Tools
- **Vite**: Development server and bundler
- **@replit/vite-plugin-runtime-error-modal**: Error overlay for development
- **@replit/vite-plugin-cartographer**: Replit-specific development tools