// Import Firebase messaging library
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');

// Firebase config (this should match your Firebase config from the frontend)
const firebaseConfig = {
    apiKey: "AIzaSyAfl8j5xb0RqwhCkRkMKTH15lLBLph-chw",
    authDomain: "planitnow-b4d28.firebaseapp.com",
    projectId: "planitnow-b4d28",
    storageBucket: "planitnow-b4d28.firebasestorage.app",
    messagingSenderId: "325191436559",
    appId: "1:325191436559:web:f96678d0abb2edd2c7967a",
    measurementId: "G-FW9S9F8DEM"
  };

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Background message handler
messaging.onBackgroundMessage(function(payload) {
  console.log("Received background message ", payload);
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
