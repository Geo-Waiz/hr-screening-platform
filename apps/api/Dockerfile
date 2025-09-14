FROM node:18-alpine

WORKDIR /app

# Copy everything first
COPY . .

# Install dependencies
RUN npm install

# Generate Prisma client
RUN npx prisma generate

EXPOSE 3000

# Run with ts-node
CMD ["npx", "ts-node", "src/index.ts"]
