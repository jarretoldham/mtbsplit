---
applyTo: '**'
---

# Project general coding standards

## Naming Conventions

- Use PascalCase for component names, interfaces, and type aliases
- Use camelCase for variables, functions, and methods
- Prefix private class members with underscore (\_)
- Use ALL_CAPS for constants

## Error Handling

- Use try/catch blocks for async operations
- Implement proper error boundaries in React components
- Always log errors with contextual information

## Project Structure

This project is a monorepo with:

- /client: Vite React frontend (TypeScript, Tailwind CSS, Tanstack Router)
- /server: Node.js backend (Fastify, Zod, TypeScript)

Both projects use ESLint, Prettier, and strict TypeScript configs.

## Testing

- Use Vitest for unit and integration tests
- Write tests in the `tests` directory
- Follow the naming convention `*.test.ts` for test files
