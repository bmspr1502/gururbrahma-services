"use client";

import { useEffect } from "react";
import { getAuth, signInWithCustomToken } from "firebase/auth";
import { initializeFirebase } from "@/firebase";
import { generateCustomToken } from "@/app/admin/actions";

export function AuthSync() {
  useEffect(() => {
    const syncAuth = async () => {
      const { firebaseApp } = initializeFirebase();
      const auth = getAuth(firebaseApp);

      // Only sign in if not already signed in
      if (!auth.currentUser) {
        const token = await generateCustomToken();
        if (token) {
          try {
            await signInWithCustomToken(auth, token);
            console.log("Client SDK authenticated via session cookie.");
          } catch (error) {
            console.error("Failed to sync client auth:", error);
          }
        }
      }
    };

    syncAuth();
  }, []);

  return null;
}
