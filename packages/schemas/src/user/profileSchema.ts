// schemas/profileSchema.ts
import { z } from "zod";

export const profileUpdateSchema = z.object({
  email: z.string().email("Invalid email address"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  avatar: z.string().min(1, "Avatar URL is required"),
});

export type ProfileUpdateFormValues = z.infer<typeof profileUpdateSchema>;
