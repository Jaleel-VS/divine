# TanStack Start — Steering Doc for AI Agents

> Status: Release Candidate (RC) — API is stable, not yet v1.
> Last verified: 2026-03-29
> Docs: https://tanstack.com/start/latest/docs/framework/react/overview

## Critical: What NOT to Do

- **No `app.config.ts` or `app.config.js`** — TanStack Start does NOT use Vinxi's `app.config` anymore. All config goes through `vite.config.ts` using the `tanstackStart()` Vite plugin.
- **No `createServerAction$`** — this does not exist. Use `createServerFn()`.
- **No `'use server'` directive** — TanStack Start uses `createServerFn()` from `@tanstack/react-start`, NOT React's `'use server'` directive.
- **No `createRoute()`** for file-based routes — use `createFileRoute('/path')` for file routes and `createRootRoute()` for the root.
- **No `<Html>`, `<Head>`, `<Body>`** components — use standard `<html>`, `<head>`, `<body>` tags with `<HeadContent />` and `<Scripts />`.
- **No `ssr.tsx` or `entry.server.tsx` or `entry.client.tsx`** by default — Start handles this automatically. Only create `src/start.ts` for global middleware config.
- **No React Server Components** — not supported yet (planned).
- **Do NOT enable `verbatimModuleSyntax`** in tsconfig — it can leak server bundles into client bundles.

## Project Stack (this repo)

```
@tanstack/react-start: ^1.132.0
@tanstack/react-router: ^1.132.0
vite: ^7.1.7
react: ^19.2.0
drizzle-orm + drizzle-kit (PostgreSQL)
tailwindcss v4 (via @tailwindcss/vite)
nitro (nightly, via nitro/vite plugin)
```

## Vite Config

The Vite plugin is `tanstackStart()` from `@tanstack/react-start/plugin/vite`. The React plugin MUST come after it:

```ts
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    // other plugins...
    tanstackStart(),
    viteReact(), // MUST come after tanstackStart()
  ],
})
```

## File Structure

```
src/
├── router.tsx              # Router config — exports getRouter()
├── routeTree.gen.ts        # Auto-generated — never edit manually
├── routes/
│   ├── __root.tsx          # Root route — renders <html> shell
│   ├── index.tsx           # / route
│   ├── about.tsx           # /about route
│   ├── posts.tsx           # /posts layout route
│   ├── posts/index.tsx     # /posts/ index
│   └── posts/$postId.tsx   # /posts/:postId dynamic route
├── start.ts                # (optional) Global middleware config
```

## Router Configuration

```ts
// src/router.tsx
import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

export function getRouter() {
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
  })
  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
```

## Root Route Pattern

```tsx
// src/routes/__root.tsx
import type { ReactNode } from 'react'
import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from '@tanstack/react-router'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'My App' },
    ],
  }),
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
```

## File Route Pattern

Every route file MUST export `Route` using `createFileRoute`:

```tsx
// src/routes/posts/$postId.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/posts/$postId')({
  loader: async ({ params }) => fetchPost(params.postId),
  component: PostComponent,
})

function PostComponent() {
  const post = Route.useLoaderData()
  return <div>{post.title}</div>
}
```

The path string in `createFileRoute('/posts/$postId')` is auto-managed by the router plugin — don't worry about keeping it in sync manually.

## File Naming Conventions

| Path             | Filename            | Type           |
|------------------|---------------------|----------------|
| `/`              | `index.tsx`         | Index Route    |
| `/about`         | `about.tsx`         | Static Route   |
| (layout only)    | `posts.tsx`         | Layout Route   |
| `/posts/`        | `posts/index.tsx`   | Index Route    |
| `/posts/:postId` | `posts/$postId.tsx` | Dynamic Route  |
| `/rest/*`        | `rest/$.tsx`        | Wildcard Route |

- `__root.tsx` — root route (always rendered, wraps everything)
- `_pathless.tsx` — pathless layout (groups routes without adding URL segment)
- Prefix with `_` for pathless layouts, `$` for dynamic params

## Server Functions

Import from `@tanstack/react-start` (NOT `@tanstack/start`):

```tsx
import { createServerFn } from '@tanstack/react-start'

// GET (default)
export const getData = createServerFn().handler(async () => {
  return { message: 'Hello from server' }
})

// POST with input validation
export const saveData = createServerFn({ method: 'POST' })
  .inputValidator((data: { name: string }) => data)
  .handler(async ({ data }) => {
    // data is typed and validated
    return { success: true }
  })

// With Zod validation
import { z } from 'zod'

export const createUser = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ name: z.string(), age: z.number() }))
  .handler(async ({ data }) => {
    return `Created ${data.name}`
  })
```

