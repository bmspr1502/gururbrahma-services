"use server";

import { z } from "zod";
import { db } from "@/firebase/server";
import { FormSchema } from "./schema";
import { sendNewEnquiryEmail } from "@/lib/emails";

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
      status: "open",
      timestamp: new Date(),
    };

    const docRef = await db.collection("inquiries").add(inquiryData);

    // Send background emails
    try {
      await sendNewEnquiryEmail(inquiryData);
    } catch (emailError) {
      console.error("Failed to send notification emails:", emailError);
    }

    console.log(
      "New Service Inquiry Saved to Firestore (ID:",
      docRef.id,
      "):",
      inquiryData
    );

    return { success: true };
  } catch (error) {
    console.error("Error processing service request:", error);
    return { success: false, message: "An unexpected error occurred." };
  }
}
