import { initializeApp, getApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getServiceAccount } from './service-account';

const apps = getApps();

if (!apps.length) {
  initializeApp({
    credential: cert(getServiceAccount()),
  });
}

const adminApp = getApp();

export const auth = getAuth(adminApp);
export const db = getFirestore(adminApp);
