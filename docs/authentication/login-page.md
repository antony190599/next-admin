# Creating a Login Page with Next.js and shadcn/ui

This guide walks through creating a login page using Next.js and shadcn/ui components.

## Prerequisites

Ensure you have the required shadcn/ui components installed:

- Button
- Input
- Label

If not installed, add them using the instructions in [Adding shadcn/ui Components](../components/adding-shadcn-components.md).

## Step 1: Create the Login Page File Structure

Create the following directory structure:

```
app/
└── (auth)/
    └── login/
        └── page.tsx
```

The `(auth)` folder is a route group that doesn't affect the URL path.

## Step 2: Create the Login Page Component

Create a login page component with email and password fields:

```tsx
// app/(auth)/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Replace with your authentication logic
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      if (response.ok) {
        // Navigate to dashboard on successful login
        router.push('/dashboard');
      } else {
        // Handle authentication error
        const error = await response.json();
        console.error('Login failed:', error);
        // Implement error display to the user
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
          <p className="mt-2 text-sm text-gray-600">
            Enter your credentials to access your account
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email"
              type="email" 
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link 
                href="/forgot-password" 
                className="text-xs text-blue-600 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <Input 
              id="password"
              type="password" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Sign in"}
          </Button>
        </form>
        
        <div className="mt-6 text-center text-sm">
          <p>
            Don&apos;t have an account?{" "}
            <Link 
              href="/register" 
              className="text-blue-600 hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
```

## Step 3: Set Up Authentication API Route

Create a login API endpoint to handle authentication:

```tsx
// app/api/auth/login/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    // Replace with your actual authentication logic
    // This is just a placeholder example
    if (email === 'admin@example.com' && password === 'password123') {
      // Set authentication cookie or return JWT token
      return NextResponse.json({ 
        success: true, 
        message: 'Authentication successful' 
      });
    }
    
    return NextResponse.json(
      { success: false, message: 'Invalid credentials' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

## Step 4: Create a Layout for Authentication Pages (Optional)

You can create a layout for all authentication pages:

```tsx
// app/(auth)/layout.tsx
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-100">
      <div className="container mx-auto py-8">
        {children}
      </div>
    </div>
  );
}
```

## Step 5: Add Authentication Middleware (Optional)

Create middleware to protect routes that require authentication:

```tsx
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.has('authToken'); // Or check your auth method
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || 
                     request.nextUrl.pathname.startsWith('/register');

  if (!isAuthenticated && !isAuthPage && !request.nextUrl.pathname.startsWith('/_next')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAuthenticated && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
```

## Styling Tips

- Use Tailwind classes for responsive layout
- Use shadcn/ui components for consistent styling
- Add dark mode support if needed

## Additional Features

You can enhance your login page with:

- Social login buttons
- Remember me functionality
- Two-factor authentication
- CAPTCHA for security

## Testing the Login Flow

To test the login functionality:

1. Start the development server with `npm run dev`
2. Navigate to `/login`
3. Try logging in with test credentials
4. Verify redirection to the dashboard
5. Test error handling with incorrect credentials

For more authentication methods, see the [Authentication Flow](./auth-flow.md) document.
