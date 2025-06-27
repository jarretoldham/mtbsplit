FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npx tsc
EXPOSE 3001
ENTRYPOINT ["sh", "docker-entrypoint.sh"]
