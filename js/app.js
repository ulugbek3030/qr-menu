import { Router } from './router.js';
import { store } from './store.js';
import { initFirebase } from './firebase-config.js';
import { t, getLang, setLang, getLangLabel, onLangChange } from './i18n.js';
import { renderHome } from './views/home.js';
import { renderMenu } from './views/menu.js';
import { renderDish, cleanupDish } from './views/dish.js';
import { renderCart } from './views/cart.js';
import { renderPayment, cleanupPayment } from './views/payment.js';
import { renderSearch } from './views/search.js';

let menuData = null;
let prevView = null;
let router = null;

async function loadData() {
  const res = await fetch('data/menu.json');
  menuData = await res.json();
  document.getElementById('header-logo').src = menuData.restaurant.logo;
}

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
  // Nav labels
  const navKeys = ['nav.menu', 'nav.search', 'nav.cart', 'nav.profile'];
  document.querySelectorAll('.nav-label').forEach((el, i) => { el.textContent = t(navKeys[i]); });
  // Waiter button
  const wl = document.getElementById('waiter-label');
  if (wl) wl.textContent = t('nav.waiter');
  // Lang toggle
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
      dropdown.classList.add('hidden');
    });
  });
}

async function init() {
  await loadData();
  initFirebase();

  router = new Router([
    {
      path: '/', nav: 'home',
      handler: () => {
        cleanup(); prevView = 'home';
        document.getElementById('app-header').style.display = '';
        document.getElementById('bottom-nav').style.display = '';
        renderHome(menuData); window.scrollTo(0, 0);
      }
    },
    {
      path: '/menu/:category', nav: 'home',
      handler: ({ category }) => {
        cleanup(); prevView = 'menu';
        document.getElementById('app-header').style.display = '';
        document.getElementById('bottom-nav').style.display = '';
        renderMenu(menuData, category); window.scrollTo(0, 0);
      }
    },
    {
      path: '/dish/:id', nav: '',
      handler: ({ id }) => {
        cleanup(); prevView = 'dish';
        document.getElementById('app-header').style.display = 'none';
        renderDish(menuData, id); window.scrollTo(0, 0);
      }
    },
    {
      path: '/cart', nav: 'cart',
      handler: () => {
        cleanup(); prevView = 'cart';
        document.getElementById('app-header').style.display = '';
        document.getElementById('bottom-nav').style.display = '';
        renderCart(menuData); window.scrollTo(0, 0);
      }
    },
    {
      path: '/payment', nav: '',
      handler: () => {
        cleanup(); prevView = 'payment';
        document.getElementById('app-header').style.display = 'none';
        renderPayment(menuData); window.scrollTo(0, 0);
      }
    },
    {
      path: '/search', nav: 'search',
      handler: () => {
        cleanup(); prevView = 'search';
        document.getElementById('app-header').style.display = '';
        document.getElementById('bottom-nav').style.display = '';
        renderSearch(menuData); window.scrollTo(0, 0);
      }
    },
    {
      path: '/profile', nav: 'profile',
      handler: () => {
        cleanup(); prevView = 'profile';
        document.getElementById('app-header').style.display = '';
        document.getElementById('bottom-nav').style.display = '';
        document.getElementById('app').innerHTML = `
          <div class="px-5 py-20 text-center">
            <span class="material-symbols-outlined text-5xl text-on-surface-variant/30 mb-3">person</span>
            <h2 class="font-headline text-xl font-bold tracking-tighter text-on-surface mb-2">${t('nav.profile')}</h2>
            <p class="text-on-surface-variant text-sm">${t('app.coming_soon')}</p>
          </div>`;
      }
    }
  ]);

  store.onChange(updateCartBadge);
  updateCartBadge();
  updateStaticLabels();
  setupLangSelector();

  // Re-render on language change
  onLangChange(() => {
    updateStaticLabels();
    router.resolve(); // re-render current view
  });

  router.resolve();
}

init();