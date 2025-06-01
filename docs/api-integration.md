# API Integration

This guide explains how to integrate external APIs in your Next.js Admin application.

## API Integration Methods

Next.js provides several ways to integrate APIs:

1. **Server Components**: Fetch data directly in React Server Components
2. **Route Handlers**: Create API endpoints in your Next.js app
3. **Client-side Fetching**: Fetch data from external APIs in client components
4. **Server Actions**: Perform data mutations with form actions

## Server Component Data Fetching

Server Components can fetch data directly during rendering:

```tsx
// app/users/page.tsx
async function getUsers() {
  const res = await fetch('https://api.example.com/users');
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}

export default async function UsersPage() {
  const users = await getUsers();
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Users</h1>
      <ul className="divide-y">
        {users.map((user) => (
          <li key={user.id} className="py-3">
            {user.name} ({user.email})
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### Caching and Revalidation

Next.js provides built-in caching for `fetch` in Server Components:

```tsx
// Revalidate data every 60 seconds
async function getUsers() {
  const res = await fetch('https://api.example.com/users', {
    next: { revalidate: 60 }
  });
  
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}

// Or disable caching
async function getLatestData() {
  const res = await fetch('https://api.example.com/data', {
    cache: 'no-store'
  });
  
  if (!res.ok) throw new Error('Failed to fetch data');
  return res.json();
}
```

## API Route Handlers

Create custom API endpoints in your Next.js app:

```tsx
// app/api/users/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  // Get query parameters
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query') || '';
  
  try {
    // You could call a database or external API here
    const users = await fetchUsersFromDatabase(query);
    
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request data
    if (!body.name || !body.email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }
    
    // Create a new user
    const newUser = await createUserInDatabase(body);
    
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
```

## Client-side Data Fetching

Use React hooks like `useState` and `useEffect` to fetch data in client components:

```tsx
'use client';

import { useState, useEffect } from 'react';

export default function ClientDataFetching() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/data');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Data:</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
```

## Server Actions

Next.js provides Server Actions for handling form submissions and data mutations:

```tsx
// app/actions.ts
'use server';

export async function createUser(formData: FormData) {
  const name = formData.get('name');
  const email = formData.get('email');

  if (!name || !email) {
    return { error: 'Name and email are required' };
  }

  try {
    // Create user in database
    const user = await db.users.create({ name, email });
    return { success: true, user };
  } catch (error) {
    console.error('Failed to create user:', error);
    return { error: 'Failed to create user' };
  }
}
```

Use the server action in a form:

```tsx
// app/users/new/page.tsx
import { createUser } from '@/app/actions';

export default function NewUserPage() {
  return (
    <form action={createUser}>
      <div className="space-y-4">
        <div>
          <label htmlFor="name">Name</label>
          <input id="name" name="name" required />
        </div>
        
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required />
        </div>
        
        <button type="submit">Create User</button>
      </div>
    </form>
  );
}
```

## Authentication and API Requests

When making authenticated API requests, you can include authentication headers:

```tsx
async function fetchProtectedData() {
  const res = await fetch('https://api.example.com/protected', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  return res.json();
}
```

For internal API routes, you can use cookies for authentication:

```tsx
// app/api/protected/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const user = getUserFromRequest(request);
  
  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  // Return protected data
  return NextResponse.json({
    message: 'Protected data',
    user,
  });
}
```

## Error Handling

Implement consistent error handling for API requests:

```tsx
async function fetchData(url) {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      // Try to parse error response
      const errorData = await response.json().catch(() => null);
      
      throw new Error(
        errorData?.message || 
        `API error: ${response.status} ${response.statusText}`
      );
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    throw error;
  }
}
```

## API Request Libraries

While the native `fetch` API is sufficient for many cases, you might want to use a library for more complex scenarios:

### Axios

```bash
npm install axios
```

```tsx
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add authentication interceptor
api.interceptors.request.use((config) => {
  const token = getAuthToken(); // Get token from storage or context
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

// Example request
async function getUsers() {
  try {
    const response = await api.get('/users');
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}
```

### SWR (Stale-While-Revalidate)

SWR is a React Hooks library for data fetching with built-in caching and revalidation:

```bash
npm install swr
```

```tsx
'use client';

import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function UserProfile({ userId }) {
  const { data, error, isLoading } = useSWR(`/api/users/${userId}`, fetcher);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading user</div>;

  return (
    <div>
      <h1>{data.name}</h1>
      <p>{data.email}</p>
    </div>
  );
}
```

### React Query / TanStack Query

For more advanced data fetching, caching, and state management:

```bash
npm install @tanstack/react-query
```

```tsx
'use client';

import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';

// Create a client
const queryClient = new QueryClient();

// Provide the client to your app
export function Providers({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

// Use in a component
function Users() {
  const { isLoading, error, data } = useQuery({
    queryKey: ['users'],
    queryFn: () => fetch('/api/users').then(res => res.json())
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {data.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

## API Data Models

Define TypeScript interfaces for your API data to improve type safety:

```typescript
// types/api.ts
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export interface ApiResponse<T> {
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, string[]>;
}
```

## Testing API Integration

Use libraries like Jest and MSW (Mock Service Worker) to test API integration:

```typescript
// __tests__/api.test.ts
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { fetchUsers } from '../lib/api';

const server = setupServer(
  rest.get('https://api.example.com/users', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        { id: '1', name: 'John Doe', email: 'john@example.com' },
        { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
      ])
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('fetches users successfully', async () => {
  const users = await fetchUsers();
  expect(users).toHaveLength(2);
  expect(users[0].name).toBe('John Doe');
});
```

## Best Practices

1. **Use TypeScript**: Define types for API requests and responses
2. **Error Handling**: Implement consistent error handling
3. **Loading States**: Always show loading states during data fetching
4. **Caching**: Use appropriate caching strategies for different data
5. **Authentication**: Secure API endpoints and handle authentication properly
6. **Rate Limiting**: Implement rate limiting for API routes
7. **Pagination**: Support pagination for large data sets
8. **Validation**: Validate request data on both client and server
