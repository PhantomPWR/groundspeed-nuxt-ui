# Groundspeed Records UI

A modern, reactive frontend built with Nuxt 4 and NuxtUI to provide pilots with a platform to submit achieved groundspeeds.

## 1. Technologies & Packages

- **Nuxt 4:** The framework of choice for its directory-based routing, auto-imports, and Server-Side Rendering (SSR).
- **NuxtUI v2.19:** A stable component library combining Tailwind CSS and Headless UI for a consistent aviation-themed aesthetic.
- **pnpm:** Used for strict dependency management and performance.
- **Tailwind CSS:** Powers the responsive grid layouts and custom styling.

## 2. Components & State Management

- **Composables (`app/composables/useAuth.ts`):** Centralized authentication logic using `useCookie` to persist JWT tokens across browser sessions.
- **Pages Hierarchy:**
    - `/auth`: Grouped Login and Registration logic.
    - `/admin`: Dashboard for hierarchy management (Categories/Manufacturers/Models).
    - `/user`: Private dashboard for pilot submissions.
    - `/aircraft/[id]`: Dynamic routes to display technical specs and filtered records for specific models.
- **Reusable Forms:** Extracted form logic (e.g., `FormACModel.vue`) to ensure a "Single Source of Truth" for data entry across Admin and User sections.

## 3. Issues & Solutions

- **Component Resolution Errors:** Encountered issues with unreleased NuxtUI v3/v4 alpha components.
    - _Solution:_ Standardized on the stable **NuxtUI v2.19**.
- **State Syncing:** Dropdowns were not updating when parent data changed.
    - _Solution:_ Lifted state to the Page level and passed data down via **Props**, using `emit('success')` to trigger refreshes.
- **Hydration Mismatches:** Browser extensions (LastPass) were injecting HTML into forms.
    - _Solution:_ Optimized code for cleaner SSR output and verified via Incognito testing.
- **OAuth2 Login Payload:** Standard JSON login failed against the FastAPI backend.
    - _Solution:_ Implemented **`URLSearchParams`** to satisfy the required `x-www-form-urlencoded` format.

## 4. Key Teachings

- **Dynamic Template Routing:** Leveraged the `[id].vue` pattern to create a single page capable of rendering thousands of unique aircraft spec sheets.
- **Stateless Frontend:** The UI stores no sensitive data, only a temporary JWT token, making the application highly secure.
- **Reactive Dependencies:** Used `watch` and `computed` properties in data fetching to create a "drilling" effect for Category → Manufacturer → Model selection.
