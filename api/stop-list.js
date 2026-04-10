import { getStopList } from './_lib/iiko.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const stoppedIds = await getStopList();
    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=10');
    return res.status(200).json({ stoppedIds });
  } catch (err) {
    console.error('Stop list error:', err.message);
    return res.status(200).json({ stoppedIds: [] });
  }
}