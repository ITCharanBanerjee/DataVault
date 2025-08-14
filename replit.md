# Overview

CodeShare is a full-stack web application for creating, sharing, and discovering code snippets. It provides real-time syntax highlighting, user authentication, and collaborative features for developers to share code snippets across multiple programming languages. The platform allows users to create accounts, publish public or private code snippets, like/favorite snippets, and explore popular content from the community.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: Radix UI primitives with shadcn/ui component library for consistent design
- **Styling**: Tailwind CSS with custom CSS variables for theming, featuring a dark theme with glassmorphism effects
- **Code Editor**: Monaco Editor integration for syntax highlighting and code editing
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Form Handling**: React Hook Form with Zod validation for type-safe forms
- **Authentication**: Context-based auth provider with session management

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Authentication**: Passport.js with local strategy, session-based authentication
- **Password Security**: Node.js crypto module with scrypt for password hashing
- **API Design**: RESTful endpoints for snippets, users, and authentication
- **Middleware**: Custom logging middleware for API requests and error handling
- **Development Tools**: TSX for TypeScript execution and hot reloading

## Database & ORM
- **Database**: PostgreSQL with Neon serverless driver
- **ORM**: Drizzle ORM with TypeScript-first schema definitions
- **Session Storage**: PostgreSQL session store using connect-pg-simple
- **Schema Design**: 
  - Users table with authentication fields
  - Snippets table with code content, metadata, and visibility settings
  - Snippet likes table for user engagement tracking
  - Proper foreign key relationships and cascade deletions

## Development & Build System
- **Bundler**: Vite for frontend with React plugin
- **TypeScript**: Shared types between client and server via shared schema
- **Path Aliases**: Configured for clean imports (@/ for client, @shared for shared code)
- **Build Process**: ESBuild for server bundling, Vite for client bundling
- **Hot Reloading**: Vite dev server with middleware mode for development

## Security & Session Management
- **Session Management**: Express session with PostgreSQL store
- **CORS**: Configured for development with credentials support
- **Authentication Flow**: Login/register endpoints with session persistence
- **Protected Routes**: Client-side route protection with authentication checks
- **Password Security**: Salted password hashing with timing-safe comparison

# External Dependencies

## Core Framework Dependencies
- **@neondatabase/serverless**: Neon PostgreSQL serverless database driver
- **drizzle-orm**: TypeScript ORM for database operations
- **drizzle-kit**: Database migration and schema management tools
- **express**: Web application framework for Node.js
- **passport**: Authentication middleware with local strategy

## Frontend UI Dependencies
- **@radix-ui/***: Headless UI components (dialog, dropdown, form controls, etc.)
- **@tanstack/react-query**: Server state management and data fetching
- **wouter**: Lightweight React router
- **react-hook-form**: Form handling with validation
- **@hookform/resolvers**: Form validation resolvers
- **zod**: Schema validation library
- **date-fns**: Date utility functions

## Development & Tooling
- **vite**: Frontend build tool and dev server
- **@vitejs/plugin-react**: Vite React plugin
- **tsx**: TypeScript execution for development
- **tailwindcss**: Utility-first CSS framework
- **monaco-editor**: Code editor component
- **class-variance-authority**: Utility for creating variant-based component APIs

## Authentication & Security
- **connect-pg-simple**: PostgreSQL session store for Express
- **drizzle-zod**: Integration between Drizzle schema and Zod validation

## Styling & Icons
- **tailwindcss**: Main styling framework with custom theme configuration
- **lucide-react**: Icon library for UI components
- **clsx**: Utility for constructing className strings conditionally