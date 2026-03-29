import { z } from "zod";

export const createJobPostSchema = z.object({
  jobTitle: z.string().min(1, "Job title is required"),
  companyName: z.string().min(1, "Company name is required"),
  location: z.string().min(1, "Location is required"),
  jobType: z.string().min(1, "Job type is required"),
  // Optional numeric fields: accept empty string/null/undefined as undefined
  minSalary: z.preprocess(
    (v) => (v === "" || v === null || v === undefined ? undefined : v),
    z.coerce.number().min(0, "Salary must be a positive number").optional()
  ),
  maxSalary: z.preprocess(
    (v) => (v === "" || v === null || v === undefined ? undefined : v),
    z.coerce.number().min(0, "Salary must be a positive number").optional()
  ),
  experience: z.string().min(1, "Experience is required"),
  jobDescription: z.string().min(10, "Description must be at least 10 characters"),
  // Optional text field: allow empty and map to undefined
  jobRequirements: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v && v.length > 0 ? v : undefined)),
});

export type CreateJobPostSchema = z.infer<typeof createJobPostSchema>;
