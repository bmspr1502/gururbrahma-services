import { initializeApp, getApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getServiceAccount } from "./service-account";

// Initialize Firebase Admin
let adminApp;
if (getApps().length === 0) {
  try {
    const serviceAccount = getServiceAccount();
    if (serviceAccount) {
      console.log("Initializing Firebase Admin with Service Account");
      adminApp = initializeApp({
        credential: cert(serviceAccount),
      });
    } else {
      console.log("Initializing Firebase Admin with Default Credentials");
      adminApp = initializeApp();
    }
  } catch (error) {
    console.error("Firebase Admin initialization error:", error);
  }
} else {
  adminApp = getApp();
}

export const auth = getAuth();
export const db = getFirestore();
