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
  linkedinUsername: z
    .string()
    .min(3, { message: "Linkedin username is required" }),
  facebookUsername: z
    .string()
    .min(3, { message: "Facebook username is required" }),
  instagramUsername: z
    .string()
    .min(3, { message: "Instagram username is required" }),
  youtubeUsername: z
    .string()
    .min(3, { message: "Youtube username is required" }),
  linkedinUrl: z.string().min(3, { message: "Linkedin url is required" }),
  programs: z.enum([
    "AI in Data Analytics",
    "AI in Business Analytics",
    "AI in Virtual Assistant",
    "AI in Education",
    "AI in Content creation",
    "AI in Digital Marketing",
    "AI in IT support",
    "AI in Community Management",
    "AI in Program management",
  ]),
});
export const paidLandingFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  fullName: z
    .string()
    .min(2, { message: "Full name must be at least 2 characters long" }),
  programs: z.enum([
    "Education",
    "Digital marketing and content creation",
    "Data/Business analytics",
  ]),
});
