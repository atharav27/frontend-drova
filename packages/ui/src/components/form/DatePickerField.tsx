'use client';
import { DatePicker } from './DatePicker';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "../ui/form";
import { Label } from '../ui/label';
import { Control, Path, FieldValues } from "react-hook-form";
import { cn } from '@repo/ui/lib/utils';

type DatePickerFieldVariant = 'default' | 'styled';

interface DatePickerFieldProps<T extends FieldValues = FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  disableFuture?: boolean;
  disablePast?: boolean;
  fromYear?: number;
  toYear?: number;
  variant?: DatePickerFieldVariant;
}

export function DatePickerField<T extends FieldValues = FieldValues>({
  control,
  name,
  label,
  placeholder,
  disableFuture = false,
  disablePast = false,
  fromYear,
  toYear,
  variant = 'default'
}: DatePickerFieldProps<T>) {
  const isStyled = variant === 'styled';

  // Smart defaults based on field name (only for default variant)
  const getSmartDefaults = () => {
    if (isStyled) {
      // For styled variant, use provided values or StyledDatePickerField defaults
      return {
        disableFuture,
        disablePast,
        fromYear: fromYear || 1950,
        toYear: toYear || new Date().getFullYear() - 18,
        placeholder: placeholder || "dd/mm/yy"
      };
    }

    const fieldName = String(name);

    if (fieldName === "yearOfManufacture" || fieldName === "yearOfRegistration") {
      return {
        disableFuture: true,
        fromYear: fromYear || 1980,
        toYear: toYear || new Date().getFullYear(),
        placeholder: placeholder || "Select date"
      };
    }

    if (fieldName === "insuranceExpiry") {
      return {
        disablePast: true,
        fromYear: fromYear || new Date().getFullYear(),
        toYear: toYear || new Date().getFullYear() + 10,
        placeholder: placeholder || "Select expiry date"
      };
    }

    return {
      disableFuture,
      disablePast,
      fromYear: fromYear || 1980,
      toYear: toYear || new Date().getFullYear() + 10,
      placeholder: placeholder || "Select date"
    };
  };

  const smartDefaults = getSmartDefaults();

  // Conditional styles based on variant
  const containerClasses = cn(
    isStyled ? '' : 'space-y-2'
  );

  const labelClasses = cn(
    isStyled
      ? 'font-medium mb-1 text-textdark'
      : 'text-textdark text-base sm:text-lg font-medium'
  );

  const datePickerClasses = cn(
    isStyled
      ? 'flex items-center w-full h-11 rounded-lg border border-gray-200 bg-gray-50 px-4 text-base placeholder:text-[#303852]/70 focus:border-primary focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors duration-200 hover:bg-[#FBFBFB]'
      : 'w-full h-10 sm:h-12 text-sm sm:text-base'
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
              <DatePicker
                value={field.value}
                onChange={field.onChange}
                placeholder={smartDefaults.placeholder}
                fromYear={smartDefaults.fromYear}
                toYear={smartDefaults.toYear}
                disableFuture={smartDefaults.disableFuture}
                disablePast={smartDefaults.disablePast}
                className={datePickerClasses}
              />
            </FormControl>
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
              <DatePicker
                value={field.value ? new Date(field.value) : undefined}
                onChange={(date) => field.onChange(date ? date.toISOString().split('T')[0] : '')}
                placeholder={smartDefaults.placeholder}
                disableFuture={smartDefaults.disableFuture}
                disablePast={smartDefaults.disablePast}
                fromYear={smartDefaults.fromYear}
                toYear={smartDefaults.toYear}
                className={datePickerClasses}
              />
            </FormControl>
            <FormMessage className={messageClasses} />
          </FormItem>
        )}
      />
    </div>
  );
}
