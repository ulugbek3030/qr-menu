import { store } from '../store.js';
import { t, tDish } from '../i18n.js';
import { esc, fmtPrice } from '../utils.js';

// Resolve translated dish name from menuData, fallback to stored English
function dishName(item, data, field) {
  const dish = data.dishes.find(d => d.id === item.id);
  return dish ? esc(tDish(dish, field)) : esc(item[field]);
}

export function renderCart(data) {
  const app = document.getElementById('app');
  const render = () => {
    const cart = store.getCart();
    const subtotal = store.getSubtotal();
    const taxRate = data.restaurant.taxRate;
    const tax = Math.round(subtotal * taxRate);
    const total = subtotal + tax;
    const split = store.getSplit();
    const perPerson = split.enabled && split.guests > 0 ? Math.ceil(total / split.guests) : total;

    if (!cart.length) {
      app.innerHTML = `
        <div class="px-5 py-20 text-center animate-[fadeIn_0.25s_ease-out]">
          <span class="material-symbols-outlined text-6xl text-on-surface-variant/30 mb-4">shopping_bag</span>
          <h2 class="font-headline text-2xl font-bold tracking-tighter text-on-surface mb-2">${t('cart.empty_title')}</h2>
          <p class="text-on-surface-variant text-sm mb-8">${t('cart.empty_desc')}</p>
          <a href="#/" class="inline-block px-8 py-3 gold-gradient text-black font-label font-bold text-xs uppercase tracking-widest rounded-full">${t('cart.browse')}</a>
        </div>`;
      return;
    }

    app.innerHTML = `
      <div class="px-5 space-y-8 animate-[fadeIn_0.25s_ease-out]">
        <section class="space-y-1">
          <h2 class="font-headline text-3xl font-extrabold tracking-tighter text-on-surface">${t('cart.selection')}</h2>
          <p class="font-body text-on-surface-variant text-sm opacity-80">${t('cart.selection_sub')}</p>
        </section>

        <section class="space-y-4">
          ${cart.map(item => `
            <div class="flex items-center gap-4 p-3 rounded-lg bg-surface-container-low">
              <div class="w-20 h-20 rounded-DEFAULT overflow-hidden flex-shrink-0">
                <img alt="${dishName(item, data, 'shortName')}" class="w-full h-full object-cover" src="${item.image}" loading="lazy">
              </div>
              <div class="flex-grow space-y-1 min-w-0">
                <div class="flex justify-between items-start gap-2">
                  <h3 class="font-headline font-bold text-base text-on-surface truncate">${dishName(item, data, 'shortName')}</h3>
                  <span class="font-label text-primary text-sm font-semibold tracking-tighter flex-shrink-0">${fmtPrice(item.price * item.qty)}</span>
                </div>
                <p class="text-[10px] text-on-surface-variant leading-relaxed truncate">${dishName(item, data, 'description')}</p>
                <div class="flex items-center justify-between pt-1">
                  <div class="flex items-center bg-surface-container-lowest rounded-full p-0.5">
                    <button data-qty-minus="${item.id}" class="w-6 h-6 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"><span class="material-symbols-outlined text-sm">remove</span></button>
                    <span class="px-2.5 font-label text-xs">${String(item.qty).padStart(2, '0')}</span>
                    <button data-qty-plus="${item.id}" class="w-6 h-6 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"><span class="material-symbols-outlined text-sm">add</span></button>
                  </div>
                  <button data-remove="${item.id}" class="text-on-surface-variant/40 hover:text-error transition-colors"><span class="material-symbols-outlined text-lg">delete</span></button>
                </div>
              </div>
            </div>
          `).join('')}
        </section>

        <section class="bg-surface-container rounded-lg p-6 space-y-6 border-t border-white/5">
          <div class="flex justify-between items-center">
            <div class="space-y-0.5">
              <h3 class="font-headline text-lg font-bold tracking-tight text-on-surface">${t('cart.split')}</h3>
              <p class="font-body text-[10px] text-on-surface-variant">${t('cart.split_desc')}</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input id="split-toggle" type="checkbox" class="sr-only peer" ${split.enabled ? 'checked' : ''}>
              <div class="w-11 h-6 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          ${split.enabled ? `
            <div class="grid grid-cols-3 gap-2">
              ${[['equally', 'balance', 'cart.equally'], ['items', 'checklist', 'cart.by_items'], ['custom', 'edit_square', 'cart.custom']].map(([mode, icon, key]) => `
                <button data-split-mode="${mode}" class="split-mode-btn flex flex-col items-center gap-1.5 p-3 rounded-lg transition-all ${split.mode === mode ? 'bg-primary text-black' : 'bg-surface-container-highest text-on-surface-variant hover:text-primary'}">
                  <span class="material-symbols-outlined text-lg">${icon}</span>
                  <span class="font-label text-[9px] uppercase tracking-widest font-bold">${t(key)}</span>
                </button>
              `).join('')}
            </div>
            <div class="space-y-3">
              <div class="flex items-center justify-between text-[10px] font-label uppercase tracking-widest text-on-surface-variant/60">
                <span>${t('cart.guests')}</span><span>${split.guests} ${t('cart.selected')}</span>
              </div>
              <div class="flex gap-3">
                ${[2, 3, 4].map(n => `
                  <button data-guests="${n}" class="guest-btn w-12 h-12 rounded-full flex items-center justify-center font-headline font-bold transition-all ${split.guests === n ? 'bg-primary text-black ring-2 ring-primary ring-offset-2 ring-offset-surface-container' : 'bg-surface-container-highest text-on-surface-variant hover:text-primary'}">${n}</button>
                `).join('')}
                <button id="add-guest-btn" class="w-12 h-12 rounded-full border-2 border-dashed border-outline-variant flex items-center justify-center text-outline hover:border-primary hover:text-primary transition-all"><span class="material-symbols-outlined text-lg">person_add</span></button>
              </div>
            </div>
            <div class="pt-3 border-t border-outline-variant/30">
              <div class="flex justify-between items-center text-sm font-label"><span class="text-on-surface-variant">${t('cart.each_pays')}</span><span class="text-primary font-bold text-lg">${fmtPrice(perPerson)}</span></div>
            </div>
          ` : ''}
        </section>

        <section class="space-y-3 pt-2">
          <div class="flex justify-between items-center text-sm font-label uppercase tracking-widest text-on-surface-variant"><span>${t('cart.subtotal')}</span><span>${fmtPrice(subtotal)}</span></div>
          <div class="flex justify-between items-center text-sm font-label uppercase tracking-widest text-on-surface-variant"><span>${t('cart.tax')} (${Math.round(taxRate * 100)}%)</span><span>${fmtPrice(tax)}</span></div>
          <div class="h-px bg-surface-container-highest"></div>
          <div class="flex justify-between items-center py-1">
            <span class="font-headline text-xl font-extrabold tracking-tighter text-on-surface">${t('cart.total')}</span>
            <span class="font-headline text-2xl font-extrabold tracking-tighter text-primary">${fmtPrice(total)}</span>
          </div>
        </section>

        <section class="pb-4">
          <a href="#/payment" class="block w-full gold-gradient text-black py-4 rounded-full font-headline font-bold uppercase tracking-[0.15em] text-center shadow-[0_8px_32px_rgba(212,175,55,0.2)] active:scale-95 transition-transform text-sm">${t('cart.proceed')}</a>
        </section>
      </div>
    `;
    attachCartHandlers(render);
  };
  render();
}

