FROM node:20-alpine AS base

FROM base AS builder

RUN apk add --no-cache gcompat
WORKDIR /app

COPY package*json tsconfig.json prisma ./
COPY src ./src

# Install dependencies first
RUN npm i

# Generate Prisma schema
RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "run", "start"]
