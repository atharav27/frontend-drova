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
import Image from "next/image";
import authImage from "../../../assets/images/auth.png";
import { ChevronLeft } from "lucide-react";

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSignIn: () => void;
  onRegister: () => void;
}

export function AuthDialog({ isOpen, onClose, onSignIn, onRegister }: AuthDialogProps) {
  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <AlertDialogContent
        className="fixed mx-auto top-[50%] z-50 w-[calc(100vw-32px)] sm:w-full  rounded-lg border-0 shadow-xl bg-white max-w-[92vw] sm:max-w-md md:max-w-lg lg:max-w-lg"
        style={{
          transform: 'translate(-50%, -50%)',
          animation: 'none',
          transition: 'opacity 0.2s ease-in-out'
        }}
      >
        <AlertDialogHeader className="text-center px-4 py-4 sm:p-6">
          {/* Back to Listings Link */}
          <div className="flex items-center mb-6">
            <button
              onClick={onClose}
              className="flex items-center text-textdark text-sm sm:text-base font-medium"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1 text-textdark" />
              Back to Listings
            </button>
          </div>

          {/* Illustration */}
          <div className="mx-auto mb-6 flex items-center justify-center">
            <Image
              src={authImage}
              alt="Authentication illustration"
              width={320}
              height={256}
              className="object-contain w-40 h-32 sm:w-80 sm:h-64"
            />
          </div>

          <AlertDialogTitle className="text-lg sm:text-2xl font-semibold text-center text-textdark mb-3">
            Get Full Access in Just a Tap!
          </AlertDialogTitle>
          <AlertDialogDescription className=" text-center text-sm sm:text-xl leading-relaxed">
            Sign in or register to view contact details,
            <br />
            post listings, and explore all features
            <br />
            tailored for you.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex gap-4 sm:gap-8 pb-4 sm:pb-6 px-4 sm:px-10 pt-0">
          <Button
            onClick={onSignIn}
            variant="outline"
            className="flex-1 p-3 sm:p-6 text-base sm:text-xl rounded-lg bg-white text-primary border border-primary hover:text-primary hover:bg-primary/10 font-medium"
          >
            Sign In
          </Button>
          <Button
            onClick={onRegister}
            className="flex-1 p-3 sm:p-6 rounded-lg text-base sm:text-xl bg-primary text-white border border-primary font-medium"
          >
            Register
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
