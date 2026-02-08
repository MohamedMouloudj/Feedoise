# Copilot Instructions

## Project Overview

This is a multilingual feedback and light ticketing platform built with Next.js 16, Prisma v7, Supabase, Resend and Lingo.dev for translation.

## Core Features

- **Multilingual feedback**: Users submit in any language, owners read in their preferred language (Lingo.dev SDK)
- **Priority weighting**: Weighted scoring (priority_weight x 10 + comment_count x 2 + days_since_created) for thread ranking
- **Light ticketing**: Status tracking (New → Under Review → Planned → Completed → Won't Fix), assignment, labels
- **Project discovery**: Public (discoverable) or invite-only projects
- **Follow & notifications**: In-app notifications for replies, status changes, priority updates
- **Comment threads**: Discussion on feedback items
- **Translated UI**: Static content via Lingo.dev Compiler

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: Supabase (PostgreSQL) + Prisma v7 ORM
- **Resend**: Notification
- **Translation**: Lingo.dev Compiler (static UI) + Lingo.dev SDK (dynamic content)
- **Styling**: Tailwind CSS + shadcn/ui (Lyra style)
- **Forms**: React Hook Form with Controller wrapper
- **Auth**: BetterAuth

## Architecture Patterns

### Rendering Strategy

- **Prioritize Server Components**: Default to Server Components for all pages and layouts
- **Client Components only when needed**: Interactive UI (forms, dropdowns, modals, notifications)
- Mark client components with `"use client"` directive at the top
- Keep client components small and focused

### SOLID Principles

- **Single Responsibility**: Each component/function does one thing
- **Open/Closed**: Extend behavior through composition, not modification
- **Liskov Substitution**: Components should be replaceable with their subtypes
- **Interface Segregation**: Keep interfaces/props minimal and focused
- **Dependency Inversion**: Depend on abstractions (types/interfaces), not concrete implementations

### File Organization

```
app/
  (auth)/           # Auth routes (login, signup with github oauth)
  (dashboard)/      # Protected routes
    projects/
    threads/
    notifications/
  api/              # API routes
components/
  ui/               # shadcn base components (DO NOT MODIFY)
  forms/            # Form components using Controller
  layout/           # Layout components (nav, sidebar)
  features/         # Feature-specific composed components
lib/
  utils.ts          # Utility functions
  db.ts             # Prisma client
  lingo.ts          # Lingo.dev SDK helpers
prisma/
  schema/           # Prisma schema files (split by domain)
    user.prisma
    organization.prisma
    project.prisma
    thread.prisma
```

## Styling Rules

### CSS & Theming

- **All styles in `app/globals.css`**: NO inline styles, NO separate CSS modules
- **Use shadcn CSS variables**: `bg-background`, `text-foreground`, `border-border`, etc.
- **Tailwind utility classes**: Use Tailwind for all styling
- **Dark mode support**: Use `dark:` prefix for dark mode variants
- **Responsive**: Mobile-first, use `sm:`, `md:`, `lg:` breakpoints

### Component Library

**Base components (use directly or compose):**

- Forms: `input`, `textarea`, `checkbox`, `radio-group`, `select`, `combobox`, `switch`, `toggle`, `calendar`
- Layout: `card`, `sheet`, `dialog`, `popover`, `hover-card`, `tabs`, `separator`, `resizable`, `pagination`
- Feedback: `AppButton`, `badge`, `alert-dialog`, `sonner` (toast), `skeleton`, `tooltip`
- Form helpers: `label`, `input-group`
- Magic UI: `@magicui/flickering-grid`, `@magicui/globe`

**Component composition pattern:**

```tsx
// Good: Compose from base components
export function ThreadCard({ thread }: { thread: Thread }) {
  return (
    <Card>
      <CardHeader>
        <Badge variant={statusToBadgeVariant(thread.status)}>
          {thread.status}
        </Badge>
      </CardHeader>
      <CardContent>{thread.title}</CardContent>
    </Card>
  );
}

// Bad: Creating custom styled divs
export function ThreadCard({ thread }: { thread: Thread }) {
  return <div className="rounded-lg border bg-card p-4">{/* ... */}</div>;
}
```

## Database Schema

### Prisma Configuration

- **Schema location**: `/prisma/schema/` (multiple `.prisma` files)
- **Always check schema before writing queries**: Scan `/prisma` directory first
- **Use Prisma Client**: Import from `@/lib/db`, never query directly
- **Type safety**: Use Prisma generated types for all database operations

### Key Models

- `User`: Users with preferred language
- `Organization`: Companies/teams that own projects
- `OrganizationMember`: User roles within organizations (owner/admin/member)
- `Project`: Feedback projects (public/private)
- `ProjectMember`: Project-specific roles (maintainer/contributor)
- `Thread`: Feedback items with status, priority, assignment
- `Comment`: Discussions on threads
- `Label`: Tags for organization
- `Notification`: In-app notifications

## Form Handling

### React Hook Form Pattern

**Always use Controller wrapper for form inputs:**

```tsx
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";

export function MyForm() {
  const { control, handleSubmit } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="title"
        control={control}
        rules={{ required: "Title is required" }}
        render={({ field, fieldState }) => (
          <div>
            <Input {...field} />
            {fieldState.error && <span>{fieldState.error.message}</span>}
          </div>
        )}
      />
    </form>
  );
}
```

## Translation Integration

### Static UI (Lingo.dev Compiler)

- Handles automatic translation of JSX text at build time
- NO manual `t()` functions needed
- Write plain English strings: `<h1>Welcome</h1>`
- Compiler transforms at build time

### Dynamic Content (Lingo.dev SDK)

- Use for user-generated content (threads, comments)
- Import from `@/lib/lingo`
- Pattern:

```tsx
import { localizeObject } from "@/lib/lingo";

const translated = await localizeObject(
  { title: thread.title, content: thread.content },
  thread.originalLanguage,
  userPreferredLanguage,
);
```

## Best Practices

### Server Actions

- Prefer Server Actions over API routes for mutations
- Place in separate `<name>.action.ts` files under `actions` folder
- Use `"use server"` directive
- Return typed responses with error handling

### Data Fetching

- Server Components: Direct Prisma queries through Service classes
- Client Components: Use Server Actions or API routes
- Cache appropriately with Next.js caching strategies

### Error Handling

- Server-side: Return `{ success: false, error: string }`
- Refer to this doc "https://www.prisma.io/docs/orm/reference/error-reference#prisma-client-query-engine" for handling specific Prisma errors
- Client-side: Display error in UI, don't just console.log
- Use Sonner toast for user feedback

### Type Safety

- Always import Prisma types: `import { Thread, Project } from "@/lib/generated/prisma/client"`
- Use `Prisma.ThreadInclude` for relations
- No `any` types unless absolutely necessary

## Constraints

- **NO modifications to `/components/ui/*`**: These are shadcn base components
- **NO separate CSS files**: Everything in `globals.css`
- **NO client components by default**: Only when interactivity required
- **NO direct database queries**: Always use Prisma client from `@/lib/db` inside `/services`, using static methods, and use them in Server Components or Server Actions
- **NO hardcoded strings in multiple places**: Extract to constants if reused

## Code Generation Guidelines

When generating code:

1. Check `/prisma` schema first to understand data model
2. Determine if Server or Client Component is needed
3. Use shadcn components from the installed list
4. Follow Controller pattern for forms
5. Include proper TypeScript types
6. Add error handling with Sonner toasts
7. Use CSS variables for theming
8. Keep components small and focused (SOLID)

## Common Patterns

### Page Structure

```tsx
// app/(dashboard)/projects/page.tsx
import { db } from "@/lib/db";
import { ProjectCard } from "@/components/features/project-card";

export default async function ProjectsPage() {
  const projects = await db.project.findMany({
    where: { isPublic: true },
    include: { organization: true },
  });

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Discover Projects</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
```

### Client Interaction

```tsx
"use client";

import { useForm, Controller } from "react-hook-form";
import { AppButton } from "@/components/AppButton";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function CreateThreadForm({ projectId }: { projectId: string }) {
  const { control, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {
    try {
      const result = await createThread(projectId, data);
      if (result.success) {
        toast.success("Thread created!");
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Controller
        name="title"
        control={control}
        rules={{ required: true }}
        render={({ field }) => <Input {...field} placeholder="Title" />}
      />
      <AppButton type="submit">Submit Feedback</AppButton>
    </form>
  );
}
```

When in doubt, prioritize simplicity, type safety, and server-side rendering.
