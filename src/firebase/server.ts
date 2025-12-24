import { initializeApp, getApp, getApps, cert, App } from "firebase-admin/app";
import { getAuth, Auth } from "firebase-admin/auth";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import { getServiceAccount } from "./service-account";

// Initialize Firebase Admin
let adminApp: App;

if (getApps().length > 0) {
  // Use the existing app (likely pre-initialized by Cloud Run / Frameworks)
  adminApp = getApps()[0];
  console.log(`[Firebase Admin] Using existing app: ${adminApp.name}`);
} else {
  const serviceAccount = getServiceAccount();

  if (serviceAccount) {
    try {
      console.log("Initializing Firebase Admin with Service Account");
      adminApp = initializeApp({
        credential: cert(serviceAccount),
      });
    } catch (error) {
      console.error(
        "Failed to initialize with Service Account. Falling back to default.",
        error
      );
      // Fallback if the specific credential fails
      adminApp = initializeApp();
    }
  } else {
    // This will use Application Default Credentials on Google Cloud.
    console.log("Initializing Firebase Admin with Default Credentials");
    adminApp = initializeApp();
  }
}

export const auth = getAuth(adminApp);
export const db = getFirestore(adminApp);
