import { store } from '../store.js';

export function renderDish(data, dishId) {
  const dish = data.dishes.find(d => d.id === dishId);
  if (!dish) {
    document.getElementById('app').innerHTML = `<div class="p-10 text-center text-on-surface-variant">Dish not found.</div>`;
    return;
  }

  const app = document.getElementById('app');
  let qty = 1;

  app.innerHTML = `
    <div class="animate-[fadeIn_0.25s_ease-out] pb-8">
      <!-- Hero Image -->
      <section class="relative h-[400px] w-full overflow-hidden -mt-16">
        <img class="w-full h-full object-cover" src="${dish.image}" alt="${dish.name}">
        <div class="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
        <!-- Back button -->
        <div class="absolute top-20 left-4">
          <button onclick="history.back()" class="w-10 h-10 flex items-center justify-center rounded-full bg-background/50 backdrop-blur-md hover:bg-[#D4AF37]/10 transition-colors active:scale-95">
            <span class="material-symbols-outlined text-[#D4AF37]">arrow_back</span>
          </button>
        </div>
        <div class="absolute bottom-0 left-0 w-full p-5 space-y-1.5">
          <div class="flex items-center gap-2">
            ${dish.badges.length ? `<span class="bg-primary/20 text-primary px-2.5 py-0.5 rounded-full text-[10px] font-label tracking-widest uppercase">${dish.badges[0]}</span>` : ''}
            <div class="flex items-center gap-1 text-primary-fixed-dim">
              <span class="material-symbols-outlined text-sm star-filled">star</span>
              <span class="text-sm font-bold">${dish.rating}</span>
            </div>
          </div>
          <h2 class="text-3xl font-headline font-extrabold tracking-tighter leading-none text-on-surface">${dish.name}</h2>
          <p class="text-on-surface-variant max-w-sm text-sm font-light leading-relaxed">${dish.description}</p>
        </div>
      </section>

      <!-- Nutrition -->
      <section class="px-5 mt-8 grid grid-cols-3 gap-3">
        <div class="bg-surface-container-low p-4 rounded-lg border border-outline-variant/10">
          <span class="text-on-surface-variant text-[10px] uppercase tracking-widest font-label">Calories</span>
          <div class="mt-2">
            <span class="text-2xl font-headline font-bold text-on-surface">${dish.calories}</span>
            <span class="text-on-surface-variant text-xs ml-0.5">kcal</span>
          </div>
        </div>
        <div class="bg-surface-container-low p-4 rounded-lg border border-outline-variant/10">
          <span class="text-on-surface-variant text-[10px] uppercase tracking-widest font-label">Proteins</span>
          <div class="mt-2">
            <span class="text-2xl font-headline font-bold text-on-surface">${dish.protein}</span>
            <span class="text-on-surface-variant text-xs ml-0.5">g</span>
          </div>
        </div>
        <div class="bg-surface-container-low p-4 rounded-lg border border-outline-variant/10">
          <span class="text-on-surface-variant text-[10px] uppercase tracking-widest font-label">Carbs</span>
          <div class="mt-2">
            <span class="text-2xl font-headline font-bold text-on-surface">${dish.carbs}</span>
            <span class="text-on-surface-variant text-xs ml-0.5">g</span>
          </div>
        </div>
      </section>

      <!-- Ingredients -->
      <section class="px-5 mt-6">
        <div class="bg-surface-container p-5 rounded-lg border border-outline-variant/10">
          <h3 class="text-primary font-headline font-bold text-xs tracking-widest uppercase mb-3">Main Ingredients</h3>
          <ul class="space-y-2">
            ${dish.ingredients.map(ing => `
              <li class="flex items-center gap-2.5 text-on-surface/80 text-sm">
                <span class="w-1.5 h-1.5 rounded-full bg-primary-container flex-shrink-0"></span>
                ${ing}
              </li>
            `).join('')}
          </ul>
        </div>
      </section>

      <!-- Reviews -->
      ${dish.reviews.length ? `
        <section class="px-5 mt-10 space-y-5">
          <div class="flex justify-between items-end">
            <div>
              <h3 class="text-2xl font-headline font-bold text-on-surface tracking-tighter">Guest Reviews</h3>
              <p class="text-on-surface-variant text-xs mt-0.5">Verified community members</p>
            </div>
          </div>
          <div class="space-y-4">
            ${dish.reviews.map(review => `
              <div class="bg-surface-container-low p-5 rounded-lg space-y-3 border-l-4 border-primary">
                <div class="flex justify-between items-start">
                  <div class="flex items-center gap-2.5">
                    <div class="w-9 h-9 rounded-full overflow-hidden bg-surface-variant">
                      <img class="w-full h-full object-cover" src="${review.avatar}" alt="${review.name}" loading="lazy">
                    </div>
                    <div>
                      <p class="text-on-surface font-bold text-sm">${review.name}</p>
                      <p class="text-on-surface-variant text-[9px] uppercase tracking-tighter">${review.role}</p>
                    </div>
                  </div>
                  <div class="flex gap-0.5 text-primary">
                    ${Array.from({length: 5}, (_, i) => `<span class="material-symbols-outlined text-sm ${i < review.rating ? 'star-filled' : ''}">star</span>`).join('')}
                  </div>
                </div>
                <p class="text-on-surface/90 text-sm leading-relaxed italic">"${review.text}"</p>
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Spacer for sticky bar -->
      <div class="h-24"></div>
    </div>

    <!-- Sticky Bottom Bar -->
    <div class="fixed bottom-0 left-0 w-full z-40 p-4 bg-[#131313]/90 backdrop-blur-2xl border-t border-outline-variant/20">
      <div class="max-w-lg mx-auto flex items-center justify-between gap-4">
        <div class="flex flex-col">
          <span class="text-on-surface-variant text-[9px] uppercase tracking-[0.15em]">Total Price</span>
          <span id="dish-total" class="text-primary text-2xl font-headline font-extrabold tracking-tighter">${formatPrice(dish.price)}</span>
        </div>
        <div class="flex items-center gap-3">
          <div class="flex items-center bg-surface-container rounded-full p-0.5 border border-outline-variant/30">
            <button id="qty-minus" class="w-9 h-9 flex items-center justify-center text-on-surface hover:text-primary transition-colors">
              <span class="material-symbols-outlined text-lg">remove</span>
            </button>
            <span id="qty-display" class="px-3 font-bold text-sm">${qty}</span>
            <button id="qty-plus" class="w-9 h-9 flex items-center justify-center text-on-surface hover:text-primary transition-colors">
              <span class="material-symbols-outlined text-lg">add</span>
            </button>
          </div>
          <button id="add-to-cart-btn" class="py-3 px-6 rounded-full gold-gradient text-on-primary font-headline font-extrabold uppercase tracking-widest text-[10px] flex items-center gap-1.5 active:scale-95 transition-all shadow-[0_8px_32px_rgba(212,175,55,0.15)]">
            <span class="material-symbols-outlined text-base">shopping_bag</span>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  `;

  // Hide bottom nav on dish detail
  document.getElementById('bottom-nav').style.display = 'none';

  // Quantity controls
  const qtyDisplay = document.getElementById('qty-display');
  const totalDisplay = document.getElementById('dish-total');

  document.getElementById('qty-minus').addEventListener('click', () => {
    if (qty > 1) {
      qty--;
      qtyDisplay.textContent = qty;
      totalDisplay.textContent = formatPrice(dish.price * qty);
    }
  });

  document.getElementById('qty-plus').addEventListener('click', () => {
    if (qty < 20) {
      qty++;
      qtyDisplay.textContent = qty;
      totalDisplay.textContent = formatPrice(dish.price * qty);
    }
  });

  document.getElementById('add-to-cart-btn').addEventListener('click', () => {
    store.addItem(dish, qty);
    const btn = document.getElementById('add-to-cart-btn');
    btn.innerHTML = '<span class="material-symbols-outlined text-base">check</span> Added!';
    setTimeout(() => {
      location.hash = '#/cart';
    }, 600);
  });
}

export function cleanupDish() {
  document.getElementById('bottom-nav').style.display = '';
}

function formatPrice(price) {
  return price.toLocaleString('en-US').replace(/,/g, ' ') + ' sum';
}