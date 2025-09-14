FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
COPY apps/api/package.json ./apps/api/

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY apps/api ./apps/api

# Build application
WORKDIR /app/apps/api
RUN npm run build

# Generate Prisma client
RUN npm run db:generate

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

CMD ["npm", "start"]
