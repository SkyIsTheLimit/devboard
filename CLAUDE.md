# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DevBoard is a monorepo-based task management application built with Next.js, React, Prisma, and a custom UI component library. The project uses npm workspaces for managing multiple packages.

### Technology Stack

- **Frontend Framework**: Next.js 16 with App Router
- **React**: Version 19 with React Compiler enabled
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS v4
- **Package Manager**: npm with workspaces
- **Build Tools**: tsup for component library bundling
- **TypeScript**: Strict mode enabled across all packages

## Monorepo Structure

```
packages/
├── web/          Next.js application (main app)
└── ui/           Shared React component library
```

## Development Commands

### Running the Application

```bash
# Start development server (runs Next.js app)
npm run dev

# Build all packages
npm run build

# Run linting across all packages
npm run lint

# Run tests across all packages (if present)
npm run test

# Type checking across all packages
npm run type-check
```

### Working with Individual Packages

```bash
# Run commands in specific workspace
npm run dev --workspace=packages/web
npm run build --workspace=packages/ui
```

### Database Management (Prisma)

The database is managed via Prisma in the `packages/web` directory. You can run these commands from the root or from `packages/web/`:

```bash
# From packages/web directory:
cd packages/web

# Generate Prisma Client (after schema changes, also runs automatically on npm install)
npx prisma generate

# Run database migrations
npm run db:migrate
# or: npx prisma migrate dev

# Reset database and re-seed
npx prisma migrate reset

# Open Prisma Studio (database GUI)
npm run db:studio
# or: npx prisma studio

# Run seed script
npm run db:seed
# or: npx tsx prisma/seed.ts
```

## Architecture

### Workspace Dependencies

The `web` package depends on the local `ui` package via the workspace protocol:
- `packages/web/package.json` includes `"@devboard-interactive/ui": "*"`
- Changes to UI components are automatically available to the web app in development

### Database Layer (Prisma)

- **Schema location**: `packages/web/prisma/schema.prisma`
- **Generated client**: Output to `packages/web/src/generated/prisma` (custom location)
- **Database**: PostgreSQL with `@prisma/adapter-pg` for connection pooling
- **Client singleton**: `packages/web/src/lib/prisma.ts` provides a singleton PrismaClient instance with hot-reload support in development
- **Data model**: Tasks with labels, using enums for Status and Priority
- **Auto-generation**: Prisma Client regenerates automatically on `npm install` via postinstall hook

Key models:
- `Task`: Core task entity with title, description, status, priority, dueDate, and labels
- `Label`: Reusable labels with name and color that can be attached to multiple tasks

Enums:
- `Status`: TODO, IN_PROGRESS, IN_REVIEW, DONE
- `Priority`: LOW, MEDIUM, HIGH, URGENT

### UI Component Library (@devboard-interactive/ui)

Built with:
- **Bundler**: tsup (dual CJS/ESM output with TypeScript declarations)
- **Styling**: Tailwind CSS utility classes (expects Tailwind in consuming app)
- **Component Patterns**: Uses class-variance-authority (cva) for variant management
- **Primitives**: Radix UI primitives for accessible components (Label, Select, Separator, Slot)
- **React patterns**: forwardRef for all components, TypeScript interfaces extending native HTML attributes

Components follow a consistent pattern:
- Export both component and props interface
- Support className prop for extension
- Use variant/size prop patterns with class-variance-authority
- All components are in `packages/ui/src/components/ui/`
- Utilities in `packages/ui/src/lib/utils.ts` (includes `cn` helper for className merging)

Available components:
- Button (uses Radix Slot, multiple variants and sizes)
- Input
- Card
- Badge
- Textarea
- Label (Radix UI)
- Select (Radix UI)
- Separator (Radix UI)
- Item (custom component)

### Next.js Application (@devboard-interactive/web)

- **Framework**: Next.js 16 with App Router
- **React**: Version 19 with React Compiler enabled
- **Styling**: Tailwind CSS v4 with PostCSS
- **Path aliases**: `@/*` maps to `src/*`
- **Structure**: Standard Next.js App Router layout in `src/app/`

Key configuration:
- React Compiler is enabled via `reactCompiler: true` in `next.config.ts`
- TypeScript with strict mode
- ESLint configured

### TypeScript Configuration

- **UI package**: Outputs to `dist/`, generates declaration files and maps
- **Web package**: Next.js bundler module resolution, no emit (handled by Next.js)
- Both use strict mode

## Development Workflow

1. **Install dependencies**: Run `npm install` in the root (installs for all workspaces)
2. **Set up database**: Configure `DATABASE_URL` in `.env`, then run Prisma migrations
3. **Generate Prisma Client**: Run `npx prisma generate` in `packages/web/`
4. **Start dev server**: Run `npm run dev` from root
5. **UI component changes**: Build with `npm run build --workspace=packages/ui` or use watch mode with `npm run dev --workspace=packages/ui`

## Important Patterns

### Prisma Client Import

Always import the singleton instance from `src/lib/prisma.ts`:
```typescript
import { prisma } from "@/lib/prisma";
```

Or if importing types/client directly from generated code:
```typescript
import { PrismaClient } from "../generated/prisma/client";
```

### Component Development

When creating new UI components:
1. Add to `packages/ui/src/components/ui/`
2. Export component and props from component file
3. Add exports to `packages/ui/src/index.ts`
4. Rebuild the UI package or run in watch mode
5. Use Tailwind utility classes for styling
6. Consider using class-variance-authority for variants
7. Use the `cn()` utility from `@/lib/utils` for className merging

