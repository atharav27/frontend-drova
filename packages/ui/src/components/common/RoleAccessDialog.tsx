"use client";

import { Button } from "../ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "../ui/alert-dialog";
import { ChevronLeft, Shield, UserPlus } from "lucide-react";

interface RoleAccessDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterAsSeller: () => void;
  requiredRole: string;
  customMessage?: string;
}

export function RoleAccessDialog({
  isOpen,
  onClose,
  onRegisterAsSeller,
  requiredRole,
  customMessage
}: RoleAccessDialogProps) {
  const roleDisplayName = requiredRole.toLowerCase();
  const isSellerRole = requiredRole === 'SELLER';

  const defaultMessage = isSellerRole
    ? `This feature is only available for sellers. Register as a seller to create listings, manage your inventory, and reach more customers.`
    : `This feature is only available for ${roleDisplayName}s. Please switch to ${roleDisplayName} account to access this feature.`;

  const message = customMessage || defaultMessage;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent
        className="fixed mx-auto top-[50%] z-50 w-[calc(100vw-32px)] sm:w-full rounded-lg border-0 shadow-xl bg-white max-w-[95vw] sm:max-w-md md:max-w-lg"
        style={{
          transform: 'translate(-50%, -50%)',
          animation: 'none',
          transition: 'opacity 0.2s ease-in-out'
        }}
      >
        <AlertDialogHeader className="text-center px-4 py-4 sm:p-6">
          {/* Back Button */}
          <div className="flex items-center mb-4 sm:mb-6">
            <button
              onClick={onClose}
              className="flex items-center text-textdark text-sm sm:text-base font-medium hover:text-textdark/80 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1 text-textdark" />
              Go Back
            </button>
          </div>

          {/* Role Icon */}
          <div className="mx-auto mb-4 sm:mb-6 flex items-center justify-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-full flex items-center justify-center">
              {isSellerRole ? (
                <UserPlus className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              ) : (
                <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              )}
            </div>
          </div>

          <AlertDialogTitle className="text-xl sm:text-2xl font-semibold text-center text-textdark mb-3">
            {isSellerRole ? 'Become a Seller!' : `Access ${requiredRole} Features`}
          </AlertDialogTitle>

          <AlertDialogDescription className="text-center text-sm sm:text-lg leading-relaxed text-textdark/70">
            {message}
          </AlertDialogDescription>

          {isSellerRole && (
            <div className="mt-4 p-3 sm:p-4 bg-primary/5 rounded-lg">
              <h4 className="font-semibold text-textdark mb-2 text-sm sm:text-base">Seller Benefits:</h4>
              <ul className="text-xs sm:text-sm text-textdark/70 space-y-1 text-left">
                <li>• Create and manage vehicle listings</li>
                <li>• Reach thousands of potential buyers</li>
                <li>• Track your sales performance</li>
                <li>• Access seller analytics and insights</li>
              </ul>
            </div>
          )}
        </AlertDialogHeader>

        <AlertDialogFooter className="flex gap-3 sm:gap-4 pb-4 px-4 sm:px-6 pt-0">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 p-3 sm:p-4 text-sm sm:text-base rounded-lg bg-white text-primary border border-primary hover:text-primary hover:bg-primary/10 font-medium"
          >
            Maybe Later
          </Button>
          {isSellerRole ? (
            <Button
              onClick={onRegisterAsSeller}
              className="flex-1 p-3 sm:p-4 rounded-lg text-sm sm:text-base bg-primary text-white border border-primary font-medium"
            >
              Register as Seller
            </Button>
          ) : (
            <Button
              onClick={onClose}
              className="flex-1 p-3 sm:p-4 rounded-lg text-sm sm:text-base bg-primary text-white border border-primary font-medium"
            >
              Switch Account
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
