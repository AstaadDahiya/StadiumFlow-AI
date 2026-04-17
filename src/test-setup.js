/**
 * @fileoverview Global test setup for Vitest.
 * Mocks browser-only globals that are unavailable in jsdom.
 */

// Mock DOMPurify (loaded via CDN in the browser, unavailable in jsdom)
window.DOMPurify = {
  sanitize: (html) => html, // Pass-through in tests — security is tested via integration, not unit
};

// Mock import.meta.env for modules that read API keys
import.meta.env.VITE_GEMINI_API_KEY = '';
import.meta.env.VITE_GOOGLE_MAPS_KEY = '';
