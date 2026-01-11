# Base stage: copy code and enable corepack
FROM node:22-alpine AS base
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml* ./
COPY tsconfig.json ./
COPY drizzle.config.ts ./
COPY src ./src

# Dev dependencies stage (for drizzle-kit)
FROM base AS dev-deps
WORKDIR /app
COPY drizzle.config.ts ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store CI=true pnpm install --frozen-lockfile

# Build stage
FROM dev-deps AS build
RUN pnpm run build

# Production image (API service)
FROM node:22-alpine AS prod
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable
RUN --mount=type=cache,id=pnpm,target=/pnpm/store CI=true pnpm install --prod --frozen-lockfile
CMD ["node", "dist/src/index.js"]