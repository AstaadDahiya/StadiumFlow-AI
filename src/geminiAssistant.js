import { ZONES, CONCESSION_STALLS, SEAT_DATA } from './mockData.js';

// Use the REST API directly instead of the npm package 
// so there are zero dependency issues.
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export async function generateSmartInsights() {
  const container = document.getElementById('assistant-content');
  if (!container) return;

  container.innerHTML = `
    <div class="assistant-loading">
      <div class="spinner"></div>
      <span>Analyzing stadium data...</span>
    </div>
  `;

  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
      throw new Error('Missing Gemini API Key. Please add it to your .env file as VITE_GEMINI_API_KEY.');
    }

    // Build live data context from the app's actual state
    const zoneLines = ZONES.map(
      z => `- ${z.name} (${z.section}): ${z.current}/${z.capacity} — ${Math.round(z.density * 100)}% full`
    ).join('\n');

    const stallLines = CONCESSION_STALLS.map(
      c => `- ${c.name} (${c.type}, ${c.location}): ${c.waitMin} min wait`
    ).join('\n');

    const prompt = `You are the elite "StadiumFlow AI Assistant". Provide 2-3 extremely concise, highly-actionable tips for a fan right now based on the live stadium data below.
Focus on: navigating away from the most crowded zones, pointing to concession stands with shortest wait times, or safety tips.
Use a brief, friendly, professional tone. Format as short bullet points starting with an emoji. Do NOT include introductory text — just dive straight into the bullets.

LIVE DATA:
Stadium Occupancy:
${zoneLines}

Concession Wait Times:
${stallLines}

User's Seat: Section ${SEAT_DATA.section}, Row ${SEAT_DATA.row}`;

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(`API Error ${response.status}: ${errBody.slice(0, 200)}`);
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No insights available.';

    // Lightweight markdown → HTML conversion
    let html = rawText
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')   // bold
      .replace(/^\* (.+)$/gm, '<li>$1</li>')              // unordered list items (* )
      .replace(/^- (.+)$/gm, '<li>$1</li>');              // unordered list items (- )

    if (html.includes('<li>')) {
      html = '<ul class="assistant-tips">' + html.replace(/(<li>)/g, '$1') + '</ul>';
      // Clean up any stray text outside <li> tags inside the <ul>
      html = html.replace(/<ul class="assistant-tips">([\s\S]*?)<\/ul>/g, (match, inner) => {
        const cleaned = inner.replace(/^(?!<li>)[^<\n]+$/gm, '').trim();
        return `<ul class="assistant-tips">${cleaned}</ul>`;
      });
    } else {
      // If no bullets, wrap in paragraphs
      html = rawText.split('\n').filter(l => l.trim()).map(l => `<p>${l}</p>`).join('');
    }

    container.innerHTML = window.DOMPurify.sanitize(html);

  } catch (error) {
    console.error('Gemini Assistant Error:', error);
    container.innerHTML = window.DOMPurify.sanitize(`
      <div class="assistant-error">
        ⚠️ Failed to fetch insights.
        <br/><br/>
        <small>${error.message}</small>
      </div>
    `);
  }
}

export function toggleAssistantPanel() {
  const panel = document.getElementById('assistant-panel');
  if (panel) {
    if (panel.classList.contains('active')) {
      panel.classList.remove('active');
    } else {
      panel.classList.add('active');
      // Automatically generate insights on the first open if empty
      const content = document.getElementById('assistant-content');
      if (content && content.innerHTML.trim() === '') {
        generateSmartInsights();
      }
    }
  }
}
