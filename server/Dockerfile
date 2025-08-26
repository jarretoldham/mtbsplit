FROM node:22-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npx tsc
RUN npx tsc-alias -p tsconfig.json
EXPOSE 3001
ENTRYPOINT ["sh", "docker-entrypoint.sh"]
