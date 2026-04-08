import { store } from '../store.js';

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
          <h2 class="font-headline text-2xl font-bold tracking-tighter text-on-surface mb-2">Your cart is empty</h2>
          <p class="text-on-surface-variant text-sm mb-8">Start exploring our menu to add items.</p>
          <a href="#/" class="inline-block px-8 py-3 gold-gradient text-black font-label font-bold text-xs uppercase tracking-widest rounded-full">Browse Menu</a>
        </div>
      `;
      return;
    }

    app.innerHTML = `
      <div class="px-5 space-y-8 animate-[fadeIn_0.25s_ease-out]">
        <!-- Title -->
        <section class="space-y-1">
          <h2 class="font-headline text-3xl font-extrabold tracking-tighter text-on-surface">Your Selection</h2>
          <p class="font-body text-on-surface-variant text-sm opacity-80">The art of a perfect evening.</p>
        </section>

        <!-- Cart Items -->
        <section class="space-y-4">
          ${cart.map(item => `
            <div class="flex items-center gap-4 p-3 rounded-lg bg-surface-container-low">
              <div class="w-20 h-20 rounded-DEFAULT overflow-hidden flex-shrink-0">
                <img alt="${item.name}" class="w-full h-full object-cover" src="${item.image}" loading="lazy">
              </div>
              <div class="flex-grow space-y-1 min-w-0">
                <div class="flex justify-between items-start gap-2">
                  <h3 class="font-headline font-bold text-base text-on-surface truncate">${item.shortName}</h3>
                  <span class="font-label text-primary text-sm font-semibold tracking-tighter flex-shrink-0">${formatPrice(item.price * item.qty)}</span>
                </div>
                <p class="text-[10px] text-on-surface-variant leading-relaxed truncate">${item.description}</p>
                <div class="flex items-center justify-between pt-1">
                  <div class="flex items-center bg-surface-container-lowest rounded-full p-0.5">
                    <button data-qty-minus="${item.id}" class="w-6 h-6 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors">
                      <span class="material-symbols-outlined text-sm">remove</span>
                    </button>
                    <span class="px-2.5 font-label text-xs">${String(item.qty).padStart(2, '0')}</span>
                    <button data-qty-plus="${item.id}" class="w-6 h-6 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors">
                      <span class="material-symbols-outlined text-sm">add</span>
                    </button>
                  </div>
                  <button data-remove="${item.id}" class="text-on-surface-variant/40 hover:text-error transition-colors">
                    <span class="material-symbols-outlined text-lg">delete</span>
                  </button>
                </div>
              </div>
            </div>
          `).join('')}
        </section>

        <!-- Split the Bill -->
        <section class="bg-surface-container rounded-lg p-6 space-y-6 border-t border-white/5">
          <div class="flex justify-between items-center">
            <div class="space-y-0.5">
              <h3 class="font-headline text-lg font-bold tracking-tight text-on-surface">Split the Bill</h3>
              <p class="font-body text-[10px] text-on-surface-variant">Share the meal between guests.</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input id="split-toggle" type="checkbox" class="sr-only peer" ${split.enabled ? 'checked' : ''}>
              <div class="w-11 h-6 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          ${split.enabled ? `
            <!-- Split Mode -->
            <div class="grid grid-cols-3 gap-2">
              <button data-split-mode="equally" class="split-mode-btn flex flex-col items-center gap-1.5 p-3 rounded-lg transition-all ${split.mode === 'equally' ? 'bg-primary text-black' : 'bg-surface-container-highest text-on-surface-variant hover:text-primary'}">
                <span class="material-symbols-outlined text-lg">balance</span>
                <span class="font-label text-[9px] uppercase tracking-widest font-bold">Equally</span>
              </button>
              <button data-split-mode="items" class="split-mode-btn flex flex-col items-center gap-1.5 p-3 rounded-lg transition-all ${split.mode === 'items' ? 'bg-primary text-black' : 'bg-surface-container-highest text-on-surface-variant hover:text-primary'}">
                <span class="material-symbols-outlined text-lg">checklist</span>
                <span class="font-label text-[9px] uppercase tracking-widest">By Items</span>
              </button>
              <button data-split-mode="custom" class="split-mode-btn flex flex-col items-center gap-1.5 p-3 rounded-lg transition-all ${split.mode === 'custom' ? 'bg-primary text-black' : 'bg-surface-container-highest text-on-surface-variant hover:text-primary'}">
                <span class="material-symbols-outlined text-lg">edit_square</span>
                <span class="font-label text-[9px] uppercase tracking-widest">Custom</span>
              </button>
            </div>

            <!-- Guest Count -->
            <div class="space-y-3">
              <div class="flex items-center justify-between text-[10px] font-label uppercase tracking-widest text-on-surface-variant/60">
                <span>Guests</span>
                <span>${split.guests} Selected</span>
              </div>
              <div class="flex gap-3">
                ${[2, 3, 4].map(n => `
                  <button data-guests="${n}" class="guest-btn w-12 h-12 rounded-full flex items-center justify-center font-headline font-bold transition-all ${split.guests === n ? 'bg-primary text-black ring-2 ring-primary ring-offset-2 ring-offset-surface-container' : 'bg-surface-container-highest text-on-surface-variant hover:text-primary'}">${n}</button>
                `).join('')}
                <button id="add-guest-btn" class="w-12 h-12 rounded-full border-2 border-dashed border-outline-variant flex items-center justify-center text-outline hover:border-primary hover:text-primary transition-all">
                  <span class="material-symbols-outlined text-lg">person_add</span>
                </button>
              </div>
            </div>

            <div class="pt-3 border-t border-outline-variant/30">
              <div class="flex justify-between items-center text-sm font-label">
                <span class="text-on-surface-variant">Each pays</span>
                <span class="text-primary font-bold text-lg">${formatPrice(perPerson)}</span>
              </div>
            </div>
          ` : ''}
        </section>

        <!-- Summary -->
        <section class="space-y-3 pt-2">
          <div class="flex justify-between items-center text-sm font-label uppercase tracking-widest text-on-surface-variant">
            <span>Subtotal</span>
            <span>${formatPrice(subtotal)}</span>
          </div>
          <div class="flex justify-between items-center text-sm font-label uppercase tracking-widest text-on-surface-variant">
            <span>Tax & Service (${Math.round(taxRate * 100)}%)</span>
            <span>${formatPrice(tax)}</span>
          </div>
          <div class="h-px bg-surface-container-highest"></div>
          <div class="flex justify-between items-center py-1">
            <span class="font-headline text-xl font-extrabold tracking-tighter text-on-surface">Total</span>
            <span class="font-headline text-2xl font-extrabold tracking-tighter text-primary">${formatPrice(total)}</span>
          </div>
        </section>

        <!-- Checkout -->
        <section class="pb-4">
          <a href="#/payment" class="block w-full gold-gradient text-black py-4 rounded-full font-headline font-bold uppercase tracking-[0.15em] text-center shadow-[0_8px_32px_rgba(212,175,55,0.2)] active:scale-95 transition-transform text-sm">Proceed to Payment</a>
        </section>
      </div>
    `;

    attachCartHandlers(render);
  };

  render();
}

