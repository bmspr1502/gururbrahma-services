"use server";

import { z } from "zod";
import { db } from "@/firebase/server";

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

type RequestServiceResult = {
  success: boolean;
  message?: string;
};

export async function requestServiceAction(
  data: z.infer<typeof FormSchema>
): Promise<RequestServiceResult> {
  const validationResult = FormSchema.safeParse(data);
  if (!validationResult.success) {
    return { success: false, message: "Invalid form data." };
  }

  try {
    const inquiryData = {
      ...validationResult.data,
      status: "new",
      createdAt: new Date(),
    };

    await db.collection("inquiries").add(inquiryData);

    console.log("New Service Inquiry Saved to Firestore:", inquiryData);

    return { success: true };
  } catch (error) {
    console.error("Error processing service request:", error);
    return { success: false, message: "An unexpected error occurred." };
  }
}