### Calling Server Functions

```tsx
// In a loader
export const Route = createFileRoute('/posts')({
  loader: () => getPosts(),
})

// In a component (with useServerFn hook)
import { useServerFn } from '@tanstack/react-start'

function MyComponent() {
  const save = useServerFn(saveData)
  // use save() in event handlers
}

// Direct call with data
await saveData({ data: { name: 'John' } })
```

### Server Context Utilities

```tsx
import {
  getRequest,
  getRequestHeader,
  setResponseHeaders,
  setResponseStatus,
} from '@tanstack/react-start/server'
```

### Redirects and Not Found

```tsx
import { redirect, notFound } from '@tanstack/react-router'

// In a server function handler:
throw redirect({ to: '/login' })
throw notFound()
```

## Middleware

```tsx
import { createMiddleware } from '@tanstack/react-start'

// Request middleware (runs on all requests)
const loggingMiddleware = createMiddleware().server(async ({ next }) => {
  console.log('Request received')
  return next()
})

// Server function middleware (has .client() and .inputValidator())
const authMiddleware = createMiddleware({ type: 'function' })
  .server(async ({ next, request }) => {
    const session = await getSession(request.headers)
    if (!session) throw new Error('Unauthorized')
    return next({ context: { session } })
  })

// Using middleware on a server function
const protectedFn = createServerFn()
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    // context.session is available and typed
  })
```

### Global Middleware (src/start.ts)

```tsx
// src/start.ts
import { createStart } from '@tanstack/react-start'

export const startInstance = createStart(() => ({
  requestMiddleware: [loggingMiddleware],   // all requests
  functionMiddleware: [authMiddleware],      // all server functions
}))
```

## File Organization for Server Code

```
src/utils/
├── users.functions.ts   # createServerFn wrappers — safe to import anywhere
├── users.server.ts      # Server-only helpers (DB queries) — only import in handlers
└── schemas.ts           # Shared validation schemas — client-safe
```

- Static imports of `.functions.ts` files are safe in client components (build replaces with RPC stubs)
- Avoid dynamic imports of server functions

## Key Imports Cheat Sheet

```tsx
// Routing
import { createRouter } from '@tanstack/react-router'
import { createFileRoute, createRootRoute } from '@tanstack/react-router'
import { Outlet, Link, HeadContent, Scripts } from '@tanstack/react-router'
import { redirect, notFound } from '@tanstack/react-router'

// Server functions
import { createServerFn } from '@tanstack/react-start'
import { useServerFn } from '@tanstack/react-start'

// Middleware
import { createMiddleware, createStart } from '@tanstack/react-start'

// Server context utilities
import { getRequest, getRequestHeader, setResponseHeaders, setResponseStatus } from '@tanstack/react-start/server'

// Vite plugin
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
```

## Common Hallucination Traps

| AI tends to generate...                  | Correct approach                                      |
|------------------------------------------|-------------------------------------------------------|
| `'use server'` directive                 | `createServerFn()` from `@tanstack/react-start`       |
| `app.config.ts` (Vinxi)                 | `vite.config.ts` with `tanstackStart()` plugin         |
| `createServerAction$()`                  | `createServerFn({ method: 'POST' })`                  |
| `@tanstack/start` imports               | `@tanstack/react-start`                               |
| `createRoute()` in file routes           | `createFileRoute('/path')`                             |
| `<Html>`, `<Head>`, `<Body>` components  | Standard HTML tags + `<HeadContent />` + `<Scripts />` |
| `useAction()` / `useSubmission()`        | `useServerFn()` or direct calls                        |
| `entry.server.tsx` / `entry.client.tsx`  | Not needed — Start handles this automatically          |
| `loader` returning `json()`              | Just return the data directly                          |
| `useLoaderData()` as standalone hook     | `Route.useLoaderData()` (scoped to the route)          |

## Sources

- [TanStack Start Overview](https://tanstack.com/start/latest/docs/framework/react/overview) — accessed 2026-03-29
- [TanStack Start Build from Scratch](https://tanstack.com/start/latest/docs/framework/react/build-from-scratch) — accessed 2026-03-29
- [TanStack Start Server Functions](https://tanstack.com/start/latest/docs/framework/react/guide/server-functions) — accessed 2026-03-29
- [TanStack Start Middleware](https://tanstack.com/start/latest/docs/framework/react/guide/middleware) — accessed 2026-03-29
- [TanStack Start Routing](https://tanstack.com/start/latest/docs/framework/react/guide/routing) — accessed 2026-03-29
- [TanStack Router Overview](https://tanstack.com/router/latest/docs/framework/react/overview) — accessed 2026-03-29
