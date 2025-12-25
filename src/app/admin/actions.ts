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

    cookies().set("__session", sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    });

    // Clean up old idToken cookie if it exists
    cookies().delete("idToken");

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
  cookies().delete("__session");
  cookies().delete("idToken");
  revalidatePath("/admin");
  redirect("/admin");
}
