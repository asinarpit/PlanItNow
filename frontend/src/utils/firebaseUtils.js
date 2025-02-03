// src/utils/firebase.js

import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";


// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Function to get device token
export const getDeviceToken = async () => {
  try {
    // Check if notifications are allowed
    if (Notification.permission === "denied") {
      alert(
        "You have blocked notifications. Please enable them in your browser settings."
      );
      throw new Error(
        "Notification permission was denied. Please enable notifications in your browser settings."
      );
    }

    // If permission is not granted yet, request permission
    if (Notification.permission !== "granted") {
      await Notification.requestPermission();
    }

    // Get device token from Firebase Messaging
    const token = await getToken(messaging, { vapidKey });

    if (token) {
      console.log("Device Token:", token);
      return token;
    } else {
      throw new Error("Failed to get device token.");
    }
  } catch (error) {
    console.error("Error getting device token:", error);
    throw error;
  }
};

// Handle incoming messages (foreground)
export const handleIncomingMessages = () => {
  onMessage(messaging, (payload) => {
    console.log("Message received. ", payload);
  });
};
