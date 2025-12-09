# @devboard-interactive/ui

A beautiful, accessible React component library built with Tailwind CSS and Radix UI primitives. Perfect for building modern task management interfaces and beyond.

## Features

- **Modern & Accessible**: Built on Radix UI primitives for best-in-class accessibility
- **Fully Typed**: Complete TypeScript support with comprehensive type definitions
- **Tailwind Native**: Designed for Tailwind CSS with utility-first styling
- **Customizable**: Every component accepts `className` for easy customization
- **Tree-shakeable**: Dual CJS/ESM output for optimal bundle sizes
- **Variant System**: Powered by `class-variance-authority` for consistent variant patterns

## Installation

This package is part of the DevBoard monorepo. If you're using it in the monorepo:

```bash
npm install
```

To use in an external project:

```bash
npm install @devboard-interactive/ui
```

## Requirements

This library requires Tailwind CSS in your project:

```bash
npm install tailwindcss
```

Make sure to include the UI package in your Tailwind configuration:

```js
// tailwind.config.js
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@devboard-interactive/ui/**/*.{js,mjs}",
  ],
  // ... rest of config
}
```

## Quick Start

```tsx
import { Button, Card, Badge } from "@devboard-interactive/ui";

function App() {
  return (
    <Card>
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4">Welcome</h2>
        <Badge variant="secondary">New Feature</Badge>
        <Button variant="default" size="lg" className="mt-4">
          Get Started
        </Button>
      </div>
    </Card>
  );
}
```

## Components

### Button

A versatile button component with multiple variants and sizes, built on Radix UI Slot for composition.

**Variants**: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`
**Sizes**: `default`, `sm`, `lg`, `icon`

```tsx
import { Button } from "@devboard-interactive/ui";

// Basic usage
<Button>Click me</Button>

// With variants and sizes
<Button variant="destructive" size="lg">Delete</Button>
<Button variant="outline" size="sm">Cancel</Button>
<Button variant="ghost">Clear</Button>

// As a child component (using Radix Slot)
<Button asChild>
  <a href="/dashboard">Go to Dashboard</a>
</Button>

// With custom styling
<Button className="w-full mt-4">Submit</Button>
```

**Props**:
- `variant`: Visual style variant
- `size`: Size variant
- `asChild`: Render as the child element (using Radix Slot)
- All standard button HTML attributes

---

### Badge

Small label component for displaying status, tags, or counts.

**Variants**: `default`, `secondary`, `destructive`, `outline`

```tsx
import { Badge } from "@devboard-interactive/ui";

<Badge>Default</Badge>
<Badge variant="secondary">In Progress</Badge>
<Badge variant="destructive">Urgent</Badge>
<Badge variant="outline">New</Badge>

// Custom styling
<Badge className="ml-2">+5</Badge>
```

**Props**:
- `variant`: Visual style variant
- All standard div HTML attributes

---

### Card

Flexible container component with multiple sub-components for structured content.

**Sub-components**: `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`

```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@devboard-interactive/ui";

<Card>
  <CardHeader>
    <CardTitle>Project Updates</CardTitle>
    <CardDescription>Recent changes to your projects</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Content goes here...</p>
  </CardContent>
  <CardFooter>
    <Button>View All</Button>
  </CardFooter>
</Card>
```

**Props**: All standard div HTML attributes for each component

---

### Input

Styled text input component with consistent design.

```tsx
import { Input } from "@devboard-interactive/ui";

<Input type="text" placeholder="Enter your name..." />
<Input type="email" placeholder="Email address" />
<Input type="password" placeholder="Password" disabled />

// With custom styling
<Input className="max-w-md" />
```

**Props**: All standard input HTML attributes

---

### Textarea

Multi-line text input component.

```tsx
import { Textarea } from "@devboard-interactive/ui";

<Textarea placeholder="Enter description..." />
<Textarea rows={6} placeholder="Detailed notes..." />

// With custom styling
<Textarea className="min-h-[120px]" />
```

**Props**: All standard textarea HTML attributes

---

### Label

Accessible form label component built on Radix UI.

```tsx
import { Label, Input } from "@devboard-interactive/ui";

<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" placeholder="Enter your email" />
</div>
```

**Props**: All Radix UI Label props plus standard label HTML attributes

---

### Select

Accessible dropdown select component built on Radix UI with beautiful animations.

**Sub-components**: `Select`, `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem`, `SelectLabel`, `SelectGroup`, `SelectSeparator`

```tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
  SelectGroup,
} from "@devboard-interactive/ui";

<Select>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="Select priority" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel>Priority</SelectLabel>
      <SelectItem value="low">Low</SelectItem>
      <SelectItem value="medium">Medium</SelectItem>
      <SelectItem value="high">High</SelectItem>
      <SelectItem value="urgent">Urgent</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>
```

**Props**: All Radix UI Select props

---

### Separator

Visual divider component for separating content.

```tsx
import { Separator } from "@devboard-interactive/ui";

// Horizontal separator (default)
<Separator />

