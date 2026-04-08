import { store } from '../store.js';

export function renderPayment(data) {
  const app = document.getElementById('app');
  const cart = store.getCart();
  const subtotal = store.getSubtotal();
  const taxRate = data.restaurant.taxRate;

  if (!cart.length) {
    location.hash = '#/cart';
    return;
  }

  let selectedTip = 15;
  let selectedPayment = 'card';

  const render = () => {
    const tipAmount = Math.round(subtotal * selectedTip / 100);
    const tax = Math.round(subtotal * taxRate);
    const total = subtotal + tax + tipAmount;

    app.innerHTML = `
      <div class="px-5 animate-[fadeIn_0.25s_ease-out]">
        <!-- Back -->
        <div class="flex items-center gap-3 mb-6">
          <button onclick="history.back()" class="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#D4AF37]/10 transition-colors active:scale-95">
            <span class="material-symbols-outlined text-[#D4AF37]">arrow_back</span>
          </button>
          <div class="flex-1"></div>
          <div class="flex items-center gap-1.5 text-on-surface-variant font-label text-[10px] tracking-widest uppercase">
            <span class="material-symbols-outlined text-sm star-filled">lock</span>
            SECURE PAYMENT
          </div>
        </div>

        <!-- Order Details -->
        <section class="mb-8">
          <h2 class="font-headline text-xl font-bold tracking-tighter mb-4 uppercase">Order Details</h2>
          <div class="bg-surface-container-low rounded-lg p-5 space-y-3">
            ${cart.map(item => `
              <div class="flex justify-between items-center">
                <span class="text-on-surface-variant font-label text-sm uppercase tracking-wide">${item.shortName}${item.qty > 1 ? ` (x${item.qty})` : ''}</span>
                <span class="font-headline text-on-surface">${formatPrice(item.price * item.qty)}</span>
              </div>
            `).join('')}
            <div class="pt-3 border-t border-surface-container-highest flex justify-between items-end">
              <span class="text-on-surface-variant font-label text-[10px] uppercase tracking-[0.1em]">Subtotal</span>
              <span class="font-headline text-lg text-on-surface">${formatPrice(subtotal)}</span>
            </div>
          </div>
        </section>

        <!-- Tips -->
        <section class="mb-8">
          <div class="flex items-baseline justify-between mb-4">
            <h2 class="font-headline text-xl font-bold tracking-tighter uppercase">Tips</h2>
            <span class="text-primary font-label text-[10px] uppercase tracking-widest">Support the team</span>
          </div>
          <div class="grid grid-cols-4 gap-2">
            ${[10, 15, 20].map(pct => `
              <button data-tip="${pct}" class="tip-btn py-3.5 rounded-lg font-headline font-bold text-lg transition-all active:scale-95 ${selectedTip === pct ? 'bg-primary-container text-on-primary-container shadow-[0_0_15px_rgba(212,175,55,0.3)]' : 'bg-surface-container-highest text-on-surface hover:bg-primary/10'}">${pct}%</button>
            `).join('')}
            <button data-tip="0" class="tip-btn py-3.5 rounded-lg font-label text-[10px] uppercase tracking-widest border border-outline-variant/30 transition-all active:scale-95 ${selectedTip === 0 ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface'}">No Tip</button>
          </div>
        </section>

        <!-- Payment Method -->
        <section class="mb-8">
          <h2 class="font-headline text-xl font-bold tracking-tighter mb-4 uppercase">Payment Method</h2>
          <div class="space-y-2">
            <!-- Apple Pay -->
            <button data-pay="apple" class="pay-btn w-full bg-surface-container p-4 rounded-lg flex items-center justify-between cursor-pointer transition-all ${selectedPayment === 'apple' ? 'border-2 border-primary' : 'border border-transparent hover:border-primary/20'}">
              <div class="flex items-center gap-3">
                <div class="w-10 h-7 bg-black rounded flex items-center justify-center text-white">
                  <span class="font-bold text-[10px]">Apple Pay</span>
                </div>
                <span class="font-label text-sm uppercase tracking-widest text-on-surface">Apple Pay</span>
              </div>
              <div class="w-4 h-4 rounded-full border-2 ${selectedPayment === 'apple' ? 'border-primary' : 'border-outline-variant'} flex items-center justify-center">
                ${selectedPayment === 'apple' ? '<div class="w-2 h-2 rounded-full bg-primary"></div>' : ''}
              </div>
            </button>
            <!-- Card -->
            <button data-pay="card" class="pay-btn w-full bg-surface-container p-4 rounded-lg flex items-center justify-between cursor-pointer transition-all ${selectedPayment === 'card' ? 'border-2 border-primary' : 'border border-transparent hover:border-primary/20'}">
              <div class="flex items-center gap-3">
                <div class="w-10 h-7 bg-surface-container-highest rounded flex items-center justify-center">
                  <span class="material-symbols-outlined text-on-surface text-lg">credit_card</span>
                </div>
                <div class="flex flex-col items-start">
                  <span class="font-label text-sm uppercase tracking-widest text-on-surface">Visa *4242</span>
                  <span class="text-[9px] text-on-surface-variant uppercase tracking-tighter">Expires 12/26</span>
                </div>
              </div>
              <div class="w-4 h-4 rounded-full border-2 ${selectedPayment === 'card' ? 'border-primary' : 'border-outline-variant'} flex items-center justify-center">
                ${selectedPayment === 'card' ? '<div class="w-2 h-2 rounded-full bg-primary"></div>' : ''}
              </div>
            </button>
            <!-- Cash -->
            <button data-pay="cash" class="pay-btn w-full bg-surface-container p-4 rounded-lg flex items-center justify-between cursor-pointer transition-all ${selectedPayment === 'cash' ? 'border-2 border-primary' : 'border border-transparent hover:border-primary/20'}">
              <div class="flex items-center gap-3">
                <div class="w-10 h-7 bg-surface-container-highest rounded flex items-center justify-center">
                  <span class="material-symbols-outlined text-on-surface text-lg">payments</span>
                </div>
                <span class="font-label text-sm uppercase tracking-widest text-on-surface">Cash Payment</span>
              </div>
              <div class="w-4 h-4 rounded-full border-2 ${selectedPayment === 'cash' ? 'border-primary' : 'border-outline-variant'} flex items-center justify-center">
                ${selectedPayment === 'cash' ? '<div class="w-2 h-2 rounded-full bg-primary"></div>' : ''}
              </div>
            </button>
          </div>
        </section>

        <!-- Total -->
        <section class="mt-8 mb-6 bg-surface-container-lowest p-6 rounded-lg border-t-2 border-primary/10 relative overflow-hidden">
          <div class="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 blur-3xl"></div>
          <div class="flex flex-col items-center gap-1.5 relative z-10">
            <span class="text-on-surface-variant font-label text-[10px] uppercase tracking-[0.2em]">Total Amount to Pay</span>
            <div class="flex items-end">
              <span class="text-on-surface font-headline text-5xl font-extrabold tracking-tighter">${formatPriceNumber(total)}</span>
              <span class="text-primary font-headline text-xl mb-1 ml-1.5">sum</span>
            </div>
            <p class="text-[9px] text-on-surface-variant mt-1 text-center max-w-[180px] uppercase leading-relaxed tracking-widest">Including ${selectedTip}% tips and ${Math.round(taxRate*100)}% service tax.</p>
          </div>
        </section>

        <!-- Pay Button -->
        <button id="pay-now-btn" class="w-full gold-gradient text-on-primary py-5 rounded-full font-headline font-extrabold text-base uppercase tracking-[0.15em] shadow-[0_8px_30px_rgb(242,202,80,0.15)] active:scale-[0.98] transition-all mb-6">PAY NOW</button>

        <!-- Trust -->
        <div class="flex flex-col items-center gap-3 opacity-30 pb-4">
          <div class="flex gap-4 items-center">
            <span class="material-symbols-outlined text-2xl">verified_user</span>
            <span class="material-symbols-outlined text-2xl">shield</span>
            <span class="material-symbols-outlined text-2xl">security</span>
          </div>
          <p class="text-[8px] font-label uppercase tracking-[0.15em] text-center">Encrypted transaction via Nocturnal Secure-Gate</p>
        </div>
      </div>

      <!-- Success Overlay -->
      <div id="pay-success" class="hidden fixed inset-0 z-[100] bg-background/95 backdrop-blur-2xl flex flex-col items-center justify-center p-6 text-center">
        <div class="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
          <span class="material-symbols-outlined text-5xl text-primary star-filled">check_circle</span>
        </div>
        <h3 class="font-headline text-3xl font-extrabold tracking-tighter uppercase mb-3">Payment Successful</h3>
        <p class="font-body text-on-surface-variant text-sm max-w-xs mb-10 tracking-wide leading-relaxed">Your transaction is complete. A digital receipt has been sent to your registered email.</p>
        <div class="w-full max-w-xs p-5 bg-surface-container-low rounded-lg mb-10">
          <div class="flex justify-between text-[10px] font-label uppercase tracking-widest text-on-surface-variant mb-1.5">
            <span>Transaction ID</span>
            <span class="text-on-surface">#NG-${Math.floor(100000 + Math.random() * 900000)}</span>
          </div>
          <div class="flex justify-between text-[10px] font-label uppercase tracking-widest text-on-surface-variant">
            <span>Time</span>
            <span class="text-on-surface">${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
        <button id="return-btn" class="bg-surface-container-highest text-on-surface px-10 py-3 rounded-full font-headline font-bold uppercase tracking-widest text-xs hover:bg-primary/10 transition-colors">Return to Gallery</button>
      </div>
    `;

    // Tip selection
    app.querySelectorAll('.tip-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedTip = parseInt(btn.dataset.tip);
        render();
      });
    });

    // Payment method
    app.querySelectorAll('.pay-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedPayment = btn.dataset.pay;
        render();
      });
    });

    // Pay button
    document.getElementById('pay-now-btn').addEventListener('click', () => {
      const overlay = document.getElementById('pay-success');
      overlay.classList.remove('hidden');
      overlay.style.animation = 'fadeIn 0.4s ease-out';
    });

    // Return
    const returnBtn = document.getElementById('return-btn');
    if (returnBtn) {
      returnBtn.addEventListener('click', () => {
        store.clear();
        location.hash = '#/';
      });
    }
  };

  // Hide bottom nav
  document.getElementById('bottom-nav').style.display = 'none';
  render();
}

export function cleanupPayment() {
  document.getElementById('bottom-nav').style.display = '';
  const overlay = document.getElementById('pay-success');
  if (overlay) overlay.remove();
}

function formatPrice(price) {
  return price.toLocaleString('en-US').replace(/,/g, ' ') + ' sum';
}

function formatPriceNumber(price) {
  return price.toLocaleString('en-US').replace(/,/g, ' ');
}