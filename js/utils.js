import { t } from './i18n.js';

// Sanitize HTML to prevent XSS
export function esc(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Format price with currency
export function fmtPrice(price) {
  return price.toLocaleString('en-US').replace(/,/g, ' ') + ' ' + t('fmt.sum');
}

// Format price number only (no currency)
export function fmtNum(price) {
  return price.toLocaleString('en-US').replace(/,/g, ' ');
}

// WiFi config — single source of truth
export const WIFI = { ssid: 'Dionis', password: 'Dio135662', encryption: 'WPA' };