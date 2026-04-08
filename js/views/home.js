import { store } from '../store.js';
import { t, tDish } from '../i18n.js';

export function renderHome(data) {
  const specials = data.dishes.filter(d => d.tags.includes('specials'));
  const app = document.getElementById('app');

  app.innerHTML = `
    <div class="px-5 space-y-10 animate-[fadeIn_0.25s_ease-out]">
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

function formatPrice(price) {
  return price.toLocaleString('en-US').replace(/,/g, ' ') + ' ' + t('fmt.sum');
}