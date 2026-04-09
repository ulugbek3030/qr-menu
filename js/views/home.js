import { store } from '../store.js';
import { t, tDish } from '../i18n.js';
import { fmtPrice, WIFI } from '../utils.js';

export function renderHome(data) {
  const specials = data.dishes.filter(d => d.tags.includes('specials'));
  const app = document.getElementById('app');

  app.innerHTML = `
    <div class="px-5 space-y-10 animate-[fadeIn_0.25s_ease-out]">
      <!-- Wi-Fi Button -->
      <button id="wifi-btn" class="w-full flex items-center gap-4 p-4 rounded-lg bg-surface-container-low border border-outline-variant/10 hover:border-primary/30 transition-all active:scale-[0.98] group">
        <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
          <span class="material-symbols-outlined text-primary text-2xl">wifi</span>
        </div>
        <div class="text-left flex-grow">
          <p class="font-headline font-bold text-sm text-on-surface">${t('wifi.title')}</p>
          <p class="text-on-surface-variant text-[10px] uppercase tracking-widest">Dionis</p>
        </div>
        <span class="material-symbols-outlined text-on-surface-variant/40 group-hover:text-primary transition-colors">chevron_right</span>
      </button>

      <!-- Today's Specials -->
      <section class="space-y-4">
        <div>
          <span class="text-primary font-label text-[10px] uppercase tracking-[0.3em] font-bold">${t('home.selected')}</span>
          <h2 class="text-2xl font-headline font-extrabold tracking-tighter mt-0.5">${t('home.specials')}</h2>
        </div>
        <div class="flex overflow-x-auto gap-4 no-scrollbar -mx-5 px-5 snap-x">
          ${specials.map(dish => `
            <a href="#/dish/${dish.id}" class="flex-none w-[78%] snap-center relative aspect-[4/5] rounded-lg overflow-hidden group">
              <img alt="${tDish(dish, 'name')}" class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src="${dish.image}" loading="lazy">
              <div class="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
              <div class="absolute bottom-0 p-5 space-y-1.5">
                ${dish.badges.length ? `
                  <div class="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/20 backdrop-blur-md rounded-md">
                    <span class="material-symbols-outlined text-primary text-xs star-filled">star</span>
                    <span class="text-[9px] text-primary font-bold uppercase tracking-widest">${dish.badges[0]}</span>
                  </div>
                ` : ''}
                <h3 class="text-xl font-headline font-bold leading-tight text-shadow-sm">${tDish(dish, 'name')}</h3>
                <p class="text-primary font-headline font-bold">${formatPrice(dish.price)}</p>
              </div>
            </a>
          `).join('')}
        </div>
      </section>

      <!-- Explore Categories -->
      <section class="space-y-6">
        <h2 class="text-center text-on-surface-variant font-label text-[10px] uppercase tracking-[0.4em]">${t('home.explore')}</h2>
        <div class="grid grid-cols-1 gap-4">
          <a href="#/menu/kitchen" class="relative min-h-[280px] rounded-lg overflow-hidden group">
            <img alt="${t('home.kitchen')}" class="absolute inset-0 w-full h-full object-cover transition-all duration-500" src="${data.categoryImages.kitchen}" loading="lazy">
            <div class="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
            <div class="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              <span class="font-headline text-4xl font-extrabold tracking-tighter text-white drop-shadow-2xl text-shadow-sm">${t('home.kitchen')}</span>
              <div class="w-10 h-0.5 bg-primary mt-3 mb-3 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              <p class="text-on-surface/70 max-w-[200px] text-xs leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500">${t('home.kitchen_desc')}</p>
              <span class="mt-5 px-6 py-2.5 gold-gradient text-black font-label font-bold text-[10px] uppercase tracking-widest rounded-full transform translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">${t('home.open_menu')}</span>
            </div>
          </a>
          <div class="grid grid-cols-2 gap-3 h-[200px]">
            <a href="#/menu/bar" class="relative rounded-lg overflow-hidden group">
              <img alt="${t('home.bar')}" class="absolute inset-0 w-full h-full object-cover" src="${data.categoryImages.bar}" loading="lazy">
              <div class="absolute inset-0 bg-background/60 group-hover:bg-background/40 transition-colors"></div>
              <div class="absolute inset-0 flex flex-col items-center justify-center p-3">
                <span class="font-headline text-xl font-bold text-white text-shadow-sm">${t('home.bar')}</span>
                <span class="text-primary text-[9px] uppercase tracking-widest font-bold mt-1.5">${t('home.bar_sub')}</span>
              </div>
            </a>
            <a href="#/menu/hookah" class="relative rounded-lg overflow-hidden group">
              <img alt="${t('home.hookah')}" class="absolute inset-0 w-full h-full object-cover" src="${data.categoryImages.hookah}" loading="lazy">
              <div class="absolute inset-0 bg-background/60 group-hover:bg-background/40 transition-colors"></div>
              <div class="absolute inset-0 flex flex-col items-center justify-center p-3">
                <span class="font-headline text-xl font-bold text-white text-shadow-sm">${t('home.hookah')}</span>
                <span class="text-primary text-[9px] uppercase tracking-widest font-bold mt-1.5">${t('home.hookah_sub')}</span>
              </div>
            </a>
          </div>
        </div>
      </section>

      <!-- Signature Dish -->
      ${renderSignatureDish(data.dishes.find(d => d.id === 'ganache'))}
    </div>
  `;

  // Wi-Fi button handler
  document.getElementById('wifi-btn').addEventListener('click', () => openWifiModal());
}