### Database Schema Changes

1. Edit `packages/web/prisma/schema.prisma`
2. Run `npx prisma migrate dev --name descriptive_name`
3. Prisma Client will auto-generate to `src/generated/prisma`
4. Update seed file if needed

## Observability and Monitoring

The project uses Sentry for error tracking, performance monitoring, and logging.

### Sentry Configuration

In Next.js, Sentry is initialized in three locations:
- **Client-side**: `instrumentation-client.(js|ts)`
- **Server-side**: `sentry.server.config.ts`
- **Edge runtime**: `sentry.edge.config.ts`

Initialization only needs to happen in these files. To use Sentry functionality elsewhere, import with:
```typescript
import * as Sentry from "@sentry/nextjs";
```

#### Baseline Configuration

```javascript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://e11c4288d6e6d0e8ff11407e88c8b6d2@o4510506402381824.ingest.us.sentry.io/4510506405986304",
  enableLogs: true,
});
```

#### Logger Integration

```javascript
Sentry.init({
  dsn: "https://e11c4288d6e6d0e8ff11407e88c8b6d2@o4510506402381824.ingest.us.sentry.io/4510506405986304",
  integrations: [
    // send console.log, console.warn, and console.error calls as logs to Sentry
    Sentry.consoleLoggingIntegration({ levels: ["log", "warn", "error"] }),
  ],
});
```

### Exception Catching

Use `Sentry.captureException(error)` to capture exceptions in try-catch blocks or areas where exceptions are expected:
```typescript
try {
  // risky operation
} catch (error) {
  Sentry.captureException(error);
}
```

### Tracing and Performance Monitoring

Create spans for meaningful actions like button clicks, API calls, and function calls using `Sentry.startSpan`. Child spans can exist within a parent span.

#### Custom Span in Component Actions

The `name` and `op` properties should be meaningful for the activities in the call. Attach attributes based on relevant information and metrics:

```javascript
function TestComponent() {
  const handleTestButtonClick = () => {
    // Create a transaction/span to measure performance
    Sentry.startSpan(
      {
        op: "ui.click",
        name: "Test Button Click",
      },
      (span) => {
        const value = "some config";
        const metric = "some metric";

        // Metrics can be added to the span
        span.setAttribute("config", value);
        span.setAttribute("metric", metric);

        doSomething();
      },
    );
  };

  return (
    <button type="button" onClick={handleTestButtonClick}>
      Test Sentry
    </button>
  );
}
```

#### Custom Span in API Calls

```javascript
async function fetchUserData(userId) {
  return Sentry.startSpan(
    {
      op: "http.client",
      name: `GET /api/users/${userId}`,
    },
    async () => {
      const response = await fetch(`/api/users/${userId}`);
      const data = await response.json();
      return data;
    },
  );
}
```

### Logging

Sentry provides structured logging with `logger.fmt` template literal function for variables:

```javascript
const { logger } = Sentry;

logger.trace("Starting database connection", { database: "users" });
logger.debug(logger.fmt`Cache miss for user: ${userId}`);
logger.info("Updated profile", { profileId: 345 });
logger.warn("Rate limit reached for endpoint", {
  endpoint: "/api/results/",
  isEnterprise: false,
});
logger.error("Failed to process payment", {
  orderId: "order_123",
  amount: 99.99,
});
logger.fatal("Database connection pool exhausted", {
  database: "users",
  activeConnections: 100,
});
```

## MCP Configuration

The project has Prisma MCP server configured in `.mcp.json` for database operations via Model Context Protocol.

## Common Tasks

### Adding a New UI Component

1. Create component file in `packages/ui/src/components/ui/ComponentName.tsx`
2. Export component and props interface from the component file
3. Add exports to `packages/ui/src/index.ts`
4. Rebuild UI package: `npm run build --workspace=packages/ui`
5. Use Tailwind utility classes for styling
6. Consider using class-variance-authority for variant patterns
7. Use the `cn()` utility from `@/lib/utils` for className merging

### Adding a Database Model

1. Edit `packages/web/prisma/schema.prisma`
2. Run migration: `cd packages/web && npx prisma migrate dev --name descriptive_name`
3. Update seed file if needed: `packages/web/prisma/seed.ts`
4. Prisma Client auto-generates to `src/generated/prisma`

### Running Tests

Run tests across all packages:
```bash
npm run test
```

### Type Checking

Check TypeScript across all packages:
```bash
npm run type-check
```

## Project Structure

```
devboard/
├── packages/
│   ├── web/                    # Next.js application
│   │   ├── src/
│   │   │   ├── app/            # App Router pages and layouts
│   │   │   ├── generated/      # Prisma Client output
│   │   │   │   └── prisma/     # Generated Prisma Client
│   │   │   └── lib/            # Utilities and singleton instances
│   │   │       └── prisma.ts   # Prisma Client singleton with pg adapter
│   │   ├── prisma/
│   │   │   ├── schema.prisma   # Database schema
│   │   │   └── seed.ts         # Database seed script
│   │   └── public/             # Static assets
│   └── ui/                     # Shared component library
│       ├── src/
│       │   ├── components/     # React components
│       │   │   └── ui/         # UI components
│       │   ├── lib/            # Utilities (cn helper, etc.)
│       │   └── index.ts        # Package exports
│       └── dist/               # Built output (generated)
├── .mcp.json                   # MCP server configuration
├── CLAUDE.md                   # This file
└── package.json                # Root package with workspaces
