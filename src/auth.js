/**
 * @fileoverview Authentication flow handler.
 * Manages sign-in UI interactions with Firebase Auth (Google) and mock email login.
 * @module auth
 */

import { signInWithGoogle, signInMock, trackEvent } from './firebase.js';
import { DOM_IDS } from './constants.js';

/**
 * Initializes the authentication flow by binding event listeners
 * to the sign-in button and Google sign-in button.
 *
 * @returns {void}
 */
export function initAuthFlow() {
  const signInBtn = document.getElementById(DOM_IDS.SIGN_IN_BTN);
  const googleBtn = document.getElementById(DOM_IDS.GOOGLE_SIGN_IN_BTN);
  const authOverlay = document.getElementById(DOM_IDS.AUTH_OVERLAY);

  if (!signInBtn || !googleBtn || !authOverlay) { return; }

  // Email/Password sign-in (mock for demo)
  signInBtn.addEventListener('click', () => {
    signInBtn.textContent = 'Authenticating...';
    signInBtn.style.opacity = '0.5';
    signInMock();

    setTimeout(() => {
      authOverlay.classList.add('hidden');
      document.dispatchEvent(new Event('authSuccess'));
      trackEvent('app_opened', { method: 'email' });
    }, 800);
  });

  // Real Google Sign-In via Firebase Auth
  googleBtn.addEventListener('click', async () => {
    const originalHTML = googleBtn.innerHTML;
    googleBtn.innerHTML = 'Authenticating via Google...';
    googleBtn.style.opacity = '0.7';

    try {
      const user = await signInWithGoogle();
      console.log('Signed in as:', user.displayName);

      authOverlay.classList.add('hidden');
      document.dispatchEvent(new Event('authSuccess'));
      trackEvent('app_opened', { method: 'google', user: user.displayName });
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      googleBtn.innerHTML = originalHTML;
      googleBtn.style.opacity = '1';

      if (error.code !== 'auth/popup-closed-by-user') {
        alert('Sign-in failed: ' + error.message);
      }
    }
  });
}