function renderSignatureDish(dish) {
  if (!dish) return '';
  return `
    <section class="pb-4">
      <div class="bg-surface-container-low rounded-lg overflow-hidden">
        <a href="#/dish/${dish.id}" class="block">
          <div class="relative aspect-video overflow-hidden">
            <img alt="${tDish(dish, 'name')}" class="w-full h-full object-cover" src="${dish.image}" loading="lazy">
            <div class="absolute inset-0 bg-gradient-to-t from-surface-container-lowest to-transparent"></div>
          </div>
          <div class="p-6 -mt-10 relative z-10">
            <div class="flex justify-between items-start">
              <div>
                <span class="text-primary-fixed-dim text-[9px] uppercase tracking-widest font-black">${t('home.signature')}</span>
                <h3 class="text-2xl font-headline font-extrabold tracking-tighter mt-0.5 text-shadow-sm">${tDish(dish, 'name')}</h3>
                <p class="text-on-surface-variant text-xs mt-2 leading-relaxed max-w-[200px] italic">${tDish(dish, 'description')}</p>
              </div>
              <span class="text-xl font-headline font-bold text-primary">${formatPrice(dish.price)}</span>
            </div>
          </div>
        </a>
      </div>
    </section>
  `;
}

// fmtPrice + WIFI imported from utils.js
function formatPrice(p) { return fmtPrice(p); }

function openWifiModal() {
  const existing = document.getElementById('wifi-modal');
  if (existing) existing.remove();

  // WIFI: QR code string format
  const wifiString = `WIFI:T:${WIFI.encryption};S:${WIFI.ssid};P:${WIFI.password};;`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&bgcolor=131313&color=f2ca50&data=${encodeURIComponent(wifiString)}`;

  const modal = document.createElement('div');
  modal.id = 'wifi-modal';
  modal.className = 'review-modal-backdrop fixed inset-0 z-[60] bg-background/80 backdrop-blur-md flex items-center justify-center p-6 overflow-y-auto';
  modal.innerHTML = `
    <div class="review-modal-sheet w-full max-w-sm bg-surface-container rounded-[2rem] p-5 space-y-4 my-auto">
      <!-- Header + Close -->
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
            <span class="material-symbols-outlined text-primary text-lg">wifi</span>
          </div>
          <h3 class="font-headline text-lg font-bold tracking-tighter">${t('wifi.title')}</h3>
        </div>
        <button id="close-wifi" class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container-highest transition-colors">
          <span class="material-symbols-outlined text-on-surface-variant text-xl">close</span>
        </button>
      </div>

      <!-- QR + Info side by side -->
      <div class="flex gap-4 items-center">
        <div class="flex-shrink-0 bg-[#131313] p-2 rounded-lg">
          <img src="${qrUrl}" alt="Wi-Fi QR" width="110" height="110" class="rounded">
        </div>
        <div class="space-y-3 flex-grow">
          <div>
            <p class="text-on-surface-variant text-[9px] uppercase tracking-widest">${t('wifi.network')}</p>
            <p class="text-on-surface font-headline font-bold text-base">${WIFI.ssid}</p>
          </div>
          <div>
            <p class="text-on-surface-variant text-[9px] uppercase tracking-widest">${t('wifi.password')}</p>
            <div class="flex items-center gap-1.5">
              <p class="text-on-surface font-mono text-base">${WIFI.password}</p>
              <button id="copy-pw" class="w-7 h-7 flex items-center justify-center rounded-full hover:bg-primary/10 transition-colors active:scale-90">
                <span class="material-symbols-outlined text-primary text-sm">content_copy</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <p class="text-on-surface-variant text-[10px] text-center">${t('wifi.scan_qr')}</p>

      <!-- Copy Password Button -->
      <button id="wifi-connect" class="w-full py-3.5 rounded-full gold-gradient text-on-primary font-headline font-bold uppercase tracking-[0.15em] text-sm text-center active:scale-95 transition-all shadow-[0_8px_32px_rgba(212,175,55,0.15)]">
        <span class="material-symbols-outlined text-base align-middle mr-1">content_copy</span>
        ${t('wifi.connect')}
      </button>
    </div>
  `;

  document.body.appendChild(modal);

  // Close
  const close = () => modal.remove();
  modal.querySelector('#close-wifi').addEventListener('click', close);
  modal.addEventListener('click', (e) => { if (e.target === modal) close(); });

  // Copy password
  modal.querySelector('#copy-pw').addEventListener('click', () => {
    navigator.clipboard.writeText(WIFI.password).then(() => {
      const btn = modal.querySelector('#copy-pw span');
      btn.textContent = 'check';
      setTimeout(() => { btn.textContent = 'content_copy'; }, 1500);
    }).catch(() => {});
  });

  // Connect button — copies password + closes
  modal.querySelector('#wifi-connect').addEventListener('click', () => {
    navigator.clipboard.writeText(WIFI.password).catch(() => {});
    const btn = modal.querySelector('#wifi-connect');
    btn.innerHTML = '<span class="material-symbols-outlined text-base align-middle mr-1">check</span> ' + t('menu.added');
    setTimeout(() => { modal.remove(); }, 1000);
  });
}