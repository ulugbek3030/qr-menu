import { store } from '../store.js';
import { getReviews, addReview } from '../reviews.js';
import { getDb } from '../firebase-config.js';

export function renderDish(data, dishId) {
  const dish = data.dishes.find(d => d.id === dishId);
  if (!dish) {
    document.getElementById('app').innerHTML = `<div class="p-10 text-center text-on-surface-variant">Dish not found.</div>`;
    return;
  }

  const app = document.getElementById('app');
  let qty = 1;

  // Merge static + Firebase reviews
  let allReviews = [...dish.reviews];
  let reviewsLoaded = false;

  function renderPage() {
    const avgRating = allReviews.length
      ? (allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length).toFixed(1)
      : dish.rating;

    app.innerHTML = `
      <div class="animate-[fadeIn_0.25s_ease-out] pb-8">
        <!-- Hero Image -->
        <section class="relative h-[400px] w-full overflow-hidden -mt-16">
          <img class="w-full h-full object-cover" src="${dish.image}" alt="${dish.name}">
          <div class="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
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
                <span class="text-sm font-bold">${avgRating}</span>
                <span class="text-on-surface-variant text-[10px] ml-0.5">(${allReviews.length})</span>
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
        <section class="px-5 mt-10 space-y-5">
          <div class="flex justify-between items-center">
            <div>
              <h3 class="text-2xl font-headline font-bold text-on-surface tracking-tighter">Guest Reviews</h3>
              <p class="text-on-surface-variant text-xs mt-0.5">${allReviews.length} review${allReviews.length !== 1 ? 's' : ''}</p>
            </div>
            <button id="open-review-modal" class="bg-surface-container-highest text-primary px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-primary hover:text-on-primary transition-all duration-300 active:scale-95">Leave a Review</button>
          </div>

          ${allReviews.length ? `
            <div class="space-y-4">
              ${allReviews.map(review => renderReviewCard(review)).join('')}
            </div>
          ` : `
            <div class="py-10 text-center">
              <span class="material-symbols-outlined text-4xl text-on-surface-variant/20 mb-2">rate_review</span>
              <p class="text-on-surface-variant text-sm">No reviews yet. Be the first!</p>
            </div>
          `}
        </section>

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

    // Hide bottom nav
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
      setTimeout(() => { location.hash = '#/cart'; }, 600);
    });

    // Review modal trigger
    document.getElementById('open-review-modal').addEventListener('click', () => {
      openReviewModal(dishId, (newReview) => {
        allReviews.unshift(newReview);
        renderPage();
      });
    });
  }

  renderPage();

  // Load reviews from Firebase (async, merges after load)
  loadFirebaseReviews(dishId, dish.reviews).then(merged => {
    if (merged.length !== allReviews.length) {
      allReviews = merged;
      reviewsLoaded = true;
      renderPage();
    }
  });
}

async function loadFirebaseReviews(dishId, staticReviews) {
  const fbReviews = await getReviews(dishId);
  // Merge: static first, then Firebase (deduplicated by text)
  const staticTexts = new Set(staticReviews.map(r => r.text));
  const uniqueFb = fbReviews.filter(r => !staticTexts.has(r.text));
  return [...staticReviews, ...uniqueFb];
}

function renderReviewCard(review) {
  const initial = (review.name || 'G').charAt(0).toUpperCase();
  const hasAvatar = review.avatar && review.avatar.startsWith('http');
  const timeAgo = review.createdAt ? formatTimeAgo(review.createdAt) : '';

  return `
    <div class="bg-surface-container-low p-5 rounded-lg space-y-3 border-l-4 border-primary">
      <div class="flex justify-between items-start">
        <div class="flex items-center gap-2.5">
          ${hasAvatar
            ? `<div class="w-9 h-9 rounded-full overflow-hidden bg-surface-variant"><img class="w-full h-full object-cover" src="${review.avatar}" alt="${review.name}" loading="lazy"></div>`
            : `<div class="w-9 h-9 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-headline font-bold text-sm">${initial}</div>`
          }
          <div>
            <p class="text-on-surface font-bold text-sm">${review.name || 'Guest'}</p>
            <p class="text-on-surface-variant text-[9px] uppercase tracking-tighter">${review.role || timeAgo || 'Guest'}</p>
          </div>
        </div>
        <div class="flex gap-0.5 text-primary">
          ${Array.from({length: 5}, (_, i) => `<span class="material-symbols-outlined text-sm ${i < review.rating ? 'star-filled' : ''}">star</span>`).join('')}
        </div>
      </div>
      <p class="text-on-surface/90 text-sm leading-relaxed italic">"${review.text}"</p>
    </div>
  `;
}

function openReviewModal(dishId, onSubmit) {
  let selectedRating = 0;
  const firebaseReady = !!getDb();

  // Remove existing modal
  const existing = document.getElementById('review-modal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'review-modal';
  modal.className = 'review-modal-backdrop fixed inset-0 z-[60] bg-background/80 backdrop-blur-md flex items-end justify-center';

  modal.innerHTML = `
    <div class="review-modal-sheet w-full max-w-lg bg-surface-container rounded-t-[2rem] p-6 pb-8 space-y-6">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <h3 class="font-headline text-xl font-bold tracking-tighter">Leave a Review</h3>
        <button id="close-review-modal" class="w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-container-highest transition-colors">
          <span class="material-symbols-outlined text-on-surface-variant">close</span>
        </button>
      </div>

      <!-- Star Rating Picker -->
      <div class="text-center space-y-2">
        <p class="text-on-surface-variant text-xs uppercase tracking-widest">Tap to rate</p>
        <div class="star-picker flex justify-center gap-2" id="star-picker">
          ${Array.from({length: 5}, (_, i) => `
            <span class="material-symbols-outlined star-inactive" data-star="${i + 1}">star</span>
          `).join('')}
        </div>
        <p id="rating-label" class="text-primary font-headline font-bold text-sm h-5"></p>
      </div>

      <!-- Name Input -->
      <div>
        <label class="text-on-surface-variant text-[10px] uppercase tracking-widest font-label block mb-1.5">Your Name</label>
        <input id="review-name" type="text" placeholder="Guest" maxlength="50" class="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-4 py-3 text-on-surface text-sm font-body placeholder:text-on-surface-variant/40 focus:border-primary focus:outline-none transition-colors">
      </div>

      <!-- Review Text -->
      <div>
        <label class="text-on-surface-variant text-[10px] uppercase tracking-widest font-label block mb-1.5">Your Review</label>
        <textarea id="review-text" rows="3" placeholder="Share your experience..." maxlength="500" class="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-4 py-3 text-on-surface text-sm font-body placeholder:text-on-surface-variant/40 focus:border-primary focus:outline-none transition-colors resize-none"></textarea>
      </div>

      ${!firebaseReady ? `<p class="text-on-surface-variant/50 text-[9px] text-center uppercase tracking-widest">Firebase not configured — review will be saved locally only</p>` : ''}

      <!-- Submit -->
      <button id="submit-review" disabled class="w-full py-4 rounded-full gold-gradient text-on-primary font-headline font-bold uppercase tracking-[0.15em] text-sm opacity-40 transition-all">Submit Review</button>
    </div>
  `;

  document.body.appendChild(modal);

  const RATING_LABELS = ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'];
  const submitBtn = modal.querySelector('#submit-review');
  const ratingLabel = modal.querySelector('#rating-label');

  function updateSubmitState() {
    const canSubmit = selectedRating > 0 && modal.querySelector('#review-text').value.trim().length > 0;
    submitBtn.disabled = !canSubmit;
    submitBtn.classList.toggle('opacity-40', !canSubmit);
    submitBtn.classList.toggle('active:scale-95', canSubmit);
    submitBtn.classList.toggle('shadow-[0_8px_32px_rgba(212,175,55,0.15)]', canSubmit);
  }

  // Star picker
  modal.querySelectorAll('#star-picker span').forEach(star => {
    star.addEventListener('click', () => {
      selectedRating = parseInt(star.dataset.star);
      modal.querySelectorAll('#star-picker span').forEach((s, i) => {
        s.className = `material-symbols-outlined ${i < selectedRating ? 'star-active' : 'star-inactive'}`;
      });
      ratingLabel.textContent = RATING_LABELS[selectedRating];
      updateSubmitState();
    });
  });

  modal.querySelector('#review-text').addEventListener('input', updateSubmitState);

  // Close
  const closeModal = () => modal.remove();
  modal.querySelector('#close-review-modal').addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

  // Submit
  submitBtn.addEventListener('click', async () => {
    if (submitBtn.disabled) return;
    const name = modal.querySelector('#review-name').value.trim() || 'Guest';
    const text = modal.querySelector('#review-text').value.trim();

    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;

    let newReview;
    if (firebaseReady) {
      try {
        newReview = await addReview(dishId, { name, rating: selectedRating, text });
      } catch (e) {
        console.warn('Firebase save failed:', e.message);
        newReview = { name, rating: selectedRating, text, createdAt: new Date() };
      }
    } else {
      newReview = { name, rating: selectedRating, text, createdAt: new Date() };
    }

    closeModal();
    onSubmit(newReview);
  });
}

function formatTimeAgo(date) {
  if (!date) return '';
  const d = date instanceof Date ? date : (date.toDate ? date.toDate() : new Date(date));
  const diff = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
  if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
  return Math.floor(diff / 86400) + 'd ago';
}

export function cleanupDish() {
  document.getElementById('bottom-nav').style.display = '';
  const modal = document.getElementById('review-modal');
  if (modal) modal.remove();
}

function formatPrice(price) {
  return price.toLocaleString('en-US').replace(/,/g, ' ') + ' sum';
}