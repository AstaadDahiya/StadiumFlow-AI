// Firebase Configuration & Services
import { initializeApp } from 'firebase/app';
import { getAnalytics, logEvent } from 'firebase/analytics';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyD6SW1AxgJfO8u1tO4iRqLLq8gguR2gExk",
  authDomain: "stadiumflow-ai-34106.firebaseapp.com",
  projectId: "stadiumflow-ai-34106",
  storageBucket: "stadiumflow-ai-34106.firebasestorage.app",
  messagingSenderId: "634059504224",
  appId: "1:634059504224:web:281da3421fa98585ca2105",
  measurementId: "G-W7VKPGGD0R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Track page views
logEvent(analytics, 'page_view', { page_title: 'StadiumFlow App' });

/**
 * Signs in using Google popup via Firebase Auth
 * @returns {Promise<import('firebase/auth').User>}
 */
export async function signInWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  logEvent(analytics, 'login', { method: 'google' });
  return result.user;
}

/**
 * Signs in with email/password (mock — Firebase Auth supports this but
 * requires email/password auth to be enabled in Console)
 */
export function signInMock() {
  logEvent(analytics, 'login', { method: 'email' });
}

/**
 * Listen for auth state changes
 * @param {function} callback
 */
export function onAuthChange(callback) {
  onAuthStateChanged(auth, callback);
}

/**
 * Log a custom analytics event
 * @param {string} eventName
 * @param {object} params
 */
export function trackEvent(eventName, params = {}) {
  logEvent(analytics, eventName, params);
}

export { auth, analytics };
