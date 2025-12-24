import { z } from "zod";

export const FormSchema = z.object({
  serviceId: z.string(),
  serviceName: z.string(),
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  preferredDate: z.date({
    required_error: "A preferred date is required.",
  }),
  rashiNakshatra: z.string().optional(),
});
