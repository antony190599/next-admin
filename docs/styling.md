# Styling Guide

This document explains how styling works in the Next.js Admin template.

## Styling with Tailwind CSS

The Next.js Admin template uses [Tailwind CSS](https://tailwindcss.com/) for styling. Tailwind is a utility-first CSS framework that allows you to build custom designs without leaving your HTML.

### Basic Usage

Apply styles directly in your JSX using utility classes:

```jsx
<div className="p-4 bg-white rounded-lg shadow-md">
  <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
  <p className="mt-2 text-gray-600">Welcome to your admin panel.</p>
</div>
```

### Responsive Design

Use responsive prefixes to apply different styles at different breakpoints:

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* Content */}
</div>
```

Breakpoints in the template:

- `sm`: 640px and above
- `md`: 768px and above
- `lg`: 1024px and above
- `xl`: 1280px and above
- `2xl`: 1536px and above

### Dark Mode

The template supports both light and dark modes. Use the `dark:` prefix to apply styles in dark mode:

```jsx
<div className="bg-white text-black dark:bg-gray-800 dark:text-white">
  Dark mode compatible content
</div>
```

## The `cn` Utility Function

The template includes a `cn` utility function (in `lib/utils.ts`) that combines [clsx](https://github.com/lukeed/clsx) and [tailwind-merge](https://github.com/dcastil/tailwind-merge) for conditional class merging:

```tsx
import { cn } from "@/lib/utils";

function Button({ className, variant, ...props }) {
  return (
    <button 
      className={cn(
        "px-4 py-2 rounded font-medium",
        variant === "primary" && "bg-blue-500 text-white",
        variant === "secondary" && "bg-gray-200 text-gray-800",
        className
      )}
      {...props}
    />
  );
}
```

This allows you to conditionally apply classes and properly merge them without conflicts.

## shadcn/ui Components

The shadcn/ui components in this template are styled using Tailwind CSS. They come with sensible defaults but can be customized:

1. **Via props**: Most components accept a `className` prop for adding custom styles
2. **Via component code**: You can modify the component source directly
3. **Via Tailwind config**: Update theme values in `tailwind.config.js`

Example of customizing a component via props:

```jsx
<Button className="bg-gradient-to-r from-purple-500 to-blue-500">
  Custom Gradient Button
</Button>
```

## Global Styles

Global styles are defined in `app/globals.css`. This file includes:

1. Tailwind CSS directives
2. CSS variables for theming
3. Any custom global styles

Example of global styles:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
 
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.5rem;
  }
 
  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.5% 48%;
  }
}
```

## Custom CSS

For more complex styling needs, you can:

1. **Use @layer directives**: Add custom classes to Tailwind's layers

```css
@layer components {
  .card {
    @apply bg-white rounded-lg shadow-md p-4 dark:bg-gray-800;
  }
}
```

2. **Create CSS modules**: For component-specific styles

```tsx
// styles/Dashboard.module.css
.dashboard {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

// Usage
import styles from './Dashboard.module.css';

function Dashboard() {
  return <div className={styles.dashboard}>...</div>;
}
```

## Theming

The template uses CSS variables for theming, defined in the `:root` and `.dark` selectors in `globals.css`. 

To customize the theme:

1. Modify the CSS variables in `globals.css`
2. Update the theme section in `tailwind.config.js`

Example of updating theme colors:

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        // Add custom colors
        brand: {
          light: '#60a5fa',
          DEFAULT: '#3b82f6',
          dark: '#2563eb',
        },
      },
    },
  },
}
```

## Best Practices

1. **Use utility classes first**: Try to solve styling needs with Tailwind utilities
2. **Extract components**: Create reusable components for repeating UI patterns
3. **Use variants**: Create component variants using the `cva` helper
4. **Be consistent**: Follow the same styling patterns throughout the project
5. **Responsive design**: Always consider how components look on different screen sizes
6. **Accessibility**: Ensure proper contrast ratios and focus states

## Advanced Styling Techniques

### Creating Component Variants with CVA

The template uses [class-variance-authority](https://cva.style/docs) (CVA) to create component variants:

```tsx
import { cva } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 dark:hover:bg-slate-800 dark:hover:text-slate-100 disabled:opacity-50 dark:focus:ring-slate-400 disabled:pointer-events-none dark:focus:ring-offset-slate-900 data-[state=open]:bg-slate-100 dark:data-[state=open]:bg-slate-800',
  {
    variants: {
      variant: {
        default: 'bg-slate-900 text-white hover:bg-slate-700 dark:bg-slate-50 dark:text-slate-900',
        destructive: 'bg-red-500 text-white hover:bg-red-600 dark:hover:bg-red-600',
        outline: 'bg-transparent border border-slate-200 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-100',
      },
      size: {
        default: 'h-10 py-2 px-4',
        sm: 'h-9 px-2 rounded-md',
        lg: 'h-11 px-8 rounded-md',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);
```

### Dynamic Styling with Tailwind JIT

Use dynamic class names with Tailwind JIT (Just-In-Time) compiler:

```jsx
function StatusBadge({ status }) {
  return (
    <span 
      className={`px-2 py-1 rounded text-xs font-medium ${
        status === 'active' ? 'bg-green-100 text-green-800' :
        status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
        'bg-red-100 text-red-800'
      }`}
    >
      {status}
    </span>
  );
}
```

### Animation with Tailwind

The template includes basic animation capabilities via Tailwind:

```jsx
<button className="transition-all duration-300 hover:scale-105">
  Animated Button
</button>
```

For more complex animations, consider using [Framer Motion](https://www.framer.com/motion/).

## Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [class-variance-authority](https://cva.style/docs)
- [clsx Documentation](https://github.com/lukeed/clsx)
- [tailwind-merge Documentation](https://github.com/dcastil/tailwind-merge)
