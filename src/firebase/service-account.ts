
import type { ServiceAccount } from 'firebase-admin/app';

// This function now reads from environment variables
// to construct the service account object securely.
export function getServiceAccount(): ServiceAccount {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (
    !process.env.FIREBASE_PROJECT_ID ||
    !process.env.FIREBASE_CLIENT_EMAIL ||
    !privateKey
  ) {
    console.warn(
      'Firebase server environment variables are not set. Admin features will not work. Please set them in your .env.local file.'
    );
    // Return a dummy service account to avoid crashing the server.
    // This allows the rest of the app to function during development.
    return {
      projectId: 'your-project-id',
      clientEmail: 'your-client-email@example.com',
      privateKey: 'your-private-key',
    };
  }

  return {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: privateKey,
  };
}
