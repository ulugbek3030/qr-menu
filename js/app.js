import { Router } from './router.js';
import { store } from './store.js';
import { auth } from './auth.js';
import { initFirebase } from './firebase-config.js';
import { t, getLang, setLang, getLangLabel, onLangChange } from './i18n.js';
import { renderHome } from './views/home.js';
import { renderMenu } from './views/menu.js';
import { renderDish, cleanupDish } from './views/dish.js';
import { renderCart } from './views/cart.js';
import { renderPayment, cleanupPayment } from './views/payment.js';
import { renderSearch } from './views/search.js';
import { renderWelcome } from './views/welcome.js';
import { renderProfile } from './views/profile.js';

let menuData = null;
let prevView = null;
let router = null;

// Vercel API base — same origin on Vercel, skip on static servers
const VERCEL_HOST = 'shishka-menu.vercel.app';
const isVercel = location.hostname === VERCEL_HOST || location.hostname.endsWith('.vercel.app');
const API_BASE = isVercel ? '' : `https://${VERCEL_HOST}`;

async function loadData() {
  try {
    // Try iiko API first
    let apiOk = false;
    try {
      const apiRes = await fetch(`${API_BASE}/api/menu`);
      if (apiRes.ok && (apiRes.headers.get('content-type') || '').includes('json')) {
        menuData = await apiRes.json();
        apiOk = true;
        console.log(`Menu loaded from iiko (rev: ${menuData._revision})`);
      }
    } catch { /* API unavailable */ }

    if (!apiOk) {
      const res = await fetch('data/menu.json');
      if (!res.ok) throw new Error('Failed to load menu');
      menuData = await res.json();
      console.log('Menu loaded from static JSON (fallback)');
    }
    const logo = document.getElementById('header-logo');
    if (menuData.restaurant.logo) logo.src = menuData.restaurant.logo;
  } catch (e) {
    document.getElementById('app').innerHTML = `
      <div class="px-5 py-20 text-center">
        <span class="material-symbols-outlined text-5xl text-error mb-3">error</span>
        <h2 class="font-headline text-xl font-bold text-on-surface mb-2">Failed to load menu</h2>
        <p class="text-on-surface-variant text-sm mb-6">${e.message}</p>
        <button onclick="location.reload()" class="px-6 py-3 gold-gradient text-black rounded-full font-bold text-sm">Retry</button>
      </div>`;
    throw e;
  }
}

// Stop-list polling
let stoppedIds = new Set();
async function pollStopList() {
  try {
    const res = await fetch(`${API_BASE}/api/stop-list`);
    if (res.ok) {
      const data = await res.json();
      stoppedIds = new Set(data.stoppedIds || []);
      // Mark dishes as stopped
      if (menuData) {
        for (const dish of menuData.dishes) {
          dish.isStopped = stoppedIds.has(dish.id);
        }
      }
    }
  } catch { /* silent */ }
}
export function getStoppedIds() { return stoppedIds; }

function cleanup() {
  if (prevView === 'dish') cleanupDish();
  if (prevView === 'payment') cleanupPayment();
}

function updateCartBadge() {
  const badge = document.getElementById('cart-badge');
  const count = store.getCount();
  if (count > 0) { badge.textContent = count; badge.classList.remove('hidden'); }
  else { badge.classList.add('hidden'); }
}

function updateStaticLabels() {
  const navKeys = ['nav.menu', 'nav.search', 'nav.cart', 'nav.profile'];
  document.querySelectorAll('.nav-label').forEach((el, i) => { el.textContent = t(navKeys[i]); });
  const wl = document.getElementById('waiter-label');
  if (wl) wl.textContent = t('nav.waiter');
  const lc = document.getElementById('lang-current');
  if (lc) lc.textContent = getLangLabel(getLang());
}

