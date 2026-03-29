"use client";

import React from "react";
import { Control, FieldErrors } from "react-hook-form";
import { Button } from "@repo/ui/components/ui/button";
import { cn } from "@repo/ui/lib/utils";
import { z } from "zod";
import { FormInputField } from "@repo/ui/components/form/FormInputField";
import { FormSelectController } from "@repo/ui/components/form/FormSelectController";
import { DatePickerField } from "@repo/ui/components/form/DatePickerField";
import { FileUploadField } from "../form/FileUploadField";

const baseSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  city: z.string().min(1, "City is required"),
});

const driverSpecificFields = z.object({
  dob: z.date({ required_error: "Date of birth is required" }),
  drivingLicenseNumber: z.string().min(1, "Driving license number is required"),
  licenseCategory: z.string().min(1, "License category is required"),
});

const sellerSpecificFields = z.object({
  aadhaarNumber: z.string().length(12, "Aadhaar must be 12 digits"),
  panNumber: z.string().length(10, "PAN must be 10 characters"),
});

const buyerSpecificFields = z.object({
  aadhaarNumber: z.string().length(12, "Aadhaar must be 12 digits"),
});

export const buyerDetailsSchema = baseSchema.merge(buyerSpecificFields);
export const driverDetailsSchema = baseSchema.merge(driverSpecificFields);
export const sellerDetailsSchema = baseSchema.merge(sellerSpecificFields);

export type DriverDetailsFormValues = z.infer<typeof driverDetailsSchema>;

interface DriverDetailsFormCardProps {
  control: Control<any>;
  onSubmit: (e: React.FormEvent) => void;
  errors: FieldErrors<any>;
  isPending?: boolean;
  className?: string;
  role: "driver" | "buyer" | "seller" | string;
}

// Sample data for dropdowns - replace with actual data source if needed
const cities = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Pune", "Kolkata", "Ahmedabad"];
const licenseCategories = ["LMV (Light Motor Vehicle)", "MCWG (Motorcycle with Gear)", "HGMV (Heavy Goods Motor Vehicle)"];

export default function DriverDetailsFormCard({
  control,
  onSubmit,
  errors,
  isPending,
  className,
  role,
}: DriverDetailsFormCardProps) {
  return (
    <div className={cn("bg-white shadow-sm rounded-lg border border-[#1E293B14]/8 mb-12 w-full p-6 sm:p-12", className)}>
      <form onSubmit={onSubmit} className="space-y-4 sm:space-y-6">
        <FormInputField
          control={control}
          name="fullName"
          label="Full Name"
          placeholder="Enter your Full Name"
          variant="styled"
        />

        <FormSelectController
          control={control}
          name="city"
          label="City"
          placeholder="Select your city"
          options={cities.map(city => ({ label: city, value: city }))}
          variant="styled"
        />

        {role === "driver" && (
          <>
            <DatePickerField
              control={control}
              name="dob"
              label="Date of Birth"
              fromYear={1950}
              toYear={new Date().getFullYear() - 18}
              variant="styled"
            />

            <FormInputField
              control={control}
              name="drivingLicenseNumber"
              label="Driving License Number"
              placeholder="Enter License Number"
              variant="styled"
            />

            <FormSelectController
              control={control}
              name="licenseCategory"
              label="License Category"
              placeholder="Select license category"
              options={licenseCategories.map(category => ({ label: category, value: category }))}
              variant="styled"
            />

            <FileUploadField
              label="Upload License (Front & Back)"
            />
          </>
        )}

        {role === "seller" && (
          <>
            <FormInputField
              control={control}
              name="aadhaarNumber"
              label="Aadhaar Number"
              placeholder="12-digit Adhaar Number"
              variant="styled"
            />

            <FileUploadField
              label="Upload Aadhaar Card"
            />

            <FormInputField
              control={control}
              name="panNumber"
              label="PAN Number"
              placeholder="10-character PAN"
              variant="styled"
            />

            <FileUploadField
              label="Upload PAN Card"
            />
          </>
        )}

        {role === "buyer" && (
          <>
            <FormInputField
              control={control}
              name="aadhaarNumber"
              label="Aadhaar Number"
              placeholder="12-digit Aadhaar Number"
              variant="styled"
            />

            <FileUploadField
              label="Upload Aadhaar Card"
            />
          </>
        )}

        <Button
          type="submit"
          className="w-full h-12 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium text-base transition-colors duration-200"
          disabled={isPending}
        >
          {isPending ? "Submitting..." : "Continue"}
        </Button>
      </form>
    </div>
  );
}
