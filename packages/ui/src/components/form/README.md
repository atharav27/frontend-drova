# Form Components

This directory contains reusable form components that can be used across all apps in the monorepo.

## Components

### DatePickerField
A smart date picker field component with built-in logic for different field types.

**Features:**
- Smart defaults based on field name (yearOfManufacture, insuranceExpiry, etc.)
- Configurable date ranges and restrictions
- Integration with React Hook Form
- TypeScript generic support
- Variant support (default/styled)

**Usage:**
```tsx
import { DatePickerField } from '@repo/ui/components/form/DatePickerField';

<DatePickerField
  control={control}
  name="yearOfManufacture"
  label="Year of Manufacture"
  placeholder="Select year"
  variant="default" // or "styled"
/>
```

### FormInputField
A styled input field component with consistent design across apps.

**Features:**
- Various input types support
- Disabled state styling
- Custom className support
- React Hook Form integration
- Variant support (default/styled)

**Usage:**
```tsx
import { FormInputField } from '@repo/ui/components/form/FormInputField';

<FormInputField
  control={control}
  name="vehicleName"
  label="Vehicle Name"
  placeholder="Enter vehicle name"
  type="text"
  variant="default" // or "styled"
/>
```

### FormSelectController
A styled select dropdown component with consistent design.

**Features:**
- Dynamic options support
- Disabled state
- Custom placeholder
- React Hook Form integration
- Variant support (default/styled)

**Usage:**
```tsx
import { FormSelectController } from '@repo/ui/components/form/FormSelectController';

<FormSelectController
  control={control}
  name="category"
  label="Category"
  options={[
    { label: "Option 1", value: "option1" },
    { label: "Option 2", value: "option2" }
  ]}
  variant="default" // or "styled"
/>
```

### TextareaField
A reusable textarea field component with consistent styling and behavior.

**Features:**
- Multi-line text input support
- Resizable textarea
- Disabled state styling
- Custom className support
- React Hook Form integration
- Variant support (default/styled)

**Usage:**
```tsx
import { TextareaField } from '@repo/ui/components/form/TextareaField';

<TextareaField
  control={control}
  name="description"
  label="Description"
  placeholder="Enter description..."
  className="min-h-[120px]"
  variant="default" // or "styled"
/>
```

## Importing

All form components can be imported directly from their individual files:

```tsx
import { DatePickerField } from '@repo/ui/components/form/DatePickerField';
import { FormInputField } from '@repo/ui/components/form/FormInputField';
import { FormSelectController } from '@repo/ui/components/form/FormSelectController';
import { TextareaField } from '@repo/ui/components/form/TextareaField';
```

## Variants

All form components support two variants:

- **default**: Standard styling with responsive design
- **styled**: Alternative styling with gray theme and specific layout

```tsx
// Default variant (responsive, primary theme)
<FormInputField variant="default" ... />

// Styled variant (gray theme, consistent sizing)
<FormInputField variant="styled" ... />
```

## TypeScript Support

All components are fully typed and support TypeScript generics for type-safe form handling:

```tsx
interface MyFormData {
  name: string;
  description: string;
  date: string;
  category: string;
}

// Components will be type-checked against MyFormData
<FormInputField<MyFormData>
  control={control}
  name="name" // TypeScript will ensure this exists in MyFormData
  label="Name"
/>

<TextareaField<MyFormData>
  control={control}
  name="description" // TypeScript will ensure this exists in MyFormData
  label="Description"
/>
```
