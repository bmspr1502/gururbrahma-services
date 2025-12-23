"use server";

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
    // In a real application, you would do the following:
    // 1. Save the inquiry to the Firestore 'inquiries' collection.
    //    const db = getFirestore();
    //    await addDoc(collection(db, "inquiries"), {
    //      ...validationResult.data,
    //      status: 'new',
    //      dateRequested: new Date(),
    //    });

    // 2. Trigger an email notification to the admin.
    //    This could be a call to an Express route with nodemailer,
    //    or using a Firebase Extension like "Trigger Email".

    console.log("New Service Inquiry Received:");
    console.log(validationResult.data);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return { success: true };
    
  } catch (error) {
    console.error("Error processing service request:", error);
    return { success: false, message: "An unexpected error occurred." };
  }
}
