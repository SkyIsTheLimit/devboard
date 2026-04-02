## 2025-05-24 - [Custom Prop Comparison for Server Component Payloads]
**Learning:** Next.js Server Components serialize Date objects/DTOs creating new references on every render, invalidating standard `React.memo`.
**Action:** We must use custom prop comparison for object references (`arePropsEqual`) to properly memoize Client Components that receive complex objects from Server Components.
