# ---------- Build stage ----------
FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund

# ---------- Runtime stage ----------
FROM node:22-alpine
WORKDIR /app

RUN addgroup -S app && adduser -S app -G app
COPY --from=builder /app/node_modules ./node_modules
COPY src ./src
COPY package.json package-lock.json ./

USER app
EXPOSE 3000

CMD ["node", "src/index.js"]
