# Security Hardening Specification

> **Status:** Future Implementation (v2+)
> **Applies When:** Database and user authentication are added
> **Reference:** OWASP Top 10, OWASP API Security Top 10
> **Last Updated:** 2026-01-03

---

## Table of Contents

1. [Overview](#1-overview)
2. [Rate Limiting](#2-rate-limiting)
3. [Input Validation & Sanitization](#3-input-validation--sanitization)
4. [API Key & Secret Management](#4-api-key--secret-management)
5. [Authentication & Session Security](#5-authentication--session-security)
6. [Data Protection](#6-data-protection)
7. [API Security](#7-api-security)
8. [Infrastructure Security](#8-infrastructure-security)
9. [Security Headers](#9-security-headers)
10. [Logging & Monitoring](#10-logging--monitoring)
11. [Implementation Checklist](#11-implementation-checklist)

---

## 1. Overview

This document outlines the security requirements to be implemented when the Personal UI Vault transitions from a local development tool to a production application with database storage and user authentication.

### 1.1 Current State (v1)

- File-based storage (no database)
- Local-only access (no authentication)
- No public endpoints
- No sensitive data handling

### 1.2 Future State (v2+)

When adding multi-user support, the following must be implemented:

- User authentication and authorization
- Database-backed storage
- Public API endpoints
- Session management
- Secure credential handling

---

## 2. Rate Limiting

### 2.1 Requirements

Implement rate limiting on **all public endpoints** to prevent abuse, DDoS attacks, and brute-force attempts.

### 2.2 Strategy: Dual-Layer Rate Limiting

```typescript
// Rate limit configuration structure
interface RateLimitConfig {
  // IP-based limiting (unauthenticated requests)
  ip: {
    windowMs: number;      // Time window in milliseconds
    maxRequests: number;   // Max requests per window
    blockDuration: number; // Block duration after limit exceeded
  };
  // User-based limiting (authenticated requests)
  user: {
    windowMs: number;
    maxRequests: number;
    blockDuration: number;
  };
}
```

### 2.3 Default Limits

| Endpoint Category | IP Limit | User Limit | Window | Block Duration |
|-------------------|----------|------------|--------|----------------|
| **Authentication** | 5/min | N/A | 1 min | 15 min |
| **API Read** | 100/min | 1000/min | 1 min | 5 min |
| **API Write** | 20/min | 100/min | 1 min | 10 min |
| **Source Copy** | 30/min | 300/min | 1 min | 5 min |
| **Search** | 60/min | 600/min | 1 min | 5 min |
| **File Upload** | 10/min | 50/min | 1 min | 15 min |

### 2.4 Graceful 429 Responses

```typescript
// Example 429 response structure
interface RateLimitResponse {
  error: {
    code: "RATE_LIMIT_EXCEEDED";
    message: string;
    retryAfter: number;  // Seconds until limit resets
  };
  headers: {
    "Retry-After": string;
    "X-RateLimit-Limit": string;
    "X-RateLimit-Remaining": string;
    "X-RateLimit-Reset": string;
  };
}
```

### 2.5 Implementation Notes

```typescript
// packages/vault-api/middleware/rate-limit.ts

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// IMPORTANT: Use sliding window algorithm for smoother rate limiting
// IMPORTANT: Store rate limit state in Redis for distributed deployments
// IMPORTANT: Include rate limit headers in ALL responses

export function createRateLimiter(config: RateLimitConfig) {
  // Implementation details:
  // 1. Check IP-based limit first (before auth)
  // 2. If authenticated, apply user-based limit
  // 3. Return 429 with proper headers if exceeded
  // 4. Log rate limit events for monitoring
}
```

---

## 3. Input Validation & Sanitization

### 3.1 Validation Strategy

All user inputs MUST be validated using schema-based validation (Zod) before processing.

### 3.2 Validation Rules

| Input Type | Validation Rules |
|------------|------------------|
| **IDs** | Regex: `/^[a-z0-9-]+$/`, max 100 chars |
| **Names** | 1-100 chars, no HTML/script tags |
| **Descriptions** | 1-500 chars, sanitized for XSS |
| **Tags** | Array, 1-20 items, each 1-50 chars |
| **Search Queries** | 1-200 chars, special chars escaped |
| **Pagination** | `page` >= 1, `limit` <= 100 |
| **File Paths** | Whitelist allowed paths, no `..` traversal |

### 3.3 Schema Validation Example

```typescript
// packages/vault-api/validation/schemas.ts

import { z } from "zod";

// IMPORTANT: Always use strict schemas that reject unexpected fields
// IMPORTANT: Validate at the edge (API route handler entry point)
// IMPORTANT: Never trust client-side validation alone

export const ItemQuerySchema = z.object({
  type: z.enum(["component", "section", "template"]).optional(),
  tags: z.array(z.string().max(50)).max(20).optional(),
  status: z.enum(["draft", "ready", "deprecated"]).optional(),
  search: z.string().max(200).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
}).strict(); // Reject unexpected fields

export const CreateItemSchema = z.object({
  id: z.string()
    .regex(/^[a-z0-9-]+$/, "ID must be lowercase alphanumeric with hyphens")
    .min(1)
    .max(100),
  name: z.string()
    .min(1)
    .max(100)
    .transform(sanitizeHtml), // Strip HTML tags
  description: z.string()
    .min(1)
    .max(500)
    .transform(sanitizeHtml),
  tags: z.array(
    z.string().min(1).max(50).transform(sanitizeHtml)
  ).min(1).max(20),
  // ... other fields
}).strict();
```

### 3.4 Sanitization Functions

```typescript
// packages/vault-api/utils/sanitize.ts

// IMPORTANT: Use established libraries (DOMPurify for HTML, validator.js for strings)
// IMPORTANT: Sanitize on input AND encode on output
// IMPORTANT: Different contexts require different sanitization (HTML, SQL, URL, etc.)

import DOMPurify from "isomorphic-dompurify";
import validator from "validator";

export function sanitizeHtml(input: string): string {
  // Remove all HTML tags, keeping only text content
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [] });
}

export function sanitizeForSearch(input: string): string {
  // Escape special regex characters
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function validateFilePath(path: string, allowedBase: string): boolean {
  // SECURITY: Prevent path traversal attacks
  const normalized = path.normalize("NFC");
  const resolved = require("path").resolve(allowedBase, normalized);
  return resolved.startsWith(allowedBase) && !normalized.includes("..");
}
```

### 3.5 Error Responses for Invalid Input

```typescript
// Return 400 Bad Request with specific error details
interface ValidationErrorResponse {
  error: {
    code: "VALIDATION_ERROR";
    message: "Invalid input";
    details: Array<{
      field: string;
      message: string;
      received?: unknown;
    }>;
  };
}
```

---

## 4. API Key & Secret Management

### 4.1 Principles

1. **NEVER** hardcode secrets in source code
2. **NEVER** expose secrets to the client (browser)
3. **ALWAYS** use environment variables for secrets
4. **ALWAYS** rotate keys regularly
5. **ALWAYS** use different keys for different environments

### 4.2 Environment Variable Structure

```bash
# .env.local (NEVER commit this file)
# .env.example (commit this with placeholder values)

# Database
DATABASE_URL="postgresql://..."
DATABASE_URL_DIRECT="postgresql://..."  # For migrations

# Authentication
AUTH_SECRET="..."                        # NextAuth.js secret
AUTH_GOOGLE_ID="..."                     # OAuth client ID
AUTH_GOOGLE_SECRET="..."                 # OAuth client secret

# External Services
UPSTASH_REDIS_REST_URL="..."            # Rate limiting
UPSTASH_REDIS_REST_TOKEN="..."
RESEND_API_KEY="..."                     # Email service

# Feature Flags
ENABLE_PUBLIC_REGISTRY="false"
```

### 4.3 Secret Access Patterns

```typescript
// packages/vault-api/config/env.ts

import { z } from "zod";

// IMPORTANT: Validate ALL environment variables at startup
// IMPORTANT: Fail fast if required variables are missing
// IMPORTANT: Use Zod for type-safe environment parsing

const serverEnvSchema = z.object({
  DATABASE_URL: z.string().url(),
  AUTH_SECRET: z.string().min(32),
  UPSTASH_REDIS_REST_URL: z.string().url(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1),
  // Add all server-side env vars
});

// Only expose NEXT_PUBLIC_* variables to client
const clientEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url(),
  // Add all client-side env vars
});

// Validate on startup
export const serverEnv = serverEnvSchema.parse(process.env);
export const clientEnv = clientEnvSchema.parse({
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
});
```

### 4.4 Key Rotation Schedule

| Secret Type | Rotation Frequency | Notes |
|-------------|-------------------|-------|
| AUTH_SECRET | 90 days | Invalidates all sessions |
| API Keys | 90 days | Generate new before expiring old |
| Database Password | 180 days | Coordinate with maintenance window |
| OAuth Secrets | 365 days | Update in provider dashboard |

### 4.5 Preventing Client-Side Exposure

```typescript
// next.config.ts

// IMPORTANT: Only NEXT_PUBLIC_* vars are exposed to client
// IMPORTANT: Server components can access all env vars
// IMPORTANT: Never pass secrets through props to client components

export default {
  serverExternalPackages: ["@node-rs/bcrypt"], // Keep server-only

  // Block accidental exposure
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000", "your-domain.com"],
    },
  },
};
```

---

## 5. Authentication & Session Security

### 5.1 Session Configuration

```typescript
// auth.config.ts

import type { AuthConfig } from "next-auth";

// IMPORTANT: Use secure session settings
// IMPORTANT: Implement CSRF protection
// IMPORTANT: Set appropriate cookie flags

export const authConfig: AuthConfig = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  cookies: {
    sessionToken: {
      options: {
        httpOnly: true,       // Prevent XSS access
        sameSite: "lax",      // CSRF protection
        secure: process.env.NODE_ENV === "production", // HTTPS only
        path: "/",
      },
    },
  },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
};
```

### 5.2 Password Requirements (if using credentials)

- Minimum 12 characters
- At least one uppercase, lowercase, number, special character
- Check against common password lists (Have I Been Pwned API)
- Use bcrypt with cost factor >= 12
- Implement account lockout after 5 failed attempts

### 5.3 CSRF Protection

```typescript
// Ensure all state-changing operations use:
// 1. POST/PUT/DELETE methods (not GET)
// 2. CSRF tokens for form submissions
// 3. SameSite cookie attribute
// 4. Origin/Referer header validation for API calls
```

---

## 6. Data Protection

### 6.1 Data Classification

| Data Type | Classification | Storage | Encryption |
|-----------|---------------|---------|------------|
| User email | PII | Database | At rest |
| User password | Sensitive | Never stored (hashed only) | bcrypt |
| Session tokens | Sensitive | JWT/Cookie | Signed |
| Item source code | User content | Filesystem/DB | At rest |
| API keys | Secret | Environment only | N/A |

### 6.2 Database Security

```typescript
// IMPORTANT: Use parameterized queries (Prisma handles this)
// IMPORTANT: Never interpolate user input into SQL
// IMPORTANT: Use connection pooling with timeouts
// IMPORTANT: Enable SSL for database connections

// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  // Enforce SSL
  // Connection pooling via PgBouncer or Prisma Accelerate
}
```

### 6.3 Encryption at Rest

- Enable database-level encryption (AWS RDS, PlanetScale, etc.)
- Encrypt sensitive fields with application-level encryption if needed
- Encrypt backups

---

## 7. API Security

### 7.1 CORS Configuration

```typescript
// middleware.ts

// IMPORTANT: Restrict CORS to known origins only
// IMPORTANT: Don't use wildcard (*) in production
// IMPORTANT: Validate Origin header

const allowedOrigins = [
  "https://your-domain.com",
  "https://app.your-domain.com",
];

if (process.env.NODE_ENV === "development") {
  allowedOrigins.push("http://localhost:3000");
}
```

### 7.2 Request Size Limits

```typescript
// next.config.ts

export default {
  api: {
    bodyParser: {
      sizeLimit: "1mb",  // Adjust based on needs
    },
    responseLimit: "4mb",
  },
};
```

### 7.3 API Versioning

- Use URL path versioning: `/api/v1/items`
- Maintain backwards compatibility for at least 6 months
- Deprecation notices in response headers

---

## 8. Infrastructure Security

### 8.1 Deployment Checklist

- [ ] Enable HTTPS (TLS 1.2+)
- [ ] Configure Web Application Firewall (WAF)
- [ ] Enable DDoS protection (Cloudflare, AWS Shield)
- [ ] Restrict direct access to origin servers
- [ ] Enable audit logging
- [ ] Configure automatic security updates

### 8.2 Network Security

- Use private networking for database connections
- Implement VPC peering where applicable
- Use security groups/firewall rules to restrict access

---

## 9. Security Headers

### 9.1 Required Headers

```typescript
// middleware.ts or next.config.ts

// IMPORTANT: Apply security headers to all responses
// IMPORTANT: Test with securityheaders.com

const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Content-Security-Policy",
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval';
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: blob: https:;
      font-src 'self';
      connect-src 'self' https://api.your-domain.com;
      frame-ancestors 'self';
    `.replace(/\s+/g, " ").trim(),
  },
];
```

---

## 10. Logging & Monitoring

### 10.1 Security Events to Log

| Event | Log Level | Alert |
|-------|-----------|-------|
| Failed login attempt | WARN | After 3 attempts |
| Rate limit exceeded | WARN | Pattern detection |
| Invalid input rejected | INFO | Unusual patterns |
| Authentication success | INFO | No |
| Password changed | INFO | Email notification |
| Suspicious activity | ERROR | Immediate |
| Authorization failure | WARN | Pattern detection |

### 10.2 Log Format

```typescript
// IMPORTANT: Never log sensitive data (passwords, tokens, full card numbers)
// IMPORTANT: Include correlation IDs for request tracing
// IMPORTANT: Sanitize user input in logs

interface SecurityLogEntry {
  timestamp: string;
  level: "INFO" | "WARN" | "ERROR";
  event: string;
  userId?: string;
  ip: string;
  userAgent: string;
  correlationId: string;
  details: Record<string, unknown>;
}
```

### 10.3 Alerting Thresholds

- 5+ failed logins from same IP in 5 minutes
- 100+ rate limit hits in 1 minute
- Any SQL injection pattern detected
- Any XSS pattern detected
- Unusual geographic access patterns

---

## 11. Implementation Checklist

### Phase 1: Before Adding Authentication

- [ ] Set up environment variable management
- [ ] Configure security headers
- [ ] Implement input validation schemas
- [ ] Add basic rate limiting structure
- [ ] Set up logging infrastructure

### Phase 2: With Authentication

- [ ] Implement rate limiting on all endpoints
- [ ] Add CSRF protection
- [ ] Configure secure session management
- [ ] Implement password policies
- [ ] Add account lockout
- [ ] Set up security monitoring

### Phase 3: Production Hardening

- [ ] Security audit by third party
- [ ] Penetration testing
- [ ] OWASP ZAP scan
- [ ] Configure WAF rules
- [ ] Implement incident response plan
- [ ] Document security procedures

---

## References

- [OWASP Top 10](https://owasp.org/Top10/)
- [OWASP API Security Top 10](https://owasp.org/www-project-api-security/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [NextAuth.js Security](https://next-auth.js.org/getting-started/introduction#security)
- [Next.js Security Headers](https://nextjs.org/docs/advanced-features/security-headers)

---

*Document maintained by Claude Code. Last updated: 2026-01-03*
