/**
 * @fileoverview Firebase configuration and service initialization.
 * Lazy-loads Firebase SDK modules to minimize initial bundle impact.
 * @module firebase
 */

/** @type {object|null} Cached Firebase app instance */
let firebaseApp = null;
/** @type {object|null} Cached Firebase Auth instance */
let firebaseAuth = null;
/** @type {object|null} Cached Firebase Analytics instance */
let firebaseAnalytics = null;

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyD6SW1AxgJfO8u1tO4iRqLLq8gguR2gExk",
  authDomain: "stadiumflow-ai-34106.firebaseapp.com",
  projectId: "stadiumflow-ai-34106",
  storageBucket: "stadiumflow-ai-34106.firebasestorage.app",
  messagingSenderId: "634059504224",
  appId: "1:634059504224:web:281da3421fa98585ca2105",
  measurementId: "G-W7VKPGGD0R"
};

/**
 * Lazily initializes and returns the Firebase app instance.
 * Only loads the Firebase SDK when actually needed, reducing initial load time.
 *
 * @returns {Promise<object>} The initialized Firebase app.
 */
async function getApp() {
  if (!firebaseApp) {
    const { initializeApp } = await import('firebase/app');
    firebaseApp = initializeApp(FIREBASE_CONFIG);
  }
  return firebaseApp;
}

/**
 * Lazily initializes and returns the Firebase Auth instance.
 *
 * @returns {Promise<object>} The Firebase Auth instance.
 */
async function getAuth() {
  if (!firebaseAuth) {
    const app = await getApp();
    const { getAuth } = await import('firebase/auth');
    firebaseAuth = getAuth(app);
  }
  return firebaseAuth;
}

/**
 * Lazily initializes and returns the Firebase Analytics instance.
 *
 * @returns {Promise<object>} The Firebase Analytics instance.
 */
async function getAnalytics() {
  if (!firebaseAnalytics) {
    const app = await getApp();
    const { getAnalytics } = await import('firebase/analytics');
    firebaseAnalytics = getAnalytics(app);
  }
  return firebaseAnalytics;
}

/**
 * Signs in a user using Google OAuth popup via Firebase Auth.
 *
 * @returns {Promise<import('firebase/auth').User>} The authenticated user object.
 * @throws {Error} If the sign-in popup is closed or authentication fails.
 */
export async function signInWithGoogle() {
  const auth = await getAuth();
  const { signInWithPopup, GoogleAuthProvider } = await import('firebase/auth');
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  await trackEvent('login', { method: 'google' });
  return result.user;
}

/**
 * Logs a mock email sign-in event to Firebase Analytics.
 *
 * @returns {Promise<void>}
 */
export async function signInMock() {
  await trackEvent('login', { method: 'email' });
}

/**
 * Logs a custom analytics event to Firebase Analytics (GA4).
 *
 * @param {string} eventName - The name of the event to track.
 * @param {object} [params={}] - Optional key-value parameters for the event.
 * @returns {Promise<void>}
 */
export async function trackEvent(eventName, params = {}) {
  try {
    const analytics = await getAnalytics();
    const { logEvent } = await import('firebase/analytics');
    logEvent(analytics, eventName, params);
  } catch (error) {
    console.warn('[Firebase] Analytics event failed:', error);
  }
}

// Initialize analytics page view tracking lazily
getAnalytics().then(analytics => {
  import('firebase/analytics').then(({ logEvent }) => {
    logEvent(analytics, 'page_view', { page_title: 'StadiumFlow App' });
  });
}).catch(() => {
  // Analytics not critical — fail silently
});
