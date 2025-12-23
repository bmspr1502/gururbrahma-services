"use server";

import { db } from "@/firebase/server";
import { revalidatePath } from "next/cache";

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
      createdAt: new Date(),
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
      createdAt: new Date(),
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
