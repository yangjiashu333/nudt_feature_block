# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **React 19 + TypeScript 5.8 + Vite** application for data pipeline/ML feature management, using **session-based authentication** with HTTP-only cookies and **Zustand** for state management.

## Development Commands

```bash
# Development
npm run dev                 # Start development server
npm run build              # Production build (TypeScript + Vite)
npm run test               # Run all tests with Vitest
npm run test:ui            # Interactive test UI
npm run lint               # ESLint with TypeScript rules
npm run format             # Prettier formatting

# Testing specific files
npx vitest tests/models/auth.test.ts        # Run specific test file
npx vitest --watch tests/models/            # Watch mode for directory
```

## Architecture Overview

### State Management Pattern

- **Zustand stores** in `/src/models/` act as domain models (not Redux)
- **Persistent auth store** manages session state with localStorage backup
- **No React Query** - async data handled through Zustand actions + Axios

### Authentication System

- **Session-based with HTTP-only cookies** (not JWT tokens)
- HTTP client configured with `withCredentials: true`
- **Automatic 401 handling** in HTTP interceptor clears auth state and redirects
- **Route protection** at layout level, not component level

### HTTP Layer Architecture

- **Centralized HTTP client** in `/src/services/http/index.ts`
- **Automatic error handling** with toast notifications (uses Sonner)
- **Request configuration options**:
  - `skipAuth: true` for login/register endpoints
  - `silentError: true` to suppress toast notifications
  - `customErrorHandler` for specific error handling

### Component Structure

- **shadcn/ui + Radix UI** component system in `/src/components/ui/`
- **Feature-based organization** - components grouped by domain (dashboard, user)
- **Form handling** with React Hook Form + Zod validation

## Key Technical Decisions

1. **No token storage** - authentication relies entirely on server-managed sessions
2. **Error handling centralized** in HTTP layer to reduce development overhead
3. **TypeScript strict mode** with comprehensive type definitions in `/src/types/`
4. **Path aliases** configured: `@/*` maps to `./src/*`

## Testing Strategy

- **Vitest** with Node.js environment and mocked browser APIs
- **Service layer mocking** in `/tests/mocks/` with realistic data
- **State management testing** focuses on async actions and error states
- **Test structure mirrors source** - organize by domain, not technical layers

## Common Patterns

### Adding New Features

1. Define types in `/src/types/[domain].ts`
2. Create API endpoints in `/src/services/api/[domain].ts`
3. Build Zustand store in `/src/models/[domain].ts`
4. Create components in `/src/components/[domain]/`
5. Add tests in `/tests/models/[domain].test.ts`

### API Error Handling

```typescript
// Automatic error handling (default)
await httpService.post('/api/data', payload);

// Silent errors for optional operations
await httpService.post('/api/data', payload, { silentError: true });

// Custom error handling
await httpService.post('/api/data', payload, {
  customErrorHandler: (error) => {
    /* custom logic */
  },
});
```

### Authentication Checks

```typescript
// In components - reactive to auth state changes
const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
const user = useAuthStore((state) => state.user);
```

## Domain Context

The application supports role-based access (user, admin, ban) for collaborative data science workflows.

## Rules

- 应用仅用于桌面端，不考虑移动端适配
- 组件使用shadcn，图标使用lucide，样式使用shadcn定义的design token
- 生成的代码只保留必要的注释
- 生成的代码不使用any类型，都要进行eslint检查和typescript类型检查
- 对model层进行修改或新增时必须进行测试，测试覆盖率必须超过80%
