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

The database is managed via Prisma in the `packages/web` directory.

```bash
# Generate Prisma Client (after schema changes)
cd packages/web
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Reset database and re-seed
npx prisma migrate reset

# Open Prisma Studio (database GUI)
npx prisma studio

# Run seed script
npx tsx prisma/seed.ts
```

## Architecture

### Workspace Dependencies

The `web` package depends on the local `ui` package via the workspace protocol:
- `packages/web/package.json` includes `"@devboard-interactive/ui": "*"`
- Changes to UI components are automatically available to the web app in development

### Database Layer (Prisma)

- **Schema location**: `packages/web/prisma/schema.prisma`
- **Generated client**: Output to `packages/web/src/generated/prisma` (custom location)
- **Database**: PostgreSQL
- **Client singleton**: `packages/web/src/app/lib/prisma.ts` provides a singleton PrismaClient instance with hot-reload support in development
- **Data model**: Tasks with labels, using enums for Status and Priority

Key models:
- `Task`: Core task entity with title, description, status, priority, dueDate, and labels
- `Label`: Reusable labels with name and color that can be attached to multiple tasks

### UI Component Library (@devboard-interactive/ui)

Built with:
- **Bundler**: tsup (dual CJS/ESM output with TypeScript declarations)
- **Styling**: Tailwind CSS utility classes (expects Tailwind in consuming app)
- **React patterns**: forwardRef for all components, TypeScript interfaces extending native HTML attributes

Components follow a consistent pattern:
- Export both component and props interface
- Support className prop for extension
- Use variant/size prop patterns for visual variations
- All components are in `packages/ui/src/components/`

Available components:
- Button (variants: primary, secondary, danger, ghost; sizes: sm, md, lg; loading state)
- Input
- Card
- Badge
- Textarea

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

Always import from the custom output location:
```typescript
import { PrismaClient } from "../../generated/prisma/client";
```

### Component Development

When creating new UI components:
1. Add to `packages/ui/src/components/`
2. Export component and props from component file
3. Add exports to `packages/ui/src/index.ts`
4. Rebuild the UI package or run in watch mode
5. Use Tailwind utility classes for styling

### Database Schema Changes

1. Edit `packages/web/prisma/schema.prisma`
2. Run `npx prisma migrate dev --name descriptive_name`
3. Prisma Client will auto-generate to `src/generated/prisma`
4. Update seed file if needed

## MCP Configuration

The project has Prisma MCP server configured in `.mcp.json` for database operations via Model Context Protocol.

## Common Tasks

### Adding a New UI Component

1. Create component file in `packages/ui/src/components/ComponentName.tsx`
2. Export component and props interface from the component file
3. Add exports to `packages/ui/src/index.ts`
4. Rebuild UI package: `npm run build --workspace=packages/ui`
5. Use Tailwind utility classes for styling

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
│   │   │   └── lib/            # Utilities and singleton instances
│   │   ├── prisma/
│   │   │   ├── schema.prisma   # Database schema
│   │   │   └── seed.ts         # Database seed script
│   │   └── public/             # Static assets
│   └── ui/                     # Shared component library
│       ├── src/
│       │   ├── components/     # React components
│       │   └── index.ts        # Package exports
│       └── dist/               # Built output (generated)
├── .mcp.json                   # MCP server configuration
├── CLAUDE.md                   # This file
└── package.json                # Root package with workspaces
