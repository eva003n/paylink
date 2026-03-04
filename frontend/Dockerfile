ARG NODE_VERSION=22.21.1
# Stage 1: dependancies
FROM node:${NODE_VERSION}-alpine AS builder
WORKDIR /app

# enable pnpm
RUN corepack enable
RUN corepack prepare pnpm@latest --activate

# copy only deps first for caching
COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

# copy rest of code
COPY . .

RUN pnpm build

# 2) Runtime stage (nginx)
FROM nginx:alpine

# remove default config
RUN rm /etc/nginx/conf.d/default.conf

# add our SPA config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# copy built files
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]