"use server";

import { db } from "@/firebase/server";
import { revalidatePath } from "next/cache";
import { sendStatusUpdateEmail, sendScheduleUpdateEmail } from "@/lib/emails";
import { serializeFirestoreData } from "@/lib/utils";

// Inquiry Actions
export async function getInquiries(showClosed = false) {
  try {
    let query = db.collection("inquiries").orderBy("timestamp", "desc");

    if (!showClosed) {
      // By default show open and confirmed, but not completed
      query = db
        .collection("inquiries")
        .where("status", "in", ["open", "confirmed"])
        .orderBy("timestamp", "desc");
    }

    const snapshot = await query.get();
    const inquiries = snapshot.docs.map((doc: any) => {
      const data = serializeFirestoreData(doc.data());
      return {
        id: doc.id,
        ...data,
      };
    });
    return { success: true, data: inquiries };
  } catch (error) {
    console.error("Error fetching inquiries:", error);
    return { success: false, error: "Failed to fetch inquiries." };
  }
}

export async function updateInquiryStatus(
  id: string,
  status: "open" | "confirmed" | "completed"
) {
  try {
    const docRef = db.collection("inquiries").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) throw new Error("Inquiry not found");

    const oldData = doc.data();
    await docRef.update({ status, updatedAt: new Date() });

    // Send email if status changed to confirmed
    if (status === "confirmed" && oldData?.status !== "confirmed") {
      const fullData = {
        ...oldData,
        status,
        preferredDate: oldData?.preferredDate?.toDate
          ? oldData.preferredDate.toDate()
          : null,
      };
      await sendStatusUpdateEmail(fullData, status);
    }

    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error updating inquiry status:", error);
    return { success: false, error: "Failed to update status." };
  }
}

export async function updateInquirySchedule(
  id: string,
  date: Date,
  time: string
) {
  try {
    const docRef = db.collection("inquiries").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) throw new Error("Inquiry not found");

    const oldData = doc.data();
    await docRef.update({
      preferredDate: date,
      preferredTime: time,
      updatedAt: new Date(),
    });

    // Send email about schedule change
    const fullData = {
      ...oldData,
      preferredDate: date,
      preferredTime: time,
    };
    await sendScheduleUpdateEmail(fullData);

    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error updating inquiry schedule:", error);
    return { success: false, error: "Failed to update schedule." };
  }
}

export async function deleteInquiry(id: string) {
  try {
    await db.collection("inquiries").doc(id).delete();
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error deleting inquiry:", error);
    return { success: false, error: "Failed to delete inquiry." };
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
      const data = serializeFirestoreData(doc.data());
      return {
        success: true,
        data,
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
  type: "short" | "video" | "playlist",
  description: string = "",
  thumbnailUrl: string = "",
  tags: string[] = []
) {
  try {
    await db.collection("videos").add({
      youtubeUrl,
      title,
      type,
      description,
      thumbnailUrl,
      tags,
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

export async function updateVideo(
  id: string,
  youtubeUrl: string,
  title: string,
  type: "short" | "video" | "playlist",
  description: string,
  thumbnailUrl: string = "",
  tags: string[] = []
) {
  try {
    await db.collection("videos").doc(id).update({
      youtubeUrl,
      title,
      type,
      description,
      thumbnailUrl,
      tags,
      updatedAt: new Date(),
    });
    revalidatePath("/video");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error updating video:", error);
    return { success: false, error: "Failed to update video." };
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
  imageUrl: string,
  images: string[] = [],
  documents: { name: string; url: string }[] = []
) {
  try {
    await db.collection("posts").add({
      title,
      content,
      tags,
      imageUrl,
      images,
      documents,
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

export async function updatePost(
  id: string,
  title: string,
  content: string,
  tags: string[],
  imageUrl: string,
  images: string[] = [],
  documents: { name: string; url: string }[] = []
) {
  try {
    await db.collection("posts").doc(id).update({
      title,
      content,
      tags,
      imageUrl,
      images,
      documents,
      updatedAt: new Date(),
    });
    revalidatePath("/posts");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error updating post:", error);
    return { success: false, error: "Failed to update post." };
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
