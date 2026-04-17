// Utils

export function getHeatColor(density) {
  if (density < 0.4) return { fill: 'var(--heat-low)', status: 'Low' };
  if (density < 0.7) return { fill: 'var(--heat-medium)', status: 'Medium' };
  return { fill: 'var(--heat-high)', status: 'High' };
}

export function updateTime() {
  const el = document.getElementById('status-time');
  if (!el) return;
  const now = new Date();
  let h = now.getHours();
  let m = now.getMinutes();
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  h = h ? h : 12; 
  m = m < 10 ? '0' + m : m;
  el.textContent = `${h}:${m} ${ampm}`;
}
