# Custom Components

This guide covers the custom components in the Next.js Admin template and how to create your own components.

## Existing Custom Components

The admin template includes several custom components built on top of shadcn/ui components:

### Layout Components

- **PageHeader**: Standard header for pages with title and actions
- **DashboardShell**: Container component for dashboard pages
- **Sidebar**: Navigation sidebar with collapsible sections
- **MainNav**: Main navigation component
- **UserNav**: User dropdown menu component

### Data Display Components

- **DataTable**: Enhanced table component with sorting, filtering, and pagination
- **StatsCard**: Card displaying key metrics with optional icons and trends
- **RecentActivityList**: List component for displaying activity logs

### Form Components

- **FormField**: Wrapper component for form inputs with labels and error messages
- **SearchInput**: Search input with clear button and keyboard shortcuts
- **FilterDropdown**: Dropdown component for applying filters

## Creating Your Own Components

Follow these steps to create custom components for your admin interface:

### Step 1: Plan Your Component

1. Define the purpose and functionality of the component
2. Identify the props the component will accept
3. Determine if the component needs state or should be stateless
4. Decide if it should be a client or server component

### Step 2: Create the Component File

Create a new file in the appropriate directory:

- `/src/components/ui/` for UI components
- `/src/components/common/` for shared components
- `/src/components/forms/` for form components
- `/src/components/dashboard/` for dashboard-specific components

### Step 3: Write the Component Code

Example of a custom stats card component:

```tsx
// components/dashboard/stats-card.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: number;
  className?: string;
}

export function StatsCard({
  title,
  value,
  description,
  icon,
  trend,
  className,
}: StatsCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="h-4 w-4 text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {(description || trend !== undefined) && (
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            {trend !== undefined && (
              <span
                className={cn(
                  "mr-1 flex items-center",
                  trend > 0 ? "text-green-600" : "text-red-600"
                )}
              >
                {trend > 0 ? (
                  <ArrowUpIcon className="h-3 w-3 mr-0.5" />
                ) : (
                  <ArrowDownIcon className="h-3 w-3 mr-0.5" />
                )}
                {Math.abs(trend)}%
              </span>
            )}
            {description}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
```

### Step 4: Use the Component

Use your custom component in a page or another component:

```tsx
// src/app/dashboard/page.tsx
import { StatsCard } from "@/components/dashboard/stats-card";
import { Users, DollarSign, ShoppingCart, Activity } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Revenue"
        value="$45,231.89"
        description="vs previous month"
        trend={20.1}
        icon={<DollarSign className="h-4 w-4" />}
      />
      
      <StatsCard
        title="New Users"
        value="2,350"
        description="+180 this week"
        trend={5.4}
        icon={<Users className="h-4 w-4" />}
      />
      
      <StatsCard
        title="Orders"
        value="1,274"
        description="10 pending"
        trend={-3.2}
        icon={<ShoppingCart className="h-4 w-4" />}
      />
      
      <StatsCard
        title="Active Sessions"
        value="573"
        description="Right now"
        icon={<Activity className="h-4 w-4" />}
      />
    </div>
  );
}
```

## Best Practices for Custom Components

Follow these practices when creating custom components:

### 1. Component Organization

- Group related components together
- Use subdirectories to organize by feature or type
- Create an index file to export components from each directory

### 2. Naming Conventions

- Use PascalCase for component names
- Name files after the component they contain
- Use descriptive names that indicate the component's purpose

### 3. Props Design

- Define prop types with TypeScript interfaces
- Provide default values for optional props
- Use sensible prop names that are easy to understand
- Include a `className` prop for style customization

### 4. Composition

- Prefer composition over complex conditional rendering
- Break large components into smaller, focused components
- Use the children prop to make components more flexible

Example of component composition:

```tsx
// Composable card component
export function DashboardCard({
  header,
  children,
  footer,
  className,
}: {
  header?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      {header && <CardHeader>{header}</CardHeader>}
      <CardContent>{children}</CardContent>
      {footer && (
        <CardFooter className="border-t bg-muted/50">{footer}</CardFooter>
      )}
    </Card>
  );
}
```

### 5. Accessibility

- Use semantic HTML elements
- Add proper ARIA attributes
- Ensure keyboard navigation works
- Test with screen readers

### 6. Responsive Design

- Use Tailwind's responsive prefixes for adaptive layouts
- Test components at different screen sizes
- Consider mobile-first design

### 7. Performance

- Memoize components that re-render frequently
- Use appropriate React hooks for performance optimization
- Avoid unnecessary re-renders

## Advanced Component Patterns

Consider these patterns for more complex components:

### Compound Components

Split complex components into smaller, related components:

```tsx
// Example of compound component pattern
export function Tabs({ children, defaultValue, ...props }) {
  const [value, setValue] = useState(defaultValue);
  
  return (
    <TabsContext.Provider value={{ value, setValue }}>
      <div {...props}>{children}</div>
    </TabsContext.Provider>
  );
}

Tabs.List = function TabsList({ children }) {
  return <div role="tablist">{children}</div>;
};

Tabs.Trigger = function TabsTrigger({ value, children }) {
  const { value: selectedValue, setValue } = useTabsContext();
  
  return (
    <button
      role="tab"
      aria-selected={value === selectedValue}
      onClick={() => setValue(value)}
    >
      {children}
    </button>
  );
};

Tabs.Content = function TabsContent({ value, children }) {
  const { value: selectedValue } = useTabsContext();
  
  return value === selectedValue ? <div>{children}</div> : null;
};
```

### Controlled vs. Uncontrolled Components

Provide both controlled and uncontrolled options for form components:

```tsx
// Example of a component that can be controlled or uncontrolled
interface SearchProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
}

export function Search({ value, defaultValue, onChange }: SearchProps) {
  // Use useState for uncontrolled mode, or use the passed value for controlled mode
  const [internalValue, setInternalValue] = useState(defaultValue || "");
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) {
      setInternalValue(e.target.value);
    }
    onChange?.(e.target.value);
  };
  
  return <input value={currentValue} onChange={handleChange} />;
}
```

For more complex components and advanced patterns, refer to the [React Component Design Patterns](https://reactpatterns.com/).
