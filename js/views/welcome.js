import { auth } from '../auth.js';
import { t, setLang, getLang, getLangLabel } from '../i18n.js';

export function renderWelcome(onComplete) {
  const app = document.getElementById('app');
  document.getElementById('app-header').style.display = 'none';
  document.getElementById('bottom-nav').style.display = 'none';

  let step = 'phone'; // 'phone' -> 'register' (if new) or straight to menu (if returning)

  function renderPhoneStep() {
    app.innerHTML = `
      <div class="px-5 min-h-screen flex flex-col justify-center animate-[fadeIn_0.25s_ease-out] -mt-16">
        <div class="text-center mb-10">
          <div class="w-16 h-16 mx-auto rounded-full gold-gradient flex items-center justify-center mb-5">
            <span class="material-symbols-outlined text-3xl text-on-primary">restaurant</span>
          </div>
          <h1 class="font-headline text-3xl font-extrabold tracking-tighter text-on-surface">NOCTURNAL GALLERY</h1>
          <p class="text-on-surface-variant text-sm mt-2">${t('welcome.subtitle')}</p>
        </div>

        <div class="space-y-4 max-w-sm mx-auto w-full">
          <div>
            <label class="text-on-surface-variant text-[10px] uppercase tracking-widest font-label block mb-1.5">${t('welcome.phone')}</label>
            <input id="phone-input" type="tel" placeholder="+998 90 123 45 67" maxlength="20"
              class="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-3.5 text-on-surface text-lg font-body tracking-wider placeholder:text-on-surface-variant/30 focus:border-primary focus:outline-none transition-colors text-center">
          </div>
          <button id="phone-submit" disabled class="w-full py-4 rounded-full gold-gradient text-on-primary font-headline font-bold uppercase tracking-[0.15em] text-sm opacity-40 transition-all">${t('welcome.continue')}</button>
        </div>

        <div class="text-center mt-8">
          <p class="text-on-surface-variant/40 text-[9px] uppercase tracking-widest">${t('welcome.privacy')}</p>
        </div>
      </div>
    `;

    const input = document.getElementById('phone-input');
    const btn = document.getElementById('phone-submit');

    const updateBtn = () => {
      const valid = input.value.replace(/\D/g, '').length >= 9;
      btn.disabled = !valid;
      btn.classList.toggle('opacity-40', !valid);
      btn.classList.toggle('active:scale-95', valid);
      btn.classList.toggle('shadow-[0_8px_32px_rgba(212,175,55,0.15)]', valid);
    };

    input.addEventListener('input', updateBtn);
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !btn.disabled) btn.click(); });

    btn.addEventListener('click', () => {
      const phone = input.value.trim();
      const existing = auth.login(phone);
      if (existing) {
        // Returning user — restore lang and go to menu
        setLang(existing.lang || 'ru');
        onComplete();
      } else {
        // New user — go to registration
        renderRegisterStep(phone);
      }
    });

    setTimeout(() => input.focus(), 300);
  }

  function renderRegisterStep(phone) {
    step = 'register';
    app.innerHTML = `
      <div class="px-5 min-h-screen flex flex-col justify-center animate-[fadeIn_0.25s_ease-out] -mt-16">
        <div class="text-center mb-8">
          <div class="w-14 h-14 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <span class="material-symbols-outlined text-2xl text-primary">person_add</span>
          </div>
          <h2 class="font-headline text-2xl font-extrabold tracking-tighter text-on-surface">${t('welcome.new_guest')}</h2>
          <p class="text-on-surface-variant text-sm mt-1">${t('welcome.fill_info')}</p>
        </div>

        <div class="space-y-4 max-w-sm mx-auto w-full">
          <div>
            <label class="text-on-surface-variant text-[10px] uppercase tracking-widest font-label block mb-1.5">${t('welcome.your_name')}</label>
            <input id="reg-name" type="text" placeholder="${t('welcome.name_placeholder')}" maxlength="50"
              class="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-3.5 text-on-surface text-sm font-body placeholder:text-on-surface-variant/30 focus:border-primary focus:outline-none transition-colors">
          </div>
          <div>
            <label class="text-on-surface-variant text-[10px] uppercase tracking-widest font-label block mb-1.5">${t('welcome.phone')}</label>
            <input id="reg-phone" type="tel" value="${phone}" readonly
              class="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-4 py-3.5 text-on-surface/60 text-sm font-body tracking-wider">
          </div>
          <div>
            <label class="text-on-surface-variant text-[10px] uppercase tracking-widest font-label block mb-1.5">${t('welcome.language')}</label>
            <div class="grid grid-cols-4 gap-2">
              ${['ru', 'uz', 'en', 'kk'].map(code => `
                <button data-reg-lang="${code}" class="reg-lang-btn py-3 rounded-lg font-label font-bold text-xs uppercase tracking-widest transition-all ${getLang() === code ? 'bg-primary text-on-primary' : 'bg-surface-container-highest text-on-surface-variant hover:text-primary'}">${getLangLabel(code)}</button>
              `).join('')}
            </div>
          </div>
          <button id="reg-submit" disabled class="w-full py-4 rounded-full gold-gradient text-on-primary font-headline font-bold uppercase tracking-[0.15em] text-sm opacity-40 transition-all mt-2">${t('welcome.register')}</button>
        </div>
      </div>
    `;

    let selectedLang = getLang();
    const nameInput = document.getElementById('reg-name');
    const submitBtn = document.getElementById('reg-submit');

    const updateBtn = () => {
      const valid = nameInput.value.trim().length >= 2;
      submitBtn.disabled = !valid;
      submitBtn.classList.toggle('opacity-40', !valid);
      submitBtn.classList.toggle('active:scale-95', valid);
      submitBtn.classList.toggle('shadow-[0_8px_32px_rgba(212,175,55,0.15)]', valid);
    };

    nameInput.addEventListener('input', updateBtn);
    nameInput.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !submitBtn.disabled) submitBtn.click(); });

    // Language selector
    document.querySelectorAll('.reg-lang-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedLang = btn.dataset.regLang;
        document.querySelectorAll('.reg-lang-btn').forEach(b => {
          b.classList.toggle('bg-primary', b.dataset.regLang === selectedLang);
          b.classList.toggle('text-on-primary', b.dataset.regLang === selectedLang);
          b.classList.toggle('bg-surface-container-highest', b.dataset.regLang !== selectedLang);
          b.classList.toggle('text-on-surface-variant', b.dataset.regLang !== selectedLang);
        });
      });
    });

    submitBtn.addEventListener('click', () => {
      const name = nameInput.value.trim();
      auth.register({ name, phone, lang: selectedLang });
      setLang(selectedLang);
      onComplete();
    });

    setTimeout(() => nameInput.focus(), 300);
  }

  renderPhoneStep();
}