// Firebase Configuration
// =====================
// TO SET UP:
// 1. Go to https://console.firebase.google.com
// 2. Click "Create a project" → name it (e.g. "qr-menu")
// 3. Go to Project Settings (gear icon) → scroll to "Your apps" → click Web (</>)
// 4. Register app → copy the firebaseConfig object below
// 5. Go to Firestore Database → Create database → Start in TEST MODE
// 6. Replace the config below with your values

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.firebasestorage.app",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

let db = null;

export function initFirebase() {
  if (typeof firebase === 'undefined') {
    console.warn('Firebase SDK not loaded');
    return false;
  }
  if (firebaseConfig.apiKey === 'YOUR_API_KEY') {
    console.warn('Firebase not configured — reviews will use local data only. See js/firebase-config.js');
    return false;
  }
  try {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    return true;
  } catch (e) {
    console.warn('Firebase init failed:', e.message);
    return false;
  }
}

export function getDb() {
  return db;
}