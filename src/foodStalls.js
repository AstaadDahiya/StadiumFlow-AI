/**
 * @fileoverview Concession stall renderer with filterable category pills and wait time display.
 * @module foodStalls
 */

import { CONCESSION_STALLS, STALL_FILTERS } from './mockData.js';
import { debounce } from './utils.js';
import { DOM_IDS, DEBOUNCE } from './constants.js';

/** @type {string} Currently active stall filter category */
let activeStallFilter = 'All';

/**
 * Determines the wait level classification for a given wait time.
 *
 * @param {number} min - Wait time in minutes.
 * @returns {'low' | 'medium' | 'high'} Wait level string.
 * @private
 */
function getWaitLevel(min) {
  if (typeof min !== 'number' || min < 0) { return 'low'; }
  if (min < 5) { return 'low'; }
  if (min <= 10) { return 'medium'; }
  return 'high';
}

/**
 * Renders the food stall filter pills and stall cards into the DOM.
 * Applies the current active filter to determine which stalls are visible.
 * Filter click handlers are debounced to prevent rapid DOM thrashing.
 *
 * @returns {void}
 */
export function renderStalls() {
  try {
    const filterRow = document.getElementById(DOM_IDS.STALL_FILTER_ROW);
    const listEl = document.getElementById(DOM_IDS.STALLS_LIST);
    if (!filterRow || !listEl) { return; }

    filterRow.innerHTML = window.DOMPurify.sanitize(
      STALL_FILTERS.map(f => `
        <button class="stall-filter-pill ${f === activeStallFilter ? 'active' : ''}" data-filter="${f}" role="tab" aria-selected="${f === activeStallFilter}">${f}</button>
      `).join('')
    );

    const debouncedRender = debounce(() => renderStalls(), DEBOUNCE.FILTER_CLICK);

    filterRow.querySelectorAll('.stall-filter-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        activeStallFilter = btn.getAttribute('data-filter');
        debouncedRender();
      });
    });

    const filtered = activeStallFilter === 'All'
      ? CONCESSION_STALLS
      : CONCESSION_STALLS.filter(s => s.type === activeStallFilter);

    listEl.innerHTML = window.DOMPurify.sanitize(filtered.map(stall => {
      const level = getWaitLevel(stall.waitMin);
      const fillPct = Math.min((stall.waitMin / 20) * 100, 100);
      const tags = stall.menu.slice(0, 3).map(m => m.name);

      return `
      <div class="stall-card">
        <div class="stall-card__top">
          <div class="stall-card__icon">${stall.icon}</div>
          <div class="stall-card__info">
            <div class="stall-card__name">${stall.name}</div>
            <div class="stall-card__location">${stall.location}</div>
          </div>
          <div class="stall-card__wait-badge stall-card__wait-badge--${level}">
            ${stall.waitMin}m wait
          </div>
        </div>
        <div class="stall-card__wait-bar">
          <div class="stall-card__wait-fill" style="width: ${fillPct}%; background: currentColor;"></div>
        </div>
        <div class="stall-card__bottom">
          <div class="stall-card__tags">
            ${tags.map(t => `<span class="stall-tag">${t}</span>`).join('')}
          </div>
        </div>
      </div>
      `;
    }).join(''));
  } catch (error) {
    console.error('[FoodStalls] Failed to render stalls:', error);
  }
}
