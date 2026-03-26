# Bolt's Performance Journal

## 2026-03-24 - Prefetch Labels to Eliminate waterfalls
**Learning:** Initializing Client Components with `useEffect` fetches creates sequential waterfalls (Server Component fetches -> Client Component Mounts -> Client Component fetches). In this codebase, `TaskEditSheet` was fetching labels on mount, causing a delay when opening the edit sheet.
**Action:** Prefetch shared data like `labels` in the Server Component (`page.tsx`) using `Promise.all` and pass them down as `initialLabels` props. This ensures data is available immediately on the client and reduces total load time.
