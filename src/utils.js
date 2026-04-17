/**
 * @fileoverview Shared utility functions for the StadiumFlow application.
 * @module utils
 */

import { DOM_IDS } from './constants.js';

/**
 * Determines the heat color and status label for a given crowd density value.
 * Uses a three-tier threshold system: Low (< 0.4), Medium (0.4–0.7), High (≥ 0.7).
 *
 * @param {number} density - A value between 0 and 1 representing zone occupancy.
 * @returns {{ fill: string, status: string }} An object with CSS variable fill color and human-readable status.
 */
export function getHeatColor(density) {
  if (typeof density !== 'number' || isNaN(density)) {
    return { fill: 'var(--heat-low)', status: 'Low' };
  }
  if (density < 0.4) { return { fill: 'var(--heat-low)', status: 'Low' }; }
  if (density < 0.7) { return { fill: 'var(--heat-medium)', status: 'Medium' }; }
  return { fill: 'var(--heat-high)', status: 'High' };
}

/**
 * Updates the status bar clock element with the current time in 12-hour format.
 * Fails silently if the target DOM element does not exist.
 *
 * @returns {void}
 */
export function updateTime() {
  const el = document.getElementById(DOM_IDS.STATUS_TIME);
  if (!el) { return; }
  const now = new Date();
  let h = now.getHours();
  let m = now.getMinutes();
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  h = h ? h : 12;
  m = m < 10 ? '0' + m : m;
  el.textContent = `${h}:${m} ${ampm}`;
}

/**
 * Creates a debounced version of a function that delays invocation
 * until after `delay` milliseconds have elapsed since the last call.
 *
 * @param {Function} fn - The function to debounce.
 * @param {number} delay - The debounce delay in milliseconds.
 * @returns {Function} The debounced function.
 */
export function debounce(fn, delay) {
  let timer = null;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}
