FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

EXPOSE 3000

CMD ["sh", "-c", "if [ -z \"$JWT_SECRET\" ]; then echo 'JWT_SECRET environment variable is required' && exit 1; fi && npx prisma migrate deploy && node src/index.js"]
