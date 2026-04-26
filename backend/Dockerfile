ARG NODE_VERSION=22.21.1
ARG PNPM_VERSION=10.32.1

# Stage 1: Dependencies
FROM node:${NODE_VERSION}-alpine AS deps
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/package.json
COPY shared/package.json ./shared/package.json
# COPY backend/ecosystem.config.js ./backend/ecosystem.config.js

RUN pnpm install --frozen-lockfile

# Stage 2: Build
FROM node:${NODE_VERSION}-alpine AS build
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate
# Manifests + tsconfigs
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json backend/tsconfig.json backend/tsconfig.app.json ./backend/
COPY shared/package.json shared/tsconfig.json shared/tsconfig.cjs.json shared/tsconfig.esm.json ./shared/
# Source
COPY shared/src ./shared/src
COPY backend/src ./backend/src
COPY backend/types ./backend/types
COPY backend/public ./backend/public
COPY backend/ecosystem.config.js ./backend/ecosystem.config.js

# Install deps, Build shared first, then backend
RUN pnpm install --frozen-lockfile
RUN pnpm --filter shared build
RUN pnpm --filter backend run build


# Stage 3: Runtime
FROM node:${NODE_VERSION}-alpine AS runner
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate
# ENV PATH="/app/node_modules/.bin:$PATH"
#workspace manifests
COPY --from=build /app/package.json ./
COPY --from=build /app/pnpm-lock.yaml ./
COPY --from=build /app/pnpm-workspace.yaml ./
COPY --from=build /app/shared/package.json ./shared/package.json
COPY --from=build /app/backend/package.json ./backend/package.json
# Built
COPY --from=build /app/backend/dist ./dist
COPY --from=build /app/backend/public ./public
COPY --from=build /app/backend/ecosystem.config.js ./ecosystem.config.js
COPY --from=build /app/shared/dist ./shared/dist

RUN pnpm install --prod  --frozen-lockfile

ENV PATH="/app/node_modules/.bin:/app/backend/node_modules/.bin:$PATH"

EXPOSE 8000
CMD ["pm2-runtime", "--json", "ecosystem.config.js"]