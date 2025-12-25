"use client";

import { useEffect } from "react";
import { getAnalytics, isSupported } from "firebase/analytics";
import { initializeFirebase } from "@/firebase";

export function Analytics() {
  useEffect(() => {
    const initAnalytics = async () => {
      // Check if Analytics is supported (environment check)
      const supported = await isSupported();
      if (supported) {
        // Initialize Firebase app if not already
        const { firebaseApp } = initializeFirebase();
        // Initialize Analytics
        getAnalytics(firebaseApp);
        console.log("Firebase Analytics initialized");
      }
    };

    initAnalytics();
  }, []);

  return null;
}
