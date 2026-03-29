import React from 'react';
import { Button } from '../ui/button';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  showAction?: boolean;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  showAction = true,
  className = ""
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-8 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 ${className}`}>
      <div className="text-center space-y-3 sm:space-y-4 md:space-y-6 max-w-lg mx-auto">
        {Icon && (
          <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
            <Icon className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-gray-400" />
          </div>
        )}
        <div className="space-y-2 sm:space-y-3">
          <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-textdark leading-tight">
            {title}
          </h3>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg text-textdark/70 leading-relaxed">
            {description}
          </p>
        </div>
        {showAction && actionLabel && onAction && (
          <div className="pt-2 sm:pt-4">
            <Button
              onClick={onAction}
              className="bg-primary text-white hover:bg-primary/90 px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 rounded-lg flex items-center gap-1.5 sm:gap-2 font-semibold text-xs sm:text-sm md:text-base w-full "
            >
              {actionLabel}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
