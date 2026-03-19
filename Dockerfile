# 🇪🇸 TaxFlow ES - Dockerfile Optimizado para España
FROM node:18-alpine AS base

# Configurar timezone para España
RUN apk add --no-cache tzdata
ENV TZ=Europe/Madrid

# Variables por defecto
ENV PORT=3000
ENV NODE_ENV=production
ENV SKIP_ENV_VALIDATION=true

# ===== BUILD STAGE =====
FROM base AS builder

# Instalar dependencias sistema para Prisma
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

# Copiar archivos de configuración
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependencias (legacy-peer-deps para compatibilidad)
RUN npm ci --legacy-peer-deps --only=production --omit=dev

# Copiar código fuente
COPY . .

# Generar cliente Prisma
RUN npx prisma generate

# Build aplicación NextJS con funcionalidades españolas
RUN npm run build

# ===== PRODUCTION STAGE =====
FROM base AS runner

# Crear usuario no-root para seguridad
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

WORKDIR /app

# Instalar solo dependencias de runtime
RUN apk add --no-cache openssl

# Copiar archivos necesarios desde builder
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Crear directorio para database SQLite
RUN mkdir -p /app/data && chown nextjs:nodejs /app/data

# Copiar scripts específicos españoles
COPY --from=builder --chown=nextjs:nodejs /app/scripts ./scripts

# Cambiar a usuario no-root
USER nextjs

# Exponer puerto
EXPOSE $PORT

# Health check endpoint para funcionalidades españolas
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:$PORT/api/health || exit 1

# Variables de entorno específicas españolas
ENV NEXT_TELEMETRY_DISABLED=1
ENV DATABASE_URL="file:/app/data/production.db"

# Comando inicio con migración automática
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]

# Install required system dependencies
RUN apt-get update && apt-get install -y \
    ca-certificates \
    ghostscript \
    graphicsmagick \
    openssl \
    libwebp-dev \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Create upload directory and set permissions
RUN mkdir -p /app/upload

# Copy built assets from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/app ./app
COPY --from=builder /app/next.config.ts ./

# Copy and set up entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Create directory for uploads
RUN mkdir -p /app/data

EXPOSE 7331

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["npm", "start"]
