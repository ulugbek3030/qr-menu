import { auth } from '../auth.js';
import { t, setLang, getLang, getLangName } from '../i18n.js';
import { WIFI } from '../utils.js';

// Background image from Stitch design
const BG_IMAGE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDYTbtgPhHdbhDe5vURmp0S3QG_2ia7NHYUnMM_VyMI1toRQsXEoToDrS2KdvVhcfRbwwhiDHg9_RpsK2k0xn1fLBJD2C578UxFJwapGlN58LMBVrrlqBPQ3A_hEwO7su9ja_QNTIvpxsksLBEopukraQw3kQanke96FQvK-iGTgZCKxyWlXcLNCBlREuD2gugmfiMheWxFYuagjHxC-BFSeBPQy8eMafyBxL-ChtlrhbuxG2--kx5afCmvjAt9Oa6ScJRMuVkoMg';

const LANGS = [
  { code: 'ru', name: 'Русский' },
  { code: 'en', name: 'English' },
  { code: 'uz', name: "O'zbek" },
  { code: 'kk', name: 'Қазақша' }
];

export function renderWelcome(onComplete, data) {
  const app = document.getElementById('app');
  document.getElementById('app-header').style.display = 'none';
  document.getElementById('bottom-nav').style.display = 'none';
  // Remove shell padding for full-screen welcome
  app.style.paddingTop = '0';
  app.style.paddingBottom = '0';
  app.style.maxWidth = 'none';

  let selectedLang = getLang();

  function render() {
    const currentLangName = LANGS.find(l => l.code === selectedLang)?.name || 'Русский';

    app.innerHTML = `
      <!-- Background -->
      <div class="fixed inset-0 z-0">
        <div class="absolute inset-0 bg-gradient-to-b from-transparent via-background to-background z-10"></div>
        <img class="w-full h-full object-cover opacity-30 grayscale-[0.5]" src="${BG_IMAGE}" alt="">
      </div>

      <div class="relative z-20 flex flex-col px-6 pt-10 pb-10 max-w-lg mx-auto">
        <!-- Logo -->
        <header class="flex flex-col items-center justify-center mb-8">
          <div class="w-20 h-20 mb-3 flex items-center justify-center bg-surface-container-highest rounded-full border border-outline-variant/10 shadow-2xl">
            <span class="material-symbols-outlined text-primary text-4xl" style="font-variation-settings: 'FILL' 1;">restaurant</span>
          </div>
          <h1 class="font-headline text-3xl font-extrabold tracking-tighter text-on-surface uppercase" style="text-shadow: 0 0 15px rgba(242,202,80,0.3);">${t('nav.title')}</h1>
          <p class="font-label text-[10px] tracking-[0.2em] text-primary/70 mt-1 uppercase">${t('welcome.subtitle_short')}</p>
        </header>

        <div class="space-y-6 w-full">
          <!-- Language Selector Dropdown -->
          <section class="flex justify-center">
            <div class="relative w-full max-w-[200px]" id="lang-welcome-wrap">
              <button id="lang-welcome-toggle" class="w-full px-5 py-2.5 rounded-full border border-primary/40 flex items-center justify-between text-on-surface hover:border-primary transition-all" style="background: rgba(32,31,31,0.7); backdrop-filter: blur(24px);">
                <div class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-primary text-xl">language</span>
                  <span class="font-medium text-sm">${currentLangName}</span>
                </div>
                <span class="material-symbols-outlined text-primary/60 text-lg" id="lang-chevron">expand_more</span>
              </button>
              <div id="lang-welcome-dropdown" class="hidden absolute top-full left-0 w-full border-x border-b border-primary/40 rounded-b-2xl overflow-hidden z-50" style="background: rgba(32,31,31,0.9); backdrop-filter: blur(24px);">
                ${LANGS.filter(l => l.code !== selectedLang).map(l => `
                  <button data-wlang="${l.code}" class="w-full px-5 py-3 text-left text-sm text-on-surface-variant hover:bg-primary/10 hover:text-primary transition-colors border-t border-outline-variant/10">${l.name}</button>
                `).join('')}
              </div>
            </div>
          </section>

          <!-- Form Fields -->
          <section class="space-y-4">
            <!-- Table Number (auto) -->
            <div class="space-y-1.5">
              <label class="font-label text-[10px] uppercase tracking-widest text-on-surface-variant ml-4">${t('welcome.table')}</label>
              <div class="flex items-center ml-4 mt-1">
                <span class="material-symbols-outlined text-primary/60 text-xl mr-3">table_restaurant</span>
                <span class="font-headline font-bold text-2xl text-on-surface tracking-tight">12</span>
              </div>
            </div>

            <!-- Name -->
            <div class="space-y-1.5">
              <label class="font-label text-[10px] uppercase tracking-widest text-on-surface-variant ml-4">${t('welcome.your_name')}</label>
              <div class="relative">
                <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary/60 text-xl">person</span>
                <input id="w-name" type="text" maxlength="50" placeholder="${t('welcome.name_hint')}" class="w-full bg-surface-container-lowest border-none rounded-xl py-4 pl-12 pr-4 focus:ring-1 focus:ring-primary text-on-surface placeholder:text-on-surface-variant/30 font-medium">
              </div>
            </div>

            <!-- Phone -->
            <div class="space-y-1.5">
              <label class="font-label text-[10px] uppercase tracking-widest text-on-surface-variant ml-4">${t('welcome.phone')}</label>
              <div class="relative">
                <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary/60 text-xl">smartphone</span>
                <input id="w-phone" type="tel" maxlength="20" placeholder="+998" class="w-full bg-surface-container-lowest border-none rounded-xl py-4 pl-12 pr-4 focus:ring-1 focus:ring-primary text-on-surface placeholder:text-on-surface-variant/30 font-medium font-mono tracking-wider">
              </div>
            </div>
          </section>

          <!-- Actions -->
          <section class="space-y-3 pt-2">
            <button id="w-enter" disabled class="w-full gold-gradient text-on-primary font-headline font-bold text-lg py-4 rounded-full shadow-[0_10px_30px_rgba(242,202,80,0.2)] active:scale-95 transition-all opacity-40">${t('welcome.enter')}</button>
            <button id="w-skip" class="w-full text-on-surface-variant/60 font-label text-sm py-2 hover:text-on-surface transition-colors active:scale-95">${t('welcome.skip')}</button>
          </section>

          <!-- Wi-Fi Card -->
          <section class="pt-2">
            <div class="relative group">
              <div class="absolute inset-0 bg-primary/20 blur-2xl rounded-2xl group-hover:bg-primary/30 transition-all"></div>
              <button id="w-wifi" class="relative w-full border border-primary/20 rounded-2xl p-4 flex items-center justify-between overflow-hidden active:scale-[0.98] transition-all" style="background: rgba(32,31,31,0.7); backdrop-filter: blur(24px);">
                <div class="flex items-center gap-3">
                  <div class="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                    <span class="material-symbols-outlined text-primary text-xl" style="font-variation-settings: 'FILL' 1;">wifi</span>
                  </div>
                  <div class="text-left">
                    <p class="font-headline font-bold text-on-surface text-base leading-tight">${t('wifi.title')}</p>
                    <p class="text-[9px] text-primary/60 uppercase tracking-widest">Dionis</p>
                  </div>
                </div>
                <span class="material-symbols-outlined text-primary text-lg">arrow_forward_ios</span>
                <div class="absolute -right-4 -bottom-4 opacity-5">
                  <span class="material-symbols-outlined text-7xl" style="font-variation-settings: 'FILL' 1;">wifi</span>
                </div>
              </button>
            </div>
          </section>
        </div>
      </div>
    `;

    // --- Event Handlers ---

    const nameInput = document.getElementById('w-name');
    const phoneInput = document.getElementById('w-phone');
    const enterBtn = document.getElementById('w-enter');

    function updateEnterBtn() {
      const nameOk = nameInput.value.trim().length >= 2;
      const phoneOk = phoneInput.value.replace(/\D/g, '').length >= 9;
      const valid = nameOk && phoneOk;
      enterBtn.disabled = !valid;
      enterBtn.classList.toggle('opacity-40', !valid);
    }

    nameInput.addEventListener('input', updateEnterBtn);
    phoneInput.addEventListener('input', updateEnterBtn);

    // Enter menu
    enterBtn.addEventListener('click', () => {
      if (enterBtn.disabled) return;
      auth.register({
        name: nameInput.value.trim(),
        phone: phoneInput.value.trim(),
        lang: selectedLang
      });
      setLang(selectedLang);
      cleanupBg();
      onComplete();
    });

    // Skip
    document.getElementById('w-skip').addEventListener('click', () => {
      auth.register({ name: t('review.guest'), phone: '', lang: selectedLang });
      setLang(selectedLang);
      cleanupBg();
      onComplete();
    });

    // Language dropdown
    const toggle = document.getElementById('lang-welcome-toggle');
    const dropdown = document.getElementById('lang-welcome-dropdown');
    const chevron = document.getElementById('lang-chevron');

    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = !dropdown.classList.contains('hidden');
      dropdown.classList.toggle('hidden');
      chevron.style.transform = open ? '' : 'rotate(180deg)';
      if (!open) {
        toggle.classList.add('rounded-b-none', 'border-b-transparent');
      } else {
        toggle.classList.remove('rounded-b-none', 'border-b-transparent');
      }
    });

    document.addEventListener('click', () => {
      dropdown.classList.add('hidden');
      chevron.style.transform = '';
      toggle.classList.remove('rounded-b-none', 'border-b-transparent');
    }, { once: false });

    dropdown.querySelectorAll('[data-wlang]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        selectedLang = btn.dataset.wlang;
        setLang(selectedLang);
        render(); // re-render in new language
      });
    });

    // Wi-Fi button — import and open from home.js would create circular dep, so inline mini version
    document.getElementById('w-wifi').addEventListener('click', () => {
      openWifiFromWelcome();
    });

    setTimeout(() => nameInput.focus(), 300);
  }

  render();
}

