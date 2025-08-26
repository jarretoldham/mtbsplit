#!/bin/sh
npx prisma migrate deploy
exec node dist/src/server.js
