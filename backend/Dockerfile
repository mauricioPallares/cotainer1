# Etapa 1: compilar TypeScript
FROM node:20-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --frozen-lockfile
COPY . .
RUN npm run build

# Etapa 2: imagen final solo con dependencias de produccion
FROM node:20-alpine AS runner
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --frozen-lockfile --omit=dev && npm cache clean --force

COPY --from=builder /usr/src/app/dist ./dist

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000
CMD ["node", "dist/index.js"]
