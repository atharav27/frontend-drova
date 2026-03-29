import { z } from "zod";

export const jobApplicationSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  contactNumber: z.string().min(10, "A valid contact number is required"),
  licenseNumber: z.string().min(1, "License number is required"),
  licenseCategory: z.string().min(1, "License category is required"),
  yearsOfExperience: z.string().min(1, "Years of experience is required"),
  availableFrom: z.preprocess(
    (val) => {
      if (typeof val === "string") {
        return new Date(val);
      }
      if (val instanceof Date) {
        return val;
      }
      return new Date(); // fallback to current date
    },
    z.date({
      required_error: "A date is required.",
    })
  ),
  interestReason: z.string().min(10, "This field is required"),
});

export type JobApplicationSchema = z.infer<typeof jobApplicationSchema>;
