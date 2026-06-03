/**
 * AuthModel
 * Layer   : Model
 * Purpose : Manages authentication state and token persistence in localStorage.
 *           No DOM access.
 */

const TOKEN_KEY = 'sipredia_token';
const USER_KEY  = 'sipredia_user';
const API_BASE  = (typeof process !== 'undefined' && process.env && process.env.API_BASE_URL) || 'http://localhost:8000';

export class AuthModel {
  /**
   * Attempt login via API.
   * @param {string} username
   * @param {string} password
   * @returns {Promise<{token: string, user: object}>}
   */
  async login(username, password) {
    const response = await fetch(`${API_BASE}/api/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.detail || `Login failed (${response.status})`);
    }

    const data = await response.json();
    this.#persistSession(data.token, data.user);
    return data;
  }

  /**
   * Attempt registration via API.
   * @param {Object} userData - { nama, tglLahir, email, password }
   * @returns {Promise<object>}
   */
  async register(userData) {
    const response = await fetch(`${API_BASE}/api/auth/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.detail || `Registrasi gagal (${response.status})`);
    }

    return await response.json();
  }

  /**
   * Clear session from localStorage.
   */
  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  /**
   * Check whether a session token exists.
   * @returns {boolean}
   */
  isAuthenticated() {
    return !!localStorage.getItem(TOKEN_KEY);
  }

  /**
   * Retrieve the stored auth token.
   * @returns {string|null}
   */
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  /**
   * Retrieve the stored user object.
   * @returns {object|null}
   */
  getUser() {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY));
    } catch {
      return null;
    }
  }

  // ── Private ──────────────────────────────────────────────────────────────

  #persistSession(token, user) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
}
