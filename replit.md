# Voto Consciente

Plataforma educativa, gamificada e acessível para cidadãos brasileiros aprenderem sobre democracia e votação com consciência.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string
- Required env: `SESSION_SECRET` — Express session secret
- Required env: `AI_INTEGRATIONS_OPENAI_BASE_URL`, `AI_INTEGRATIONS_OPENAI_API_KEY` — set automatically by Replit OpenAI integration

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React 19 + Vite + Tailwind CSS + shadcn/ui + Wouter routing
- API: Express 5
- DB: PostgreSQL + Drizzle ORM (conversations + messages tables)
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)
- AI: OpenAI via Replit AI Integrations proxy (Sônia persona)

## Where things live

- `artifacts/voto-consciente/` — React+Vite frontend (all pages, components, hooks)
- `artifacts/api-server/` — Express API (routes: /api/health, /api/openai/*)
- `lib/api-spec/openapi.yaml` — OpenAPI contract (source of truth for API)
- `lib/api-client-react/src/generated/` — Orval-generated hooks and schemas
- `lib/db/src/schema/` — Drizzle schema (conversations, messages tables)
- `artifacts/voto-consciente/src/lib/progress.ts` — localStorage gamification state
- `artifacts/voto-consciente/src/contexts/accessibility-context.tsx` — font size + high contrast

## Architecture decisions

- **SSE streaming for AI chat**: POST `/api/openai/conversations/:id/messages` streams tokens via Server-Sent Events. Frontend consumes via `fetch` + `ReadableStream` manually (not Orval hooks).
- **Gamification fully on frontend**: Quiz scores, medals, XP, and mission progress are stored in `localStorage` — no backend needed for game state.
- **Accessibility-first**: minimum 20px font, TTS via `window.speechSynthesis` (pt-BR, 0.85 rate), floating A+/A- controls, high-contrast toggle.
- **Hardcoded civic content**: Quiz questions, Academy missions, and candidate profiles are embedded in the frontend code (no CMS needed for MVP).
- **OpenAI persona**: Sônia uses a detailed system prompt in Portuguese targeting elderly Brazilian citizens, with simplified language and civic education focus.

## Product

- **Quiz "Fake ou Fato?"** — 10-question gamified quiz to identify misinformation, with medals, score tracking, and educational explanations
- **Academia da Democracia** — 5-mission learning journey about democracy, the 3 powers, elections, and civic rights with XP progression
- **Match de Candidatos** — 7-topic neutral questionnaire that computes % compatibility with 4 fictional candidates
- **Dashboard** — user progress page showing level (Novato/Iniciante/Cidadão), XP, medals, and mission history
- **Chat com Sônia** — real-time streaming AI assistant specialized in civic education for Brazilians

## Gotchas

- Never call service ports directly; always go through proxy at `localhost:80` (e.g. `localhost:80/api/healthz`)
- After changing the OpenAPI spec, run codegen before touching frontend hooks
- TTS buttons use `window.speechSynthesis` — they only work in browser (not in SSR or tests)
- The SSE endpoint must be consumed with raw `fetch`, not via Orval-generated hooks

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
