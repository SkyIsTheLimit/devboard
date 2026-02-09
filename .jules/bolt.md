## 2024-05-23 - Task Edit Sheet Auto-Save Performance
**Learning:** The `TaskEditSheet` component triggers `router.refresh()` on every field blur (auto-save). In Next.js App Router, this causes a full server re-render of the current route (including `getTasks` and `Header` auth checks). This ensures data consistency (e.g. task moving out of filtered list) but is expensive for simple text edits.
**Action:** Future optimizations could implement optimistic updates for the list while keeping the sheet open, avoiding `router.refresh()` until the sheet closes, or using more granular revalidation.
