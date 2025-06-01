# Getting Started with Next.js Admin

This guide will walk you through setting up and running the Next.js Admin template.

## Prerequisites

Before you begin, make sure you have the following installed:

- Node.js 18.x or later
- npm, yarn, or pnpm

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd next-admin
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

## Running the Development Server

Start the development server with:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Project Structure

The project follows a standard Next.js App Router structure:

```
next-admin/
├── src/   
    ├── app/                    # App router pages and layouts
    │   ├── (auth)/             # Authentication routes
    │   │   ├── login/          # Login page
    │   │   └── register/       # Registration page
    │   ├── dashboard/          # Dashboard pages
    │   └── layout.tsx          # Root layout
    ├── components/             # Reusable components
    │   ├── ui/                 # UI components from shadcn/ui
    │   └── ...                 # Custom components
    ├── lib/                    # Utility functions
    ├── public/                 # Static assets
    └── styles/                 # Global styles
```

## Configuration

The project uses several configuration files:

- `next.config.js` - Next.js configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration

## Next Steps

- Set up [authentication](./authentication/README.md)
- Learn about [routing](./routing.md)
- Explore the available [components](./components/README.md)
