export class Router {
  constructor(routes) {
    this.routes = routes;
    this.currentView = null;
    window.addEventListener('hashchange', () => this.resolve());
  }

  resolve() {
    const hash = location.hash || '#/';
    for (const route of this.routes) {
      const match = this.matchRoute(route.path, hash);
      if (match) {
        this.currentView = route.view;
        route.handler(match.params);
        this.updateNav(route.nav || '');
        return;
      }
    }
    // Fallback to home
    location.hash = '#/';
  }

  matchRoute(pattern, hash) {
    const patternParts = pattern.split('/');
    const hashParts = hash.replace('#', '').split('/');
    if (patternParts.length !== hashParts.length) return null;

    const params = {};
    for (let i = 0; i < patternParts.length; i++) {
      if (patternParts[i].startsWith(':')) {
        params[patternParts[i].slice(1)] = decodeURIComponent(hashParts[i]);
      } else if (patternParts[i] !== hashParts[i]) {
        return null;
      }
    }
    return { params };
  }

  updateNav(activeNav) {
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.toggle('active', item.dataset.nav === activeNav);
    });
  }
}