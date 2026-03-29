"use client";

import {
  Form,
} from "@repo/ui/components/ui/form";
import { createJobPostSchema, CreateJobPostSchema } from "~/schema/create-job-post-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/components/ui/button";
import { useForm } from "react-hook-form";
import React from "react";
import { toast } from "sonner";
import { useCreateDriverJob, JobType } from "~/hooks/query";
import { FormInputField } from "@repo/ui/components/form/FormInputField";
import { FormSelectController } from "@repo/ui/components/form/FormSelectController";
import { TextareaField } from "@repo/ui/components/form/TextareaField";

const locations = ["Bangalore", "Mumbai", "Hyderabad", "Pune", "Delhi"];
const jobTypes = ["Full Time", "Part Time", "Contract", "Temporary", "Intern", "Freelance"];
const experiences = ["0-1 years", "1-3 years", "3-5 years", "5+ years"];

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div className="border-b pb-4">
    <h3 className="text-xl md:text-2xl font-semibold text-primary px-4 md:px-6">{children}</h3>
  </div>
);

export function CreateJobForm() {
  const form = useForm<CreateJobPostSchema>({
    resolver: zodResolver(createJobPostSchema),
    defaultValues: {
      jobTitle: "",
      companyName: "",
      location: "",
      jobType: "",
      minSalary: undefined,
      maxSalary: undefined,
      experience: "",
      jobDescription: "",
      jobRequirements: "",
    },
  });

  const { mutate: createJob, isPending } = useCreateDriverJob();

  const mapJobTypeToEnum = (value: string): JobType => {
    switch (value.toLowerCase()) {
      case "full time":
        return JobType.FULL_TIME;
      case "part time":
        return JobType.PART_TIME;
      case "contract":
        return JobType.CONTRACT;
      case "temporary":
        return JobType.TEMPORARY;
      case "intern":
        return JobType.INTERN;
      case "freelance":
        return JobType.FREELANCE;
      default:
        return JobType.FULL_TIME;
    }
  };

  const extractExperienceYears = (value: string): number | null => {
    if (!value) return null;
    const match = value.match(/\d+/);
    return match ? Number(match[0]) : null;
  };

  const onSubmit = (data: CreateJobPostSchema) => {
    const payload = {
      title: data.jobTitle,
      description: data.jobDescription,
      companyName: data.companyName,
      location: data.location,
      jobType: mapJobTypeToEnum(data.jobType),
      minSalary: data.minSalary ?? null,
      maxSalary: data.maxSalary ?? null,
      experience: extractExperienceYears(data.experience),
      requirements: data.jobRequirements || null,
    };

    createJob(payload, {
      onSuccess: () => {
        toast.success("Job post created successfully");
        form.reset();
      },
      onError: (error: any) => {
        const message = error?.message || "Failed to create job post";
        toast.error(message);
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 md:space-y-14">
        <div>
          <SectionTitle>Job Details</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 pt-6 px-4 md:px-6">
            <FormInputField
              control={form.control}
              name="jobTitle"
              label="Job Title"
              placeholder="e.g. Interstate Truck Driver"
            />
            <FormInputField
              control={form.control}
              name="companyName"
              label="Company Name"
              placeholder="e.g. Express Logistics Ltd"
            />
          </div>
        </div>
        <div>
          <SectionTitle>Location & Type</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 pt-6 px-4 md:px-6">
            <FormSelectController
              control={form.control}
              name="location"
              label="Location"
              placeholder="Select Location"
              options={locations.map(location => ({ label: location, value: location }))}
            />
            <FormSelectController
              control={form.control}
              name="jobType"
              label="Job Type"
              placeholder="Select Job Type"
              options={jobTypes.map(type => ({ label: type, value: type }))}
            />
          </div>
        </div>
        <div>
          <SectionTitle>Compensation & Experience</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 pt-6 px-4 md:px-6">
            <FormInputField
              control={form.control}
              name="minSalary"
              label="Min Salary (₹)"
              placeholder="e.g. 10000"
              type="number"
            />
            <FormInputField
              control={form.control}
              name="maxSalary"
              label="Max Salary (₹)"
              placeholder="e.g. 10000"
              type="number"
            />
            <FormSelectController
              control={form.control}
              name="experience"
              label="Experience Required"
              placeholder="Select Experience"
              options={experiences.map(exp => ({ label: exp, value: exp }))}
            />
          </div>
        </div>
        <div>
          <SectionTitle>Description & Requirements</SectionTitle>
          <div className="space-y-6 pt-6 px-4 md:px-6">
            <TextareaField
              control={form.control}
              name="jobDescription"
              label="Job Description"
              placeholder="Describe the job responsibilities and expectations..."
              className="min-h-[150px]"
            />
            <TextareaField
              control={form.control}
              name="jobRequirements"
              label="Job Requirements"
              placeholder="List qualifications and requirements (one per line)"
              className="min-h-[150px]"
            />
          </div>
        </div>
        <div className="flex justify-end px-4 md:px-6">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Posting..." : "Post Job Listing"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
