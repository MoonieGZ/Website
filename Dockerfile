FROM node:18-alpine AS base

FROM base AS builder

WORKDIR /app

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN npm ci

COPY src ./src
COPY public ./public
COPY next-env.d.ts .
COPY next.config.mjs .
COPY tsconfig.json .
COPY components.json .
COPY postcss.config.mjs .
COPY tailwind.config.ts .

ARG ENV_VARIABLE
ENV ENV_VARIABLE=${ENV_VARIABLE}
ARG NEXT_PUBLIC_ENV_VARIABLE
ENV NEXT_PUBLIC_ENV_VARIABLE=${NEXT_PUBLIC_ENV_VARIABLE}

ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

FROM base AS runner

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

ENV NEXT_TELEMETRY_DISABLED=1

USER nextjs
ENV HOSTNAME="0.0.0.0"
CMD ["npm", "start"]