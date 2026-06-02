/**
 * RouterModel
 * Layer   : Model
 * Purpose : Manages SPA client-side routing state via History API.
 *           Does NOT touch the DOM.
 */
export class RouterModel {
  #routes = new Map();
  #currentRoute = null;

  /**
   * Register a named route.
   * @param {string} path   - URL pathname e.g. '/dashboard'
   * @param {string} name   - Route name key
   */
  register(path, name) {
    this.#routes.set(path, name);
  }

  /**
   * Resolve a pathname to a route name.
   * @param {string} pathname
   * @returns {string|null}
   */
  resolve(pathname) {
    const name = this.#routes.get(pathname) || null;
    this.#currentRoute = name;
    return name;
  }

  get currentRoute() {
    return this.#currentRoute;
  }

  /**
   * Navigate to a path by pushing to browser history.
   * @param {string} path
   */
  push(path) {
    window.history.pushState({}, '', path);
  }

  /**
   * Replace current history entry without a push.
   * @param {string} path
   */
  replace(path) {
    window.history.replaceState({}, '', path);
  }
}
