# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This is a pnpm workspace monorepo with three packages:

- `packages/web` (@nutd/web) - React frontend application using Vite, TypeScript, and Tailwind CSS
- `packages/server` (@nutd/server) - Express.js backend API using TypeScript and nodemon for development
- `packages/libs` (@nutd/libs) - Shared library package containing types, constants, enums, and utilities

All packages use the `@nutd/*` namespace and are linked via workspace dependencies.

## Development Commands

### Root-level commands (run from project root):
- `pnpm dev` - Start both frontend and backend development servers in parallel
- `pnpm build` - Build all packages
- `pnpm lint` - Run ESLint on all packages
- `pnpm lint:fix` - Fix ESLint issues across all packages
- `pnpm format` - Format code with Prettier across all packages
- `pnpm clean` - Remove node_modules, dist, and build directories from all packages

### Package-specific commands:
- `pnpm web:dev` - Start only the frontend development server (Vite on port 5173)
- `pnpm web:build` - Build the frontend application
- `pnpm server:dev` - Start only the backend development server (Express on port 3000)
- `pnpm server:build` - Build the backend application
- `pnpm server:start` - Start the production backend server
- `pnpm --filter @nutd/libs run build` - Build the shared libraries package

### Working with individual packages:
Use `pnpm --filter <package-name>` to run commands in specific packages:
- `pnpm --filter @nutd/web run <command>`
- `pnpm --filter @nutd/server run <command>`
- `pnpm --filter @nutd/libs run <command>`

## Architecture Notes

### Shared Libraries Package (@nutd/libs)
The libs package exports shared code through specific entry points:
- Main export: `import { ... } from '@nutd/libs'`
- Specific imports: `import { ... } from '@nutd/libs/types'`, `/constants`, `/enums`, `/utils`

The package structure includes:
- `src/types/` - TypeScript interfaces and type definitions
- `src/constants/` - Application constants (API endpoints, HTTP status codes, etc.)
- `src/enums/` - Enumeration definitions (UserRole, Environment, LogLevel)
- `src/utils/` - Utility functions (date formatting, validation, etc.)

### Frontend (Web Package)
- React 19 with TypeScript
- Vite for build tooling and development server
- Tailwind CSS for styling
- React Router for routing
- Consumes shared types and utilities from @nutd/libs

### Backend (Server Package)
- Express.js with TypeScript
- Basic health check endpoint at `/health`
- Consumes shared types and utilities from @nutd/libs
- Uses nodemon for development hot-reloading

## Important Notes

- Package Manager: This project uses pnpm (version 10.8.0) exclusively
- TypeScript: All packages use TypeScript ~5.8.3
- Code Quality: ESLint and Prettier are configured for all packages
- When making changes to @nutd/libs, run `pnpm --filter @nutd/libs run build` to rebuild the shared package
- The libs package uses ESM modules (`"type": "module"` in package.json)