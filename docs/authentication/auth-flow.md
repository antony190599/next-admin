# Authentication Flow Implementation

This document explains how to implement a complete authentication flow in your Next.js admin application.

## Authentication Methods

Choose the authentication method that best suits your needs:

1. **Server-side Session**: Using cookies and server-side sessions
2. **JSON Web Tokens (JWT)**: Stateless authentication using tokens
3. **OAuth**: Authentication through third-party providers

## JWT Authentication Implementation

This guide focuses on JWT-based authentication, which is well-suited for Next.js applications.

### 1. Install Required Packages

```bash
npm install jsonwebtoken bcryptjs
npm install -D @types/jsonwebtoken @types/bcryptjs
```

### 2. Create Authentication Utilities

Create authentication utility functions in `/lib/auth.ts`:

```typescript
// lib/auth.ts
import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Replace with your secret key (store in environment variables in production)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface UserData {
  id: string;
  email: string;
  name: string;
  role: string;
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

// Compare password with hash
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

// Generate JWT token
export function generateToken(userData: UserData): string {
  return jwt.sign(userData, JWT_SECRET, { expiresIn: '1d' });
}

// Verify JWT token
export function verifyToken(token: string): UserData | null {
  try {
    return jwt.verify(token, JWT_SECRET) as UserData;
  } catch (error) {
    return null;
  }
}

// Get user from request
export function getUserFromRequest(req: NextRequest): UserData | null {
  const token = req.cookies.get('authToken')?.value;
  if (!token) return null;
  return verifyToken(token);
}
```

### 3. Create Login API Endpoint

```typescript
// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyPassword, generateToken } from '@/lib/auth';

// This would come from your database in a real app
const users = [
  {
    id: '1',
    email: 'admin@example.com',
    password: '$2a$10$JqliG8.uB7zX4aZr1RgGPevjF6rRXUOD1I3VQ0iYdIGHEDTNWM3s2', // password123 (hashed)
    name: 'Admin User',
    role: 'admin',
  },
];

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    // Find user with matching email (replace with database query)
    const user = users.find(u => u.email === email);
    
    // Check if user exists and password is correct
    if (!user || !(await verifyPassword(password, user.password))) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // Generate token with user data
    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
    const token = generateToken(userData);
    
    // Set cookie with token
    cookies().set({
      name: 'authToken',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 86400, // 1 day
    });
    
    return NextResponse.json({
      success: true,
      user: userData,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### 4. Create Logout API Endpoint

```typescript
// app/api/auth/logout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  // Clear the authentication cookie
  cookies().delete('authToken');
  
  return NextResponse.json({
    success: true,
    message: 'Logged out successfully',
  });
}
```

### 5. Create Auth Context for Client Components

```typescript
// contexts/auth-context.tsx
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check if the user is authenticated on mount
  useEffect(() => {
    async function loadUserFromSession() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadUserFromSession();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      setUser(data.user);
      router.push('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

### 6. Create "Me" API Endpoint for Session Validation

```typescript
// app/api/auth/me/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### 7. Update Root Layout to Include Auth Provider

```typescript
// app/layout.tsx
import { AuthProvider } from '@/contexts/auth-context';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
```

### 8. Create Protected Route Component

```typescript
// components/protected-route.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';

export default function ProtectedRoute({
  children,
  requiredRole = [],
}: {
  children: React.ReactNode;
  requiredRole?: string[];
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
    
    if (
      !isLoading && 
      user && 
      requiredRole.length > 0 && 
      !requiredRole.includes(user.role)
    ) {
      // Redirect if the user doesn't have the required role
      router.push('/unauthorized');
    }
  }, [user, isLoading, router, requiredRole]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  if (requiredRole.length > 0 && !requiredRole.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}
```

### 9. Use Protection Component in Dashboard Pages

```typescript
// app/dashboard/page.tsx
'use client';

import ProtectedRoute from '@/components/protected-route';
import { useAuth } from '@/contexts/auth-context';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <p>Welcome, {user?.name}!</p>
        {/* Dashboard content */}
      </div>
    </ProtectedRoute>
  );
}
```

## Security Considerations

1. **Store Secrets Securely**: Use environment variables for sensitive values like JWT_SECRET
2. **HTTP-Only Cookies**: Always use HTTP-only cookies for storing authentication tokens
3. **HTTPS**: Enable HTTPS in production
4. **CSRF Protection**: Implement CSRF protection for authentication endpoints
5. **Rate Limiting**: Add rate limiting to prevent brute force attacks
6. **Password Validation**: Enforce strong password requirements
7. **Session Expiration**: Set appropriate expiration times for tokens

## Next Steps

- Implement user registration
- Add password reset functionality  
- Set up email verification
- Implement multi-factor authentication
- Add social login providers

For more information about authentication in Next.js, refer to the [Next.js Authentication Documentation](https://nextjs.org/docs/authentication).
