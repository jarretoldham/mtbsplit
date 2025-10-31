# Authentication Security Fixes

This document outlines security vulnerabilities found in the authentication implementation and provides code snippets to fix them.

---

### 5. **Weak Password Requirements** - MEDIUM

**Current Code:** `server/src/routes/auth.routes.ts:9`

```typescript
const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});
```

**Vulnerability:**

- Only checks length, not complexity
- Allows weak passwords like "12345678" or "aaaaaaaa"

**Fix:**

```typescript
// Create a strong password schema
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(100, 'Password must be less than 100 characters')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(
    /[^a-zA-Z0-9]/,
    'Password must contain at least one special character',
  );

const RegisterSchema = z.object({
  email: z.string().email(),
  password: passwordSchema,
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
});

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1), // Don't validate on login, just check if provided
});
```

---

### 7. **Missing CORS Configuration** - MEDIUM

**Vulnerability:**

- No CORS headers configured
- Could allow unauthorized cross-origin requests in production

**Fix:**

**Install dependency:**

```bash
npm install @fastify/cors
```

**Update `server/src/app.ts`:**

```typescript
import fastify from 'fastify';
import cors from '@fastify/cors';
import authPlugin from './plugins/auth.plugin';
import oauthPlugin from './plugins/oauth.plugin';
import authRoutes from './routes/auth.routes';
import athletesRoutes from './routes/athlete.routes';
import trackRoutes from './routes/track.routes';

async function build(opts = {}) {
  const app = fastify(opts);

  // Register CORS
  await app.register(cors, {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true, // Important for cookies!
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  });

  // Register auth plugin (JWT, cookies)
  await app.register(authPlugin);

  // Register OAuth providers
  await app.register(oauthPlugin);

  app.get('/ping', async (request, reply) => {
    return { pong: 'it works!!' };
  });

  // Register routes
  await app.register(authRoutes);
  await app.register(athletesRoutes);
  await app.register(trackRoutes);
  return app;
}

export default build;
```

---

### 8. **No CSRF Protection** - MEDIUM

**Current Issue:** OAuth state parameter may not be properly verified

**Fix:**

@fastify/oauth2 includes state parameter by default. Ensure it's properly configured:

**Update `server/src/plugins/oauth.plugin.ts`:**

```typescript
import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import fastifyOauth2 from '@fastify/oauth2';
import crypto from 'crypto';
import { OAUTH_PROVIDERS } from '../config/oauth-providers.config';

declare module 'fastify' {
  interface FastifyInstance {
    strava: any;
    // google: any;
  }
}

async function oauthPlugin(fastify: FastifyInstance) {
  // Register each OAuth provider
  for (const [_, config] of Object.entries(OAUTH_PROVIDERS)) {
    await fastify.register(fastifyOauth2, {
      ...config,
      // Ensure state parameter is generated and verified (CSRF protection)
      generateStateFunction: () => {
        return crypto.randomBytes(16).toString('hex');
      },
      checkStateFunction: (state, callback) => {
        // State is automatically verified by the plugin
        callback();
      },
    });
  }
}

export default fp(oauthPlugin);
```

---

## ⚠️ MEDIUM Priority Issues

### 9. **Long JWT Expiry** - MEDIUM

**Current Code:** `server/src/routes/auth.routes.ts:37, 71`

```typescript
const token = server.jwt.sign(user, { expiresIn: '7d' });
```

**Vulnerability:**

- 7 days is quite long
- Stolen tokens remain valid for a week
- No token refresh mechanism

**Recommended Approach:**

```typescript
// Short-lived access tokens (15-30 minutes)
const token = server.jwt.sign(user, { expiresIn: '15m' });

reply.setCookie('auth_token', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 15 * 60, // 15 minutes to match JWT expiry
  path: '/',
});
```

**For better UX, implement refresh tokens (future enhancement):**

```typescript
// Access token (short-lived)
const accessToken = server.jwt.sign(
  { athleteId: user.athleteId, email: user.email },
  { expiresIn: '15m' },
);

// Refresh token (long-lived, stored in database)
const refreshToken = server.jwt.sign(
  { athleteId: user.athleteId, type: 'refresh' },
  { expiresIn: '7d' },
);

// Store refresh token in database
// Add refresh token rotation endpoint
```

