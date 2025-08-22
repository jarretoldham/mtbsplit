FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npx tsc && echo "TypeScript compilation completed" && ls -la dist/
RUN npx tsc-alias -p tsconfig.json && echo "tsc-alias completed" && ls -la dist/
EXPOSE 3001
ENTRYPOINT ["sh", "docker-entrypoint.sh"]
