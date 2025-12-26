"use server";

import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { initializeApp, getApps } from "firebase/app";
import { firebaseConfig } from "@/firebase/config";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth as adminAuth } from "@/firebase/server";

// Initialize Client SDK on the server for login purposes
const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const clientAuth = getAuth(app);

export async function login(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const userCredential = await signInWithEmailAndPassword(
      clientAuth,
      email,
      password
    );
    const idToken = await userCredential.user.getIdToken();

    // Create a session cookie
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn,
    });

    (await cookies()).set("__session", sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    // Clean up old idToken cookie if it exists
    (await cookies()).delete("idToken");

    revalidatePath("/admin");
  } catch (error: any) {
    console.error("Login Error:", error);
    return {
      error:
        "Log in failed. Please check your credentials or contact the owner for access.",
    };
  }

  // Redirect outside try-catch to avoid next.js redirect error being caught
  redirect("/admin/dashboard");
}

export async function logout() {
  (await cookies()).delete("__session");
  (await cookies()).delete("idToken");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function generateCustomToken() {
  const session = (await cookies()).get("__session")?.value;
  if (!session) {
    console.log("[Auth] No session cookie found for custom token generation.");
    return { success: false, error: "No session cookie found" };
  }

  try {
    const decodedClaims = await adminAuth.verifySessionCookie(session, true);
    console.log("[Auth] Session verified for UID:", decodedClaims.uid);

    try {
      const customToken = await adminAuth.createCustomToken(decodedClaims.uid);
      console.log(
        "[Auth] Custom token created successfully for UID:",
        decodedClaims.uid
      );
      return { success: true, token: customToken };
    } catch (tokenError: any) {
      console.error(
        "[Auth] Error creating custom token (Admin SDK):",
        tokenError.code || "unknown_code",
        tokenError.message || tokenError
      );

      let errorMsg = tokenError.message || "Failed to create custom token";
      if (
        tokenError.code === "auth/insufficient-permission" ||
        errorMsg.includes("signBlob")
      ) {
        errorMsg =
          "PERMISSION_DENIED: Service account needs 'Service Account Token Creator' role.";
        console.error(
          "[Auth] HINT: The service account may need 'Service Account Token Creator' role in Google Cloud Console."
        );
      }

      return { success: false, error: errorMsg, code: tokenError.code };
    }
  } catch (error: any) {
    console.error(
      "[Auth] Error verifying session cookie:",
      error.code || "unknown_code",
      error.message || error
    );
    return {
      success: false,
      error: "Session verification failed",
      code: error.code,
    };
  }
}
