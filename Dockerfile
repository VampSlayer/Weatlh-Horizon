# Use the official Bun image
FROM oven/bun:1 AS base
WORKDIR /app

# Install dependencies
FROM base AS install
COPY package.json ./
# If bun.lockb exists, it will be copied, else it will be skipped
COPY bun.lockb* ./
RUN bun install

# Development
FROM base AS dev
COPY --from=install /app/node_modules ./node_modules
COPY . .
EXPOSE 5173
CMD ["bun", "run", "dev"]

# Build
FROM install AS build
COPY . .
RUN bun run build

# Production
# Use a lightweight nginx image for serving the static files
FROM nginx:alpine AS prod
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
