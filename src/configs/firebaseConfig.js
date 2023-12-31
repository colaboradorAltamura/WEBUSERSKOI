/* eslint-disable no-console */

import {
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID,
  FIREBASE_MEASURAMENT_ID,
  ENVIRONMENT,
} from 'src/configs/appConfig';

console.log('NODE_ENV: ', process.env.NODE_ENV, 'ENVIRONMENT: ', ENVIRONMENT, 'PROJECT_ID:', FIREBASE_PROJECT_ID);

const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
  measurementId: FIREBASE_MEASURAMENT_ID,
};

export const FirebaseConfig = firebaseConfig;
