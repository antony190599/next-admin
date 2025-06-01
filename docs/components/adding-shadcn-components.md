# Adding shadcn/ui Components

This guide explains how to add more shadcn/ui components to your project.

## Understanding shadcn/ui

[shadcn/ui](https://ui.shadcn.com/) is not a traditional component library that you install as a package. Instead, it provides components that you copy directly into your project. This approach gives you full control over the components and their styling.

## Prerequisites

The project already has the required dependencies for shadcn/ui:

- Tailwind CSS
- clsx and tailwind-merge (for class management)
- Radix UI primitives (for accessible components)

## Adding Components Manually

To add a new shadcn/ui component manually:

### Step 1: Visit the shadcn/ui Website

Go to the [shadcn/ui components page](https://ui.shadcn.com/docs/components) and select the component you want to add.

### Step 2: Copy the Component Code

For each component, shadcn/ui provides the component code and any dependencies. Copy these files to your project.

### Step 3: Install Required Dependencies

Some components require additional Radix UI primitives. Install them using npm:

```bash
npm install @radix-ui/<package-name>
```

For example, to install the Dialog component's dependencies:

```bash
npm install @radix-ui/react-dialog
```

### Step 4: Copy Component Files

Create the component file in your project's components directory (usually under `components/ui/`).

For example, for the Dialog component:

```tsx
// components/ui/dialog.tsx
"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = ({
  className,
  children,
  ...props
}: DialogPrimitive.DialogPortalProps) => (
  <DialogPrimitive.Portal className={cn(className)} {...props}>
    <div className="fixed inset-0 z-50 flex items-start justify-center sm:items-center">
      {children}
    </div>
  </DialogPrimitive.Portal>
)
DialogPortal.displayName = DialogPrimitive.Portal.displayName

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-all duration-100 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:fade-in",
      className
    )}
    {...props}
    ref={ref}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

// ... rest of the component code
```

## Using the Component

Once you've added the component, you can import and use it in your pages:

```tsx
// app/example/page.tsx
"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function DialogExample() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open Dialog</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {/* Dialog content */}
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

## Common shadcn/ui Components

Here are some commonly used shadcn/ui components you might want to add:

### Form Components

- **Form**: For building forms with validation
- **Select**: Dropdown select component
- **Checkbox**: Checkbox input component
- **RadioGroup**: Radio button group
- **Switch**: Toggle switch component
- **Textarea**: Multiline text input

### Layout Components

- **Card**: Card container
- **Sheet**: Slide-out panel
- **Tabs**: Tabbed interface
- **Accordion**: Collapsible content sections

### Feedback Components

- **Alert**: Alert messages
- **Toast**: Notifications
- **Dialog**: Modal dialogs

### Data Display

- **Table**: For displaying tabular data
- **Avatar**: User avatars
- **Badge**: Status indicators

## Customizing Components

shadcn/ui components are designed to be customized. You can modify the component code directly or use the provided className props to apply custom styles.

For example, to customize the Button component's appearance:

```tsx
<Button className="bg-blue-700 hover:bg-blue-800">
  Custom Button
</Button>
```

You can also modify the component's variant definitions in the component file:

```tsx
// components/ui/button.tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "underline-offset-4 hover:underline text-primary",
        // Add your custom variants here
        custom: "bg-blue-700 hover:bg-blue-800 text-white",
      },
      // ... other variants
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
```

## Troubleshooting

If you encounter issues when adding shadcn/ui components:

1. **Missing Dependencies**: Make sure you've installed all required dependencies
2. **TypeScript Errors**: Check that type imports are correct
3. **Styling Issues**: Ensure Tailwind CSS is properly configured
4. **Runtime Errors**: Verify that you're using client components where required

For more information, refer to the [official shadcn/ui documentation](https://ui.shadcn.com/docs).
