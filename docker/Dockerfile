FROM node:24-alpine AS deps

WORKDIR /app
COPY package.json ./
RUN npm install --production --legacy-peer-deps

FROM node:24-alpine

WORKDIR /app
ENV NODE_ENV=production

RUN addgroup -S app && adduser -S app -G app

COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
COPY src ./src
COPY migrations ./migrations
COPY docker/entrypoint.sh ./

USER app
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -qO- http://localhost:3000/api/v1/health || exit 1

CMD ["sh", "entrypoint.sh"]
