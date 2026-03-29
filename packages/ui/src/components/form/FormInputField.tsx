'use client';

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Label } from '../ui/label';
import { Control, FieldValues, Path } from 'react-hook-form';
import { cn } from '@repo/ui/lib/utils';

type FormInputFieldVariant = 'default' | 'styled';

type FormInputFieldProps<T extends FieldValues> = {
  label: string;
  name: Path<T>;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  control: Control<T>;
  disabled?: boolean;
  className?: string;
  variant?: FormInputFieldVariant;
  description?: string;
};

export function FormInputField<T extends FieldValues>({
  label,
  name,
  type = 'text',
  placeholder,
  control,
  disabled = false,
  className = '',
  variant = 'default',
  description,
}: FormInputFieldProps<T>) {
  const isStyled = variant === 'styled';

  // Conditional styles based on variant
  const containerClasses = cn(
    isStyled ? '' : 'space-y-2'
  );

  const labelClasses = cn(
    isStyled
      ? 'font-medium mb-1 text-textdark'
      : 'text-textdark text-base sm:text-lg font-medium'
  );

  const inputClasses = cn(
    'w-full px-3 rounded-lg focus:outline-none',
    // Base input styles
    isStyled
      ? [
          'h-11 px-4 text-base',
          'border border-gray-200 bg-gray-50',
          'placeholder:text-[#303852]/70',
          'focus:border-primary focus-visible:ring-0 focus-visible:ring-offset-0',
          'transition-colors duration-200',
          disabled && 'bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200'
        ]
      : [
          'h-10 sm:h-12 sm:px-4',
          'border border-primary/30 bg-white',
          'text-textdark/70 text-sm sm:text-base',
          disabled && 'bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200'
        ],
    className
  );

  const messageClasses = cn(
    isStyled ? 'text-sm text-red-600' : ''
  );

  if (isStyled) {
    return (
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormLabel className={labelClasses}>{label}</FormLabel>
            <FormControl>
              <input
                {...field}
                type={type}
                placeholder={placeholder}
                disabled={disabled}
                className={inputClasses}
              />
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage className={messageClasses} />
          </FormItem>
        )}
      />
    );
  }

  return (
    <div className={containerClasses}>
      <Label className={labelClasses}>{label}</Label>
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <input
                {...field}
                type={type}
                placeholder={placeholder}
                disabled={disabled}
                className={inputClasses}
              />
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage className={messageClasses} />
          </FormItem>
        )}
      />
    </div>
  );
}
