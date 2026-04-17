import { CONCESSION_STALLS, STALL_FILTERS } from './mockData.js';

let activeStallFilter = 'All';

function getWaitLevel(min) {
  if (min < 5) return 'low';
  if (min <= 10) return 'medium';
  return 'high';
}

export function renderStalls() {
  const filterRow = document.getElementById('stall-filter-row');
  const listEl = document.getElementById('stalls-list');
  if (!filterRow || !listEl) return;

  filterRow.innerHTML = window.DOMPurify.sanitize(
    STALL_FILTERS.map(f => `
      <button class="stall-filter-pill ${f === activeStallFilter ? 'active' : ''}" data-filter="${f}" role="tab" aria-selected="${f === activeStallFilter}">${f}</button>
    `).join('')
  );

  filterRow.querySelectorAll('.stall-filter-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      activeStallFilter = btn.getAttribute('data-filter');
      renderStalls();
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
}
