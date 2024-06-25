import { z } from "zod";

export const landingFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  fullName: z
    .string()
    .min(2, { message: "Full name must be at least 2 characters long" }),
  phone: z
    .string()
    .min(10, { message: "Phone number must be at least 10 characters long" }),
  country: z
    .string()
    .min(2, { message: "Country name must be at least 2 characters long" }),
  age: z.number().min(10, { message: "You must be at least 18 years old" }),
  twitterUsername: z
    .string()
    .min(3, { message: "Twitter username is required" }),
});
