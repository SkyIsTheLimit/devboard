## 2024-05-23 - [O(N*M) to O(N+M) React Rendering Optimization]
**Learning:** Checking for array membership `.includes()` inside `.map()` or `.filter()` loops during React rendering leads to O(N*M) complexity. This can cause significant rendering bottlenecks on lists.
**Action:** When filtering or mapping over an array `A` checking for membership in an array `B`, precompute a `Set` from array `B` outside the loop, resulting in O(N+M) complexity using `Set.has()`.
