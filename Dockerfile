FROM node:20-alpine AS deps

WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules

# Create data directory for database
RUN mkdir -p data && chmod 755 data

# Set database path for build process
ENV DATABASE_PATH=./data/db.sqlite

# Run migrations to create the database and schema
RUN npm run migrate:latest
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

# Copy the standalone output
COPY --from=builder /app/.next/standalone ./

# Copy the public folder
COPY --from=builder /app/public ./public

# Copy the static folder
COPY --from=builder /app/.next/static ./.next/static

# Copy the data directory with the database
COPY --from=builder /app/data ./data

# Copy the .env file
COPY --from=builder /app/.env ./.env

EXPOSE 3000

ENV PORT 3000
ENV NODE_ENV production
ENV HOSTNAME 0.0.0.0

CMD ["node", "server.js"]