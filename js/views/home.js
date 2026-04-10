import { store } from '../store.js';
import { t, tDish } from '../i18n.js';
import { fmtPrice, WIFI, esc } from '../utils.js';

export function renderHome(data) {
  const app = document.getElementById('app');
  const categories = data.categories || [];
  // Pick dishes with images for the specials carousel
  const specials = data.dishes.filter(d => d.image).slice(0, 6);

  app.innerHTML = `
    <div class="px-5 space-y-8 animate-[fadeIn_0.25s_ease-out]">
      <!-- Wi-Fi -->
      <button id="wifi-btn" class="w-full flex items-center gap-4 p-4 rounded-lg bg-surface-container-low border border-outline-variant/10 hover:border-primary/30 transition-all active:scale-[0.98] group">
        <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
          <span class="material-symbols-outlined text-primary text-2xl">wifi</span>
        </div>
        <div class="text-left flex-grow">
          <p class="font-headline font-bold text-sm text-on-surface">${t('wifi.title')}</p>
          <p class="text-on-surface-variant text-[10px] uppercase tracking-widest">${WIFI.ssid}</p>
        </div>
        <span class="material-symbols-outlined text-on-surface-variant/40 group-hover:text-primary transition-colors">chevron_right</span>
      </button>

      ${specials.length ? `
      <!-- Popular Dishes Carousel -->
      <section class="space-y-4">
        <div>
          <span class="text-primary font-label text-[10px] uppercase tracking-[0.3em] font-bold">${t('home.selected')}</span>
          <h2 class="text-2xl font-headline font-extrabold tracking-tighter mt-0.5">${t('home.specials')}</h2>
        </div>
        <div class="flex overflow-x-auto gap-4 no-scrollbar -mx-5 px-5 snap-x">
          ${specials.map(dish => `
            <a href="#/dish/${dish.id}" class="flex-none w-[78%] snap-center relative aspect-[4/5] rounded-lg overflow-hidden group">
              <img alt="${esc(tDish(dish, 'name'))}" class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src="${dish.image}" loading="lazy">
              <div class="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
              <div class="absolute bottom-0 p-5 space-y-1.5">
                <h3 class="text-xl font-headline font-bold leading-tight text-shadow-sm">${esc(tDish(dish, 'name'))}</h3>
                <p class="text-primary font-headline font-bold">${fmtPrice(dish.price)}</p>
              </div>
            </a>
          `).join('')}
        </div>
      </section>
      ` : ''}

      <!-- Categories -->
      <section class="space-y-4">
        <h2 class="text-center text-on-surface-variant font-label text-[10px] uppercase tracking-[0.4em]">${t('home.explore')}</h2>
        <div class="grid grid-cols-2 gap-3">
          ${categories.map(cat => {
            const img = data.categoryImages?.[cat.id] || '';
            const count = data.dishes.filter(d => d.category === cat.id).length;
            return `
              <a href="#/menu/${cat.id}" class="relative rounded-lg overflow-hidden group ${img ? 'min-h-[140px]' : 'p-5 bg-surface-container-low hover:bg-surface-container'}">
                ${img ? `
                  <img class="absolute inset-0 w-full h-full object-cover" src="${img}" loading="lazy">
                  <div class="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors"></div>
                  <div class="relative flex flex-col items-center justify-center min-h-[140px] p-3 text-center">
                    <span class="material-symbols-outlined text-primary text-xl mb-1">${cat.icon || 'restaurant'}</span>
                    <span class="font-headline text-base font-bold text-white text-shadow-sm">${esc(cat.name)}</span>
                    <span class="text-on-surface-variant text-[9px] mt-0.5">${count}</span>
                  </div>
                ` : `
                  <div class="flex flex-col items-center text-center">
                    <span class="material-symbols-outlined text-primary text-2xl mb-2">${cat.icon || 'restaurant'}</span>
                    <span class="font-headline text-sm font-bold text-on-surface">${esc(cat.name)}</span>
                    <span class="text-on-surface-variant text-[9px] mt-0.5">${count}</span>
                  </div>
                `}
              </a>
            `;
          }).join('')}
        </div>
      </section>
    </div>
  `;

  document.getElementById('wifi-btn').addEventListener('click', () => openWifiModal());
}

function openWifiModal() {
  const existing = document.getElementById('wifi-modal');
  if (existing) existing.remove();

  const wifiString = `WIFI:T:${WIFI.encryption};S:${WIFI.ssid};P:${WIFI.password};;`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&bgcolor=131313&color=f2ca50&data=${encodeURIComponent(wifiString)}`;

  const modal = document.createElement('div');
  modal.id = 'wifi-modal';
  modal.className = 'review-modal-backdrop fixed inset-0 z-[60] bg-background/80 backdrop-blur-md flex items-center justify-center p-6 overflow-y-auto';
  modal.innerHTML = `
    <div class="review-modal-sheet w-full max-w-sm bg-surface-container rounded-[2rem] p-5 space-y-4 my-auto">
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center"><span class="material-symbols-outlined text-primary text-lg">wifi</span></div>
          <h3 class="font-headline text-lg font-bold tracking-tighter">${t('wifi.title')}</h3>
        </div>
        <button id="close-wifi" class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container-highest transition-colors"><span class="material-symbols-outlined text-on-surface-variant text-xl">close</span></button>
      </div>
      <div class="flex gap-4 items-center">
        <div class="flex-shrink-0 bg-[#131313] p-2 rounded-lg"><img src="${qrUrl}" alt="Wi-Fi QR" width="110" height="110" class="rounded"></div>
        <div class="space-y-3 flex-grow">
          <div><p class="text-on-surface-variant text-[9px] uppercase tracking-widest">${t('wifi.network')}</p><p class="text-on-surface font-headline font-bold text-base">${WIFI.ssid}</p></div>
          <div><p class="text-on-surface-variant text-[9px] uppercase tracking-widest">${t('wifi.password')}</p><div class="flex items-center gap-1.5"><p class="text-on-surface font-mono text-base">${WIFI.password}</p><button id="copy-pw" class="w-7 h-7 flex items-center justify-center rounded-full hover:bg-primary/10 transition-colors active:scale-90"><span class="material-symbols-outlined text-primary text-sm">content_copy</span></button></div></div>
        </div>
      </div>
      <p class="text-on-surface-variant text-[10px] text-center">${t('wifi.scan_qr')}</p>
      <button id="wifi-connect" class="w-full py-3.5 rounded-full gold-gradient text-on-primary font-headline font-bold uppercase tracking-[0.15em] text-sm text-center active:scale-95 transition-all shadow-[0_8px_32px_rgba(212,175,55,0.15)]"><span class="material-symbols-outlined text-base align-middle mr-1">content_copy</span> ${t('wifi.connect')}</button>
    </div>`;

  document.body.appendChild(modal);
  modal.querySelector('#close-wifi').addEventListener('click', () => modal.remove());
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
  modal.querySelector('#copy-pw').addEventListener('click', () => {
    navigator.clipboard.writeText(WIFI.password).then(() => {
      modal.querySelector('#copy-pw span').textContent = 'check';
      setTimeout(() => { modal.querySelector('#copy-pw span').textContent = 'content_copy'; }, 1500);
    }).catch(() => {});
  });
  modal.querySelector('#wifi-connect').addEventListener('click', () => {
    navigator.clipboard.writeText(WIFI.password).catch(() => {});
    modal.querySelector('#wifi-connect').innerHTML = '<span class="material-symbols-outlined text-base align-middle mr-1">check</span> Скопировано!';
    setTimeout(() => modal.remove(), 1000);
  });
}