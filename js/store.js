const CART_KEY = 'ng_cart';
const SPLIT_KEY = 'ng_split';

class CartStore {
  constructor() {
    this.listeners = [];
    this._cart = this._load();
    this._split = this._loadSplit();
  }

  _load() {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch { return []; }
  }

  _save() {
    localStorage.setItem(CART_KEY, JSON.stringify(this._cart));
    this._notify();
  }

  _loadSplit() {
    try {
      return JSON.parse(localStorage.getItem(SPLIT_KEY)) || { enabled: false, mode: 'equally', guests: 2 };
    } catch { return { enabled: false, mode: 'equally', guests: 2 }; }
  }

  _saveSplit() {
    localStorage.setItem(SPLIT_KEY, JSON.stringify(this._split));
    this._notify();
  }

  _notify() {
    this.listeners.forEach(fn => fn());
  }

  onChange(fn) {
    this.listeners.push(fn);
  }

  getCart() {
    return this._cart;
  }

  getCount() {
    return this._cart.reduce((sum, item) => sum + item.qty, 0);
  }

  getSubtotal() {
    return this._cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  }

  addItem(dish, qty = 1) {
    const existing = this._cart.find(item => item.id === dish.id);
    if (existing) {
      existing.qty += qty;
    } else {
      this._cart.push({
        id: dish.id,
        name: dish.name,
        shortName: dish.shortName || dish.name,
        price: dish.price,
        image: dish.image,
        description: dish.description,
        qty
      });
    }
    this._save();
  }

  removeItem(id) {
    this._cart = this._cart.filter(item => item.id !== id);
    this._save();
  }

  updateQty(id, qty) {
    if (qty <= 0) {
      this.removeItem(id);
      return;
    }
    const item = this._cart.find(i => i.id === id);
    if (item) {
      item.qty = qty;
      this._save();
    }
  }

  clear() {
    this._cart = [];
    this._save();
  }

  // Split bill
  getSplit() { return this._split; }
  setSplitEnabled(v) { this._split.enabled = v; this._saveSplit(); }
  setSplitMode(m) { this._split.mode = m; this._saveSplit(); }
  setSplitGuests(n) { this._split.guests = Math.max(1, n); this._saveSplit(); }
}

export const store = new CartStore();