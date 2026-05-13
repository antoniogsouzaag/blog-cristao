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
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY tsconfig.base.json tsconfig.json ./
COPY lib/ ./lib/
COPY artifacts/christian-blog/ ./artifacts/christian-blog/
RUN node -e "const p=require('./package.json'); delete p.scripts.preinstall; require('fs').writeFileSync('./package.json', JSON.stringify(p,null,2))"
RUN pnpm install --frozen-lockfile --ignore-scripts
RUN pnpm --filter @workspace/christian-blog build

# ─── Runtime ─────────────────────────────────────────────────────────────────
FROM node:22-slim AS runner
RUN npm install -g pnpm@11.1.1
RUN apt-get update && apt-get install -y nginx supervisor && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY tsconfig.base.json tsconfig.json ./
COPY lib/ ./lib/
COPY artifacts/api-server/ ./artifacts/api-server/
RUN node -e "const p=require('./package.json'); delete p.scripts.preinstall; require('fs').writeFileSync('./package.json', JSON.stringify(p,null,2))"
RUN pnpm install --frozen-lockfile --prod --ignore-scripts

COPY --from=api-builder /app/artifacts/api-server/dist ./artifacts/api-server/dist
COPY --from=frontend-builder /app/artifacts/christian-blog/dist/public /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf
RUN rm -f /etc/nginx/sites-enabled/default

ENV NODE_ENV=production
ENV PORT=3001
EXPOSE 80

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
