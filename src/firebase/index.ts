"use client";

import { firebaseConfig } from "@/firebase/config";
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase() {
  const apps = getApps();
  if (apps.length > 0) {
    return getSdks(apps[0]);
  }

  let firebaseApp: FirebaseApp;

  try {
    // Attempt to initialize via Firebase App Hosting environment variables
    firebaseApp = initializeApp();
  } catch (e: any) {
    // Only warn in production if not using automatic init
    if (process.env.NODE_ENV === "production" && !firebaseConfig.apiKey) {
      console.warn(
        "Automatic initialization failed and firebaseConfig is incomplete.",
        e
      );
    }

    firebaseApp = initializeApp(firebaseConfig);
  }

  return getSdks(firebaseApp);
}

export function getSdks(firebaseApp: FirebaseApp) {
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp),
  };
}

export * from "./provider";
export * from "./client-provider";
export * from "./firestore/use-collection";
export * from "./firestore/use-doc";
export * from "./non-blocking-updates";
export * from "./non-blocking-login";
export * from "./errors";
export * from "./error-emitter";
