# Next.js Routing Guide

This document explains how to work with routing in the Next.js App Router.

## App Router Overview

Next.js 13+ introduced the App Router, which uses a file-system based router built on top of React Server Components. This enables you to create routes and organize your application in a more intuitive way.

## Directory Structure

In the App Router, routes are defined by folders within the `app` directory:

```
src/
└──app/
    ├── page.tsx         # Home page (/)
    ├── dashboard/       # Dashboard route (/dashboard)
    │   └── page.tsx     # Dashboard page component
    ├── users/           # Users route (/users)
    │   ├── page.tsx     # Users list page component
    │   └── [id]/        # Dynamic route for specific user (/users/:id)
    │       └── page.tsx # User details page component
    └── layout.tsx       # Root layout (applies to all pages)
```

## Creating New Pages

To create a new page:

1. Create a new directory in the `app` folder for your route
2. Add a `page.tsx` file in that directory

Example - Creating an "About" page:

```tsx
// app/about/page.tsx
export default function AboutPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">About Us</h1>
      <p>This is the about page content.</p>
    </div>
  );
}
```

This will be accessible at `/about`.

## Dynamic Routes

Create dynamic routes using square brackets notation:

```tsx
// src/app/products/[id]/page.tsx
export default function ProductPage({ params }: { params: { id: string } }) {
  return <div>Product ID: {params.id}</div>;
}
```

This will match URLs like `/products/123`.

## Nested Routes

You can create nested routes by adding subdirectories:

```tsx
// src/app/dashboard/settings/page.tsx
export default function SettingsPage() {
  return <div>Dashboard Settings</div>;
}
```

This will be accessible at `/dashboard/settings`.

## Layouts

Use layouts to create shared UI for multiple pages:

```tsx
// src/app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <nav className="bg-gray-100 p-4">Dashboard Navigation</nav>
      <main className="p-4">{children}</main>
    </div>
  );
}
```

This layout will wrap all pages within the `dashboard` directory.

## Navigation

Use the Next.js `Link` component for client-side navigation:

```tsx
import Link from 'next/link';

export default function NavigationMenu() {
  return (
    <nav>
      <ul>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link href="/users">Users</Link>
        </li>
      </ul>
    </nav>
  );
}
```

## Programmatic Navigation

Use the `useRouter` hook for programmatic navigation:

```tsx
'use client';

import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const router = useRouter();
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    // Authentication logic here
    
    // Navigate to dashboard on successful login
    router.push('/dashboard');
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit">Login</button>
    </form>
  );
}
```

## Route Groups

Create route groups using parentheses in folder names to organize routes without affecting the URL path:

```
src/
└──app/
    ├── (auth)/
    │   ├── login/
    │   │   └── page.tsx      # /login
    │   └── register/
    │       └── page.tsx      # /register
    └── (dashboard)/
        ├── settings/
        │   └── page.tsx      # /settings
        └── profile/
            └── page.tsx      # /profile
```

## Loading and Error States

Create loading and error UI for routes:

```tsx
// src/app/users/loading.tsx
export default function Loading() {
  return <div>Loading users...</div>;
}
```

```tsx
// src/app/users/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
```

For more information, refer to the [official Next.js documentation](https://nextjs.org/docs/app/building-your-application/routing).
