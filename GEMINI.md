# Project Overview

This is a React application built with Vite and TypeScript. It uses Tailwind CSS for styling and includes a variety of UI components from `shadcn/ui`. The project is set up with ESLint for linting, Prettier for formatting, and Vitest for testing.

## Building and Running

- **Development:** `npm run dev`
- **Build:** `npm run build`
- **Lint:** `npm run lint`
- **Format:** `npm run format`
- **Test:** `npm run test`

## Development Conventions

- The project uses TypeScript for static typing.
- Styling is done with Tailwind CSS.
- UI components are built using `shadcn/ui`.
- The project follows standard React conventions.
- State management is likely handled with Zustand, given its inclusion in the dependencies.
- Routing is handled by `react-router`.
- API calls are made using `axios`.

## Rules

- 应用仅用于桌面端，不考虑移动端适配
- 组件使用shadcn，图标使用lucide，样式使用shadcn定义的design token
- 生成的代码只保留必要的注释
- 生成的代码不使用any类型，都要进行eslint检查和typescript类型检查
- 对model层进行修改或新增时必须进行测试，测试覆盖率必须超过80%
