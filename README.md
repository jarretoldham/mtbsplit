# mtbsplit Monorepo

## Overview
This project contains:
- **/client**: Vite + React 19 frontend (TypeScript, Tailwind CSS, ESLint, Prettier)
- **/server**: Node.js backend (Fastify, Zod, Prisma ORM, TypeScript, ESLint, Prettier)
- **/db**: PostgreSQL database (via Docker Compose)

## Features
- Hot reload support for both frontend and backend in development (see `docker-compose.dev.yml`)
- Production-ready Docker setup for all services
- Strict TypeScript configurations throughout

## Getting Started

### Development (with hot reload)

- Frontend: http://localhost:5173
- Backend: http://localhost:3001
- Database: localhost:5432 (Postgres)

### Production
```
docker compose up --build
```
- Frontend: http://localhost:3000
- Backend: http://localhost:3001
- Database: localhost:5432 (Postgres)

### Manual (local) Development
#### Frontend
```
cd client
npm install
npm run dev
```
#### Backend
```
cd server
npm install
npx prisma generate
npx tsc
node dist/src/index.js
```

## Linting & Formatting
- Run `npx eslint .` and `npx prettier --check .` in each project folder.

## Database Migrations
- Use Prisma for schema and migrations:
```
cd server
npx prisma migrate dev
```