function attachCartHandlers(rerender) {
  // Quantity buttons
  document.querySelectorAll('[data-qty-minus]').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = store.getCart().find(i => i.id === btn.dataset.qtyMinus);
      if (item) store.updateQty(item.id, item.qty - 1);
      rerender();
    });
  });
  document.querySelectorAll('[data-qty-plus]').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = store.getCart().find(i => i.id === btn.dataset.qtyPlus);
      if (item) store.updateQty(item.id, item.qty + 1);
      rerender();
    });
  });
  document.querySelectorAll('[data-remove]').forEach(btn => {
    btn.addEventListener('click', () => {
      store.removeItem(btn.dataset.remove);
      rerender();
    });
  });

  // Split toggle
  const splitToggle = document.getElementById('split-toggle');
  if (splitToggle) {
    splitToggle.addEventListener('change', () => {
      store.setSplitEnabled(splitToggle.checked);
      rerender();
    });
  }

  // Split mode
  document.querySelectorAll('.split-mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      store.setSplitMode(btn.dataset.splitMode);
      rerender();
    });
  });

  // Guest count
  document.querySelectorAll('.guest-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      store.setSplitGuests(parseInt(btn.dataset.guests));
      rerender();
    });
  });

  const addGuestBtn = document.getElementById('add-guest-btn');
  if (addGuestBtn) {
    addGuestBtn.addEventListener('click', () => {
      store.setSplitGuests(store.getSplit().guests + 1);
      rerender();
    });
  }
}

function formatPrice(price) {
  return price.toLocaleString('en-US').replace(/,/g, ' ') + ' sum';
}