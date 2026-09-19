FROM docker.io/library/node:24-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY .docker-build/node_modules ./node_modules
COPY package.json ./
COPY src ./src
EXPOSE 3000
CMD ["node", "src/main.js"]
