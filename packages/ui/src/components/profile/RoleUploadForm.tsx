"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@repo/ui/components/ui/button";
import { Form } from "@repo/ui/components/ui/form";
import { FormInputField } from "@repo/ui/components/form/FormInputField";
import { FormSelectController } from "@repo/ui/components/form/FormSelectController";
import { DatePickerField } from "@repo/ui/components/form/DatePickerField";
import { FileUploadField } from "@repo/ui/components/form/FileUploadField";

// Base schema for all roles
const baseRoleSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
});

// Driver role schema
const driverSchema = baseRoleSchema.extend({
  dob: z.date({ required_error: "Date of birth is required" }),
  licenseNumber: z.string()
    .min(1, "License number is required")
    .max(20, "License number must be 20 characters or less"),
  licenseCategory: z.string().min(1, "License category is required"),
  licenseFrontImage: z.string().min(1, "License image is required"),
});

// Buyer role schema
const buyerSchema = baseRoleSchema.extend({
  aadhaarNumber: z.string()
    .min(12, "Aadhaar number must be exactly 12 digits")
    .max(12, "Aadhaar number must be exactly 12 digits")
    .regex(/^\d{12}$/, "Aadhaar number must contain only digits"),
  aadhaarCardImage: z.string().min(1, "Aadhaar card image is required"),
});

// Seller role schema
const sellerSchema = baseRoleSchema.extend({
  aadhaarNumber: z.string()
    .min(12, "Aadhaar number must be exactly 12 digits")
    .max(12, "Aadhaar number must be exactly 12 digits")
    .regex(/^\d{12}$/, "Aadhaar number must contain only digits"),
  aadhaarCardImage: z.string().min(1, "Aadhaar card image is required"),
  panNumber: z.string()
    .min(10, "PAN number must be exactly 10 characters")
    .max(10, "PAN number must be exactly 10 characters")
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN number format"),
  panCardImage: z.string().min(1, "PAN card image is required"),
});


// License category options
const licenseCategoryOptions = [
  { label: "LMV (Light Motor Vehicle)", value: "LMV" },
  { label: "MCWG (Motorcycle with Gear)", value: "MCWG" },
  { label: "HGMV (Heavy Goods Motor Vehicle)", value: "HGMV" },
  { label: "HMV (Heavy Motor Vehicle)", value: "HMV" },
  { label: "MCWOG (Motorcycle without Gear)", value: "MCWOG" },
];

// Base form data type that includes all possible fields
type BaseFormData = {
  userId: string;
  dob?: Date;
  licenseNumber?: string;
  licenseCategory?: string;
  licenseFrontImage?: string;
  aadhaarNumber?: string;
  aadhaarCardImage?: string;
  panNumber?: string;
  panCardImage?: string;
};

interface RoleUploadFormProps {
  role: "BUYER" | "DRIVER" | "SELLER";
  userId: string;
  onCancel: () => void;
  isLoading?: boolean;
  onUploadAdditional?: (_formData: any) => void;
}

export function RoleUploadForm({
  role,
  userId,
  onCancel,
  isLoading = false,
  onUploadAdditional
}: RoleUploadFormProps) {
  // Get the appropriate schema based on role
  const getSchema = () => {
    switch (role) {
      case "DRIVER":
        return driverSchema;
      case "BUYER":
        return buyerSchema;
      case "SELLER":
        return sellerSchema;
      default:
        return baseRoleSchema;
    }
  };

  const schema = getSchema();

  const form = useForm<BaseFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      userId,
      dob: undefined,
      licenseNumber: "",
      licenseCategory: "",
      licenseFrontImage: "",
      aadhaarNumber: "",
      aadhaarCardImage: "",
      panNumber: "",
      panCardImage: "",
    },
  });

  const handleSubmit = (formData: BaseFormData) => {
    console.log("Form submitted with data:", formData);

    // Convert Date object to string for API call
    const apiData = {
      ...formData,
      dateOfBirth: formData.dob ? formData.dob.toISOString().split('T')[0] : undefined,
    };

    // Call the actual upload function with form data
    onUploadAdditional?.(apiData);
  };

  const handleFileSelect = (fieldName: keyof BaseFormData, files: FileList | null) => {
    if (files && files.length > 0) {
      // In a real app, you would upload the file and get the URL
      // For now, we'll use the file name as a placeholder
      const fileName = files[0]?.name;
      if (fileName) {
        form.setValue(fieldName, fileName);
      }
    }
  };

  const renderDriverFields = () => (
    <>
      <DatePickerField<BaseFormData>
        control={form.control}
        name="dob"
        label="Date of Birth"
        fromYear={1950}
        toYear={new Date().getFullYear() - 18}
        variant="styled"
      />

      <FormInputField<BaseFormData>
        control={form.control}
        name="licenseNumber"
        label="Driving License Number"
        placeholder="Enter your license number"
        variant="styled"
      />

      <FormSelectController<BaseFormData>
        control={form.control}
        name="licenseCategory"
        label="License Category"
        placeholder="Select license category"
        options={licenseCategoryOptions}
        variant="styled"
      />

      <FileUploadField
        label="Driving License Image"
        onFileSelect={(files) => handleFileSelect("licenseFrontImage", files)}
        accept="image/*"
        maxSizeMB={5}
      />
    </>
  );

  const renderBuyerFields = () => (
    <>
      <FormInputField<BaseFormData>
        control={form.control}
        name="aadhaarNumber"
        label="Aadhaar Number"
        placeholder="Enter your 12-digit Aadhaar number"
        type="text"
        variant="styled"
      />

      <FileUploadField
        label="Aadhaar Card Image"
        onFileSelect={(files) => handleFileSelect("aadhaarCardImage", files)}
        accept="image/*"
        maxSizeMB={5}
      />
    </>
  );

  const renderSellerFields = () => (
    <>
      <FormInputField<BaseFormData>
        control={form.control}
        name="aadhaarNumber"
        label="Aadhaar Number"
        placeholder="Enter your 12-digit Aadhaar number"
        type="text"
        variant="styled"
      />

      <FileUploadField
        label="Aadhaar Card Image"
        onFileSelect={(files) => handleFileSelect("aadhaarCardImage", files)}
        accept="image/*"
        maxSizeMB={5}
      />

      <FormInputField<BaseFormData>
        control={form.control}
        name="panNumber"
        label="PAN Number"
        placeholder="Enter your 10-character PAN number"
        type="text"
        variant="styled"
      />

      <FileUploadField
        label="PAN Card Image"
        onFileSelect={(files) => handleFileSelect("panCardImage", files)}
        accept="image/*"
        maxSizeMB={5}
      />
    </>
  );

  const renderFields = () => {
    switch (role) {
      case "DRIVER":
        return renderDriverFields();
      case "BUYER":
        return renderBuyerFields();
      case "SELLER":
        return renderSellerFields();
      default:
        return null;
    }
  };


  return (


      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-3 sm:space-y-4">
          {renderFields()}

          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-3 sm:pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
              className="w-full sm:w-auto order-2 sm:order-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="px-4 sm:px-6 w-full sm:w-auto order-1 sm:order-2 text-sm sm:text-base"
            >
              {isLoading ? "Submitting..." : "Submit Documents"}
            </Button>
          </div>
        </form>
      </Form>

  );
}
