"use client";

import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@repo/ui/components/ui/alert-dialog";
import { Button } from "@repo/ui/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import { cn } from "@repo/ui/lib/utils";
import deleteIcon from "../../../assets/images/delete.png";

interface ConfirmationDialogProps {
  trigger: React.ReactNode;
  title: string;
  description: string;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  loadingText?: string;
}

export function ConfirmationDialog({
  trigger,
  title,
  description,
  onConfirm,
  confirmText = "Delete",
  cancelText = "Cancel",
  isLoading = false,
  loadingText = "Deleting...",
}: ConfirmationDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {trigger}
      </AlertDialogTrigger>

      <AlertDialogContent
        className="fixed top-[50%] z-50 sm:w-full mx-auto rounded-lg border-0 shadow-xl bg-white max-w-[80vw] sm:max-w-md md:max-w-lg lg:max-w-lg"
        style={{
          transform: 'translate(-50%, -50%)',
          animation: 'none',
          transition: 'opacity 0.2s ease-in-out'
        }}
      >
        <AlertDialogHeader className="text-center pt-4 pb-3 px-4 sm:pt-8 sm:pb-6 sm:px-6 lg:pt-8 lg:pb-6 lg:px-6">
          {/* Back to Listings Link */}
          <div className="flex items-center mb-3 sm:mb-6 lg:mb-6">
            <AlertDialogCancel asChild className="bg-white hover:bg-white border-0 text-sm sm:text-lg lg:text-lg p-0">
              <Button className="flex items-center text-textdark font-medium text-sm sm:text-lg lg:text-lg">
                <ChevronLeft className="w-5 h-5 mr-1 text-textdark" />
                Back to Listings
              </Button>
            </AlertDialogCancel>
          </div>

          {/* Delete Icon */}
          <div className="mx-auto mb-3 sm:mb-4 flex items-center justify-center">
            <Image
              src={deleteIcon}
              alt="Delete"
              width={340}
              height={240}
              className="object-contain w-32 h-24 sm:w-56 sm:h-36 lg:w-[340px] lg:h-[240px]"
            />
          </div>

          <AlertDialogTitle className="text-base sm:text-xl lg:text-2xl text-center font-semibold text-textdark px-3 sm:px-8 lg:px-10">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-textdark text-xs sm:text-base lg:text-xl text-center leading-relaxed px-3 sm:px-6 lg:px-0">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex gap-2 sm:gap-6 lg:gap-6 pb-4 sm:pb-6 lg:pb-6 px-3 sm:px-8 lg:px-8 pt-0">
          <AlertDialogCancel className="flex-1 p-3 sm:p-5 lg:p-5 rounded-lg bg-white text-primary text-sm sm:text-xl lg:text-xl border hover:bg-primary/10 font-medium border-primary hover:text-primary hover:border-primary">
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 p-3 sm:p-5 lg:p-5 rounded-lg bg-primary hover:bg-primary/90 text-white text-sm sm:text-xl lg:text-xl border border-primary font-medium disabled:opacity-50"
          >
            {isLoading ? loadingText : confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
