importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyDGVOxs3F9miqLJHlnIZn5luEVJ0p1zyUA',
  authDomain: 'insurance-world-1152a.firebaseapp.com',
  projectId: 'insurance-world-1152a',
  storageBucket: 'insurance-world-1152a.firebasestorage.app',
  messagingSenderId: '741478189733',
  appId: '1:741478189733:web:23527bffcef37ff7d1db4c',
  measurementId: 'G-335XFZ8WL7',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  // Broadcast the message to the main thread
  const channel = new BroadcastChannel('fcm_notifications');
  channel.postMessage(payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/favicon.ico',
    data: payload.data,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
