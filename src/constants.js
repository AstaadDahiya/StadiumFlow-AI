/**
 * @fileoverview Shared constants for DOM selectors and configuration values.
 * Centralizing magic strings improves maintainability and reduces typo-related bugs.
 * @module constants
 */

/** @enum {string} DOM element IDs used across modules */
export const DOM_IDS = {
  // Auth
  AUTH_OVERLAY: 'auth-overlay',
  SIGN_IN_BTN: 'sign-in-btn',
  GOOGLE_SIGN_IN_BTN: 'google-sign-in-btn',

  // Map
  MAP_CONTAINER: 'map-container',
  MAP_STATS: 'map-stats',
  ZONE_DETAIL_MODAL: 'zone-detail-modal',
  ZONE_DETAIL_TITLE: 'zone-detail-title',
  ZONE_DETAIL_BODY: 'zone-detail-body',
  ZONE_DETAIL_CLOSE: 'zone-detail-close',
  FIND_RR_BTN: 'find-rr-btn',

  // Food
  STALL_FILTER_ROW: 'stall-filter-row',
  STALLS_LIST: 'stalls-list',

  // Alerts
  ALERT_FILTER_ROW: 'alert-filter-row',
  ALERTS_LIST: 'alerts-list',

  // Seat
  SEAT_HERO: 'seat-hero',
  SEAT_NEARBY: 'seat-nearby',
  GOOGLE_MAP: 'google-map',

  // AI Assistant
  AI_FAB: 'ai-fab',
  ASSISTANT_PANEL: 'assistant-panel',
  ASSISTANT_CLOSE: 'assistant-close',
  ASSISTANT_CONTENT: 'assistant-content',
  REFRESH_INSIGHTS_BTN: 'refresh-insights-btn',

  // Status
  STATUS_TIME: 'status-time',
};

/** @enum {number} Debounce delays in milliseconds */
export const DEBOUNCE = {
  FILTER_CLICK: 200,
};

/** @type {string} Session storage key for cached Gemini response */
export const GEMINI_CACHE_KEY = 'stadiumflow_gemini_cache';

/** @type {string} Gemini REST API endpoint */
export const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
