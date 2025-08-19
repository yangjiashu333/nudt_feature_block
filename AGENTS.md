# Repository Guidelines

## Project Structure & Module Organization
- `src/`: application code.
  - `components/` (UI, feature, user, dataset components), `pages/`, `layouts/`, `hooks/`, `models/` (Zustand stores), `services/` (API), `types/`, `config/`, `mocks/` (MSW), `assets/`.
  - `__tests__/`: unit tests and setup (`src/__tests__/setup/vitest.setup.ts`).
- `public/`: static assets (MSW worker output).
- `dist/`: production build output.
- Path alias: import via `@/...` for files under `src/`.

## Build, Test, and Development Commands
- `npm run dev`: start Vite dev server.
- `npm run build`: type-check (`tsc -b`) and build for production.
- `npm run preview`: preview the production build locally.
- `npm run lint`: run ESLint.
- `npm run format`: run Prettier.
- `npm test` or `npm run test:run`: run Vitest in Node env.
- `npm run test:ui`: open the Vitest UI.
- Coverage (example): `npx vitest run --coverage`.

## Coding Style & Naming Conventions
- TypeScript, strict mode enabled. React + Vite.
- Prettier: 2 spaces, single quotes, semicolons, width 100.
- ESLint: recommended + TS + React hooks; unused vars allowed when prefixed with `_`.
- Files: kebab-case (e.g., `edit-feature-modal.tsx`); components exported with PascalCase.
- Use the `@` alias for imports: `import { useFeatureStore } from '@/models/feature';`.

## Testing Guidelines
- Framework: Vitest with globals; setup at `src/__tests__/setup/vitest.setup.ts`.
- MSW is used for API mocking; enable via env (`VITE_ENABLE_MSW=true`) for dev/tests.
- Place tests under `src/__tests__`, name as `*.test.ts(x)` mirroring source folders.
- Keep tests deterministic; reset stores/mocks between tests.

## Commit & Pull Request Guidelines
- Use Conventional Commits: `feat(scope): ...`, `fix(scope): ...`, `refactor(scope): ...`.
  - Examples: `feat(feature): implement CRUD`, `fix(api): timeout handling`.
- PRs: include clear description, linked issues, screenshots for UI changes, and test notes.
- Before opening a PR: run `npm run lint`, `npm test`, and ensure `npm run build` succeeds.

## Security & Configuration Tips
- Configure env in `.env.local` (see `.env.example`). Keys: `VITE_API_BASE_URL`, `VITE_API_TIMEOUT`, `VITE_ENABLE_MSW`.
- Do not commit real secrets. Prefer mock mode (`VITE_ENABLE_MSW=true`) for local development.