function cleanupBg() {
  // Remove the fixed background when leaving welcome
  const bg = document.querySelector('.fixed.inset-0.z-0');
  if (bg) bg.remove();
  // Restore shell padding
  const app = document.getElementById('app');
  app.style.paddingTop = '';
  app.style.paddingBottom = '';
  app.style.maxWidth = '';
}

function openWifiFromWelcome() {
  const wifiString = `WIFI:T:${WIFI.encryption};S:${WIFI.ssid};P:${WIFI.password};;`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&bgcolor=131313&color=f2ca50&data=${encodeURIComponent(wifiString)}`;

  const existing = document.getElementById('wifi-modal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'wifi-modal';
  modal.className = 'fixed inset-0 z-[60] bg-background/80 backdrop-blur-md flex items-center justify-center p-6 overflow-y-auto';
  modal.style.animation = 'fadeIn 0.2s ease-out';
  modal.innerHTML = `
    <div class="w-full max-w-sm bg-surface-container rounded-[2rem] p-5 space-y-3 my-auto" style="animation: sheetUp 0.3s cubic-bezier(0.16,1,0.3,1);">
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
            <span class="material-symbols-outlined text-primary text-lg">wifi</span>
          </div>
          <h3 class="font-headline text-lg font-bold tracking-tighter">Wi-Fi</h3>
        </div>
        <button id="close-wifi-w" class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container-highest transition-colors">
          <span class="material-symbols-outlined text-on-surface-variant text-xl">close</span>
        </button>
      </div>
      <div class="flex gap-4 items-center">
        <div class="flex-shrink-0 bg-[#131313] p-2.5 rounded-lg">
          <img src="${qrUrl}" alt="Wi-Fi QR" width="110" height="110" class="rounded">
        </div>
        <div class="space-y-3 flex-grow">
          <div>
            <p class="text-on-surface-variant text-[9px] uppercase tracking-widest">${t('wifi.network')}</p>
            <p class="text-on-surface font-headline font-bold text-base">${WIFI.ssid}</p>
          </div>
          <div>
            <p class="text-on-surface-variant text-[9px] uppercase tracking-widest">${t('wifi.password')}</p>
            <div class="flex items-center gap-1.5">
              <p class="text-on-surface font-mono text-base">${WIFI.password}</p>
              <button id="copy-pw-w" class="w-7 h-7 flex items-center justify-center rounded-full hover:bg-primary/10 transition-colors active:scale-90">
                <span class="material-symbols-outlined text-primary text-sm">content_copy</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <button id="wifi-copy-w" class="w-full py-3 rounded-full gold-gradient text-on-primary font-headline font-bold uppercase tracking-[0.15em] text-sm text-center active:scale-95 transition-all">
        <span class="material-symbols-outlined text-base align-middle mr-1">content_copy</span> ${t('wifi.connect')}
      </button>
    </div>
  `;

  document.body.appendChild(modal);
  modal.querySelector('#close-wifi-w').addEventListener('click', () => modal.remove());
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
  modal.querySelector('#copy-pw-w')?.addEventListener('click', () => {
    navigator.clipboard.writeText(WIFI.password).catch(() => {});
    const icon = modal.querySelector('#copy-pw-w span');
    icon.textContent = 'check';
    setTimeout(() => { icon.textContent = 'content_copy'; }, 1500);
  });
  modal.querySelector('#wifi-copy-w')?.addEventListener('click', () => {
    navigator.clipboard.writeText(WIFI.password).catch(() => {});
    const btn = modal.querySelector('#wifi-copy-w');
    btn.innerHTML = '<span class="material-symbols-outlined text-base align-middle mr-1">check</span> ' + t('menu.added');
    setTimeout(() => { modal.remove(); }, 1000);
  });
}