// Vertical separator
<div className="flex h-5 items-center">
  <span>Item 1</span>
  <Separator orientation="vertical" className="mx-2" />
  <span>Item 2</span>
</div>
```

**Props**:
- `orientation`: `"horizontal"` (default) or `"vertical"`
- `decorative`: Boolean, default `true`
- All Radix UI Separator props

---

### Item

Advanced compositional component for building list items with media, content, and actions.

**Sub-components**: `Item`, `ItemGroup`, `ItemMedia`, `ItemContent`, `ItemTitle`, `ItemDescription`, `ItemActions`, `ItemHeader`, `ItemFooter`, `ItemSeparator`

**Variants**: `default`, `outline`, `muted`
**Sizes**: `default`, `sm`

```tsx
import {
  Item,
  ItemGroup,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
  ItemSeparator,
  Badge,
  Button,
} from "@devboard-interactive/ui";

// Simple item
<Item>
  <ItemContent>
    <ItemTitle>Task Title</ItemTitle>
    <ItemDescription>This is a task description</ItemDescription>
  </ItemContent>
</Item>

// Complex item with media and actions
<Item variant="outline" size="default">
  <ItemMedia variant="icon">
    <CheckCircle />
  </ItemMedia>
  <ItemContent>
    <ItemTitle>Project Completed</ItemTitle>
    <ItemDescription>
      The DevBoard project has been successfully deployed
    </ItemDescription>
  </ItemContent>
  <ItemActions>
    <Badge variant="secondary">Done</Badge>
    <Button variant="ghost" size="icon">
      <MoreVertical />
    </Button>
  </ItemActions>
</Item>

// Item group with separators
<ItemGroup>
  <Item>
    <ItemContent>
      <ItemTitle>First Item</ItemTitle>
    </ItemContent>
  </Item>
  <ItemSeparator />
  <Item>
    <ItemContent>
      <ItemTitle>Second Item</ItemTitle>
    </ItemContent>
  </Item>
</ItemGroup>
```

**Item Props**:
- `variant`: Visual style (`default`, `outline`, `muted`)
- `size`: Size variant (`default`, `sm`)
- `asChild`: Render as child element
- All standard div HTML attributes

**ItemMedia Props**:
- `variant`: `default`, `icon`, or `image`
- All standard div HTML attributes

---

## Utilities

### cn (className merger)

The library exports a `cn` utility function for merging Tailwind classes:

```tsx
import { cn } from "@devboard-interactive/ui";

const className = cn(
  "base-class",
  condition && "conditional-class",
  "override-class"
);
```

This utility uses `clsx` and `tailwind-merge` to intelligently merge class names.

---

## Development

### Building

Build the package:

```bash
npm run build --workspace=packages/ui
```

Or from the `packages/ui` directory:

```bash
npm run build
```

### Watch Mode

Automatically rebuild on changes:

```bash
npm run dev --workspace=packages/ui
```

### Type Checking

```bash
npm run type-check
```

### Linting

```bash
npm run lint
```

---

## Design Patterns

### forwardRef

All components support ref forwarding:

```tsx
const inputRef = useRef<HTMLInputElement>(null);

<Input ref={inputRef} />

// Access the input element
inputRef.current?.focus();
```

### className Extension

Every component accepts `className` for custom styling:

```tsx
<Button className="w-full mt-4 bg-gradient-to-r from-blue-500 to-purple-600">
  Gradient Button
</Button>
```

### TypeScript

Full TypeScript support with exported prop types:

```tsx
import type { ButtonProps, BadgeProps } from "@devboard-interactive/ui";

const MyButton: React.FC<ButtonProps> = (props) => {
  return <Button {...props} />;
};
```

### Composition with asChild

Use the `asChild` prop (on components that support it) to compose components:

```tsx
<Button asChild>
  <Link to="/dashboard">Dashboard</Link>
</Button>
```

This renders the Link component with Button styles, instead of a button wrapping a link.

---

## Adding New Components

1. Create component in `src/components/ui/ComponentName.tsx`
2. Export from `src/index.ts`
3. Build the package
4. Document in this README

Example component structure:

```tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const myComponentVariants = cva(
  "base-classes",
  {
    variants: {
      variant: {
        default: "default-classes",
        alternate: "alternate-classes",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface MyComponentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof myComponentVariants> {}

const MyComponent = React.forwardRef<HTMLDivElement, MyComponentProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(myComponentVariants({ variant, className }))}
        {...props}
      />
    );
  }
);
MyComponent.displayName = "MyComponent";

export { MyComponent, myComponentVariants };
```

---

## Browser Support

This library supports all modern browsers:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

## Contributing

This is part of the DevBoard monorepo. To contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

## License

MIT

## Links

- **Repository**: [github.com/skyisthelimit/devboard](https://github.com/skyisthelimit/devboard)
- **Issues**: [github.com/skyisthelimit/devboard/issues](https://github.com/skyisthelimit/devboard/issues)
- **NPM**: `@devboard-interactive/ui`

---

Made with care for the DevBoard project
