"use client";

import {
  Form,
} from "@repo/ui/components/ui/form";
import { jobApplicationSchema, JobApplicationSchema } from "~/schema/job-application-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/components/ui/button";
import { useForm } from "react-hook-form";
import React, { useEffect } from "react";
import { DatePickerField } from "@repo/ui/components/form/DatePickerField";
import { FormInputField } from "@repo/ui/components/form/FormInputField";
import { FormSelectController } from "@repo/ui/components/form/FormSelectController";
import { TextareaField } from "@repo/ui/components/form/TextareaField";
import { Profile } from "@repo/hooks";
import { useApplyToJob, JobApplicationCreateRequest } from "~/hooks/query/useDriverJobs";
import { toast } from "sonner";

interface JobApplicationFormProps {
  jobId?: string | null;
  userProfile?: Profile | null;
  onSubmit?: () => void;
}

export function JobApplicationForm({ jobId, userProfile, onSubmit }: JobApplicationFormProps = {}) {
  const applyToJobMutation = useApplyToJob();

  const form = useForm<JobApplicationSchema>({
    resolver: zodResolver(jobApplicationSchema),
    defaultValues: {
      fullName: "",
      contactNumber: "",
      licenseNumber: "",
      licenseCategory: "",
      yearsOfExperience: "",
      availableFrom: undefined,
      interestReason: "",
    },
  });

  // Prefill form with user profile data when available
  useEffect(() => {
    if (userProfile) {
      // Map profile license category to our dropdown values
      const mapLicenseCategory = (profileValue: string | null) => {
        if (!profileValue) return "";

        // Clean the value (remove spaces, convert to uppercase)
        const cleanValue = profileValue.trim().toUpperCase();

        // Map common variations to our dropdown values
        const mapping: { [key: string]: string } = {
          "LVM": "LMV",           // LVM -> LMV
          "LMV": "LMV",           // Already correct
          "MCWG": "MCWG",         // Already correct
          "HGMV": "HGMV",         // Already correct
          "HMV": "HMV",           // Already correct
          "MC": "MC",             // Already correct
          "TV": "TV",             // Already correct
        };

        return mapping[cleanValue] || "";
      };

      const mappedLicenseCategory = mapLicenseCategory(userProfile.documents.licenseCategory);

      const formData = {
        fullName: userProfile.fullName || "",
        contactNumber: userProfile.phone || "",
        licenseNumber: userProfile.documents.licenseNumber || "",
        licenseCategory: mappedLicenseCategory,
        yearsOfExperience: "", // Let user fill this
        availableFrom: undefined, // Let user fill this
        interestReason: "", // Let user fill this
      };

      form.reset(formData);

      // Manually set the license category to ensure it gets set correctly
      if (mappedLicenseCategory) {
        form.setValue("licenseCategory", mappedLicenseCategory);
      }
    }
  }, [userProfile, form]);

  const handleSubmit = (data: JobApplicationSchema) => {
    if (!jobId) {
      toast.error("Job ID is required to submit application");
      return;
    }

    // Convert form data to API payload format
    const availableFromDate = data.availableFrom || new Date();
    const availableFromString = availableFromDate.toISOString().split('T')[0] as string;

    const payload: JobApplicationCreateRequest = {
      fullName: data.fullName || "",
      contactNumber: data.contactNumber || "",
      licenseNumber: data.licenseNumber || "",
      licenseCategory: data.licenseCategory || "",
      yearsOfExperience: parseInt(data.yearsOfExperience) || 0,
      availableFrom: availableFromString as string,
      motivation: data.interestReason || "",
    };

    applyToJobMutation.mutate(
      { jobId, payload },
      {
        onSuccess: () => {
          toast.success("Application submitted successfully!");
          onSubmit?.();
        },
        onError: (error) => {
          toast.error(`Failed to submit application: ${error.message}`);
        },
      }
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 md:space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <FormInputField
            control={form.control}
            name="fullName"
            label="Full Name"
            placeholder="John Joseph"
          />
          <FormInputField
            control={form.control}
            name="contactNumber"
            label="Contact Number"
            placeholder="+91 8989657865"
          />
          <FormInputField
            control={form.control}
            name="licenseNumber"
            label="License Number"
            placeholder="MH0123456789"
          />
          <FormSelectController
            control={form.control}
            name="licenseCategory"
            label="License Category"
            placeholder="Select license category"
            options={[
              { label: "LMV (Light Motor Vehicle)", value: "LMV" },
              { label: "MCWG (Motorcycle with Gear)", value: "MCWG" },
              { label: "HGMV (Heavy Goods Motor Vehicle)", value: "HGMV" },
              { label: "HMV (Heavy Motor Vehicle)", value: "HMV" },
              { label: "MC (Motor Cycle)", value: "MC" },
              { label: "TV (Transport Vehicle)", value: "TV" },
            ]}
          />
        </div>
        <FormInputField
          control={form.control}
          name="yearsOfExperience"
          label="Years of Experience"
          placeholder="How many years of experience do you have?"
        />
        <DatePickerField
          control={form.control}
          name="availableFrom"
          label="Available From"
          placeholder="Select availability date"
          disablePast={true}
        />
        <TextareaField
          control={form.control}
          name="interestReason"
          label="Why are you interested in this job?"
          placeholder="Tell us why are you interested in this position and why you would be a good fit."
          className="min-h-[120px]"
        />
        <div className="flex ">
          <Button
            type="submit"
            className="w-full sm:w-auto text-base sm:text-lg font-medium"
            disabled={applyToJobMutation.isPending}
          >
            {applyToJobMutation.isPending ? "Submitting..." : "Submit Application"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
