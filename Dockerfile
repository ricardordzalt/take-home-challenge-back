FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/.env* ./

# Environment variables
ARG PORT=3000
ENV PORT=${PORT}
ENV NODE_ENV=production

# Expose dynamic port
EXPOSE ${PORT}

# Start the application
CMD ["sh", "-c", "npm run prisma:migrate && npm run start:prod"]
