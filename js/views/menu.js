import { store } from '../store.js';
import { t, tDish } from '../i18n.js';
import { fmtPrice, esc } from '../utils.js';

export function renderMenu(data, category) {
  const cat = data.categories.find(c => c.id === category);
  const allDishes = data.dishes.filter(d => d.category === category);
  const app = document.getElementById('app');
  const catName = cat ? esc(cat.name) : t('nav.menu');

  if (!allDishes.length) {
    app.innerHTML = `
      <div class="px-5 animate-[fadeIn_0.25s_ease-out]">
        <div class="flex items-center gap-3 mb-6">
          <button onclick="history.back()" class="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#D4AF37]/10 transition-colors active:scale-95"><span class="material-symbols-outlined text-[#D4AF37]">arrow_back</span></button>
          <h1 class="font-headline text-2xl font-extrabold tracking-tighter uppercase">${catName}</h1>
        </div>
        <p class="text-center text-on-surface-variant py-12 text-sm">${t('menu.empty')}</p>
      </div>`;
    return;
  }

  app.innerHTML = `
    <div class="px-5 animate-[fadeIn_0.25s_ease-out]">
      <div class="flex items-center gap-3 mb-6">
        <button onclick="history.back()" class="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#D4AF37]/10 transition-colors active:scale-95"><span class="material-symbols-outlined text-[#D4AF37]">arrow_back</span></button>
        <h1 class="font-headline text-2xl font-extrabold tracking-tighter uppercase">${catName}</h1>
        <span class="text-on-surface-variant text-xs ml-auto">${allDishes.length}</span>
      </div>
      <div id="dishes-grid" class="space-y-4">
        ${renderDishes(allDishes)}
      </div>
    </div>
  `;

  attachAddButtons(allDishes);
}

function renderDishes(dishes) {
  return dishes.map(dish => {
    const hasImage = !!dish.image;
    return hasImage ? `
      <div class="bg-surface-container-low rounded-lg overflow-hidden group">
        <a href="#/dish/${dish.id}" class="block relative aspect-[16/10] overflow-hidden">
          <img class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src="${dish.image}" alt="${esc(tDish(dish, 'name'))}" loading="lazy">
          <div class="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent"></div>
          <div class="absolute bottom-0 left-0 p-4 w-full">
            <h3 class="font-headline text-lg font-bold text-on-surface">${esc(tDish(dish, 'name'))}</h3>
            <div class="flex items-center justify-between mt-1">
              <span class="text-primary font-bold">${fmtPrice(dish.price)}</span>
              <button data-add="${dish.id}" class="add-btn px-5 py-2 rounded-full gold-gradient text-on-primary font-bold tracking-widest text-[10px] uppercase active:scale-95 transition-all">${t('menu.add')}</button>
            </div>
          </div>
        </a>
      </div>
    ` : `
      <div class="bg-surface-container-low rounded-lg p-4 flex items-center gap-4">
        <a href="#/dish/${dish.id}" class="flex-grow min-w-0">
          <h3 class="font-headline text-base font-bold text-on-surface truncate">${esc(tDish(dish, 'name'))}</h3>
          ${dish.description ? `<p class="text-on-surface-variant text-xs truncate mt-0.5">${esc(tDish(dish, 'description'))}</p>` : ''}
        </a>
        <span class="text-primary font-bold text-sm flex-shrink-0">${fmtPrice(dish.price)}</span>
        <button data-add="${dish.id}" class="add-btn w-9 h-9 flex items-center justify-center rounded-full border border-outline-variant text-on-surface hover:bg-primary hover:text-on-primary hover:border-primary transition-all flex-shrink-0">
          <span class="material-symbols-outlined text-base">add</span>
        </button>
      </div>
    `;
  }).join('');
}

function attachAddButtons(allDishes) {
  document.querySelectorAll('.add-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const dish = allDishes.find(d => d.id === btn.dataset.add);
      if (dish) {
        store.addItem(dish);
        // Feedback
        const orig = btn.innerHTML;
        if (btn.querySelector('span')) {
          btn.querySelector('span').textContent = 'check';
        } else {
          btn.textContent = t('menu.added');
        }
        btn.classList.add('bg-primary', 'text-on-primary', 'border-primary');
        setTimeout(() => {
          btn.innerHTML = orig;
          btn.classList.remove('bg-primary', 'text-on-primary', 'border-primary');
        }, 1200);
      }
    });
  });
}