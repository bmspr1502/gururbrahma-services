'use server';

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from '@/firebase/server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const idToken = await userCredential.user.getIdToken();
    cookies().set('idToken', idToken, { secure: true, httpOnly: true });
    revalidatePath('/admin');
  } catch (error: any) {
    console.error('Login Error:', error);
    if (error.code === 'auth/user-not-found') {
      // For simplicity, we'll create the user if they don't exist.
      // In a real app, you might want to handle this differently.
      try {
        const newUserCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const idToken = await newUserCredential.user.getIdToken();
        cookies().set('idToken', idToken, { secure: true, httpOnly: true });
        revalidatePath('/admin');
      } catch (createError: any) {
        return { error: createError.message };
      }
    } else {
      return { error: error.message };
    }
  }
}

export async function logout() {
  cookies().delete('idToken');
  revalidatePath('/admin');
}
