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
        console.log("[AuthSync] Attempting to sync client auth...");
        const token = await generateCustomToken();
        if (token) {
          try {
            await signInWithCustomToken(auth, token);
            console.log("[AuthSync] Client SDK authenticated successfully.");
          } catch (error) {
            console.error("[AuthSync] Failed to sign in with custom token:", error);
          }
        } else {
          console.warn("[AuthSync] No custom token received from server.");
        }
      } else {
        console.log("[AuthSync] Client SDK already authenticated as:", auth.currentUser.uid);
      }
    };

    syncAuth();
  }, []);

  return null;
}
