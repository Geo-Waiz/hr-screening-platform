FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install only production dependencies
RUN npm ci --only=production

# Install TypeScript for building
RUN npm install -g typescript

# Copy source code
COPY . .

# Install dev dependencies temporarily for building
RUN npm install

# Build the application
RUN npm run build

# Generate Prisma client
RUN npx prisma generate

# Remove dev dependencies to reduce image size
RUN npm prune --production

EXPOSE 3000

# Run the compiled JavaScript
CMD ["node", "dist/index.js"]
