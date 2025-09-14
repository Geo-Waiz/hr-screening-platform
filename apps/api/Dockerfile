FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including dev dependencies)
RUN npm install

# Copy all source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

EXPOSE 3000

# Use ts-node to run TypeScript directly (no build needed)
CMD ["npx", "ts-node", "src/index.ts"]
