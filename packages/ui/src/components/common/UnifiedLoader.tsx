import { Loader2 } from "lucide-react";

interface UnifiedLoaderProps {
  message?: string;
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
  className?: string;
}

export function UnifiedLoader({
  message = "Loading...",
  size = "md",
  fullScreen = false,
  className = ""
}: UnifiedLoaderProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-12 w-12"
  };

  const containerClass = fullScreen
    ? "min-h-screen bg-[#FAFAFB] flex items-center justify-center"
    : "flex items-center justify-center p-4";

  return (
    <div className={`${containerClass} ${className}`}>
      <div className="text-center">
        {/* Spinner matching ProfileSavedTab style */}
        <div className={`animate-spin rounded-full border-b-2 border-primary mx-auto ${sizeClasses[size]}`}></div>
        {message && (
          <p className="text-gray-600 text-sm mt-3 font-medium">{message}</p>
        )}
      </div>
    </div>
  );
}

// Convenience components for common use cases
export function PageLoader({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="fixed inset-0 bg-[#FAFAFB] flex items-center justify-center z-10">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-600 text-sm font-medium">{message}</p>
      </div>
    </div>
  );
}

export function CardLoader({ message = "Loading..." }: { message?: string }) {
  return <UnifiedLoader message={message} size="md" fullScreen={false} />;
}

export function ButtonLoader({
  message = "Loading",
  textColor = "text-primary",
  textSize = "text-sm"
}: {
  message?: string;
  textColor?: string;
  textSize?: string;
}) {
  return (
    <span className={`inline-flex items-center ${textSize} ${textColor} font-medium`}>
      {message}
      <span className="ml-1 flex">
        <span className="animate-bounce" style={{ animationDelay: '0ms' }}>.</span>
        <span className="animate-bounce" style={{ animationDelay: '150ms' }}>.</span>
        <span className="animate-bounce" style={{ animationDelay: '300ms' }}>.</span>
      </span>
    </span>
  );
}

// Optional: Add a more sophisticated button loader with spinner
export function ButtonLoaderWithSpinner({ message = "Loading" }: { message?: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm text-primary font-medium">
      <Loader2 className="h-4 w-4 animate-spin" />
      {message}
      <span className="flex">
        <span className="animate-bounce" style={{ animationDelay: '0ms' }}>.</span>
        <span className="animate-bounce" style={{ animationDelay: '150ms' }}>.</span>
        <span className="animate-bounce" style={{ animationDelay: '300ms' }}>.</span>
      </span>
    </span>
  );
}
