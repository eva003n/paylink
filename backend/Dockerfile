ARG NODE_VERSION=22.21.1
# Stage 1: dependancies
FROM node:${NODE_VERSION}-alpine AS deps
WORKDIR /app
#enable working with pnpm
RUN corepack enable
RUN corepack prepare pnpm@latest --activate
COPY package.json  pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Stage 2: build
FROM node:20-alpine AS build
WORKDIR /app
RUN corepack enable
RUN corepack prepare pnpm@latest --activate
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

# Stage 3: Runtime
FROM node:${NODE_VERSION}-alpine AS runner
WORKDIR /app
RUN npm install -g pm2
COPY --from=build /app/dist .
COPY ecosystem.config.js ./
COPY package.json ./

EXPOSE 8000

# dev
# CMD ["pm2-dev", "--json","ecosystem.config.js"]
# prod
CMD ["pm2-runtime", "--json", "ecosystem.config.js"]