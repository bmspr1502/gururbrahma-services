import type { ServiceAccount } from "firebase-admin/app";

// This function now reads from environment variables
// to construct the service account object securely.
export function getServiceAccount(): ServiceAccount | null {
  const privateKey = process.env.FB_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (
    !process.env.FB_PROJECT_ID ||
    !process.env.FB_CLIENT_EMAIL ||
    !privateKey
  ) {
    console.warn(
      "Firebase server environment variables are not set. Admin features will not work. Please set them in your .env.local file."
    );
    return null;
  }

  return {
    projectId: process.env.FB_PROJECT_ID,
    clientEmail: process.env.FB_CLIENT_EMAIL,
    privateKey: privateKey,
  };
}
