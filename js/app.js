import { Router } from './router.js';
import { store } from './store.js';
import { renderHome } from './views/home.js';
import { renderMenu } from './views/menu.js';
import { renderDish, cleanupDish } from './views/dish.js';
import { renderCart } from './views/cart.js';
import { renderPayment, cleanupPayment } from './views/payment.js';

let menuData = null;
let prevView = null;

async function loadData() {
  const res = await fetch('data/menu.json');
  menuData = await res.json();
  // Set logo
  document.getElementById('header-logo').src = menuData.restaurant.logo;
}

function cleanup() {
  if (prevView === 'dish') cleanupDish();
  if (prevView === 'payment') cleanupPayment();
}

function updateCartBadge() {
  const badge = document.getElementById('cart-badge');
  const count = store.getCount();
  if (count > 0) {
    badge.textContent = count;
    badge.classList.remove('hidden');
  } else {
    badge.classList.add('hidden');
  }
}

async function init() {
  await loadData();

  const router = new Router([
    {
      path: '/',
      nav: 'home',
      handler: () => {
        cleanup();
        prevView = 'home';
        document.getElementById('app-header').style.display = '';
        document.getElementById('bottom-nav').style.display = '';
        renderHome(menuData);
        window.scrollTo(0, 0);
      }
    },
    {
      path: '/menu/:category',
      nav: 'home',
      handler: ({ category }) => {
        cleanup();
        prevView = 'menu';
        document.getElementById('app-header').style.display = '';
        document.getElementById('bottom-nav').style.display = '';
        renderMenu(menuData, category);
        window.scrollTo(0, 0);
      }
    },
    {
      path: '/dish/:id',
      nav: '',
      handler: ({ id }) => {
        cleanup();
        prevView = 'dish';
        document.getElementById('app-header').style.display = 'none';
        renderDish(menuData, id);
        window.scrollTo(0, 0);
      }
    },
    {
      path: '/cart',
      nav: 'cart',
      handler: () => {
        cleanup();
        prevView = 'cart';
        document.getElementById('app-header').style.display = '';
        document.getElementById('bottom-nav').style.display = '';
        renderCart(menuData);
        window.scrollTo(0, 0);
      }
    },
    {
      path: '/payment',
      nav: '',
      handler: () => {
        cleanup();
        prevView = 'payment';
        document.getElementById('app-header').style.display = 'none';
        renderPayment(menuData);
        window.scrollTo(0, 0);
      }
    },
    {
      path: '/search',
      nav: 'search',
      handler: () => {
        cleanup();
        prevView = 'search';
        document.getElementById('app-header').style.display = '';
        document.getElementById('bottom-nav').style.display = '';
        document.getElementById('app').innerHTML = `
          <div class="px-5 py-20 text-center">
            <span class="material-symbols-outlined text-5xl text-on-surface-variant/30 mb-3">search</span>
            <h2 class="font-headline text-xl font-bold tracking-tighter text-on-surface mb-2">Search</h2>
            <p class="text-on-surface-variant text-sm">Coming soon</p>
          </div>
        `;
      }
    },
    {
      path: '/profile',
      nav: 'profile',
      handler: () => {
        cleanup();
        prevView = 'profile';
        document.getElementById('app-header').style.display = '';
        document.getElementById('bottom-nav').style.display = '';
        document.getElementById('app').innerHTML = `
          <div class="px-5 py-20 text-center">
            <span class="material-symbols-outlined text-5xl text-on-surface-variant/30 mb-3">person</span>
            <h2 class="font-headline text-xl font-bold tracking-tighter text-on-surface mb-2">Profile</h2>
            <p class="text-on-surface-variant text-sm">Coming soon</p>
          </div>
        `;
      }
    }
  ]);

  // Listen to cart changes for badge
  store.onChange(updateCartBadge);
  updateCartBadge();

  // Initial route
  router.resolve();
}

init();