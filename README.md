```
 ____  _____ __     __ ____   ___    _    ____  ____
|  _ \| ____\ \   / /| __ ) / _ \  / \  |  _ \|  _ \
| | | |  _|  \ \ / / |  _ \| | | |/ _ \ | |_) | | | |
| |_| | |___  \ V /  | |_) | |_| / ___ \|  _ <| |_| |
|____/|_____|  \_/   |____/ \___/_/   \_\_| \_\____/
```

<div align="center">

**A modern, powerful task management platform built with Next.js 16, React 19, and Prisma**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black.svg)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC.svg)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[![CI](https://github.com/SkyIsTheLimit/devboard/actions/workflows/ci.yml/badge.svg)](https://github.com/SkyIsTheLimit/devboard/actions/workflows/ci.yml)
[![NPM](https://img.shields.io/npm/v/@devboard-interactive/ui)](https://img.shields.io/npm/v/@devboard-interactive/ui)
</div>

---

## What is DevBoard?

DevBoard is a modern task management application designed for developers and teams who value simplicity, speed, and beautiful design. Built with cutting-edge web technologies, it provides a seamless experience for organizing and tracking your work.

### Features

- **User Authentication**: Secure sign-in with Google and GitHub OAuth
- **Intuitive Task Management**: Create, organize, and track tasks with ease
- **Multi-User Support**: Each user has their own private task list
- **Label System**: Categorize tasks with customizable colored labels
- **Priority Levels**: Assign priority (Low, Medium, High, Urgent) to stay focused
- **Status Tracking**: Track progress through TODO, IN_PROGRESS, IN_REVIEW, and DONE states
- **Modern UI**: Beautiful, accessible components built with Tailwind CSS and Radix UI
- **Type-Safe**: Full TypeScript support across the entire stack
- **Database-Driven**: PostgreSQL with Prisma ORM for reliable data management

---

## Tech Stack

### Frontend
- **Next.js 16** - App Router with React Server Components
- **React 19** - With React Compiler enabled for optimized performance
- **Tailwind CSS v4** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **TypeScript** - Strict mode for type safety

### Backend
- **Prisma** - Next-generation ORM for PostgreSQL
- **PostgreSQL** - Robust, scalable database
- **Next.js API Routes** - Serverless API endpoints

### Tooling
- **npm Workspaces** - Monorepo management
- **tsup** - Fast TypeScript bundler for component library
- **ESLint** - Code linting
- **Prisma Studio** - Database GUI

---

## Project Structure

This is a monorepo managed with npm workspaces:

```
devboard/
├── packages/
│   ├── web/          # Next.js application (main app)
│   └── ui/           # Shared React component library
├── CLAUDE.md         # AI assistant guidelines
└── package.json      # Root package with workspace configuration
```

### Packages

#### `@devboard-interactive/web`
The main Next.js application with:
- App Router for file-based routing
- Prisma integration for database operations
- API routes for task management
- Server and client components

#### `@devboard-interactive/ui`
A beautiful, reusable component library featuring:
- Button, Input, Textarea, Badge, Card components
- Select, Label, Separator (Radix UI based)
- Advanced Item component for list layouts
- Full TypeScript support
- Tailwind CSS styling

[View UI Documentation](./packages/ui/README.md)

---

## Getting Started

### Prerequisites

- **Node.js** 20+
- **npm** (comes with Node.js)
- **PostgreSQL** database

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/skyisthelimit/devboard.git
cd devboard
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in `packages/web/`:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/devboard?schema=public"

# Authentication (required)
AUTH_SECRET="your-secret-key-here-generate-with-openssl-rand-base64-32"
AUTH_TRUST_HOST="true"

# Google OAuth
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"

# GitHub OAuth
AUTH_GITHUB_ID="your-github-client-id"
AUTH_GITHUB_SECRET="your-github-client-secret"
```

See [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) for instructions on setting up OAuth credentials.

4. **Set up the database**

```bash
cd packages/web
npx prisma migrate dev
npx prisma db seed
```

5. **Start the development server**

```bash
# From the root directory
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your application!

---

## Development Commands

### Root Commands

```bash
# Start development server
npm run dev

# Build all packages
npm run build

# Run linting across all packages
npm run lint

# Type checking across all packages
npm run type-check

# Run tests (if configured)
npm run test
```

### Database Commands

From `packages/web/`:

```bash
# Run migrations
npm run db:migrate

# Seed the database
npm run db:seed

# Open Prisma Studio (database GUI)
npm run db:studio

# Generate Prisma Client
npx prisma generate
```

### UI Package Commands

```bash
# Build the UI package
npm run build --workspace=packages/ui

# Watch mode (auto-rebuild)
npm run dev --workspace=packages/ui
```

---

## Database Schema

### Task Model

```prisma
model Task {
  id          String    @id @default(cuid())
  title       String
  description String?
  status      Status    @default(TODO)
  priority    Priority  @default(MEDIUM)
  dueDate     DateTime?
  labels      Label[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
```

### Enums

- **Status**: `TODO`, `IN_PROGRESS`, `IN_REVIEW`, `DONE`
- **Priority**: `LOW`, `MEDIUM`, `HIGH`, `URGENT`

[View full schema](./packages/web/prisma/schema.prisma)

---

## Component Library

The `@devboard-interactive/ui` package provides a comprehensive set of components:

- **Button** - Multiple variants (default, destructive, outline, secondary, ghost, link)
- **Badge** - Status indicators with color variants
- **Card** - Container with header, content, and footer sub-components
- **Input** - Styled text input
- **Textarea** - Multi-line text input
- **Label** - Accessible form labels (Radix UI)
- **Select** - Dropdown select with animations (Radix UI)
- **Separator** - Visual dividers
- **Item** - Advanced compositional component for lists

See the [UI package README](./packages/ui/README.md) for detailed documentation.

---

## Key Features

### React Compiler

This project uses the new React Compiler (enabled in Next.js 16) for automatic optimization of React components. No manual memoization needed!

### Prisma Integration

- Custom output path: `src/generated/prisma`
- Singleton client pattern with hot-reload support
- PostgreSQL adapter for connection pooling
- Auto-generation on `npm install`

### Tailwind CSS v4

Using the latest Tailwind CSS with PostCSS for modern styling capabilities.

### TypeScript Strict Mode

Full type safety across the entire codebase with strict TypeScript configuration.

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## Project Guidelines

This project includes a `CLAUDE.md` file with comprehensive guidelines for AI assistants working on the codebase. It includes:

- Architecture overview
- Development commands
- Common patterns and practices
- Database management instructions

---

## License

This project is licensed under the MIT License.

---

## Links

- **Repository**: [github.com/skyisthelimit/devboard](https://github.com/skyisthelimit/devboard)
- **Issues**: [github.com/skyisthelimit/devboard/issues](https://github.com/skyisthelimit/devboard/issues)
- **Author**: [Sandeep Prasad](https://github.com/SkyIsTheLimit)

---

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components inspired by [shadcn/ui](https://ui.shadcn.com/)
- Icons by [Lucide](https://lucide.dev/)
- Database ORM by [Prisma](https://www.prisma.io/)

---

<div align="center">

**Made with ❤️ for developers, by developers**

⭐ Star this repo if you find it useful!

</div>
