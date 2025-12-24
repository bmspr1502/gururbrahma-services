import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function serializeFirestoreData(data: any): any {
  if (data === null || data === undefined) return data;

  // Handle Dates (already serialized or standard JS Dates)
  if (data instanceof Date) return data;

  // Handle arrays
  if (Array.isArray(data)) {
    return data.map((item) => serializeFirestoreData(item));
  }

  // Handle objects
  if (typeof data === "object") {
    // Check for Firestore Timestamp (Standard method for both Admin and Client SDKs)
    if (typeof data.toDate === "function") {
      return data.toDate();
    }

    // Check for Timestamp properties if already plain object
    if ("_seconds" in data && "_nanoseconds" in data) {
      return new Date(data._seconds * 1000);
    }

    // Check for other non-plain objects or just recurse
    const serialized: any = {};
    for (const key in data) {
      serialized[key] = serializeFirestoreData(data[key]);
    }
    return serialized;
  }

  return data;
}
