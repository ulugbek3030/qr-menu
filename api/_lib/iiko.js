const IIKO_BASE = 'https://api-ru.iiko.services';
const API_KEY = process.env.IIKO_API_KEY;
const ORG_ID = process.env.IIKO_ORG_ID;

let cachedToken = null;
let tokenExpiry = 0;

export async function getToken() {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken;

  const res = await fetch(`${IIKO_BASE}/api/1/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apiLogin: API_KEY })
  });
  const body = await res.text();
  if (!res.ok) throw new Error(`iiko auth failed: ${res.status} ${body}`);
  const data = JSON.parse(body);
  cachedToken = data.token;
  tokenExpiry = Date.now() + 45 * 60 * 1000; // refresh every 45 min
  return cachedToken;
}

async function iikoPost(endpoint, body = {}) {
  const token = await getToken();
  const res = await fetch(`${IIKO_BASE}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(`iiko ${endpoint} failed: ${res.status}`);
  return res.json();
}

export async function getNomenclature(startRevision = 0) {
  return iikoPost('/api/1/nomenclature', {
    organizationId: ORG_ID,
    startRevision
  });
}

export async function getStopList() {
  const data = await iikoPost('/api/1/stop_lists', {
    organizationIds: [ORG_ID]
  });
  // Flatten all terminal group stop lists into one Set of product IDs
  const stoppedIds = new Set();
  for (const tg of data.terminalGroupStopLists || []) {
    for (const item of tg.items || []) {
      if (item.balance === 0) {
        stoppedIds.add(item.productId);
      }
    }
  }
  return [...stoppedIds];
}

export function getOrgId() { return ORG_ID; }