/**
 * AuthModel
 * Layer   : Model
 * Purpose : Manages authentication state and token persistence in localStorage.
 * No DOM access.
 */

const TOKEN_KEY = 'sipredia_token';
const USER_KEY  = 'sipredia_user';

const API_BASE = (typeof process !== 'undefined' && process.env && process.env.API_BASE_URL) || 'https://sipredia-backend.vercel.app';

export class AuthModel {
  /**
   * Attempt login via API.
   * @param {string} email - Diubah ke email sesuai Supabase
   * @param {string} password
   * @returns {Promise<object>}
   */
  async login(email, password) {
    const response = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      // Mengambil pesan error spesifik dari BE Node.js (err.error)
      throw new Error(err.error || `Login failed (${response.status})`);
    }

    const result = await response.json();
    
    // Menyesuaikan dengan struktur response sukses dari BE Node.js yang kita buat
    const token = result.data.session.access_token;
    
    // Menyimpan metadata user (termasuk nama dan tanggal_lahir yang di-fetch dari tabel profiles)
    const user = {
      id: result.data.user.id,
      email: result.data.user.email,
      ...result.data.user.user_metadata
    };

    this.#persistSession(token, user);
    return result;
  }

  /**
   * Attempt registration via API.
   * @param {Object} userData - { nama, tglLahir, email, password }
   * @returns {Promise<object>}
   */
  async register(userData) {
    // Mapping tglLahir ke tanggal_lahir agar sesuai dengan body yang diminta BE
    const payload = {
      email: userData.email,
      password: userData.password,
      nama: userData.nama,
      tanggal_lahir: userData.tglLahir 
    };

    const response = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || `Registrasi gagal (${response.status})`);
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