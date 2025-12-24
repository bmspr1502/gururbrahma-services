"use server";

import { db } from "@/firebase/server";
import { revalidatePath } from "next/cache";

// Inquiry Actions
export async function getInquiries() {
  try {
    const snapshot = await db
      .collection("inquiries")
      .orderBy("createdAt", "desc")
      .get();
    const inquiries = snapshot.docs.map((doc: any) => {
      const data = doc.data();
      // Manual serialization for simple fields, helper would be better but keeping it self-contained
      return {
        id: doc.id,
        ...data,
        // Ensure Dates are serializable numbers or ISO strings for client
        createdAt: data.createdAt?.toDate
          ? data.createdAt.toDate()
          : new Date(),
        preferredDate: data.preferredDate?.toDate
          ? data.preferredDate.toDate()
          : null,
      };
    });
    return { success: true, data: inquiries };
  } catch (error) {
    console.error("Error fetching inquiries:", error);
    return { success: false, error: "Failed to fetch inquiries." };
  }
}

// Notification Actions
export async function updateHomeNotification(
  title: string,
  message: string,
  active: boolean
) {
  try {
    await db.collection("site-content").doc("home-notification").set({
      title,
      message,
      active,
      updatedAt: new Date(),
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error updating notification:", error);
    return { success: false, error: "Failed to update notification." };
  }
}

export async function getHomeNotification() {
  try {
    const doc = await db
      .collection("site-content")
      .doc("home-notification")
      .get();
    if (doc.exists) {
      const data = doc.data();
      return {
        success: true,
        data: {
          ...data,
          updatedAt: data?.updatedAt?.toDate ? data.updatedAt.toDate() : null,
        },
      };
    }
    return { success: true, data: null };
  } catch (error) {
    console.error("Error fetching notification:", error);
    return { success: false, error: "Failed to fetch notification settings." };
  }
}

// Video Actions
export async function addVideo(
  youtubeUrl: string,
  title: string,
  type: "short" | "video"
) {
  try {
    await db.collection("videos").add({
      youtubeUrl,
      title,
      type,
      timestamp: new Date(),
    });
    revalidatePath("/video");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error adding video:", error);
    return { success: false, error: "Failed to add video." };
  }
}

export async function deleteVideo(id: string) {
  try {
    await db.collection("videos").doc(id).delete();
    revalidatePath("/video");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting video:", error);
    return { success: false, error: "Failed to delete video." };
  }
}

// Post Actions
export async function addPost(
  title: string,
  content: string,
  tags: string[],
  imageUrl: string
) {
  try {
    await db.collection("posts").add({
      title,
      content,
      tags,
      imageUrl,
      timestamp: new Date(),
    });
    revalidatePath("/posts");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error adding post:", error);
    return { success: false, error: "Failed to add post." };
  }
}

export async function deletePost(id: string) {
  try {
    await db.collection("posts").doc(id).delete();
    revalidatePath("/posts");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting post:", error);
    return { success: false, error: "Failed to delete post." };
  }
}
