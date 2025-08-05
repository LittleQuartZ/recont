# Agent Guidelines for recont

## Build/Development Commands
- `pnpm dev` - Start all services in development mode
- `pnpm build` - Build all packages
- `pnpm check-types` - Run TypeScript type checking across all packages
- `pnpm dev:web` - Start only the web app (React Router)
- `pnpm dev:native` - Start only the native app (Expo)
- `pnpm dev:server` - Start only the backend (Convex)

## Code Style & Conventions
- Use TypeScript with strict typing, prefer `type` over `interface`
- Import statements: Group imports - external libraries first, then internal from `@/` paths
- Components: Use React functional components with named exports
- Styling: TailwindCSS classes, no inline styles
- File naming: kebab-case for files, PascalCase for React components
- Error handling: Throw descriptive Error objects with clear messages
- State management: Convex for backend state, useState/React state for local UI state
- Authentication: Use Clerk for user authentication patterns

## Project Structure
- Monorepo with apps (web/native) and packages (backend)
- Web: React Router v7 with TypeScript
- Native: Expo with React Native and NativeWind
- Backend: Convex with TypeScript for serverless functions
- UI Components: Radix UI primitives with custom styling