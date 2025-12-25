import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function serializeFirestoreData(data: any): any {
  if (data === null || data === undefined) return data;

  // Handle Dates - convert to ISO string for absolute serialization safety in Next.js 15
  if (data instanceof Date) return data.toISOString();

  // Handle arrays
  if (Array.isArray(data)) {
    return data.map((item) => serializeFirestoreData(item));
  }

  // Handle objects
  if (typeof data === "object") {
    // Check for Firestore Timestamp
    if (typeof data.toDate === "function") {
      return data.toDate().toISOString();
    }

    // Check for Timestamp properties if already plain object
    if ("_seconds" in data && "_nanoseconds" in data) {
      return new Date(data._seconds * 1000).toISOString();
    }

    // Only recurse into plain objects to avoid issues with complex classes/references
    if (data.constructor === Object) {
      const serialized: any = {};
      for (const key in data) {
        serialized[key] = serializeFirestoreData(data[key]);
      }
      return serialized;
    }
  }

  return data;
}
