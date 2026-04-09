import { store } from '../store.js';
import { t, tDish } from '../i18n.js';
import { fmtPrice } from '../utils.js';

const FILTERS = [
  { id: 'popular', key: 'menu.popular' },
  { id: 'new', key: 'menu.new' },
  { id: 'healthy', key: 'menu.healthy' },
  { id: 'specials', key: 'menu.specials' }
];

let activeFilter = 'popular';
let lastCategory = null;

export function renderMenu(data, category) {
  // Reset filter when switching categories
  if (category !== lastCategory) { activeFilter = 'popular'; lastCategory = category; }
  const cat = data.categories.find(c => c.id === category);
  const allDishes = data.dishes.filter(d => d.category === category);
  const app = document.getElementById('app');
  const catName = cat ? t('home.' + cat.id) || cat.name : t('nav.menu');

  app.innerHTML = `
    <div class="px-5 animate-[fadeIn_0.25s_ease-out]">
      <div class="flex items-center gap-3 mb-6">
        <button onclick="history.back()" class="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#D4AF37]/10 transition-colors active:scale-95">
          <span class="material-symbols-outlined text-[#D4AF37]">arrow_back</span>
        </button>
        <h1 class="font-headline text-2xl font-extrabold tracking-tighter uppercase">${catName}</h1>
      </div>
      <div class="flex gap-2 overflow-x-auto pb-4 no-scrollbar -mx-5 px-5 mb-6">
        ${FILTERS.map(f => `
          <button data-filter="${f.id}" class="filter-btn whitespace-nowrap px-5 py-2 rounded-full font-medium text-sm transition-all ${activeFilter === f.id ? 'bg-primary text-on-primary shadow-lg shadow-primary/10' : 'bg-surface-container-highest text-on-surface-variant hover:text-primary'}">${t(f.key)}</button>
        `).join('')}
      </div>
      <div id="dishes-grid" class="space-y-6">
        ${renderDishes(allDishes, activeFilter)}
      </div>
    </div>
  `;

  app.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeFilter = btn.dataset.filter;
      app.querySelectorAll('.filter-btn').forEach(b => {
        b.className = b.className.replace(/bg-primary text-on-primary shadow-lg shadow-primary\/10|bg-surface-container-highest text-on-surface-variant hover:text-primary/g, '');
        if (b.dataset.filter === activeFilter) {
          b.classList.add('bg-primary', 'text-on-primary', 'shadow-lg', 'shadow-primary/10');
        } else {
          b.classList.add('bg-surface-container-highest', 'text-on-surface-variant', 'hover:text-primary');
        }
      });
      document.getElementById('dishes-grid').innerHTML = renderDishes(allDishes, activeFilter);
      attachAddButtons(allDishes);
    });
  });

  attachAddButtons(allDishes);
}

function renderDishes(allDishes, filter) {
  const dishes = allDishes.filter(d => d.tags.includes(filter));
  if (!dishes.length) {
    return `<p class="text-center text-on-surface-variant py-12 text-sm">${t('menu.empty')}</p>`;
  }

  const hero = dishes[0];
  const rest = dishes.slice(1);

  return `
    <a href="#/dish/${hero.id}" class="block relative group overflow-hidden rounded-lg bg-surface-container-low">
      <div class="aspect-[16/9] w-full relative">
        <img class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="${hero.image}" alt="${tDish(hero, 'name')}" loading="lazy">
        <div class="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
        <div class="absolute bottom-0 left-0 p-5 w-full">
          <div class="flex items-center gap-2 mb-1.5">
            <span class="material-symbols-outlined text-primary text-sm star-filled">star</span>
            <span class="text-primary font-bold text-xs tracking-widest">${hero.rating}</span>
          </div>
          <h2 class="font-headline text-2xl font-extrabold tracking-tighter text-on-surface uppercase">${tDish(hero, 'shortName')}</h2>
          <p class="font-body text-on-surface-variant text-xs mt-1 line-clamp-2">${tDish(hero, 'description')}</p>
          <div class="flex items-center justify-between mt-3">
            <span class="text-xl font-headline font-bold text-primary">${formatPrice(hero.price)}</span>
            <button data-add="${hero.id}" class="add-btn px-6 py-2.5 rounded-full gold-gradient text-on-primary font-bold tracking-widest text-[10px] uppercase active:scale-95 transition-all">${t('menu.add')}</button>
          </div>
        </div>
      </div>
    </a>
    ${rest.map(dish => `
      <div class="bg-surface-container-low rounded-lg overflow-hidden group">
        <a href="#/dish/${dish.id}" class="block aspect-square relative overflow-hidden">
          <img class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src="${dish.image}" alt="${tDish(dish, 'name')}" loading="lazy">
          <div class="absolute top-3 right-3 bg-background/60 backdrop-blur-md px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <span class="material-symbols-outlined text-primary text-xs star-filled">star</span>
            <span class="text-primary text-[10px] font-bold">${dish.rating}</span>
          </div>
        </a>
        <div class="p-5">
          <div class="flex justify-between items-start mb-1.5">
            <h3 class="font-headline text-lg font-bold tracking-tight text-on-surface uppercase">${tDish(dish, 'shortName')}</h3>
            <span class="text-primary font-bold text-sm">${formatPrice(dish.price)}</span>
          </div>
          <p class="font-body text-on-surface-variant text-xs mb-4 line-clamp-2">${tDish(dish, 'description')}</p>
          <button data-add="${dish.id}" class="add-btn w-full py-2.5 rounded-full border border-outline-variant text-on-surface text-[10px] font-bold tracking-widest uppercase hover:bg-primary hover:text-on-primary hover:border-primary transition-all">${t('menu.add')}</button>
        </div>
      </div>
    `).join('')}
  `;
}

function attachAddButtons(allDishes) {
  document.querySelectorAll('.add-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const dish = allDishes.find(d => d.id === btn.dataset.add);
      if (dish) {
        store.addItem(dish);
        btn.textContent = t('menu.added');
        btn.classList.add('bg-primary', 'text-on-primary', 'border-primary');
        setTimeout(() => {
          btn.textContent = t('menu.add');
          btn.classList.remove('bg-primary', 'text-on-primary', 'border-primary');
        }, 1200);
      }
    });
  });
}

function formatPrice(p) { return fmtPrice(p); }