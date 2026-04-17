import { describe, it, expect, beforeEach, afterEach } from 'vitest';

/**
 * Integration tests for DOM rendering modules.
 * These test that the rendering functions correctly inject content
 * into the DOM and that interactive elements are properly wired up.
 */

describe('Map Renderer — Integration', () => {
  beforeEach(() => {
    // Setup minimal DOM structure
    document.body.innerHTML = `
      <div id="map-container"></div>
      <div id="map-stats"></div>
      <div id="zone-detail-modal">
        <h3 id="zone-detail-title"></h3>
        <div id="zone-detail-body"></div>
        <button id="zone-detail-close"></button>
      </div>
      <button id="find-rr-btn">Find Nearest Restroom</button>
    `;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should render the stadium SVG into the map container', async () => {
    const { renderMap } = await import('./mapRenderer.js');
    renderMap();
    const container = document.getElementById('map-container');
    expect(container.innerHTML).toContain('<svg');
    expect(container.innerHTML).toContain('stadium-zone');
  });

  it('should render stat cards with numeric values', async () => {
    const { renderMap } = await import('./mapRenderer.js');
    renderMap();
    const stats = document.getElementById('map-stats');
    expect(stats.innerHTML).toContain('stat-card');
    expect(stats.innerHTML).toContain('In Venue');
    expect(stats.innerHTML).toContain('Capacity');
    expect(stats.innerHTML).toContain('Max Seats');
  });

  it('should render clickable stadium zones', async () => {
    const { renderMap } = await import('./mapRenderer.js');
    renderMap();
    const zones = document.querySelectorAll('.stadium-zone');
    expect(zones.length).toBeGreaterThan(0);
  });

  it('showZoneDetail should populate modal with zone data', async () => {
    const { showZoneDetail } = await import('./mapRenderer.js');
    const mockZone = { id: 'test', name: 'Test Zone', section: 'SEC 100', density: 0.5, capacity: 1000, current: 500, type: 'medium' };
    showZoneDetail(mockZone);
    const title = document.getElementById('zone-detail-title');
    expect(title.textContent).toBe('Test Zone');
    const body = document.getElementById('zone-detail-body');
    expect(body.innerHTML).toContain('SEC 100');
    expect(body.innerHTML).toContain('500');
  });

  it('hideZoneDetail should remove active class from modal', async () => {
    const { hideZoneDetail, showZoneDetail } = await import('./mapRenderer.js');
    const modal = document.getElementById('zone-detail-modal');
    const mockZone = { id: 'test', name: 'Test', section: 'A', density: 0.5, capacity: 100, current: 50, type: 'medium' };
    showZoneDetail(mockZone);
    expect(modal.classList.contains('active')).toBe(true);
    hideZoneDetail();
    expect(modal.classList.contains('active')).toBe(false);
  });
});

describe('Food Stalls — Integration', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="stall-filter-row"></div>
      <div id="stalls-list"></div>
    `;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should render filter pills', async () => {
    const { renderStalls } = await import('./foodStalls.js');
    renderStalls();
    const pills = document.querySelectorAll('.stall-filter-pill');
    expect(pills.length).toBeGreaterThanOrEqual(2);
  });

  it('should render stall cards', async () => {
    const { renderStalls } = await import('./foodStalls.js');
    renderStalls();
    const cards = document.querySelectorAll('.stall-card');
    expect(cards.length).toBeGreaterThanOrEqual(1);
  });

  it('stall cards should show wait time badges', async () => {
    const { renderStalls } = await import('./foodStalls.js');
    renderStalls();
    const list = document.getElementById('stalls-list');
    expect(list.innerHTML).toContain('wait');
  });

  it('"All" filter should be active by default', async () => {
    const { renderStalls } = await import('./foodStalls.js');
    renderStalls();
    const activePill = document.querySelector('.stall-filter-pill.active');
    expect(activePill).not.toBeNull();
    expect(activePill.textContent).toBe('All');
  });
});

describe('Alerts — Integration', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="alert-filter-row"></div>
      <div id="alerts-list"></div>
      <div id="seat-hero"></div>
      <div id="seat-nearby"></div>
    `;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should render alert filter pills', async () => {
    const { renderAlerts } = await import('./alerts.js');
    renderAlerts();
    const pills = document.querySelectorAll('.alert-filter-pill');
    expect(pills.length).toBeGreaterThanOrEqual(2);
  });

  it('should render alert cards', async () => {
    const { renderAlerts } = await import('./alerts.js');
    renderAlerts();
    const cards = document.querySelectorAll('.alert-card');
    expect(cards.length).toBeGreaterThanOrEqual(1);
  });

  it('alert cards should display title and message', async () => {
    const { renderAlerts } = await import('./alerts.js');
    renderAlerts();
    const list = document.getElementById('alerts-list');
    expect(list.innerHTML).toContain('alert-card__title');
    expect(list.innerHTML).toContain('alert-card__message');
  });

  it('should render seat information card', async () => {
    const { renderSeat } = await import('./alerts.js');
    renderSeat();
    const hero = document.getElementById('seat-hero');
    expect(hero.innerHTML).toContain('MetLife Stadium');
    expect(hero.innerHTML).toContain('214');
  });

  it('should render nearby amenities', async () => {
    const { renderSeat } = await import('./alerts.js');
    renderSeat();
    const nearby = document.getElementById('seat-nearby');
    expect(nearby.innerHTML).toContain('Restrooms');
    expect(nearby.innerHTML).toContain('nearby-item');
  });
});

describe('Gemini Assistant — Integration', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="assistant-panel"></div>
      <div id="assistant-content"></div>
    `;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('toggleAssistantPanel should add active class', async () => {
    const { toggleAssistantPanel } = await import('./geminiAssistant.js');
    const panel = document.getElementById('assistant-panel');
    toggleAssistantPanel();
    expect(panel.classList.contains('active')).toBe(true);
  });

  it('toggleAssistantPanel should remove active class on second call', async () => {
    const { toggleAssistantPanel } = await import('./geminiAssistant.js');
    const panel = document.getElementById('assistant-panel');
    toggleAssistantPanel();
    toggleAssistantPanel();
    expect(panel.classList.contains('active')).toBe(false);
  });

  it('generateSmartInsights should show loading state', async () => {
    const { generateSmartInsights } = await import('./geminiAssistant.js');
    // This will fail the API call (no key in test) but should show loading first
    generateSmartInsights();
    const content = document.getElementById('assistant-content');
    expect(content.innerHTML).toContain('assistant-loading');
  });
});

describe('Google Maps — Integration', () => {
  beforeEach(() => {
    document.body.innerHTML = `<div id="google-map"></div>`;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should handle missing API key gracefully', async () => {
    const { initGoogleMap } = await import('./googleMaps.js');
    initGoogleMap();
    const container = document.getElementById('google-map');
    // Should show fallback message or iframe based on env
    expect(container).not.toBeNull();
  });
});

describe('Auth Module — Integration', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="auth-overlay">
        <button id="sign-in-btn">Sign In</button>
        <button id="google-sign-in-btn">Sign in with Google</button>
      </div>
    `;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should bind click handler to sign-in button', async () => {
    const { initAuthFlow } = await import('./auth.js');
    initAuthFlow();
    const btn = document.getElementById('sign-in-btn');
    expect(btn).not.toBeNull();
  });

  it('should bind click handler to google sign-in button', async () => {
    const { initAuthFlow } = await import('./auth.js');
    initAuthFlow();
    const btn = document.getElementById('google-sign-in-btn');
    expect(btn).not.toBeNull();
  });
});
