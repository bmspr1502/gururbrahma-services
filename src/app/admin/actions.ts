"use server";

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  getAuth,
} from "firebase/auth";
import { initializeApp, getApps } from "firebase/app";
import { firebaseConfig } from "@/firebase/config";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

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
    (await cookies()).set("idToken", idToken, { secure: true, httpOnly: true });
    revalidatePath("/admin");
  } catch (error: any) {
    console.error("Login Error:", error);
    if (error.code === "auth/user-not-found") {
      // For simplicity, we'll create the user if they don't exist.
      // In a real app, you might want to handle this differently.
      try {
        const newUserCredential = await createUserWithEmailAndPassword(
          clientAuth,
          email,
          password
        );
        const idToken = await newUserCredential.user.getIdToken();
        (await cookies()).set("idToken", idToken, {
          secure: true,
          httpOnly: true,
        });
        revalidatePath("/admin");
      } catch (createError: any) {
        return { error: createError.message };
      }
    } else {
      return { error: error.message };
    }
  }
}

export async function logout() {
  (await cookies()).delete("idToken");
  revalidatePath("/admin");
}
