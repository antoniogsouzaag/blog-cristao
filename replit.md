# Blog Cristão

Um blog cristão completo em português do Brasil com artigos devocionais, estudos bíblicos, testemunhos e muito mais.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm --filter @workspace/christian-blog run dev` — run the frontend
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Frontend: React + Vite + Tailwind CSS + shadcn/ui
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — OpenAPI spec (source of truth for API contracts)
- `lib/db/src/schema/` — Drizzle schema (categories.ts, posts.ts, comments.ts)
- `artifacts/api-server/src/routes/` — Express route handlers (posts, categories, comments)
- `artifacts/christian-blog/src/` — React frontend (pages, components)

## Architecture decisions

- Contract-first API: OpenAPI spec generates both React Query hooks and Zod validation schemas
- All text and UI labels in Brazilian Portuguese
- Posts can have optional Bible verse + reference for highlighted display
- Categories track post counts via aggregation query
- Comments are linked to posts with cascade delete

## Product

- A full-featured Christian blog in Brazilian Portuguese
- Readers can browse articles by category, search content, read full articles with Bible verse highlights, and leave comments
- Admin panel at `/admin` for creating, editing, and deleting posts and categories
- Categories: Devocionais, Estudos Bíblicos, Testemunhos, Família e Fé, Oração

## User preferences

- Blog in Brazilian Portuguese
- Christian theme with warm, reverent aesthetic

## Gotchas

- After any OpenAPI spec change, always run codegen before using updated types
- The `featured` field on posts controls which appear in the "Destaques" section on the home page
- Routes order matters in posts.ts — `/posts/featured`, `/posts/recent`, `/posts/stats` must come before `/posts/:id`

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
