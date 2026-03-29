"use client";

import React from "react";
import { Button } from "@repo/ui/components/ui/button";
import { cn } from "@repo/ui/lib/utils";
import { CircleCheckBig, ShoppingCart, Briefcase } from "lucide-react";

interface SignInCompleteCardProps {
  userName: string;
  userPhone: string;
  roles: string[];
  onBuySellClick: () => void;
  onDriverJobsClick: () => void;
  className?: string;
}

export function SignInCompleteCard({
  userName,
  userPhone,
  roles,
  onBuySellClick,
  onDriverJobsClick,
  className,
}: SignInCompleteCardProps) {
  return (
    <div
      className={cn(
        "bg-white shadow-sm rounded-xl mx-auto max-w-md p-6 sm:p-8 md:p-10 my-8",
        className
      )}
    >
      <div className="flex flex-col items-center text-center space-y-4 sm:space-y-6">
        <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-[#81C31D12]/5">
          <CircleCheckBig className="h-8 w-8 sm:h-10 sm:w-10 text-[#81C31D]" />
        </div>

        <div className="space-y-1.5 sm:space-y-3 pt-2 sm:pt-4">
          <h2 className="text-xl sm:text-2xl font-semibold text-textdark">
            Sign In Successful!
          </h2>
          <p className="text-textdark text-base max-w-sm">
            Welcome back! Choose where you'd like to go:
          </p>
        </div>

        <div className="w-full pt-2 space-y-3">
          <Button
            type="button"
            onClick={() => {
              console.log("🛒 Buy & Sell button clicked!");
              onBuySellClick();
            }}
            className="w-full h-11 sm:h-12 bg-primary hover:bg-primary/90 text-white rounded-lg font-semibold text-base flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-5 h-5" />
            Buy & Sell
          </Button>

          <Button
            type="button"
            onClick={() => {
              console.log("💼 Driver Jobs button clicked!");
              onDriverJobsClick();
            }}
            variant="outline"
            className="w-full h-11 sm:h-12 border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-lg font-semibold text-base flex items-center justify-center gap-2"
          >
            <Briefcase className="w-5 h-5" />
            Driver Jobs
          </Button>
        </div>

        <div className="text-center pt-4 sm:pt-6 border-t border-[#1E293B33]/20 w-full">
          <p className="font-medium text-gray-700 mb-2">Signed in as:</p>
          <div className="text-textdark/50 space-y-1 text-base">
            <p>{userPhone}</p>
            {roles.length > 0 && (
              <p className="text-sm text-textdark/70">
                Roles: {roles.join(", ")}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
