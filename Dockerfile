FROM node:20-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json .npmrc* ./
RUN npm ci --legacy-peer-deps;


FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .


# Disable telemetry during the build
ENV NEXT_TELEMETRY_DISABLED=1 
RUN npm run build;


# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Uncomment the following line in case you want to disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000

ARG DATABASE_URL= ${DATABASE_URL}
ARG JWT_SECRET=${JWT_SECRET}
ARG REPORT_URL=${REPORT_URL}
ARG BUCKET_URL=${BUCKET_URL}
ARG BASE_URL=${BASE_URL}

ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]