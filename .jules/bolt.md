## 2024-XX-XX - O(N*M) Complexity in React Component Rendering
**Learning:** Checking membership in an array using `.includes()` within a `.map()` or `.filter()` loop results in O(N*M) complexity. This is especially bad in React render cycles where it can cause significant performance degradation when N and M are large.
**Action:** Use a `Set` for O(1) membership lookups to reduce complexity to O(N+M). This should be a standard practice for rendering lists and filtering.
