ARG NODE_VERSION=22.21.1
ARG PNPM_VERSION=10.32.1
ARG NGINX_VERSION=1.27.4

# Stage 1: dependancies
FROM node:${NODE_VERSION}-alpine AS deps
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml  ./
COPY shared/package.json ./shared/package.json
COPY frontend/package.json ./frontend/package.json
# RUN pnpm install --no-frozen-lockfile
RUN pnpm install --frozen-lockfile

# Stage 2: build
FROM node:${NODE_VERSION}-alpine AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate
COPY --from=deps /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml  ./
COPY --from=deps /app/shared/package.json  ./shared/package.json 
COPY  --from=deps /app/frontend/package.json ./frontend/package.json
RUN pnpm install --frozen-lockfile
COPY shared/ ./shared
COPY frontend/ ./frontend
RUN pnpm --filter shared build
RUN pnpm --filter frontend run build

# 2) Runtime stage (nginx)
FROM nginx:${NGINX_VERSION}-alpine AS Runner
# remove default config
RUN rm /etc/nginx/conf.d/default.conf
# add our your config
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
# copy built files
COPY --from=builder /app/frontend/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]