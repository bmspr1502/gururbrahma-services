"use server";

import { db } from "@/firebase/server";
import { Post, Video } from "@/lib/types";
import { serializeFirestoreData } from "@/lib/utils";

const PAGE_SIZE = 10;

export async function getPosts({
  cursor,
  tag,
}: {
  cursor?: string | number; // ISO string or timestamp
  tag?: string;
}) {
  try {
    let query = db.collection("posts").orderBy("timestamp", "desc");

    if (tag) {
      query = query.where("tags", "array-contains", tag);
    }

    if (cursor) {
      const dateCursor = new Date(cursor);
      query = query.startAfter(dateCursor);
    }

    const snapshot = await query.limit(PAGE_SIZE).get();

    const posts = snapshot.docs.map((doc: any) => {
      const data = serializeFirestoreData(doc.data());
      return { id: doc.id, ...data } as Post;
    });

    const lastDoc = posts[posts.length - 1];
    const nextCursor = lastDoc
      ? typeof lastDoc.timestamp === "string"
        ? lastDoc.timestamp
        : lastDoc.timestamp.toISOString()
      : null;

    return {
      success: true,
      data: posts,
      nextCursor,
      hasMore: posts.length === PAGE_SIZE,
    };
  } catch (error) {
    console.error("Error fetching posts:", error);
    return { success: false, error: "Failed to fetch posts" };
  }
}

export async function getVideos({
  cursor,
  tag,
  type,
}: {
  cursor?: string | number; // ISO string or timestamp
  tag?: string;
  type?: "short" | "video" | "playlist";
}) {
  try {
    let query = db.collection("videos").orderBy("timestamp", "desc");

    if (tag) {
      query = query.where("tags", "array-contains", tag);
    }

    if (type) {
      query = query.where("type", "==", type);
    }

    if (cursor) {
      const dateCursor = new Date(cursor);
      query = query.startAfter(dateCursor);
    }

    const snapshot = await query.limit(PAGE_SIZE).get();

    const videos = snapshot.docs.map((doc: any) => {
      const data = serializeFirestoreData(doc.data());
      return { id: doc.id, ...data } as Video;
    });

    const lastDoc = videos[videos.length - 1];
    const nextCursor = lastDoc
      ? typeof lastDoc.timestamp === "string"
        ? lastDoc.timestamp
        : lastDoc.timestamp.toISOString()
      : null;

    return {
      success: true,
      data: videos,
      nextCursor,
      hasMore: videos.length === PAGE_SIZE,
    };
  } catch (error) {
    console.error("Error fetching videos:", error);
    return { success: false, error: "Failed to fetch videos" };
  }
}
