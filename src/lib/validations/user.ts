import { z } from "zod";

export const userSchema = z.object({
  firstname: z.string().min(1, "First name is required").max(255),
  lastname: z.string().min(1, "Last name is required").max(255),
  birthdate: z.string().min(1, "Birth date is required"),
  street: z.string().min(1, "Street is required").max(255),
  city: z.string().min(1, "City is required").max(255),
  province: z.string().min(1, "Province is required").max(255),
  postal_code: z.string().min(1, "Postal code is required").max(10),
});

export type UserInput = z.infer<typeof userSchema>;
