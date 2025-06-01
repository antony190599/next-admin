# Authentication

This section covers authentication concepts and implementation details for the Next.js Admin template.

## Authentication Methods

The admin template supports the following authentication methods:

1. **Form-based Authentication** - Email/password login using API routes
2. **OAuth Providers** - Social login with providers like Google, GitHub, etc.
3. **JWT-based Authentication** - Using JSON Web Tokens for session management

## Key Authentication Files

- `/app/(auth)/login/page.tsx` - Login page component
- `/app/(auth)/register/page.tsx` - Registration page component
- `/lib/auth.ts` - Authentication utility functions

## Authentication Flow

The typical authentication flow is:

1. User submits credentials via the login form
2. The form submits data to an authentication endpoint 
3. On successful authentication, the server returns a token or sets a session cookie
4. The user is redirected to the dashboard or home page
5. Protected routes check for valid authentication on each request

## Protected Routes

To create a protected route, you can use middleware to check authentication status before allowing access to certain pages.

See the [Authentication Flow](./auth-flow.md) document for implementation details.

## Content Pages

Explore the following guides for detailed instructions:

- [Login Page](./login-page.md) - Learn how to customize the login page
- [Authentication Flow](./auth-flow.md) - Understand the authentication implementation