function attachCartHandlers(rerender) {
  document.querySelectorAll('[data-qty-minus]').forEach(btn => { btn.addEventListener('click', () => { const item = store.getCart().find(i => i.id === btn.dataset.qtyMinus); if (item) store.updateQty(item.id, item.qty - 1); rerender(); }); });
  document.querySelectorAll('[data-qty-plus]').forEach(btn => { btn.addEventListener('click', () => { const item = store.getCart().find(i => i.id === btn.dataset.qtyPlus); if (item) store.updateQty(item.id, item.qty + 1); rerender(); }); });
  document.querySelectorAll('[data-remove]').forEach(btn => { btn.addEventListener('click', () => { store.removeItem(btn.dataset.remove); rerender(); }); });
  const splitToggle = document.getElementById('split-toggle');
  if (splitToggle) splitToggle.addEventListener('change', () => { store.setSplitEnabled(splitToggle.checked); rerender(); });
  document.querySelectorAll('.split-mode-btn').forEach(btn => { btn.addEventListener('click', () => { store.setSplitMode(btn.dataset.splitMode); rerender(); }); });
  document.querySelectorAll('.guest-btn').forEach(btn => { btn.addEventListener('click', () => { store.setSplitGuests(parseInt(btn.dataset.guests)); rerender(); }); });
  const addG = document.getElementById('add-guest-btn');
  if (addG) addG.addEventListener('click', () => { store.setSplitGuests(store.getSplit().guests + 1); rerender(); });
}

// fmtPrice imported from utils.js