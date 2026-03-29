'use client';

import { useRef } from 'react';
import { Label } from '@repo/ui/components/ui/label';
import { cn } from '@repo/ui/lib/utils';

interface FileUploadFieldProps {
  label: string;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  accept?: string;
  multiple?: boolean;
  onFileSelect?: (files: FileList | null) => void;
  maxSizeMB?: number;
  allowedTypes?: string[];
}

export function FileUploadField({
  label,
  className,
  onClick,
  disabled = false,
  accept = "image/*",
  multiple = false,
  onFileSelect,
  maxSizeMB = 5,
  allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
}: FileUploadFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      // Default behavior: open file picker
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files && files.length > 0) {
      // Validate file types and sizes
      const validFiles = Array.from(files).filter(file => {
        // Check file type
        if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
          console.warn(`File type ${file.type} not allowed for ${file.name}`);
          return false;
        }

        // Check file size
        const sizeInMB = file.size / (1024 * 1024);
        if (sizeInMB > maxSizeMB) {
          console.warn(`File ${file.name} exceeds ${maxSizeMB}MB limit`);
          return false;
        }

        return true;
      });

      if (validFiles.length > 0) {
        // Create a new FileList-like object with valid files
        const dataTransfer = new DataTransfer();
        validFiles.forEach(file => dataTransfer.items.add(file));
        onFileSelect?.(dataTransfer.files);
      } else {
        onFileSelect?.(null);
      }
    } else {
      onFileSelect?.(null);
    }

    // Reset the input value so the same file can be selected again
    event.target.value = '';
  };

  return (
    <div className={cn('space-y-2', className)}>
      <Label className="text-textdark mb-4 font-medium">{label}</Label>

      <div
        className={cn(
          'flex h-20  w-full cursor-pointer flex-col items-center justify-center rounded-lg border border-primary/30 bg-[#FBFBFB] transition-colors duration-200',
          disabled && 'cursor-not-allowed opacity-50',
          !disabled && 'hover:bg-gray-100'
        )}
        onClick={disabled ? undefined : handleClick}
      >
        <div className="text-3xl font-light text-textdark/70">+</div>
        <p className="text-md text-textdark/70">Click to Upload</p>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={handleFileChange}
        className="hidden"
        aria-hidden="true"
      />
    </div>
  );
}
