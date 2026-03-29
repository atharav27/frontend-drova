"use client";

import { Controller, Control, FieldValues, Path } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Label } from '../ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import { cn } from '@repo/ui/lib/utils';

interface Option {
  label: string;
  value: string;
}

type FormSelectControllerVariant = 'default' | 'styled';

interface FormSelectControllerProps<
  TFieldValues extends FieldValues = FieldValues
> {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  label: string;
  placeholder?: string;
  options: Option[];
  disabled?: boolean;
  className?: string;
  variant?: FormSelectControllerVariant;
}

export function FormSelectController<
  TFieldValues extends FieldValues = FieldValues
>({
  name,
  control,
  label,
  placeholder,
  options,
  disabled = false,
  className = '',
  variant = 'default',
}: FormSelectControllerProps<TFieldValues>) {
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

  const triggerClasses = cn(
    'w-full rounded-lg focus:outline-none',
    isStyled
      ? [
          'flex items-center h-11 border border-gray-200 bg-gray-50 px-4',
          'text-base placeholder:text-[#303852]/70',
          'focus:border-primary focus-visible:ring-0 focus-visible:ring-offset-0',
          'transition-colors duration-200 text-sm py-5'
        ]
      : [
          'text-textdark/70 text-sm sm:text-base border-primary/30 bg-white',
          'py-5 sm:py-6'
        ],
    className
  );

  const selectItemClasses = cn(
    isStyled ? 'text-textdark hover:text-textdark/90' : ''
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
          <FormItem className="space-y-2">
            <FormLabel className={labelClasses}>{label}</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={disabled}>
              <FormControl>
                <SelectTrigger className={triggerClasses}>
                  <SelectValue placeholder={placeholder || `Select ${label.toLowerCase()}`} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value} className={selectItemClasses}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage className={messageClasses} />
          </FormItem>
        )}
      />
    );
  }

  return (
    <div className={containerClasses}>
      <Label className={labelClasses}>{label}</Label>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <FormItem>
            <FormControl>
              <Select
                value={field.value as string | undefined}
                onValueChange={field.onChange}
                disabled={disabled}
              >
                <SelectTrigger
                  aria-invalid={!!error}
                  className={triggerClasses}
                >
                  <SelectValue placeholder={placeholder || `Select ${label.toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent className="text-textdark/90">
                  {options.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value} className={selectItemClasses}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage className={messageClasses} />
          </FormItem>
        )}
      />
    </div>
  );
}

export default FormSelectController;
