"use server";

import { z } from "zod";
import { db } from "@/firebase/server";
import { FormSchema } from "./schema";

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
      timestamp: new Date(),
    };

    await db.collection("inquiries").add(inquiryData);

    console.log("New Service Inquiry Saved to Firestore:", inquiryData);

    return { success: true };
  } catch (error) {
    console.error("Error processing service request:", error);
    return { success: false, message: "An unexpected error occurred." };
  }
}
