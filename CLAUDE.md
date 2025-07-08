# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 application called "Feature Block" - a computer vision feature blocks app that uses React Konva for canvas-based graphics. The app features a sidebar navigation system and a workflow canvas for building visual components.

## Development Commands

```bash
# Install dependencies
pnpm install

# Development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint
```

## Architecture

### Core Technologies
- **Next.js 15** with App Router and React 19
- **TypeScript** with strict configuration
- **Tailwind CSS v4** for styling
- **React Konva** for canvas-based graphics rendering
- **Radix UI** components for accessible UI primitives
- **Shadcn/ui** component system with "new-york" style

### Key Components Structure

- **Layout System**: Uses Shadcn/ui sidebar with `SidebarProvider`, `AppSidebar`, and `SidebarInset`
- **Workflow Canvas**: Main feature using React Konva `Stage` and `Layer` components for graphics
- **Navigation**: Sidebar with grouped menu items (currently supports workflow navigation)
- **Responsive Design**: Canvas automatically resizes with window dimensions

### Important Configuration

- **Webpack Configuration**: Modified to support Konva (`canvas: 'canvas'` external)
- **SSR**: Workflow component uses `dynamic` import with `ssr: false` for client-side rendering
- **Path Aliases**: `@/*` maps to `./src/*` for clean imports
- **Shadcn/ui**: Components located in `@/components/ui/` with utils in `@/lib/utils`

### App Structure

- **Root**: Redirects to `/workflow` page
- **Layout**: Dark mode by default with sidebar navigation
- **Workflow Page**: Main canvas interface for building feature blocks
- **Component Organization**: UI components in `@/components/ui/`, app-specific in `@/components/`

### Development Notes

- Uses `pnpm` as package manager
- ESLint configured with Next.js rules and Prettier integration
- Canvas rendering requires client-side execution (SSR disabled for workflow)
- Responsive canvas implementation handles window resize events
- Sidebar navigation supports Chinese labels ("基础功能", "工作流")

## Key Files

- `src/components/workflow/index.tsx` - Main workflow canvas component
- `src/components/app-sidebar.tsx` - Navigation sidebar configuration
- `src/app/layout.tsx` - Root layout with sidebar provider
- `next.config.ts` - Webpack configuration for Konva support
- `components.json` - Shadcn/ui configuration