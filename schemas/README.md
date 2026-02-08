# Validation Schemas

This directory contains all Zod validation schemas for the application, organized semantically by domain context.

## Architecture

All schemas are designed to:

- **Respect Prisma model types**: Field types and constraints match the database schema
- **Provide comprehensive validation**: Including regex patterns, length constraints, and custom validations
- **Export TypeScript types**: Using `z.infer<typeof schema>` for type safety
- **Enable React Hook Form integration**: Via `@hookform/resolvers/zod`

## Schema Files

### `auth.schema.ts`

Authentication and authorization related schemas:

- **`loginSchema`**: Email and password validation for sign-in
- **`signupSchema`**: User registration with password confirmation and strength requirements
- **`forgotPasswordSchema`**: Email validation for password reset requests
- **`resetPasswordSchema`**: New password validation with confirmation

### `organization.schema.ts`

Organization management schemas:

- **`organizationSchema`**: Organization creation with name and slug validation
  - Slug must be URL-safe (lowercase, alphanumeric, hyphens only)
  - Auto-validation for start/end characters

### `onboarding.schema.ts`

User onboarding flow schemas:

- **`languageSchema`**: Preferred language selection from supported languages
  - Validates against SUPPORTED_LANGUAGES enum
  - Ensures only valid language codes are accepted

## Usage Example

### Basic Form with Zod Schema

```tsx
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "@/schemas";

export function LoginForm() {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    // Data is fully typed and validated
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="email"
        control={control}
        render={({ field, fieldState }) => (
          <div>
            <Input {...field} />
            {fieldState.error && <p>{fieldState.error.message}</p>}
          </div>
        )}
      />
      {/* More fields... */}
    </form>
  );
}
```

## Key Features

### 1. Password Strength Validation

All password fields require:

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

### 2. Email Normalization

Email fields automatically:

- Convert to lowercase
- Trim whitespace
- Validate email format

### 3. Slug Generation Support

Organization slugs:

- Must be URL-safe
- Auto-lowercase transformation
- Validated regex pattern: `/^[a-z0-9-]+$/`
- Must start and end with alphanumeric characters

### 4. Type Safety

All schemas export corresponding TypeScript types:

```tsx
type LoginFormData = z.infer<typeof loginSchema>;
```

## Adding New Schemas

When creating new validation schemas:

1. **Create a new file** in this directory following the naming pattern: `[domain].schema.ts`
2. **Import Zod**: `import { z } from "zod";`
3. **Reference Prisma models**: Check `/prisma/models/` for field types
4. **Export schema and type**:
   ```tsx
   export const mySchema = z.object({ ... });
   export type MyFormData = z.infer<typeof mySchema>;
   ```
5. **Add to index.ts**: Export from the central index file
6. **Document in this README**: Add your schema to the list above

## Related Files

- **Prisma Models**: `/prisma/models/` - Database schema definitions
- **Forms**: `/components/pages/auth/` - Form components using these schemas
- **Actions**: `/actions/` - Server actions that process validated data

## Best Practices

1. **Always use zodResolver**: Never use manual validation rules in forms
2. **Keep schemas DRY**: Reuse common validation patterns
3. **Match Prisma types**: Ensure schema types match database constraints
4. **Provide clear error messages**: User-friendly validation feedback
5. **Test edge cases**: Consider empty strings, special characters, etc.
