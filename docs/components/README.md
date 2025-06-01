# Components Overview

This section provides documentation for the various components available in the Next.js Admin template.

## UI Component Library

The admin template uses [shadcn/ui](https://ui.shadcn.com/), which is a collection of reusable, accessible, and customizable UI components built with Radix UI and Tailwind CSS.

shadcn/ui provides the following benefits:

- **Not a Library**: Components are directly added to your project
- **Customizable**: All components are easily customizable
- **Accessible**: Built with accessibility in mind
- **Typed**: Full TypeScript support
- **Styling**: Uses Tailwind CSS for styling

## Available Components

The following shadcn/ui components are already installed in the project:

- Button
- Input
- Label

## Adding Components

For instructions on adding more shadcn/ui components, see [Adding shadcn/ui Components](./adding-shadcn-components.md).

## Custom Components

The admin template includes several custom components built on top of shadcn/ui:

- **Layout Components**:
  - Main layout
  - Sidebar
  - Header

- **Dashboard Components**:
  - Cards
  - Charts
  - Tables

- **Form Components**:
  - Form layouts
  - Form fields
  - Validation components

For more information on custom components, see [Custom Components](./custom-components.md).

## Component Best Practices

When working with components in the admin template:

1. **Reuse Components**: Leverage existing components whenever possible
2. **Keep Components Focused**: Each component should have a single responsibility
3. **Use TypeScript**: Define proper types for component props
4. **Document Components**: Add comments and documentation for complex components
5. **Test Components**: Write tests for critical components

## Component Customization

All components in the admin template can be customized:

- **Styling**: Modify the Tailwind classes
- **Behavior**: Extend functionality with custom hooks
- **Accessibility**: Ensure all components remain accessible

For detailed instructions on customizing specific components, refer to their respective documentation pages.
