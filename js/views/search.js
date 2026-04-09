import { store } from '../store.js';
import { t, tDish } from '../i18n.js';
import { fmtPrice } from '../utils.js';

export function renderSearch(data) {
  const app = document.getElementById('app');

  app.innerHTML = `
    <div class="px-5 animate-[fadeIn_0.25s_ease-out]">
      <h2 class="font-headline text-2xl font-extrabold tracking-tighter mb-4">${t('nav.search')}</h2>
      <div class="relative mb-6">
        <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">search</span>
        <input id="search-input" type="text" autofocus placeholder="${t('search.placeholder')}" class="w-full bg-surface-container-low border border-outline-variant/30 rounded-full pl-11 pr-10 py-3 text-on-surface text-sm font-body placeholder:text-on-surface-variant/40 focus:border-primary focus:outline-none transition-colors">
        <button id="search-clear" class="hidden absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full hover:bg-surface-container-highest transition-colors">
          <span class="material-symbols-outlined text-on-surface-variant text-base">close</span>
        </button>
      </div>
      <div id="search-results"></div>
    </div>
  `;

  const input = document.getElementById('search-input');
  const results = document.getElementById('search-results');
  const clearBtn = document.getElementById('search-clear');

  function search(query) {
    const q = query.toLowerCase().trim();
    clearBtn.classList.toggle('hidden', !q);

    if (!q) {
      results.innerHTML = renderCategories(data);
      return;
    }

    const matches = data.dishes.filter(dish => {
      const name = tDish(dish, 'name').toLowerCase();
      const desc = tDish(dish, 'description').toLowerCase();
      const shortName = tDish(dish, 'shortName').toLowerCase();
      return name.includes(q) || desc.includes(q) || shortName.includes(q);
    });

    if (!matches.length) {
      results.innerHTML = `
        <div class="py-16 text-center">
          <span class="material-symbols-outlined text-4xl text-on-surface-variant/20 mb-2">search_off</span>
          <p class="text-on-surface-variant text-sm">${t('search.no_results')}</p>
        </div>`;
      return;
    }

    results.innerHTML = `
      <p class="text-on-surface-variant text-[10px] uppercase tracking-widest mb-4">${matches.length} ${t('search.found')}</p>
      <div class="space-y-3">
        ${matches.map(dish => `
          <a href="#/dish/${dish.id}" class="flex items-center gap-4 p-3 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors">
            <div class="w-16 h-16 rounded-DEFAULT overflow-hidden flex-shrink-0">
              <img class="w-full h-full object-cover" src="${dish.image}" alt="${tDish(dish, 'name')}" loading="lazy">
            </div>
            <div class="flex-grow min-w-0">
              <div class="flex justify-between items-start gap-2">
                <h3 class="font-headline font-bold text-sm text-on-surface truncate">${tDish(dish, 'shortName')}</h3>
                <span class="text-primary font-bold text-sm flex-shrink-0">${fmtPrice(dish.price)}</span>
              </div>
              <p class="text-[10px] text-on-surface-variant truncate mt-0.5">${tDish(dish, 'description')}</p>
              <div class="flex items-center gap-1 mt-1">
                <span class="material-symbols-outlined text-primary text-xs star-filled">star</span>
                <span class="text-primary text-[10px] font-bold">${dish.rating}</span>
                <span class="text-on-surface-variant text-[10px] ml-1">${t('search.cat_' + dish.category)}</span>
              </div>
            </div>
          </a>
        `).join('')}
      </div>
    `;
  }

  input.addEventListener('input', () => search(input.value));
  clearBtn.addEventListener('click', () => { input.value = ''; search(''); input.focus(); });

  // Show categories as initial state
  search('');
}

function renderCategories(data) {
  return `
    <p class="text-on-surface-variant text-[10px] uppercase tracking-widest mb-4">${t('search.browse')}</p>
    <div class="space-y-2">
      ${data.categories.map(cat => `
        <a href="#/menu/${cat.id}" class="flex items-center gap-4 p-4 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors">
          <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <span class="material-symbols-outlined text-primary">${cat.icon}</span>
          </div>
          <div>
            <h3 class="font-headline font-bold text-sm text-on-surface">${t('home.' + cat.id)}</h3>
            <p class="text-[10px] text-on-surface-variant">${data.dishes.filter(d => d.category === cat.id).length} ${t('search.items')}</p>
          </div>
          <span class="material-symbols-outlined text-on-surface-variant/40 ml-auto">chevron_right</span>
        </a>
      `).join('')}
    </div>
  `;
}

// fmtPrice imported from utils.js