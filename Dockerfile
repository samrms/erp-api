FROM node:22-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile
COPY . .
RUN pnpm db:migrate || true
EXPOSE 3000
CMD ["node", "src/main.js"]
