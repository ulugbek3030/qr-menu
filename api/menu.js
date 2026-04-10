import { getNomenclature } from './_lib/iiko.js';
import { readFileSync } from 'fs';
import { join } from 'path';

let enrichments = null;
function getEnrichments() {
  if (!enrichments) {
    try {
      enrichments = JSON.parse(readFileSync(join(process.cwd(), 'data', 'enrichments.json'), 'utf-8'));
    } catch {
      enrichments = { parentCategories: {}, categories: {}, dishes: {} };
    }
  }
  return enrichments;
}

// Icon mapping for subcategories
const CATEGORY_ICONS = {
  'Салаты': 'eco', 'Супы': 'soup_kitchen', 'Стейк': 'restaurant',
  'Шашлыки': 'outdoor_grill', 'Рыба': 'set_meal', 'Десерты': 'cake',
  'Колбаски': 'restaurant', 'Курочка': 'restaurant', 'Горячие закуски': 'local_fire_department',
  'Холодные закуски': 'tapas', 'Брускетты': 'bakery_dining', 'Гарниры': 'rice_bowl',
  'BBQ': 'outdoor_grill', 'Паста': 'dinner_dining', 'Телятина': 'restaurant',
  'Баранина': 'restaurant', 'Соуса': 'water_drop', 'Хлеб': 'bakery_dining',
  'Закуски к пиву': 'sports_bar', 'Холодные супы': 'soup_kitchen',
  'WOK': 'ramen_dining'
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const data = await getNomenclature();
    const enrich = getEnrichments();
    const menu = transformMenu(data, enrich);
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60');
    return res.status(200).json(menu);
  } catch (err) {
    console.error('Menu API error:', err.message);
    try {
      const fallback = readFileSync(join(process.cwd(), 'data', 'menu.json'), 'utf-8');
      res.setHeader('X-Fallback', 'true');
      return res.status(200).json(JSON.parse(fallback));
    } catch {
      return res.status(500).json({ error: 'Failed to load menu' });
    }
  }
}

function transformMenu(iikoData, enrich) {
  const groups = {};
  for (const g of iikoData.groups || []) {
    if (!g.isDeleted) groups[g.id] = g;
  }

  const catEnrich = enrich.categories || {};
  const dishEnrich = enrich.dishes || {};

  // Find "Menu Resto Bar" root group
  const menuRoot = Object.values(groups).find(g => g.name === 'Menu Resto Bar');
  if (!menuRoot) {
    return { restaurant: getRestaurantInfo(), categories: [], dishes: [], categoryImages: {} };
  }

  // Find all product groups and their ancestor chain up to menuRoot
  function findRootCategory(gid) {
    // Walk up until we find a child of menuRoot
    let cur = gid;
    let prev = null;
    const visited = new Set();
    while (cur && !visited.has(cur)) {
      visited.add(cur);
      const g = groups[cur];
      if (!g) return null;
      if (g.parentGroup === menuRoot.id) return cur; // this is a top-level category under Menu Resto Bar
      prev = cur;
      cur = g.parentGroup;
    }
    return null;
  }

  // Collect all product groups and map to their subcategory
  const productsBySubCat = new Map();
  for (const p of iikoData.products || []) {
    if (p.isDeleted || p.type !== 'Dish') continue;
    const gid = p.parentGroup;
    if (!gid || !groups[gid]) continue;

    // Check this group belongs under Menu Resto Bar
    const rootCatId = findRootCategory(gid);
    if (!rootCatId) continue;

    let price = 0;
    const sp = p.sizePrices;
    if (sp && sp.length > 0 && sp[0].price) {
      price = sp[0].price.currentPrice || 0;
    }
    if (price <= 0) continue;

    if (!productsBySubCat.has(gid)) productsBySubCat.set(gid, []);
    productsBySubCat.get(gid).push(p);
  }

  // Build categories from subcategories that have products
  const categories = [];
  const categoryIdMap = new Map(); // iikoGroupId -> our slug
  let catOrder = 0;

  for (const [gid, products] of productsBySubCat) {
    const g = groups[gid];
    const ce = catEnrich[gid] || {};
    const cleanName = ce.cleanName || g.name.replace(/\s*[СC]Б\s*$/i, '').replace(/\s*CБ\s*$/i, '').trim();
    const slug = cleanName.toLowerCase().replace(/[^a-zа-яёa-z0-9]/gi, '-').replace(/-+/g, '-');

    const icon = CATEGORY_ICONS[cleanName] || 'restaurant';

    categories.push({
      id: slug,
      name: cleanName,
      subtitle: '',
      icon,
      iikoId: gid,
      order: ce.order || catOrder++,
      dishCount: products.length
    });
    categoryIdMap.set(gid, slug);
  }
  categories.sort((a, b) => a.order - b.order);

  // Build dishes
  const dishes = [];
  for (const [gid, products] of productsBySubCat) {
    const catSlug = categoryIdMap.get(gid);
    for (const p of products) {
      const rawName = p.name || '';
      const cleanName = rawName.replace(/\s*[СC]Б\s*$/i, '').replace(/\s*CБ\s*$/i, '').trim();

      const de = dishEnrich[p.id] || {};
      const image = (p.imageLinks?.length) ? p.imageLinks[0] : (de.image || '');

      let price = 0;
      if (p.sizePrices?.length && p.sizePrices[0].price) {
        price = p.sizePrices[0].price.currentPrice || 0;
      }

      dishes.push({
        id: p.id,
        category: catSlug,
        name: cleanName,
        shortName: de.shortName || cleanName,
        description: de.description || p.description || '',
        price: Math.round(price),
        image,
        rating: de.rating || 0,
        calories: p.energyFullAmount || 0,
        protein: p.proteinsFullAmount || 0,
        carbs: p.carbohydratesFullAmount || 0,
        ingredients: de.ingredients || [],
        badges: de.badges || [],
        tags: de.tags || [],
        reviews: [],
        _t: de._t || {}
      });
    }
  }

  dishes.sort((a, b) => a.name.localeCompare(b.name, 'ru'));

  // Category images: first dish with image
  const categoryImages = {};
  for (const cat of categories) {
    const firstImg = dishes.find(d => d.category === cat.id && d.image);
    categoryImages[cat.id] = firstImg ? firstImg.image : '';
  }

  return {
    restaurant: getRestaurantInfo(),
    categories,
    dishes,
    categoryImages,
    _source: 'iiko',
    _revision: iikoData.revision
  };
}

function getRestaurantInfo() {
  return {
    name: 'Шишка Бар',
    logo: '',
    currency: 'sum',
    taxRate: 0.10
  };
}