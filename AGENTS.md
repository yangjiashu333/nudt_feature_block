# Repository Guidelines

## Project Structure & Module Organization
- App code lives in `src/` with feature folders: `pages/`, `components/`, `services/`, `models/`, `types/`, `hooks/`, `layouts/`, `lib/`, `mocks/`, and `assets/`.
- Public assets are in `public/`. Built output goes to `dist/` (ignored). Coverage reports are in `coverage/`.
- Path alias `@` maps to `src` (see `vite.config.ts`). Example: `import { http } from '@/services/http'`.

## Build, Test, and Development Commands
- `npm run dev` — Start Vite dev server.
- `npm run build` — Type-check (`tsc -b`) and build for production.
- `npm run preview` — Serve the production build locally.
- `npm run test` — Run Vitest in watch mode.
- `npm run test:run` — Run Vitest in CI mode.
- `npm run test:ui` — Launch Vitest UI.
- `npm run lint` — Lint with ESLint. `npm run format` — Format with Prettier.

## Coding Style & Naming Conventions
- TypeScript, React, Vite, Tailwind CSS 4. Use functional components and hooks.
- Prettier: single quotes, semicolons, width 100, 2-space tabs (`.prettierrc`).
- ESLint: TypeScript + React Hooks rules; unused variables prefixed with `_` allowed (`eslint.config.js`).
- File names: kebab-case for files, PascalCase for React components, camelCase for functions/variables, `IThing` avoided for types.

## Testing Guidelines
- Framework: Vitest. Co-locate tests as `*.test.ts`/`*.test.tsx` near the unit under test or in `__tests__/`.
- Prefer pure unit tests for `lib/` and `services/`; mock HTTP with MSW (`src/mocks/`).
- Aim for meaningful coverage on core logic; run `npm run test:run` locally before pushing. Add assertions for error paths.

## Commit & Pull Request Guidelines
- Use Conventional Commits: `feat(scope): summary`, `fix(scope): summary`, `refactor(scope): ...`. Example: `feat(job): add create job page`.
- PRs must include: clear description, linked issue (if any), screenshots for UI changes, and test notes.
- Keep PRs small and focused; update docs when changing public APIs or env.

## Security & Configuration Tips
- Environment config via `.env.local` (see `.env.example`). Required keys: `VITE_API_BASE_URL`, `VITE_API_TIMEOUT`, `VITE_ENABLE_MSW`.
- Do not commit secrets. Use `VITE_ENABLE_MSW=true` for offline development and tests.
