import { ALERTS, ALERT_FILTERS, SEAT_DATA, NEARBY_AMENITIES } from './mockData.js';

let activeAlertFilter = 'All';

export function renderAlerts() {
  const filterRow = document.getElementById('alert-filter-row');
  const listEl = document.getElementById('alerts-list');
  if (!filterRow || !listEl) return;

  filterRow.innerHTML = window.DOMPurify.sanitize(
    ALERT_FILTERS.map(f => `
      <button class="alert-filter-pill ${f === activeAlertFilter ? 'active' : ''}" data-filter="${f}" role="tab" aria-selected="${f === activeAlertFilter}">${f}</button>
    `).join('')
  );

  filterRow.querySelectorAll('.alert-filter-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      activeAlertFilter = btn.getAttribute('data-filter');
      renderAlerts();
    });
  });

  const filtered = activeAlertFilter === 'All' 
    ? ALERTS 
    : ALERTS.filter(alert => alert.category === activeAlertFilter);

  listEl.innerHTML = window.DOMPurify.sanitize(filtered.map(alert => `
    <div class="alert-card alert-card--${alert.type}">
      <div class="alert-card__icon">${alert.icon}</div>
      <div class="alert-card__content">
        <div class="alert-card__title">${alert.title}</div>
        <div class="alert-card__message">${alert.message}</div>
        <div class="alert-card__time">${alert.time}</div>
      </div>
    </div>
  `).join(''));
}

export function renderSeat() {
  const heroEl = document.getElementById('seat-hero');
  const nearbyEl = document.getElementById('seat-nearby');
  if (!heroEl || !nearbyEl) return;

  heroEl.innerHTML = window.DOMPurify.sanitize(`
    <div class="seat-card">
      <div class="seat-card__venue">${SEAT_DATA.venue}</div>
      <div class="seat-card__seat-num">${SEAT_DATA.seat}</div>
      <div class="seat-card__location">${SEAT_DATA.event}</div>
      <div class="seat-card__meta">
        <div>
          <div class="seat-meta-item__label">Gate</div>
          <div class="seat-meta-item__value">${SEAT_DATA.gate}</div>
        </div>
        <div>
          <div class="seat-meta-item__label">Section</div>
          <div class="seat-meta-item__value">${SEAT_DATA.section}</div>
        </div>
      </div>
    </div>
  `);

  nearbyEl.innerHTML = window.DOMPurify.sanitize(`
    <div class="nearby-list">
      ${NEARBY_AMENITIES.map(a => `
        <div class="nearby-item">
          <span class="nearby-item__icon">${a.icon}</span>
          <div class="nearby-item__info">
            <div class="nearby-item__name">${a.name}</div>
            <div class="nearby-item__distance">${a.distance}</div>
          </div>
        </div>
      `).join('')}
    </div>
  `);
}
