import { getDb } from './firebase-config.js';

const COLLECTION = 'reviews';

export async function getReviews(dishId) {
  const db = getDb();
  if (!db) return [];
  try {
    const snap = await db.collection(COLLECTION)
      .where('dishId', '==', dishId)
      .orderBy('createdAt', 'desc')
      .get();
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (e) {
    console.warn('Failed to load reviews:', e.message);
    return [];
  }
}

export async function addReview(dishId, { name, rating, text }) {
  const db = getDb();
  if (!db) throw new Error('Firebase not configured');
  const doc = {
    dishId,
    name: name || 'Guest',
    rating: Math.min(5, Math.max(1, rating)),
    text: text.trim(),
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  };
  const ref = await db.collection(COLLECTION).add(doc);
  return { id: ref.id, ...doc, createdAt: new Date() };
}