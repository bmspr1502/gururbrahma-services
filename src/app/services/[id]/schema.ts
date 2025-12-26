import { z } from "zod";

export const FormSchema = z.object({
  serviceId: z.string(),
  serviceName: z.string(),
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  preferredDate: z.date({
    required_error: "A preferred date is required.",
  }),
  preferredTime: z
    .string()
    .min(1, { message: "A preferred time is required." }),
  description: z.string().optional(),
  rashiNakshatra: z.string().optional(),
  language: z.enum(["en", "ta"]),
});
