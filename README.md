# mtbsplit Monorepo

## Overview
This project contains:
- **/client**: Vite React frontend (TypeScript, Tailwind CSS)
- **/server**: Node.js backend (Fastify, Zod, TypeScript)

Both projects use ESLint, Prettier, and strict TypeScript configurations.

## Getting Started

### Frontend
```
cd client
npm install
npm run dev
```

### Backend
```
cd server
npm install
npx tsc
node dist/src/index.js
```

## Linting & Formatting
- Run `npx eslint .` and `npx prettier --check .` in each project folder.
