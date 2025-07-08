# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React + TypeScript + Vite application that implements a drag-and-drop feature block system using `@dnd-kit/core` and `@xyflow/react`. The application appears to be building a visual flow/pipeline editor with draggable blocks that can be placed in containers and nodes.

## Key Dependencies & Architecture

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4 with shadcn/ui components
- **Drag & Drop**: @dnd-kit/core for drag-and-drop functionality
- **Flow Visualization**: @xyflow/react for flow diagrams
- **State Management**: Zustand for global state
- **Routing**: React Router v7
- **UI Components**: shadcn/ui with Lucide React icons

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint

# Format code with Prettier
npm run format

# Preview production build
npm run preview
```

## Code Structure

- **src/components/**: Main UI components
  - `flow-panel.tsx`: Main panel component for displaying blocks
  - `draggable-block.tsx`: Individual draggable block component
  - `droppable-container.tsx`: Container that accepts dropped blocks
  - `custom-node/`: Custom node components for flow visualization
  - `ui/`: shadcn/ui components
- **src/lib/**: Utility functions and shared logic
- **src/layouts/**: Layout components
- **Path Aliases**: Uses `@/*` for `src/*` directory imports

## Component Architecture

The application uses a drag-and-drop system where:

- `DraggableBlock` components can be dragged from panels
- `DroppableContainer` components accept dropped blocks
- Flow visualization is handled through `@xyflow/react`
- State management likely coordinated through Zustand

## TypeScript Configuration

- Uses TypeScript project references with separate configs for app and node
- Path aliases configured for `@/*` imports
- Strict mode enabled

## Styling & UI

- Tailwind CSS v4 with shadcn/ui components
- Uses "new-york" style variant
- Neutral base color scheme
- CSS variables enabled for theming
- Lucide React for icons

## Timeline & Development Plan

Based on `timeline.md`, this appears to be a multi-phase project with estimated timelines:

- Layout system (2 days)
- Data management (3 days)
- Operator management (3 days)
- User management + login (3 days)
- Network management systems (3 days each)
- Training & testing systems (3-5 days)
