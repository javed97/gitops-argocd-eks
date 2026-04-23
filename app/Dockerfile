# ---------- Build stage ----------
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev --no-audit --no-fund

# ---------- Runtime stage ----------
FROM node:20-alpine
WORKDIR /app

# Run as non-root user (security best practice)
RUN addgroup -S app && adduser -S app -G app
COPY --from=builder /app/node_modules ./node_modules
COPY src ./src
COPY package.json ./

USER app
EXPOSE 3000

CMD ["node", "src/index.js"]
