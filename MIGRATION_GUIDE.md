# Database Migration Guide

This guide explains how to migrate the database to add user authentication support.

## Overview

This update adds user authentication with OAuth support (Google and GitHub) to DevBoard. The database schema has been updated to include:
- User accounts
- OAuth provider accounts
- Session management
- User ownership of tasks

## Prerequisites

- PostgreSQL database running and accessible
- `DATABASE_URL` environment variable configured in `packages/web/.env`
- All authentication environment variables set (see `packages/web/env.example`)

## Migration Steps

### 1. Set Up Environment Variables

Copy the example environment file and fill in your values:

```bash
cd packages/web
cp env.example .env
```

Edit `.env` and add:
- Your PostgreSQL database URL
- A secure `AUTH_SECRET` (generate with: `openssl rand -base64 32`)
- Google OAuth credentials (from Google Cloud Console)
- GitHub OAuth credentials (from GitHub Developer Settings)

### 2. Run the Migration

From the `packages/web` directory:

```bash
npx prisma migrate dev --name add_user_authentication
```

This will:
- Create the User, Account, Session, and VerificationToken tables
- Add a `userId` column to the Task table
- Create necessary foreign keys and indexes
- Generate the updated Prisma Client

### 3. Seed the Database (Optional)

To create sample data including a demo user:

```bash
npm run db:seed
```

This creates:
- A demo user (demo@devboard.dev)
- Sample labels (bug, feature, documentation, etc.)
- Sample tasks assigned to the demo user

## Schema Changes

### New Models

#### User
```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  accounts      Account[]
  sessions      Session[]
  tasks         Task[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}
```

#### Account
OAuth provider account information linked to users.

#### Session
User session management for NextAuth.js.

#### VerificationToken
Email verification tokens for NextAuth.js.

### Updated Models

#### Task
Added user ownership:
```prisma
model Task {
  // ... existing fields ...
  userId      String
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId])
}
```

## Breaking Changes

**Important:** This is a breaking change for existing databases.

- All existing tasks must be associated with a user
- The migration will fail if there are existing tasks without a user assignment
- **Before migrating production data:**
  1. Back up your database
  2. Decide how to handle existing tasks (assign to a default user, or delete)
  3. Modify the migration if needed to handle existing data

## Rollback

If you need to rollback the migration:

```bash
npx prisma migrate reset
```

⚠️ **Warning:** This will delete all data in the database.

## OAuth Provider Setup

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID
5. Set authorized redirect URIs:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://yourdomain.com/api/auth/callback/google`
6. Copy Client ID and Client Secret to your `.env` file

### GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the application details:
   - Application name: DevBoard
   - Homepage URL: Your application URL
   - Authorization callback URL:
     - Development: `http://localhost:3000/api/auth/callback/github`
     - Production: `https://yourdomain.com/api/auth/callback/github`
4. Click "Register application"
5. Generate a new client secret
6. Copy Client ID and Client Secret to your `.env` file

## Verification

After migration, verify the setup:

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000`
3. You should be redirected to the sign-in page
4. Try signing in with Google or GitHub
5. After successful authentication, you should see the task board

## Troubleshooting

### "Column 'userId' cannot be null" error

This means you have existing tasks in the database. You need to either:
1. Delete existing tasks before migrating
2. Manually assign a userId to existing tasks
3. Modify the migration to handle existing data

### OAuth callback errors

- Verify your OAuth credentials are correct
- Check that redirect URIs match exactly (including http/https and trailing slashes)
- Ensure `AUTH_TRUST_HOST=true` is set in development
- Check that `AUTH_SECRET` is set and not empty

### "Invalid session" errors

- Clear your browser cookies
- Restart the development server
- Verify database connection is working
- Check that Session table exists and is accessible

## Support

For issues or questions:
- Check the [NextAuth.js documentation](https://authjs.dev/)
- Review the [Prisma documentation](https://www.prisma.io/docs)
- Open an issue on the repository
