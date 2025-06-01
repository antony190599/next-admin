# Deployment

This guide covers how to deploy your Next.js Admin application to various environments.

## Preparing for Deployment

Before deploying your Next.js application, ensure that:

1. Your application builds without errors:
   ```bash
   npm run build
   ```

2. Environment variables are properly configured
3. API endpoints are properly secured
4. All necessary dependencies are installed and listed in `package.json`

## Environment Variables

Next.js supports environment variables through `.env` files:

- `.env.local`: Local environment variables (not committed to Git)
- `.env.development`: Development environment variables
- `.env.production`: Production environment variables
- `.env`: Default environment variables for all environments

Example `.env.production` file:

```
DATABASE_URL=postgres://user:password@host:port/database
AUTH_SECRET=your-secret-key
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

Access environment variables in your code:

```typescript
// Server-side (not exposed to client)
const dbUrl = process.env.DATABASE_URL;

// Client-side (prefixed with NEXT_PUBLIC_)
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
```

## Deployment Options

### Vercel (Recommended)

[Vercel](https://vercel.com/) is the platform built by the creators of Next.js and offers the best deployment experience.

1. **Sign up/Log in** to Vercel
2. **Import** your Git repository
3. **Configure** your project settings
4. **Deploy**

Vercel automatically detects that you're using Next.js and configures the build settings.

#### Environment Variables on Vercel

Add environment variables in the Vercel dashboard:
1. Go to your project
2. Navigate to "Settings" > "Environment Variables"
3. Add key-value pairs

### AWS Amplify

Deploy to AWS Amplify:

1. **Sign up/Log in** to AWS Amplify Console
2. **Connect** your repository
3. **Configure** build settings:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

4. **Add** environment variables
5. **Deploy**

### Netlify

Deploy to Netlify:

1. **Sign up/Log in** to Netlify
2. **Import** your repository
3. **Configure** build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
4. **Add** environment variables
5. **Deploy**

Note: For Netlify, you'll need to use the Next.js Netlify plugin:

```bash
npm install @netlify/plugin-nextjs
```

Create a `netlify.toml` file:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### Docker

Deploy using Docker:

1. **Create** a `Dockerfile`:

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

2. **Create** a `.dockerignore` file:

```
node_modules
.next
.git
```

3. **Update** `next.config.js` for standalone output:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
}

module.exports = nextConfig
```

4. **Build** and **run** the Docker image:

```bash
# Build the image
docker build -t next-admin .

# Run the container
docker run -p 3000:3000 next-admin
```

### Self-hosted (Traditional Server)

Deploy to a traditional server:

1. **Build** your Next.js application:

```bash
npm run build
```

2. **Transfer** the following files to your server:
   - `.next/`
   - `public/`
   - `node_modules/`
   - `package.json`

3. **Install** production dependencies on the server:

```bash
npm ci --production
```

4. **Start** the server:

```bash
npm start
```

Alternatively, use a process manager like PM2:

```bash
npm install -g pm2
pm2 start npm --name "next-admin" -- start
```

## Continuous Integration/Continuous Deployment (CI/CD)

### GitHub Actions

Create a GitHub Actions workflow file at `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        env:
          # Add your environment variables here
          NEXT_PUBLIC_API_URL: ${{ secrets.NEXT_PUBLIC_API_URL }}
          
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

## Performance Optimization

### Static Site Generation (SSG)

For pages that don't require real-time data, use Static Site Generation:

```typescript
// app/blog/[slug]/page.tsx
export async function generateStaticParams() {
  const posts = await getPosts();
  
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  
  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}
```

### Image Optimization

Next.js provides automatic image optimization:

```jsx
import Image from 'next/image';

export default function ProfilePage() {
  return (
    <div>
      <Image
        src="/profile.jpg"
        alt="Profile Picture"
        width={500}
        height={500}
        priority
      />
    </div>
  );
}
```

Configure image domains in `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.example.com'],
  },
}

module.exports = nextConfig
```

### Code Splitting

Next.js automatically code-splits your application. To further optimize, use dynamic imports:

```typescript
import dynamic from 'next/dynamic';

// Import the component only when needed
const DashboardChart = dynamic(() => import('@/components/dashboard/chart'), {
  loading: () => <p>Loading chart...</p>,
});

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <DashboardChart />
    </div>
  );
}
```

## Monitoring and Analytics

### Error Monitoring

Implement error monitoring with services like [Sentry](https://sentry.io/):

```bash
npm install @sentry/nextjs
```

Initialize Sentry in `next.config.js`:

```javascript
const { withSentryConfig } = require('@sentry/nextjs');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your Next.js config
};

module.exports = withSentryConfig(
  nextConfig,
  {
    // Sentry options
    silent: true,
  }
);
```

### Web Analytics

Add web analytics with services like [Vercel Analytics](https://vercel.com/analytics) or Google Analytics:

```tsx
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

## Security Considerations

### Content Security Policy (CSP)

Implement a Content Security Policy:

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Add CSP header
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:;"
  );
  
  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

### HTTP Headers

Add security headers with a custom middleware:

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Add security headers
  const headers = response.headers;
  
  headers.set('X-DNS-Prefetch-Control', 'on');
  headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  headers.set('X-XSS-Protection', '1; mode=block');
  headers.set('X-Frame-Options', 'SAMEORIGIN');
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('Referrer-Policy', 'origin-when-cross-origin');
  
  return response;
}
```

### Environment-specific Configuration

Create environment-specific configurations:

```typescript
// config/index.ts
const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  // Other configuration values
};

export default config;
```

## Troubleshooting Deployment Issues

### 404 Errors for Dynamic Routes

If you're experiencing 404 errors for dynamic routes:

1. Check that you've properly configured dynamic routes
2. Ensure you've generated the correct paths if using static generation
3. Verify your hosting provider's routing configuration

### Environment Variable Issues

If environment variables aren't working:

1. Check that client-side variables start with `NEXT_PUBLIC_`
2. Verify that environment variables are properly set in your hosting platform
3. Check for typos in variable names

### Build Failures

Common build failures and solutions:

1. **Module not found errors**:
   - Ensure all dependencies are installed
   - Check import paths for typos

2. **TypeScript errors**:
   - Fix type errors in your code
   - Add proper type definitions

3. **Memory issues during build**:
   - Increase memory limit: `NODE_OPTIONS="--max-old-space-size=4096" npm run build`

## Conclusion

Deploying a Next.js Admin application requires careful planning and consideration of various factors including environment configuration, performance optimization, and security. 

By following the best practices outlined in this guide, you can ensure a smooth deployment process and a high-performing application.

For more information, refer to the [Next.js Deployment Documentation](https://nextjs.org/docs/app/building-your-application/deploying).
