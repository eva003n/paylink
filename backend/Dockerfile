ARG NODE_VERSION=22.21.1
FROM node:${NODE_VERSION}-alpine AS base
RUN apk update
WORKDIR /app
RUN apk add --no-cache libc6-compat
# install pnpm package manager
RUN npm install -g pnpm 
RUN npm install -g pm2 

#cache dependacies
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm fetch
RUN pnpm install --frozen-lockfile

# Builder
FROM deps AS builder
COPY . .
RUN pnpm run build

# ---- Production Runner ----
FROM node:${NODE_VERSION}-alpine AS runner
WORKDIR /app
RUN apk add --no-cache libc6-compat
# Install pnpm in runner stage
RUN npm install -g pnpm
RUN npm install pm2 -g



# Create non-root user
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 expressjs

USER expressjs

# Copy only necessary files
COPY --from=builder /app/dist ./
COPY --from=builder /app/package.json ./
COPY --from=builder /app/ecosystem.config.js ./

COPY --from=deps /app/node_modules ./node_modules
USER root
RUN mkdir -p /app/uploads && chown -R node:node /app/uploads
# RUN dotenvx ext prebuild

EXPOSE 8000

#for development
CMD ["pm2-dev", "--json", "ecosystem.config.js"]
# for production
# CMD ["pm2-runtime", "--json", "ecosystem.config.js"]
