# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development

- `npm run dev` - Start Vite development server
- `npm run build` - Build for production (runs TypeScript check first)
- `npm run preview` - Preview production build locally

### Code Quality

- `npm run lint` - Run ESLint on codebase
- `npm run format` - Format code with Prettier

### Testing

- `npm test` - Run tests in watch mode with Vitest
- `npm run test:run` - Run tests once
- `npm run test:ui` - Run tests with Vitest UI

## Architecture Overview

This is a React + TypeScript + Vite application using modern tooling and patterns:

### Tech Stack

- **Frontend**: React 19 with TypeScript, React Router v7 for routing
- **UI**: shadcn/ui components with Radix UI primitives and Tailwind CSS v4
- **State Management**: Zustand with persistence middleware for auth state
- **HTTP Client**: Axios with custom interceptors for error handling
- **Testing**: Vitest with MSW (Mock Service Worker) for API mocking
- **Build Tool**: Vite with path aliases (`@/` maps to `src/`)

### Project Structure

- `src/components/` - Reusable UI components organized by feature
  - `ui/` - shadcn/ui components (don't modify these directly)
  - `feature/` - Feature-specific components (features, datasets, etc.)
  - `user/` - User management components
  - `dashboard/` - Dashboard-specific components
- `src/pages/` - Route components for different app sections
- `src/models/` - Zustand stores for state management
- `src/services/` - API layer and HTTP utilities
- `src/types/` - TypeScript type definitions
- `src/mocks/` - MSW handlers and mock data for development
- `src/hooks/` - Custom React hooks
- `src/lib/` - Utility functions

### Key Patterns

#### State Management

Uses Zustand with persistence for auth state. Example store structure in `src/models/auth.ts`.

#### API Layer

Centralized HTTP service in `src/services/http/index.ts` with:

- Axios interceptors for error handling
- Automatic auth token management
- Toast notifications for errors
- Custom error types

#### Component Organization

- Feature-based component organization
- shadcn/ui for base components
- Consistent use of React Hook Form + Zod for forms
- Toast notifications via sonner

#### Mock Development

MSW is configured for development with:

- Handlers in `src/mocks/handlers/`
- Mock data in `src/mocks/data/`
- Automatic sync with auth state

#### Testing Setup

- Vitest configured with globals and Node environment
- Test setup file at `src/__tests__/setup/vitest.setup.ts`
- Component tests follow `.test.ts` naming convention

### TypeScript Configuration

- Uses project references with separate configs for app and Node
- Path alias `@/*` maps to `src/*`
- Strict TypeScript configuration

### ESLint Configuration

- Custom rules for unused variables (allows underscore prefix)
- Special rules for shadcn/ui components (disables react-refresh warnings)
- Prettier integration for consistent formatting
