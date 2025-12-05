# @devboard-interactive/ui

A shared React component library for the DevBoard application, providing reusable UI components with Tailwind CSS styling.

## Overview

This package contains a collection of React components designed for the DevBoard task management platform. All components are built with TypeScript, follow consistent patterns, and support Tailwind CSS customization.

## Technology Stack

- **React**: ^18.0.0 (peer dependency)
- **TypeScript**: Strict mode with full type definitions
- **Build Tool**: tsup (dual CJS/ESM output)
- **Styling**: Tailwind CSS utility classes
- **Patterns**: forwardRef for all components, extending native HTML attributes

## Installation

This package is part of a monorepo and uses npm workspaces. Install dependencies from the project root:

```bash
npm install
```

## Development

### Building the Package

Build once:

```bash
npm run build --workspace=packages/ui
```

Or from this directory:

```bash
npm run build
```

### Watch Mode

Automatically rebuild on changes:

```bash
npm run dev --workspace=packages/ui
```

Or from this directory:

```bash
npm run dev
```

### Type Checking

Run TypeScript type checking:

```bash
npm run type-check
```

### Linting

Run ESLint:

```bash
npm run lint
```

## Available Components

### Button

A versatile button component with multiple variants, sizes, and loading state.

**Variants**: `primary`, `secondary`, `danger`, `ghost`
**Sizes**: `sm`, `md`, `lg`

```typescript
import { Button } from "@devboard-interactive/ui";

<Button variant="primary" size="md" loading={false}>
  Click me
</Button>
```

### Input

Standard text input component with consistent styling.

```typescript
import { Input } from "@devboard-interactive/ui";

<Input type="text" placeholder="Enter text..." />
```

### Textarea

Multi-line text input component.

```typescript
import { Textarea } from "@devboard-interactive/ui";

<Textarea placeholder="Enter description..." rows={4} />
```

### Card

Container component for grouping related content.

```typescript
import { Card } from "@devboard-interactive/ui";

<Card>
  <h2>Card Title</h2>
  <p>Card content goes here</p>
</Card>
```

### Badge

Small label component for displaying status, tags, or counts.

```typescript
import { Badge } from "@devboard-interactive/ui";

<Badge>New</Badge>
```

## Component Patterns

All components in this library follow consistent patterns:

### TypeScript Interface

Each component exports both the component and its props interface:

```typescript
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", loading = false, ...props }, ref) => {
    // Component implementation
  }
);
```

### forwardRef Support

All components use `React.forwardRef` to allow ref forwarding:

```typescript
const buttonRef = useRef<HTMLButtonElement>(null);
<Button ref={buttonRef}>Click me</Button>
```

### className Extension

All components accept a `className` prop for additional Tailwind classes:

```typescript
<Button className="mt-4 w-full">Submit</Button>
```

### Extending Native Attributes

Component props extend native HTML element attributes:

```typescript
// ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>
<Button type="submit" disabled onClick={handleClick}>
  Submit
</Button>
```

## Adding New Components

To add a new component to the library:

1. Create a new file in `src/components/ComponentName.tsx`
2. Export both the component and its props interface
3. Add the export to `src/index.ts`
4. Rebuild the package: `npm run build`

Example component structure:

```typescript
import React, { forwardRef } from "react";

export interface MyComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "alternate";
}

export const MyComponent = forwardRef<HTMLDivElement, MyComponentProps>(
  ({ variant = "default", className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={`base-classes ${className || ""}`} {...props}>
        {children}
      </div>
    );
  }
);

MyComponent.displayName = "MyComponent";
```

## Build Output

The package builds to the `dist/` directory with the following outputs:

- **CJS**: `dist/index.js` (CommonJS for Node.js)
- **ESM**: `dist/index.mjs` (ES Modules for modern bundlers)
- **Types**: `dist/index.d.ts` (TypeScript declarations)

## Package Configuration

The package is configured for optimal distribution:

```json
{
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "files": ["dist"]
}
```

## Styling Requirements

This library uses Tailwind CSS utility classes. The consuming application (e.g., `@devboard-interactive/web`) must:

1. Have Tailwind CSS installed and configured
2. Include this package's components in the Tailwind content paths
3. Use compatible Tailwind configuration

## Usage in Other Packages

This package is used in the monorepo via workspace protocol:

```json
{
  "dependencies": {
    "@devboard-interactive/ui": "*"
  }
}
```

Import components in your application:

```typescript
import { Button, Input, Card, Badge, Textarea } from "@devboard-interactive/ui";
```

## Development Workflow

1. Make changes to components in `src/components/`
2. Run `npm run dev` for watch mode (auto-rebuild on changes)
3. Test changes in the web application
4. Build for production with `npm run build`

## TypeScript Configuration

- **Output**: `dist/` directory
- **Declarations**: Generated `.d.ts` files
- **Source Maps**: Generated for debugging
- **Strict Mode**: Enabled for type safety

## License

MIT

## Repository

[https://github.com/skyisthelimit/devboard](https://github.com/skyisthelimit/devboard)
