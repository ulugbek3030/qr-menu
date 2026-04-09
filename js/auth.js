const USER_KEY = 'ng_user';

class Auth {
  constructor() {
    this._user = this._load();
  }

  _load() {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY)) || null;
    } catch { return null; }
  }

  _save() {
    localStorage.setItem(USER_KEY, JSON.stringify(this._user));
  }

  isLoggedIn() {
    return !!this._user;
  }

  getUser() {
    return this._user;
  }

  register({ name, phone, lang }) {
    this._user = {
      name: name.trim(),
      phone: phone.trim(),
      lang: lang || 'ru',
      createdAt: new Date().toISOString()
    };
    this._save();
    return this._user;
  }

  login(phone) {
    // Simple phone lookup — in a real app this would check a DB
    // Here we just check if the stored user matches
    if (this._user && this._user.phone === phone.trim()) {
      return this._user;
    }
    return null;
  }

  updateUser(fields) {
    if (!this._user) return;
    Object.assign(this._user, fields);
    this._save();
  }

  logout() {
    this._user = null;
    localStorage.removeItem(USER_KEY);
  }
}

export const auth = new Auth();