import { auth } from '../auth.js';
import { t, getLang, setLang, getLangLabel, getLangName } from '../i18n.js';

export function renderProfile(onLogout) {
  const app = document.getElementById('app');
  const user = auth.getUser();

  if (!user) { location.hash = '#/'; return; }

  const createdDate = new Date(user.createdAt).toLocaleDateString(getLang() === 'en' ? 'en-US' : getLang() === 'ru' ? 'ru-RU' : getLang() === 'uz' ? 'uz-UZ' : 'kk-KZ', { year: 'numeric', month: 'long', day: 'numeric' });

  app.innerHTML = `
    <div class="px-5 animate-[fadeIn_0.25s_ease-out]">
      <h2 class="font-headline text-2xl font-extrabold tracking-tighter mb-8">${t('profile.title')}</h2>

      <!-- Avatar + Name -->
      <div class="flex items-center gap-4 mb-8">
        <div class="w-16 h-16 rounded-full gold-gradient flex items-center justify-center text-on-primary font-headline font-extrabold text-2xl">
          ${user.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h3 class="font-headline text-xl font-bold text-on-surface">${user.name}</h3>
          <p class="text-on-surface-variant text-xs">${t('profile.member_since')} ${createdDate}</p>
        </div>
      </div>

      <!-- Info Cards -->
      <div class="space-y-3 mb-8">
        <div class="bg-surface-container-low rounded-lg p-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <span class="material-symbols-outlined text-primary">phone</span>
            <div>
              <p class="text-on-surface-variant text-[10px] uppercase tracking-widest">${t('profile.phone')}</p>
              <p class="text-on-surface font-bold text-sm">${user.phone}</p>
            </div>
          </div>
        </div>

        <div class="bg-surface-container-low rounded-lg p-4">
          <div class="flex items-center gap-3 mb-3">
            <span class="material-symbols-outlined text-primary">translate</span>
            <div>
              <p class="text-on-surface-variant text-[10px] uppercase tracking-widest">${t('profile.language')}</p>
              <p class="text-on-surface font-bold text-sm">${getLangName(getLang())}</p>
            </div>
          </div>
          <div class="grid grid-cols-4 gap-2">
            ${['ru', 'uz', 'en', 'kk'].map(code => `
              <button data-profile-lang="${code}" class="profile-lang-btn py-2.5 rounded-lg font-label font-bold text-xs uppercase tracking-widest transition-all ${getLang() === code ? 'bg-primary text-on-primary' : 'bg-surface-container-highest text-on-surface-variant hover:text-primary'}">${getLangLabel(code)}</button>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Logout -->
      <button id="logout-btn" class="w-full py-4 rounded-lg border border-outline-variant/30 text-on-surface-variant font-label text-xs uppercase tracking-widest hover:border-error hover:text-error transition-all active:scale-95">
        <span class="material-symbols-outlined text-sm align-middle mr-1">logout</span>
        ${t('profile.logout')}
      </button>
    </div>
  `;

  // Language switch
  document.querySelectorAll('.profile-lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const code = btn.dataset.profileLang;
      setLang(code);
      auth.updateUser({ lang: code });
      renderProfile(onLogout); // re-render with new lang
    });
  });

  // Logout
  document.getElementById('logout-btn').addEventListener('click', () => {
    if (confirm(t('profile.logout_confirm'))) {
      auth.logout();
      onLogout();
    }
  });
}