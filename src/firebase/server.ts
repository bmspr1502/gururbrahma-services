import { initializeApp, getApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getServiceAccount } from "./service-account";

const serviceAccount = getServiceAccount();

if (serviceAccount && !getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}

const adminApp = getApps().length > 0 ? getApp() : null;

export const auth = adminApp
  ? getAuth(adminApp)
  : ({
      verifyIdToken: async () => {
        throw new Error(
          "Firebase Admin SDK not initialized: missing credentials"
        );
      },
    } as any);

export const db = adminApp
  ? getFirestore(adminApp)
  : ({
      collection: () => {
        throw new Error(
          "Firebase Admin SDK not initialized: missing credentials"
        );
      },
    } as any);
