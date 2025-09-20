# Simple Dockerfile for Node.js API server
FROM node:20-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

EXPOSE 5000

# Run migrations and start development server
CMD ["sh", "-c", "npx prisma migrate deploy && npm run seed && npm run dev"]