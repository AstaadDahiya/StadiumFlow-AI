import { ZONES, RESTROOM_LOCATIONS } from './mockData.js';
import { getHeatColor } from './utils.js';

let mapRestroomsActive = false;
let currentRestroomsData = [];

export function renderMap() {
  const mapContainer = document.getElementById('map-container');
  if (!mapContainer) return;
  
  // Build and sanitize SVG injection
  const rawSvg = buildStadiumSVG();
  mapContainer.innerHTML = window.DOMPurify.sanitize(rawSvg, { USE_PROFILES: { svg: true, svgFilters: true } });

  // Update Stats safely
  const totalCapacity = ZONES.reduce((sum, z) => sum + z.capacity, 0);
  const totalCurrent = ZONES.reduce((sum, z) => sum + z.current, 0);
  const avgDensity = Math.round((totalCurrent / totalCapacity) * 100);

  const statsEl = document.getElementById('map-stats');
  if (statsEl) {
    statsEl.innerHTML = window.DOMPurify.sanitize(`
      <div class="stat-card">
        <div class="stat-card__value">${totalCurrent.toLocaleString()}</div>
        <div class="stat-card__label">In Venue</div>
      </div>
      <div class="stat-card">
        <div class="stat-card__value">${avgDensity}%</div>
        <div class="stat-card__label">Capacity</div>
      </div>
      <div class="stat-card">
        <div class="stat-card__value">${totalCapacity.toLocaleString()}</div>
        <div class="stat-card__label">Max Seats</div>
      </div>
    `);
  }

  // Bind events securely (event delegation style handling or direct binds)
  document.querySelectorAll('.stadium-zone').forEach(el => {
    el.addEventListener('click', () => {
      const zoneId = el.getAttribute('data-zone');
      const zone = ZONES.find(z => z.id === zoneId);
      if (zone) showZoneDetail(zone);
    });
  });
}

function buildStadiumSVG() {
  const z = {};
  ZONES.forEach(zone => { z[zone.id] = getHeatColor(zone.density); });

  // Returning a slightly simplified path set to ensure SVG parsing stays valid
  return `
  <svg viewBox="0 0 400 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Stadium crowd density map">
    <!-- Background -->
    <rect width="400" height="320" fill="var(--bg-card)" rx="16"/>

    <!-- Grid lines -->
    <g opacity="0.05" stroke="#fff" stroke-width="0.5">
      <line x1="40" y1="0" x2="40" y2="320"/>
      <line x1="0" y1="40" x2="400" y2="40"/>
    </g>

    <!-- UPPER STANDS -->
    <path class="stadium-zone" data-zone="north-upper" d="M60,25 Q200,10 340,25 L320,55 Q200,45 80,55 Z" fill="${z['north-upper'].fill}" fill-opacity="0.6"/>
    <path class="stadium-zone" data-zone="south-upper" d="M60,295 Q200,310 340,295 L320,265 Q200,275 80,265 Z" fill="${z['south-upper'].fill}" fill-opacity="0.6"/>
    <path class="stadium-zone" data-zone="east-upper" d="M375,50 Q390,160 375,270 L345,250 Q355,160 345,70 Z" fill="${z['east-upper'].fill}" fill-opacity="0.6"/>
    <path class="stadium-zone" data-zone="west-upper" d="M25,50 Q10,160 25,270 L55,250 Q45,160 55,70 Z" fill="${z['west-upper'].fill}" fill-opacity="0.6"/>

    <!-- LOWER STANDS -->
    <path class="stadium-zone" data-zone="north-lower" d="M80,55 Q200,45 320,55 L300,85 Q200,78 100,85 Z" fill="${z['north-lower'].fill}" fill-opacity="0.8"/>
    <path class="stadium-zone" data-zone="south-lower" d="M80,265 Q200,275 320,265 L300,235 Q200,242 100,235 Z" fill="${z['south-lower'].fill}" fill-opacity="0.8"/>
    <path class="stadium-zone" data-zone="east-lower" d="M345,70 Q355,160 345,250 L315,230 Q325,160 315,90 Z" fill="${z['east-lower'].fill}" fill-opacity="0.8"/>
    <path class="stadium-zone" data-zone="west-lower" d="M55,70 Q45,160 55,250 L85,230 Q75,160 85,90 Z" fill="${z['west-lower'].fill}" fill-opacity="0.8"/>

    <!-- FIELD -->
    <rect class="stadium-zone" data-zone="field" x="100" y="90" width="200" height="140" rx="12" fill="var(--bg-secondary)" stroke="var(--border-subtle)" stroke-width="2"/>
    <text x="200" y="163" text-anchor="middle" fill="var(--text-muted)" font-size="12" font-weight="700" letter-spacing="0.15em">FIELD</text>

    <!-- Zone labels -->
    <g font-size="8" font-weight="600" fill="var(--bg-primary)" text-anchor="middle">
      <text x="200" y="32">N-UP</text>
      <text x="200" y="72">N-LO</text>
      <text x="200" y="255">S-LO</text>
      <text x="200" y="285">S-UP</text>
      <text x="36" y="163">W-UP</text>
      <text x="68" y="163">W-LO</text>
      <text x="332" y="163">E-LO</text>
      <text x="363" y="163">E-UP</text>
    </g>

    <!-- Restrooms Layer -->
    <g id="restrooms-layer">
      ${mapRestroomsActive ? currentRestroomsData.map(rr => 
        `<circle cx="${rr.x}" cy="${rr.y}" r="8" fill="${rr.color}" stroke="var(--bg-card)" stroke-width="2"/>`
      ).join('') : ''}
    </g>
  </svg>`;
}

export function showZoneDetail(zone) {
  const modal = document.getElementById('zone-detail-modal');
  const title = document.getElementById('zone-detail-title');
  const body = document.getElementById('zone-detail-body');
  if (!modal || !title || !body) return;

  const color = getHeatColor(zone.density);

  title.textContent = zone.name;
  body.innerHTML = window.DOMPurify.sanitize(`
    <div class="zone-detail-row">
      <span class="zone-detail-row__label">Section</span>
      <span class="zone-detail-row__value">${zone.section}</span>
    </div>
    <div class="zone-detail-row">
      <span class="zone-detail-row__label">Occupancy</span>
      <span class="zone-detail-row__value">${zone.current.toLocaleString()} / ${zone.capacity.toLocaleString()}</span>
    </div>
    <div class="zone-detail-row">
      <span class="zone-detail-row__label">Fill Level</span>
      <div class="zone-density-bar">
        <div class="zone-density-fill" style="width: ${zone.density * 100}%; background: ${color.fill}"></div>
      </div>
    </div>
  `);

  modal.classList.add('active');
}

export function hideZoneDetail() {
  document.getElementById('zone-detail-modal')?.classList.remove('active');
}

export function toggleMapRestrooms() {
  mapRestroomsActive = !mapRestroomsActive;
  const btn = document.getElementById('find-rr-btn');
  if (!btn) return;
  
  if (mapRestroomsActive) {
    btn.classList.add('active');
    btn.innerHTML = 'Clear Restrooms';
    
    // Mock Data computation
    currentRestroomsData = RESTROOM_LOCATIONS.map(rr => {
      const occ = Math.floor(Math.random() * 100);
      let color = 'var(--heat-low)';
      if (occ > 85) { color = 'var(--heat-high)'; }
      else if (occ > 50) { color = 'var(--heat-medium)'; }
      return { ...rr, color };
    });
  } else {
    btn.classList.remove('active');
    btn.innerHTML = 'Find Nearest Restroom';
    currentRestroomsData = [];
  }
  renderMap();
}
