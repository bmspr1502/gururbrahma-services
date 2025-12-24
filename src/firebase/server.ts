
import { initializeApp, getApp, getApps, cert, App } from "firebase-admin/app";
import { getAuth, Auth } from "firebase-admin/auth";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import { getServiceAccount } from "./service-account";

let adminApp: App | undefined;

if (getApps().length === 0) {
  try {
    const serviceAccount = getServiceAccount();
    // In a deployed Firebase environment (like Cloud Run for App Hosting),
    // default credentials may be available.
    if (serviceAccount) {
      console.log("Initializing Firebase Admin with Service Account");
      adminApp = initializeApp({
        credential: cert(serviceAccount),
      });
    } else {
      // This will use Application Default Credentials on Google Cloud.
      console.log("Initializing Firebase Admin with Default Credentials");
      adminApp = initializeApp();
    }
  } catch (error) {
    console.error("Firebase Admin initialization error:", error);
    // If initialization fails, adminApp will remain undefined.
  }
} else {
  adminApp = getApp();
}

// Lazy-initialized instances. This prevents calls from happening at module load time.
let authInstance: Auth;
let dbInstance: Firestore;

if (adminApp) {
  authInstance = getAuth(adminApp);
  dbInstance = getFirestore(adminApp);
} else {
  // If adminApp is not initialized, we create placeholder objects.
  // This prevents the app from crashing but logs a stern warning.
  // Any attempt to use these will likely fail, but it won't crash on import.
  console.warn(
    "CRITICAL: Firebase Admin SDK not initialized. Server-side Firebase features will not work. Ensure service account credentials are set in your environment."
  );
  authInstance = {} as Auth;
  dbInstance = {} as Firestore;
}

export const auth = authInstance;
export const db = dbInstance;
