import './style.css';
import { initAuthFlow } from './auth.js';
import { renderMap, hideZoneDetail, toggleMapRestrooms } from './mapRenderer.js';
import { renderStalls } from './foodStalls.js';
import { renderAlerts, renderSeat } from './alerts.js';
import { updateTime } from './utils.js';
import { toggleAssistantPanel, generateSmartInsights } from './geminiAssistant.js';
import { initGoogleMap } from './googleMaps.js';

// ==========================================
// APP STATE & INIT
// ==========================================

let activeTab = 'map';

function initApp() {
  // Bind tab switching
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => switchTab(item.getAttribute('data-tab')));
  });

  // Bind globals
  document.getElementById('zone-detail-close')?.addEventListener('click', hideZoneDetail);
  document.getElementById('find-rr-btn')?.addEventListener('click', toggleMapRestrooms);
  document.getElementById('ai-fab')?.addEventListener('click', toggleAssistantPanel);
  document.getElementById('assistant-close')?.addEventListener('click', toggleAssistantPanel);
  document.getElementById('refresh-insights-btn')?.addEventListener('click', generateSmartInsights);

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

function switchTab(tabName) {
  if (tabName === activeTab) return;
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
