interface AuthLoadingSpinnerProps {
  message?: string;
  fullScreen?: boolean;
}

export function AuthLoadingSpinner({
  message = "Checking authentication...",
  fullScreen = true
}: AuthLoadingSpinnerProps) {
  const containerClass = fullScreen
    ? "min-h-screen bg-[#FAFAFB] flex items-center justify-center"
    : "flex items-center justify-center p-8";

  return (
    <div className={containerClass}>
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
}
