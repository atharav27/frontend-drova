"use client";

import React from "react";
import { cn } from "@repo/ui/lib/utils"; // Assuming cn utility is here

interface SignupStepperProps {
  currentStep: number; // 1-indexed
  steps: string[];
  className?: string;
}

export default function SignupStepper({ currentStep, steps, className }: SignupStepperProps) {
  return (
    <div className={cn("flex items-center justify-center w-full max-w-md sm:max-w-lg mx-auto my-6 sm:my-8 lg:my-10", className)}>
      {steps.map((label, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;

        return (
          <React.Fragment key={stepNumber}>
            <div className="flex flex-col items-center w-16 sm:w-20">
              <div
                className={cn(
                  "w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm sm:text-base font-medium border-2",
                  isActive ? "bg-primary border-primary text-white" :
                    isCompleted ? "bg-primary border-primary text-white" :
                      "bg-primary/40 border text-white"
                )}
              >
                {isCompleted ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                ) : (
                  stepNumber
                )}
              </div>
              <p
                className={cn(
                  "mt-1.5 sm:mt-2 text-xs sm:text-sm text-center",
                  isActive ? "text-primary font-medium" :
                    isCompleted ? "text-primary" :
                      "text-primary/40"
                )}
              >
                {label}
              </p>
            </div>
            {stepNumber < steps.length && (
              <div
                className={cn(
                  "flex-1 h-0.5 mx-0 sm:mx-0 mb-6 sm:mb-8",
                  isCompleted ? "bg-primary" : "bg-primary/40"
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
