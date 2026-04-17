import { signInWithGoogle, signInMock, trackEvent } from './firebase.js';

export function initAuthFlow() {
  const signInBtn = document.getElementById('sign-in-btn');
  const googleBtn = document.getElementById('google-sign-in-btn');
  const authOverlay = document.getElementById('auth-overlay');

  if (!signInBtn || !googleBtn || !authOverlay) return;

  // Email/Password sign-in (mock for now)
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

      // If user just closed the popup, don't show an error
      if (error.code !== 'auth/popup-closed-by-user') {
        alert('Sign-in failed: ' + error.message);
      }
    }
  });
}