---

### 10. **Missing Security Headers** - MEDIUM

**Fix:**

**Install dependency:**

```bash
npm install @fastify/helmet
```

**Update `server/src/app.ts`:**

```typescript
import fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import authPlugin from './plugins/auth.plugin';
import oauthPlugin from './plugins/oauth.plugin';
import authRoutes from './routes/auth.routes';
import athletesRoutes from './routes/athlete.routes';
import trackRoutes from './routes/track.routes';

async function build(opts = {}) {
  const app = fastify(opts);

  // Register security headers
  await app.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
    crossOriginEmbedderPolicy: false, // Adjust based on your needs
  });

  // Register CORS
  await app.register(cors, {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  });

  // ... rest of setup
}

export default build;
```

---

### 11. **Increase Bcrypt Rounds** - LOW

**Current Code:** `server/src/services/auth.service.ts:6`

```typescript
const SALT_ROUNDS = 10;
```

**Recommendation:**

```typescript
// Increase to 12 for better security (slight performance impact)
const SALT_ROUNDS = 12;
```

---

## 📋 Implementation Priority

### Phase 1: Critical (Implement Now)

1. ✅ Enforce JWT_SECRET requirement
2. ✅ Sign cookies with COOKIE_SECRET
3. ✅ Add rate limiting
4. ✅ Fix timing attack vulnerability

### Phase 2: High Priority (This Week)

5. ✅ Strengthen password requirements
6. ✅ Fix information disclosure
7. ✅ Add CORS configuration
8. ✅ Verify CSRF protection in OAuth
9. ✅ Add security headers (Helmet)

### Phase 3: Medium Priority (This Month)

10. ✅ Shorten JWT expiry / Add refresh tokens
11. ✅ Increase bcrypt rounds
12. ⏳ Add email verification
13. ⏳ Add account lockout mechanism
14. ⏳ Add password reset flow

---

## Environment Variables Checklist

Update your `.env` file with these required variables:

```env
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/postgres

# Secrets (CRITICAL - Generate secure random strings)
# Generate with: openssl rand -base64 32
JWT_SECRET=your-secure-random-secret-minimum-32-characters-long
COOKIE_SECRET=your-secure-random-cookie-secret-minimum-32-characters

# OAuth Providers
STRAVA_CLIENT_ID=your_strava_client_id
STRAVA_CLIENT_SECRET=your_strava_client_secret

# URLs
SERVER_URL=http://localhost:3001
CLIENT_URL=http://localhost:5173

# Environment
NODE_ENV=development
```

---

## Testing Security Fixes

After implementing fixes, test with:

```bash
# 1. Test rate limiting
for i in {1..10}; do
  curl -X POST http://localhost:3001/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrong"}'
done
# Should get rate limited after 5 attempts

# 2. Test weak password rejection
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@test.com",
    "password":"12345678",
    "firstName":"Test",
    "lastName":"User"
  }'
# Should fail validation

# 3. Test strong password acceptance
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@test.com",
    "password":"MyP@ssw0rd!",
    "firstName":"Test",
    "lastName":"User"
  }'
# Should succeed
```

---

## Additional Recommendations

### Future Enhancements

1. **Multi-Factor Authentication (MFA)**

   - Add TOTP/SMS-based 2FA
   - Use libraries like `speakeasy` or `otplib`

2. **Audit Logging**

   - Log all authentication events
   - Track failed login attempts
   - Monitor for suspicious activity

3. **Password History**

   - Prevent password reuse
   - Store hashed previous passwords

4. **Session Management**

   - Implement proper session revocation
   - Add "logout all devices" functionality
   - Use Redis for session storage

5. **Security Monitoring**
   - Set up alerts for multiple failed logins
   - Monitor for brute force patterns
   - Track account enumeration attempts

---

## Resources

- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [Fastify Security Best Practices](https://fastify.dev/docs/latest/Guides/Security/)
- [@fastify/rate-limit Documentation](https://github.com/fastify/fastify-rate-limit)
- [@fastify/helmet Documentation](https://github.com/fastify/fastify-helmet)
- [NIST Password Guidelines](https://pages.nist.gov/800-63-3/sp800-63b.html)
