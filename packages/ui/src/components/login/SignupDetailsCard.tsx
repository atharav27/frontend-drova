"use client";

import React from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { Button } from "@repo/ui/components/ui/button";
import { Label } from "@repo/ui/components/ui/label";
import { Input } from "@repo/ui/components/ui/input";
import { PhoneInput } from "@repo/ui/components/ui/phone-input";
import { z } from "zod";

// Define a basic schema structure for the props, can be extended
const signupDetailsSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().min(1, "Phone number is required"),
});

type SignupDetailsFormValues = z.infer<typeof signupDetailsSchema>;

interface SignupDetailsCardProps {
  control: Control<any>; // Allow any for flexibility, or use a specific type
  onSubmit: (e: React.FormEvent) => void;
  errors: FieldErrors<SignupDetailsFormValues>;
  isPending: boolean;
  isPhoneValid: boolean; // To enable/disable button based on phone validity
  phoneValue: string; // Current phone value
  onPhoneChange: (value: string) => void; // Handler for phone input changes
}

export default function SignupDetailsCard({
  control,
  onSubmit,
  errors,
  isPending,
  isPhoneValid,
  // phoneValue, // phoneValue is part of the form state via control
  // onPhoneChange, // onPhoneChange is handled by the Controller's render prop
}: SignupDetailsCardProps) {
  return (
    <div className="bg-[#FFFFFF] shadow-sm rounded-sm w-full p-6 sm:p-10 lg:p-12 my-6 sm:my-8 lg:my-8">
      <form onSubmit={onSubmit} className="space-y-4 sm:space-y-6">
        {/* First Name Input */}
        <div>
          <Label htmlFor="firstName" className="text-gray-700 text-sm sm:text-base font-medium mb-1.5 sm:mb-2 block">
            First Name <span className="text-red-500">*</span>
          </Label>
          <Controller
            name="firstName"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="firstName"
                placeholder="Enter your first name"
                className="w-full h-11 sm:h-12 border-gray-200 bg-[#FBFBFB] focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-primary"
              />
            )}
          />
          {errors.firstName && (
            <p className="text-red-500 text-xs sm:text-sm mt-1 sm:mt-1.5">
              {errors.firstName.message}
            </p>
          )}
        </div>

        {/* Last Name Input */}
        <div>
          <Label htmlFor="lastName" className="text-gray-700 text-sm sm:text-base font-medium mb-1.5 sm:mb-2 block">
            Last Name <span className="text-red-500">*</span>
          </Label>
          <Controller
            name="lastName"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="lastName"
                placeholder="Enter your last name"
                className="w-full h-11 sm:h-12 border-gray-200 bg-[#FBFBFB] focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-primary"
              />
            )}
          />
          {errors.lastName && (
            <p className="text-red-500 text-xs sm:text-sm mt-1 sm:mt-1.5">
              {errors.lastName.message}
            </p>
          )}
        </div>

        {/* Email Input */}
        <div>
          <Label htmlFor="email" className="text-gray-700 text-sm sm:text-base font-medium mb-1.5 sm:mb-2 block">
            Email (Optional)
          </Label>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="email"
                type="email"
                placeholder="Enter your email address"
                className="w-full h-11 sm:h-12 border-gray-200 bg-[#FBFBFB] focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-primary"
              />
            )}
          />
          {errors.email && (
            <p className="text-red-500 text-xs sm:text-sm mt-1 sm:mt-1.5">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Phone Number Input */}
        <div>
          <Label htmlFor="phone" className="text-gray-700 text-sm sm:text-base font-medium mb-1.5 sm:mb-2 block">
            Phone Number <span className="text-red-500">*</span>
          </Label>
          <Controller
            control={control}
            name="phone"
            render={({ field }) => (
              <PhoneInput
                {...field}
                defaultCountry="IN"
                international
                className="w-full h-11 sm:h-12 [&_input]:h-full [&_input]:border-gray-200 [&_input]:bg-[#FBFBFB] [&_input]:focus-visible:ring-1 [&_input]:focus-visible:ring-offset-0 [&_input]:focus-visible:ring-primary"
              />
            )}
          />
          {errors.phone && (
            <p className="text-red-500 text-xs sm:text-sm mt-1 sm:mt-1.5">
              {errors.phone.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full h-11 sm:h-12 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium text-sm sm:text-base"
          disabled={isPending || !isPhoneValid}
        >
          {isPending ? "Sending..." : "Send OTP"}
        </Button>
      </form>
    </div>
  );
}
