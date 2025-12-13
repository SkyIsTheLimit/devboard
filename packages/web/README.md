# @devboard-interactive/web

The main Next.js application for DevBoard, a modern task management platform.

## Overview

This package contains the web application built with Next.js 16, React 19, and Prisma. It provides the user interface and backend API for managing tasks, labels, and other project-related data.

## Technology Stack

- **Framework**: Next.js 16 with App Router
- **React**: Version 19 with React Compiler enabled
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS v4
- **UI Components**: `@devboard-interactive/ui` (local workspace package)
- **TypeScript**: Strict mode enabled

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database
- npm (comes with Node.js)

### Installation

From the project root:

```bash
npm install
```

### Environment Setup

Create a `.env` file in this directory (`packages/web/`) with your database connection and authentication credentials:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/devboard"

# Authentication
AUTH_SECRET="your-secret-key-here-generate-with-openssl-rand-base64-32"
AUTH_TRUST_HOST="true"

# Google OAuth
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"

# GitHub OAuth
AUTH_GITHUB_ID="your-github-client-id"
AUTH_GITHUB_SECRET="your-github-client-secret"
```

To get OAuth credentials:
- **Google**: Create a project at [Google Cloud Console](https://console.cloud.google.com/) and set up OAuth 2.0 credentials
- **GitHub**: Register a new OAuth App at [GitHub Developer Settings](https://github.com/settings/developers)

### Database Setup

Generate Prisma Client:

```bash
npx prisma generate
```

Run migrations:

```bash
npx prisma migrate dev
```

Seed the database (optional):

```bash
npx tsx prisma/seed.ts
```

### Development

From the project root:

```bash
npm run dev
```

Or from this directory:

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Project Structure

```
packages/web/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Home page
│   │   └── lib/             # Utilities and helpers
│   │       └── prisma.ts    # Prisma Client singleton
│   └── generated/
│       └── prisma/          # Generated Prisma Client (custom output)
├── prisma/
│   ├── schema.prisma        # Database schema
│   ├── migrations/          # Database migrations
│   └── seed.ts              # Database seed script
├── public/                  # Static assets
└── next.config.ts           # Next.js configuration
```

## Key Features

### React Compiler

This project uses the experimental React Compiler enabled via `reactCompiler: true` in `next.config.ts`. This provides automatic memoization and optimization of React components.

### Prisma Configuration

- **Custom Output**: Prisma Client is generated to `src/generated/prisma` instead of the default location
- **Import Pattern**: Always import from the custom location:
  ```typescript
  import { PrismaClient } from "../../generated/prisma/client";
  ```
- **Singleton Instance**: Use the singleton from `src/app/lib/prisma.ts` in your application code

### Database Models

Current schema includes:

- **User**: User accounts with OAuth authentication support
- **Account**: OAuth provider accounts linked to users
- **Session**: User session management
- **Task**: Core task entity with title, description, status, priority, dueDate, labels, and user ownership
- **Label**: Reusable labels with name and color that can be attached to tasks

### Authentication

The application uses NextAuth.js (Auth.js v5) for authentication with support for:
- Google OAuth
- GitHub OAuth

Users must sign in to access the application. Tasks are automatically associated with the authenticated user and filtered accordingly.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Database Commands

```bash
# Generate Prisma Client after schema changes
npx prisma generate

# Create and run a new migration
npx prisma migrate dev --name descriptive_name

# Reset database and re-seed
npx prisma migrate reset

# Open Prisma Studio (database GUI)
npx prisma studio

# Run seed script
npx tsx prisma/seed.ts
```

## Path Aliases

The project uses TypeScript path aliases:

- `@/*` maps to `src/*`

Example:
```typescript
import { prisma } from "@/lib/prisma";
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

## License

MIT
