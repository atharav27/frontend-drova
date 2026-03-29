'use client';

import React from 'react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Control, FieldValues, Path } from 'react-hook-form';
import { cn } from '@repo/ui/lib/utils';

type TextareaFieldVariant = 'default' | 'styled';

type TextareaFieldProps<T extends FieldValues> = {
  label: string;
  name: Path<T>;
  placeholder?: string;
  control: Control<T>;
  disabled?: boolean;
  className?: string;
  variant?: TextareaFieldVariant;
  autoGrow?: boolean; // auto expand height and hide scrollbar
};

export const TextareaField = React.forwardRef<
  HTMLTextAreaElement,
  TextareaFieldProps<any>
>(({
  label,
  name,
  placeholder,
  control,
  disabled = false,
  className = '',
  variant = 'default',
  autoGrow = false,
}, ref) => {
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

  const textareaClasses = cn(
    'w-full rounded-lg',
    autoGrow ? 'resize-none overflow-hidden' : 'resize-vertical',
    isStyled
      ? [
          'h-11 px-4 py-3 text-base',
          'border border-gray-200 bg-gray-50',
          'placeholder:text-[#303852]/70',
          '!outline-none !ring-0 !shadow-none focus:!outline-none focus:!ring-0 focus:!shadow-none focus:border-primary',
          'focus-visible:!outline-none focus-visible:!ring-0 focus-visible:!ring-offset-0 focus-visible:!shadow-none',
          'transition-colors duration-200',
          disabled && 'bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200'
        ]
      : [
          'px-3 sm:px-4 py-2 sm:py-3',
          'border border-primary/30 bg-white',
          'text-textdark/70 text-sm sm:text-base',
          '!outline-none !ring-0 !shadow-none focus:!outline-none focus:!ring-0 focus:!shadow-none focus:border-primary',
          'focus-visible:!outline-none focus-visible:!ring-0 focus-visible:!ring-offset-0 focus-visible:!shadow-none',
          'transition-colors duration-200',
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
          <FormItem className="space-y-2">
            <FormLabel className={labelClasses}>{label}</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                ref={ref}
                placeholder={placeholder}
                disabled={disabled}
                className={textareaClasses}
                style={{
                  outline: 'none',
                  boxShadow: 'none',
                  border: '1px solid #e5e7eb',
                  overflow: autoGrow ? 'hidden' : undefined,
                }}
                onFocus={(e) => {
                  e.target.style.outline = 'none';
                  e.target.style.boxShadow = 'none';
                  e.target.style.border = '1px solid hsl(var(--primary))';
                }}
                onBlur={(e) => {
                  e.target.style.border = '1px solid #e5e7eb';
                }}
                onInput={(e) => {
                  if (autoGrow) {
                    const el = e.currentTarget;
                    el.style.height = 'auto';
                    el.style.height = `${el.scrollHeight}px`;
                  }
                }}
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
              <Textarea
                {...field}
                ref={ref}
                placeholder={placeholder}
                disabled={disabled}
                className={textareaClasses}
                style={{
                  outline: 'none',
                  boxShadow: 'none',
                  border: '1px solid hsl(var(--primary) / 0.3)',
                  overflow: autoGrow ? 'hidden' : undefined,
                }}
                onFocus={(e) => {
                  e.target.style.outline = 'none';
                  e.target.style.boxShadow = 'none';
                  e.target.style.border = '1px solid hsl(var(--primary))';
                }}
                onBlur={(e) => {
                  e.target.style.border = '1px solid hsl(var(--primary) / 0.3)';
                }}
                onInput={(e) => {
                  if (autoGrow) {
                    const el = e.currentTarget;
                    el.style.height = 'auto';
                    el.style.height = `${el.scrollHeight}px`;
                  }
                }}
              />
            </FormControl>
            <FormMessage className={messageClasses} />
          </FormItem>
        )}
      />
    </div>
  );
});

TextareaField.displayName = 'TextareaField';
