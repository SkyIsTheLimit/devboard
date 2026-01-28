# AGENTS.md

Guidance for AI agents working with this codebase.

## Project Overview

DevBoard is a task management app built as a monorepo with two packages:

| Package | Path | Description |
|---------|------|-------------|
| `@devboard-interactive/web` | `packages/web/` | Next.js 16 application |
| `@devboard-interactive/ui` | `packages/ui/` | Shared React component library |

**Stack**: Next.js 16, React 19 (with compiler), Prisma 7, PostgreSQL, Tailwind CSS v4, NextAuth.js, Sentry

## Commands

Run all commands from the repository root unless specified otherwise.

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Build all packages |
| `npm run lint` | Lint all packages |
| `npm run type-check` | TypeScript check all packages |

### Database (from `packages/web/`)

| Command | Description |
|---------|-------------|
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:seed` | Seed the database |
| `npm run db:studio` | Open Prisma Studio GUI |
| `npx prisma migrate reset` | Reset database and re-seed |

## Code Style

- **TypeScript**: Strict mode enabled, use `@/*` path alias for imports
- **ESLint**: Configured per package, run `npm run lint` before committing
- **Components**: Use `cva` for variants, `cn()` for className merging
- **Server Actions**: Use `"use server"` directive, wrap with `withAuth()` for protected actions

### Import Patterns

```typescript
// Prisma client (singleton)
import { prisma } from "@/lib/prisma";

// UI components (each component has its own subpath)
import { Button } from "@devboard-interactive/ui/button";
import { Card } from "@devboard-interactive/ui/card";

// Utilities
import { cn } from "@/lib/utils";
```

### Component Pattern

All UI components in `packages/ui/src/components/ui/`:
- Use `forwardRef` for DOM element access
- Export component and props interface
- Support `className` prop for extension
- Use `class-variance-authority` for variant/size props

### Server Action Pattern

```typescript
"use server";
import { withAuth } from "@/server/with-auth";

export const myAction = withAuth(async (ctx) => {
  // ctx.user available, queries must filter by ctx.user.id
});
```

## Data Model

**Schema**: `packages/web/prisma/schema.prisma`

| Model | Description |
|-------|-------------|
| `User` | Auth user (OAuth only) |
| `Task` | Core entity with title, description, status, priority, dueDate |
| `Label` | Reusable tags attached to tasks |

**Enums**: `Status` (TODO, IN_PROGRESS, IN_REVIEW, DONE), `Priority` (LOW, MEDIUM, HIGH, URGENT)

## Testing

No test framework is currently configured. If adding tests, use Vitest.

## Security

### Authentication
- NextAuth.js with Google and GitHub OAuth providers
- Session stored in database via Prisma adapter
- Custom sign-in page at `/signin`

### Authorization
- All server actions must use `withAuth()` wrapper
- All database queries must filter by `userId` for tenant isolation
- Never expose user data across tenant boundaries

### Environment Variables

Required in `.env` (see `packages/web/env.example`):
- `DATABASE_URL` - PostgreSQL connection string
- `AUTH_SECRET` - NextAuth secret
- `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET` - Google OAuth
- `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET` - GitHub OAuth

## Observability

Sentry is configured for error tracking and performance monitoring:
- **Client**: `instrumentation-client.ts`
- **Server**: `sentry.server.config.ts`
- **Edge**: `sentry.edge.config.ts`

Use `Sentry.captureException(error)` in catch blocks. Use `Sentry.startSpan()` for performance tracing.

## Quick Reference

| Task | Action |
|------|--------|
| Add UI component | Create in `packages/ui/src/components/ui/`, export from `index.ts`, rebuild with `npm run build -w packages/ui` |
| Add database model | Edit `schema.prisma`, run `npm run db:migrate -w packages/web` |
| Add server action | Create in `packages/web/src/server/`, use `withAuth()` wrapper |
| Add API route | Create in `packages/web/src/app/api/` |
