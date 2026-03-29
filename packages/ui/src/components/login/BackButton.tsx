import { ChevronLeft } from 'lucide-react';
import Link from "next/link";

interface BackButtonProps {
  isOtpStep: boolean;
  onBackClick: () => void;
  homeHref?: string;
  buttonText?: string;
  className?: string;
}

export default function BackButton({ isOtpStep, onBackClick, homeHref = "/", buttonText, className }: BackButtonProps) {
  const defaultClassName = "flex items-center text-textdark font-medium hover:text-gray-800 transition-colors";
  const appliedClassName = className || defaultClassName;

  return (
    <div className="">
      {isOtpStep ? (
        <button
          onClick={onBackClick}
          className={appliedClassName}
        >
          <ChevronLeft className="w-4 h-4 mr-2 " />
          {buttonText || "Back"}
        </button>
      ) : (
        <Link href={homeHref} className={appliedClassName}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          {buttonText || "Back to Home"}
        </Link>
      )}
    </div>
  );
}
