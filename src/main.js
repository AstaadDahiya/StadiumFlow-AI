/**
 * @fileoverview Application entry point. Orchestrates authentication,
 * tab navigation, and module initialization.
 * @module main
 */

import './style.css';
import { initAuthFlow } from './auth.js';
import { renderMap, hideZoneDetail, toggleMapRestrooms } from './mapRenderer.js';
import { renderStalls } from './foodStalls.js';
import { renderAlerts, renderSeat } from './alerts.js';
import { updateTime } from './utils.js';
import { toggleAssistantPanel, refreshInsights } from './geminiAssistant.js';
import { initGoogleMap } from './googleMaps.js';
import { DOM_IDS } from './constants.js';

// ==========================================
// APP STATE & INIT
// ==========================================

/** @type {string} Currently active navigation tab */
let activeTab = 'map';

/**
 * Initializes the main application after successful authentication.
 * Binds all global event listeners and renders initial tab content.
 *
 * @returns {void}
 */
function initApp() {
  // Bind tab switching
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => switchTab(item.getAttribute('data-tab')));
  });

  // Bind global controls
  document.getElementById(DOM_IDS.ZONE_DETAIL_CLOSE)?.addEventListener('click', hideZoneDetail);
  document.getElementById(DOM_IDS.FIND_RR_BTN)?.addEventListener('click', toggleMapRestrooms);
  document.getElementById(DOM_IDS.AI_FAB)?.addEventListener('click', toggleAssistantPanel);
  document.getElementById(DOM_IDS.ASSISTANT_CLOSE)?.addEventListener('click', toggleAssistantPanel);
  document.getElementById(DOM_IDS.REFRESH_INSIGHTS_BTN)?.addEventListener('click', refreshInsights);

  // Time loop
  updateTime();
  setInterval(updateTime, 60000);

  // Render initial tab content
  renderMap();
  renderStalls();
  renderAlerts();
  renderSeat();
  initGoogleMap();
}

/**
 * Switches the active tab and updates ARIA state across all navigation items.
 *
 * @param {string} tabName - The data-tab identifier to switch to.
 * @returns {void}
 */
function switchTab(tabName) {
  if (!tabName || tabName === activeTab) { return; }
  activeTab = tabName;

  document.querySelectorAll('.nav-item').forEach(item => {
    const isActive = item.getAttribute('data-tab') === tabName;
    item.classList.toggle('active', isActive);
    item.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });

  document.querySelectorAll('.tab-panel').forEach(panel => {
    panel.classList.toggle('active', panel.getAttribute('data-tab') === tabName);
  });

  // Lazy-load Google Map when seat tab is first shown
  if (tabName === 'seat') {
    initGoogleMap();
  }
}

// 1. Kick off auth listener
initAuthFlow();

// 2. Wait for auth success to initialize main data
document.addEventListener('authSuccess', () => {
  initApp();
});
