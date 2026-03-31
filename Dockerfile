# =====================================================================
# Dockerfile — Multi-Stage Build
# Visual Resume Editor
#
# Stage 1 (builder):  Install deps + create production build
# Stage 2 (production): Copy only what's needed, run the app
# =====================================================================

# ── Stage 1: Builder ────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files first (Docker layer caching — deps only
# re-install when package files change)
COPY package.json package-lock.json ./

# Install ALL dependencies (including devDependencies for build)
RUN npm ci

# Copy the rest of the source code
COPY . .

# Run the build script (creates dist/)
RUN npm run build


# ── Stage 2: Production ────────────────────────────────────────────
FROM node:22-alpine AS production

LABEL maintainer="sahil"
LABEL description="Visual Resume Editor — DevOps CI/CD Showcase"

WORKDIR /app

# Copy only production artifacts from builder
COPY --from=builder /app/dist ./

# Install production dependencies only
RUN npm ci --only=production

# Create a non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Expose the application port
EXPOSE 3000

# Health check — used by Docker and docker-compose
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

# Start the application
CMD ["node", "server.js"]
