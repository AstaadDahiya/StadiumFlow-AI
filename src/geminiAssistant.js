/**
 * @fileoverview Gemini AI Smart Assistant module.
 * Analyzes live stadium data and generates contextual recommendations
 * via the Google Gemini 2.0 Flash REST API.
 * @module geminiAssistant
 */

import { ZONES, CONCESSION_STALLS, SEAT_DATA } from './mockData.js';
import { DOM_IDS, GEMINI_CACHE_KEY, GEMINI_API_URL } from './constants.js';

/**
 * Generates smart insights by sending live venue data to the Gemini API.
 * Caches the response in sessionStorage to avoid redundant API calls
 * when the user re-opens the panel without new data.
 *
 * @returns {Promise<void>}
 */
export async function generateSmartInsights() {
  const container = document.getElementById(DOM_IDS.ASSISTANT_CONTENT);
  if (!container) { return; }

  // Check sessionStorage cache first
  const cached = sessionStorage.getItem(GEMINI_CACHE_KEY);
  if (cached) {
    container.innerHTML = window.DOMPurify.sanitize(cached);
    return;
  }

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

    let html = rawText
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/^\* (.+)$/gm, '<li>$1</li>')
      .replace(/^- (.+)$/gm, '<li>$1</li>');

    if (html.includes('<li>')) {
      html = '<ul class="assistant-tips">' + html + '</ul>';
      html = html.replace(/<ul class="assistant-tips">([\s\S]*?)<\/ul>/g, (match, inner) => {
        const cleaned = inner.replace(/^(?!<li>)[^<\n]+$/gm, '').trim();
        return `<ul class="assistant-tips">${cleaned}</ul>`;
      });
    } else {
      html = rawText.split('\n').filter(l => l.trim()).map(l => `<p>${l}</p>`).join('');
    }

    const sanitizedHtml = window.DOMPurify.sanitize(html);

    // Cache the response in sessionStorage
    sessionStorage.setItem(GEMINI_CACHE_KEY, sanitizedHtml);

    container.innerHTML = sanitizedHtml;

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

/**
 * Toggles the visibility of the AI assistant sliding panel.
 * Automatically triggers insight generation on the first open.
 *
 * @returns {void}
 */
export function toggleAssistantPanel() {
  const panel = document.getElementById(DOM_IDS.ASSISTANT_PANEL);
  if (!panel) { return; }

  if (panel.classList.contains('active')) {
    panel.classList.remove('active');
  } else {
    panel.classList.add('active');
    const content = document.getElementById(DOM_IDS.ASSISTANT_CONTENT);
    if (content && content.innerHTML.trim() === '') {
      generateSmartInsights();
    }
  }
}

/**
 * Forces a fresh insight generation by clearing the session cache first.
 *
 * @returns {Promise<void>}
 */
export async function refreshInsights() {
  sessionStorage.removeItem(GEMINI_CACHE_KEY);
  await generateSmartInsights();
}
