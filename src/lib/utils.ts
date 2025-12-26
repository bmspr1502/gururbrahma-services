import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function serializeFirestoreData(data: any): any {
  if (data === null || data === undefined) return data;

  // Handle Dates & Timestamps - convert to ISO string
  if (data instanceof Date) return data.toISOString();
  if (typeof data.toDate === "function") return data.toDate().toISOString();

  // Handle arrays
  if (Array.isArray(data)) {
    return data.map((item) => serializeFirestoreData(item));
  }

  // Handle objects
  if (typeof data === "object") {
    // Check for Timestamp properties from JSON representation
    if ("_seconds" in data && "_nanoseconds" in data) {
      return new Date(data._seconds * 1000).toISOString();
    }

    // Only serialize plain objects
    // Using a more robust check for plain objects
    const isPlainObject =
      data.constructor === Object || data.constructor === undefined;

    if (isPlainObject) {
      const serialized: any = {};
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          serialized[key] = serializeFirestoreData(data[key]);
        }
      }
      return serialized;
    }

    // If it's not a plain object, try to convert to string to avoid serialization errors
    return String(data);
  }

  // Return primitives (string, number, boolean) as is
  return data;
}
