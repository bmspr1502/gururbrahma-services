import { initializeApp, getApp, getApps, cert, App } from "firebase-admin/app";
import { getAuth, Auth } from "firebase-admin/auth";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import { getServiceAccount } from "./service-account";

// Initialize Firebase Admin
let adminApp: App;

if (getApps().length > 0) {
  adminApp = getApps()[0];
  console.log(`[Firebase Admin] Using existing app: ${adminApp.name}`);
} else {
  const serviceAccount = getServiceAccount();

  // In production (App Hosting / Cloud Run), we prefer Application Default Credentials (ADC)
  // as recommended by Firebase documentation.
  if (process.env.NODE_ENV === "production" && !serviceAccount) {
    console.log(
      "[Firebase Admin] Initializing with Application Default Credentials (ADC)"
    );
    adminApp = initializeApp();
  } else if (serviceAccount) {
    // Local development or explicit Service Account override
    try {
      console.log(
        "[Firebase Admin] Initializing with Service Account Credentials"
      );
      adminApp = initializeApp({
        credential: cert(serviceAccount),
      });
    } catch (error) {
      console.error(
        "[Firebase Admin] Failed to initialize with Service Account. Falling back to default.",
        error
      );
      adminApp = initializeApp();
    }
  } else {
    // Fallback for other environments
    console.log("[Firebase Admin] Initializing with default settings");
    adminApp = initializeApp();
  }
}

export const auth = getAuth(adminApp);
export const db = getFirestore(adminApp);