function setupLangSelector() {
  const toggle = document.getElementById('lang-toggle');
  const dropdown = document.getElementById('lang-dropdown');
  if (!toggle || !dropdown) return;

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('hidden');
  });
  document.addEventListener('click', () => dropdown.classList.add('hidden'));
  dropdown.querySelectorAll('.lang-option').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      setLang(btn.dataset.lang);
      // Also save lang to user profile
      if (auth.isLoggedIn()) auth.updateUser({ lang: btn.dataset.lang });
      dropdown.classList.add('hidden');
    });
  });
}

function showWelcome() {
  renderWelcome(() => {
    // After registration/login — show header+nav and go to home
    document.getElementById('app-header').style.display = '';
    document.getElementById('bottom-nav').style.display = '';
    updateStaticLabels();
    location.hash = '#/';
    router.resolve();
  });
}

function handleLogout() {
  location.hash = '#/';
  showWelcome();
}

async function init() {
  await loadData();
  initFirebase();

  router = new Router([
    {
      path: '/', nav: 'home',
      handler: () => {
        if (!auth.isLoggedIn()) { showWelcome(); return; }
        cleanup(); prevView = 'home';
        document.getElementById('app-header').style.display = '';
        document.getElementById('bottom-nav').style.display = '';
        renderHome(menuData); window.scrollTo(0, 0);
      }
    },
    {
      path: '/menu/:category', nav: 'home',
      handler: ({ category }) => {
        if (!auth.isLoggedIn()) { showWelcome(); return; }
        cleanup(); prevView = 'menu';
        document.getElementById('app-header').style.display = '';
        document.getElementById('bottom-nav').style.display = '';
        renderMenu(menuData, category); window.scrollTo(0, 0);
      }
    },
    {
      path: '/dish/:id', nav: '',
      handler: ({ id }) => {
        if (!auth.isLoggedIn()) { showWelcome(); return; }
        cleanup(); prevView = 'dish';
        document.getElementById('app-header').style.display = 'none';
        renderDish(menuData, id); window.scrollTo(0, 0);
      }
    },
    {
      path: '/cart', nav: 'cart',
      handler: () => {
        if (!auth.isLoggedIn()) { showWelcome(); return; }
        cleanup(); prevView = 'cart';
        document.getElementById('app-header').style.display = '';
        document.getElementById('bottom-nav').style.display = '';
        renderCart(menuData); window.scrollTo(0, 0);
      }
    },
    {
      path: '/payment', nav: '',
      handler: () => {
        if (!auth.isLoggedIn()) { showWelcome(); return; }
        cleanup(); prevView = 'payment';
        document.getElementById('app-header').style.display = 'none';
        renderPayment(menuData); window.scrollTo(0, 0);
      }
    },
    {
      path: '/search', nav: 'search',
      handler: () => {
        if (!auth.isLoggedIn()) { showWelcome(); return; }
        cleanup(); prevView = 'search';
        document.getElementById('app-header').style.display = '';
        document.getElementById('bottom-nav').style.display = '';
        renderSearch(menuData); window.scrollTo(0, 0);
      }
    },
    {
      path: '/profile', nav: 'profile',
      handler: () => {
        if (!auth.isLoggedIn()) { showWelcome(); return; }
        cleanup(); prevView = 'profile';
        document.getElementById('app-header').style.display = '';
        document.getElementById('bottom-nav').style.display = '';
        renderProfile(handleLogout); window.scrollTo(0, 0);
      }
    }
  ]);

  store.onChange(updateCartBadge);
  updateCartBadge();
  updateStaticLabels();
  setupLangSelector();

  onLangChange(() => {
    updateStaticLabels();
    if (auth.isLoggedIn()) auth.updateUser({ lang: getLang() });
    router.resolve();
  });

  // Start stop-list polling (every 60s)
  pollStopList();
  setInterval(pollStopList, 60000);

  // If user is logged in, restore their language and go to menu
  if (auth.isLoggedIn()) {
    const user = auth.getUser();
    if (user.lang) setLang(user.lang);
    router.resolve();
  } else {
    showWelcome();
  }
}

init();