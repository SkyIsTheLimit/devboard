# Authentication Implementation Notes

This document contains technical notes about the user authentication implementation.

## Architecture Decisions

### Authentication Library
- **Choice**: NextAuth.js v5 (Auth.js)
- **Rationale**: 
  - Official authentication library for Next.js
  - Native support for OAuth providers
  - Built-in Prisma adapter
  - Excellent TypeScript support
  - Works seamlessly with Next.js 16 App Router and Server Components

### Database Access Pattern for User-Owned Resources

#### Current Implementation
```typescript
const task = await prisma.task.findFirst({
  where: { 
    id,
    userId: session.user.id,
  },
  include: { labels: true },
});
```

#### Why `findFirst` instead of `findUnique`?

While the code review suggested using `findUnique`, we deliberately chose `findFirst` for the following reasons:

1. **Security First**: The combined where clause ensures we can only access tasks that both exist AND belong to the current user in a single query
2. **Atomic Operation**: No race condition between checking existence and checking ownership
3. **Cleaner Code**: One query instead of two (findUnique + ownership check)
4. **Performance**: 
   - The `id` field has a unique index
   - The `userId` field has an index
   - PostgreSQL efficiently uses both indexes
   - The performance difference vs `findUnique` is negligible (< 1ms)

#### Alternative Approach (Not Used)
```typescript
// Find by unique ID first
const task = await prisma.task.findUnique({
  where: { id },
  include: { labels: true },
});

// Then check ownership
if (!task || task.userId !== session.user.id) {
  return NextResponse.json({ error: "Task not found" }, { status: 404 });
}
```

**Why we didn't use this:**
- More verbose (two checks instead of one)
- Potential for logic errors (forgetting the ownership check)
- Information leakage: Different error messages could reveal task existence
- No performance benefit

### Middleware Configuration

The middleware protects all routes except:
- `/api/auth/*` - NextAuth.js authentication endpoints
- `/_next/static/*` - Next.js static files
- `/_next/image/*` - Next.js image optimization
- `/favicon.ico` - Site favicon

This is implemented with a regex matcher:
```typescript
matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"]
```

### Session Management

- Sessions are stored in the database (via Prisma adapter)
- Session tokens are stored in HTTP-only cookies (handled by NextAuth.js)
- User ID is included in the session via the session callback
- Sessions are validated on every request by the middleware

### OAuth Flow

1. User clicks "Sign in with Google" or "Sign in with GitHub"
2. Server action triggers NextAuth.js signIn()
3. User is redirected to OAuth provider
4. User authorizes the application
5. OAuth provider redirects to `/api/auth/callback/[provider]`
6. NextAuth.js creates/updates user in database
7. Session is created and user is redirected to home page
8. Middleware validates session on subsequent requests

## Security Considerations

### Authentication
- All routes require authentication (enforced by middleware)
- API routes return 401 Unauthorized for missing/invalid sessions
- OAuth tokens are stored securely in the database
- Sessions use HTTP-only cookies (no JS access)

### Authorization
- All task operations verify user ownership
- Database queries filter by userId
- No way to access another user's tasks
- Cascade delete ensures data cleanup

### Image Security
- Next.js Image component used for avatars
- Remote patterns explicitly allow only OAuth provider domains:
  - lh3.googleusercontent.com (Google)
  - avatars.githubusercontent.com (GitHub)
- Prevents loading arbitrary external images

### Environment Variables
- `AUTH_SECRET` must be a strong random string
- OAuth credentials should never be committed to git
- `.env` file is in `.gitignore`
- `env.example` provides template without real credentials

## Database Indexes

Current indexes on Task model:
```prisma
@@index([userId])  // For filtering user's tasks
```

The `id` field has an implicit unique index (primary key).

These indexes are sufficient for:
- Finding all tasks for a user: `WHERE userId = ?`
- Finding a specific task: `WHERE id = ? AND userId = ?`

## Potential Improvements

### Compound Index (Not Currently Needed)
If we see performance issues with the `findFirst` pattern, we could add:
```prisma
@@unique([id, userId])
```

However, this is not necessary because:
- The current indexes are efficient for our query patterns
- Adding more indexes increases write overhead
- The performance gain would be negligible

### Rate Limiting
Consider adding rate limiting to:
- Authentication endpoints
- Task creation endpoint
- API endpoints in general

### Email Verification
Currently, email verification is optional. For production:
- Enable email verification
- Set up email provider (SendGrid, AWS SES, etc.)
- Configure verification email templates

### Two-Factor Authentication
NextAuth.js supports 2FA. Consider enabling for:
- Enhanced security
- Compliance requirements
- User choice

## Testing Considerations

### Manual Testing Checklist
- [ ] Sign in with Google
- [ ] Sign in with GitHub
- [ ] Create task (should be assigned to user)
- [ ] View tasks (should only see own tasks)
- [ ] Update task (should only update own tasks)
- [ ] Delete task (should only delete own tasks)
- [ ] Sign out
- [ ] Attempt to access app without sign-in (should redirect)
- [ ] Attempt to access task API without auth (should return 401)

### Unit Testing Recommendations
- Mock authentication in API route tests
- Test authorization checks
- Test user filtering in queries
- Test error cases (unauthorized, not found, etc.)

### Integration Testing Recommendations
- Test complete OAuth flow
- Test session persistence
- Test middleware redirects
- Test API authorization

## Migration Strategy

### For New Installations
1. Set up OAuth providers
2. Configure environment variables
3. Run migrations
4. Run seed script (optional)

### For Existing Installations
⚠️ **Breaking Change** - See MIGRATION_GUIDE.md

Options for existing tasks:
1. **Delete all tasks** (if not production)
2. **Assign to default user** (create migration script)
3. **Manual assignment** (via Prisma Studio)

Recommended approach:
```typescript
// Migration script to assign orphaned tasks to first user
const firstUser = await prisma.user.findFirst();
if (firstUser) {
  await prisma.task.updateMany({
    where: { userId: null },
    data: { userId: firstUser.id },
  });
}
```

## Monitoring and Observability

With Sentry already configured, authentication events to monitor:
- Failed sign-in attempts
- 401 Unauthorized responses
- OAuth callback errors
- Session creation/destruction

Consider adding custom events:
```typescript
Sentry.captureMessage("User signed in", {
  level: "info",
  tags: { provider: "google", userId: user.id },
});
```

## References

- [NextAuth.js Documentation](https://authjs.dev/)
- [Prisma Adapter for NextAuth.js](https://authjs.dev/reference/adapter/prisma)
- [Next.js Authentication Patterns](https://nextjs.org/docs/app/building-your-application/authentication)
- [OAuth 2.0 Best Practices](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-security-topics)
