FROM node:22-slim AS base
RUN npm install -g pnpm@11.1.1

# ─── Build API ───────────────────────────────────────────────────────────────
FROM base AS api-builder
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY tsconfig.base.json tsconfig.json ./
COPY lib/ ./lib/
COPY artifacts/api-server/ ./artifacts/api-server/
RUN node -e "const p=require('./package.json'); delete p.scripts.preinstall; require('fs').writeFileSync('./package.json', JSON.stringify(p,null,2))"
RUN pnpm install --frozen-lockfile --ignore-scripts
RUN pnpm --filter @workspace/api-server build

# ─── Build Frontend ──────────────────────────────────────────────────────────
FROM base AS frontend-builder
# Vite bakes VITE_* vars into the bundle at build time.
# Defaults embed the public anon key (safe — designed to be client-side).
# Override via EasyPanel build args if the Supabase project changes.
ARG VITE_SUPABASE_URL=https://pdkzkkwbawnrkadooemg.supabase.co
ARG VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBka3pra3diYXducmthZG9vZW1nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5ODAwNTEsImV4cCI6MjA5NDU1NjA1MX0.y-xJ8D4oAxSDkdqSFvc6eF0YLbFKQK7HmiI_nXnp8fs
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY tsconfig.base.json tsconfig.json ./
COPY lib/ ./lib/
COPY artifacts/christian-blog/ ./artifacts/christian-blog/
RUN node -e "const p=require('./package.json'); delete p.scripts.preinstall; require('fs').writeFileSync('./package.json', JSON.stringify(p,null,2))"
RUN pnpm install --frozen-lockfile --ignore-scripts
RUN pnpm --filter @workspace/christian-blog build

# ─── Runtime — Node.js only, no nginx or supervisord ─────────────────────────
FROM node:22-slim AS runner
RUN npm install -g pnpm@11.1.1
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY tsconfig.base.json tsconfig.json ./
COPY lib/ ./lib/
COPY artifacts/api-server/ ./artifacts/api-server/
RUN node -e "const p=require('./package.json'); delete p.scripts.preinstall; require('fs').writeFileSync('./package.json', JSON.stringify(p,null,2))"
RUN pnpm install --frozen-lockfile --prod --ignore-scripts

COPY --from=api-builder /app/artifacts/api-server/dist ./artifacts/api-server/dist
COPY --from=frontend-builder /app/artifacts/christian-blog/dist/public /app/public

ENV NODE_ENV=production
ENV STATIC_DIR=/app/public
# EasyPanel injects PORT=80 and routes external traffic to port 80 — Node.js listens on it directly.
# Set SUPABASE_DB_URL in EasyPanel's environment variables panel.
EXPOSE 80

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -sf "http://localhost:${PORT:-80}/api/healthz" || exit 1

CMD ["node", "--enable-source-maps", "/app/artifacts/api-server/dist/index.mjs"]
