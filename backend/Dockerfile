# ARG NODE_VERSION=22.21.1
# ARG PNPM_VERSION=10.32.1
# # Stage 1: dependancies
# FROM node:${NODE_VERSION}-alpine AS deps
# WORKDIR /app
# #enable working with pnpm
# RUN corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate
# COPY package.json  pnpm-lock.yaml pnpm-workspace.yaml ./
# COPY backend/package.json backend/package.json
# COPY backend/tsconfig.json backend/tsconfig.json
# COPY backend/tsconfig.app.json backend/tsconfig.app.json
# COPY shared/package.json ./shared/package.json
# RUN pnpm install 

# # Stage 2: build
# FROM node:${NODE_VERSION}-alpine AS build
# WORKDIR /app
# RUN corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate
# # COPY --from=deps /app/node_modules ./node_modules
# # ENV PATH="/app/node_modules/.bin:$PATH"
# # copy ONLY manifests first
# COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# COPY backend/package.json backend/package.json
# COPY backend/tsconfig.json backend/tsconfig.json
# COPY backend/tsconfig.app.json backend/tsconfig.app.json
# COPY shared/package.json shared/package.json
# RUN pnpm install --frozen-lockfile
# RUN pnpm --filter backend build
# COPY backend ./


# # Stage 3: Runtime
# FROM node:${NODE_VERSION}-alpine AS runner
# WORKDIR /app
# RUN corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate
# COPY --from=build /app/backend/dist ./dist
# COPY --from=build /app/backend/public ./public
# COPY --from=build /app/backend/package.json ./
# COPY --from=build /app/backend/ecosystem.config.js ./
# COPY --from=build /app/pnpm-lock.yaml ./
# COPY --from=build /app/pnpm-workspace.yaml ./
# # Install production deps
# # RUN pnpm install --frozen-lockfile
# # Port backend is listening on
# EXPOSE 8000 

# # dev
# # CMD ["pm2-dev", "--json","ecosystem.config.js"]
# # prod
# CMD ["npx", "pm2-runtime", "--json", "ecosystem.config.js"]

ARG NODE_VERSION=22.21.1
ARG PNPM_VERSION=10.32.1

# Stage 1: Dependencies
FROM node:${NODE_VERSION}-alpine AS deps
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/package.json
# pm2
COPY backend/ecosystem.config.js ./backend/ecosystem.config.js
COPY shared/package.json ./shared/package.json
RUN pnpm install --frozen-lockfile

# Stage 2: Build
FROM node:${NODE_VERSION}-alpine AS build
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate
# Restore node_modules
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/backend/node_modules ./backend/node_modules
COPY --from=deps /app/shared/node_modules ./shared/node_modules
# Manifests + tsconfigs
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json backend/tsconfig.json backend/tsconfig.app.json ./backend/
COPY backend/ecosystem.config.js ./backend/ecosystem.config.js
COPY shared/package.json shared/tsconfig.json shared/tsconfig.cjs.json shared/tsconfig.esm.json ./shared/
# Source
COPY shared/src ./shared/src
COPY backend/src ./backend/src
COPY backend/types ./backend/types
COPY backend/ecosystem.config.js ./backend/ecosystem.config.js
COPY backend/public ./backend/public
# Build shared first, then backend
RUN pnpm --filter shared build
RUN pnpm --filter backend install --frozen-lockfile
RUN pnpm --filter backend build

COPY backend/dist ./dist/
COPY backend/public ./public/
COPY backend/node_modules ./node_modules
COPY backend/package.json ./package.json
COPY backend/ecosystem.config.js ./ecosystem.config.js

RUN  rm -rf backend
RUN rm -rf shared

# Stage 3: Runtime
FROM node:${NODE_VERSION}-alpine AS runner
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate
COPY --from=build /app/dist ./dist
COPY --from=build /app/public ./public
COPY --from=build /app/package.json ./
COPY --from=build /app/ecosystem.config.js ./
COPY --from=build /app/pnpm-lock.yaml ./
COPY --from=build /app/pnpm-workspace.yaml ./
RUN pnpm install --prod --frozen-lockfile

EXPOSE 8000
CMD ["pm2-runtime", "--json", "ecosystem.config.js"]