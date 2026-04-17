// Google Maps Integration Module
// Uses the Maps Embed API via iframe — zero SDK dependencies, works instantly

const STADIUM_QUERY = 'MetLife+Stadium,East+Rutherford,NJ';

export function initGoogleMap() {
  const container = document.getElementById('google-map');
  if (!container || container.dataset.loaded) return;

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_KEY;
  if (!apiKey) {
    container.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--text-muted);font-size:13px;text-align:center;padding:20px;">
        📍 Map unavailable — API key missing
      </div>
    `;
    return;
  }

  const iframe = document.createElement('iframe');
  iframe.width = '100%';
  iframe.height = '100%';
  iframe.style.border = '0';
  iframe.loading = 'lazy';
  iframe.referrerPolicy = 'no-referrer-when-downgrade';
  iframe.allowFullscreen = true;
  iframe.src = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${STADIUM_QUERY}&zoom=14&maptype=roadmap`;

  container.innerHTML = '';
  container.appendChild(iframe);
  container.dataset.loaded = 'true';
}
