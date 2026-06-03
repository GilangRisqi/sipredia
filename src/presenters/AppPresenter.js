/**
 * AppPresenter
 * Layer   : Presenter
 * Purpose : Orchestrates the entire SPA — routing, auth gate, page switching.
 *           Coordinates Models ↔ Custom Elements Views without mixing responsibilities.
 */

import { RouterModel }     from '@models/RouterModel.js';
import { AuthModel }       from '@models/AuthModel.js';
import { PredictionModel } from '@models/PredictionModel.js';

// Import Custom Elements to register them with Webpack
import '@views/components/Navbar.js';
import '@views/components/Footer.js';
import { DashboardView }   from '@views/pages/DashboardView.js';
import '@views/pages/AboutView.js';

import '@views/pages/ScreeningView.js';

// Non-custom element views
import { LoginView }       from '@views/LoginView.js';
import { RegisterView }    from '@views/RegisterView.js';

export class AppPresenter {
  #router;
  #auth;
  #prediction;
  #navbar;
  #outlet;

  constructor() {
    this.#router     = new RouterModel();
    this.#auth       = new AuthModel();
    this.#prediction = new PredictionModel();

    this.#registerRoutes();
  }

  /** Bootstrap the application. */
  async init() {
    // Cache references to global elements defined in index.html
    this.#navbar = document.querySelector('app-navbar');
    this.#outlet = document.querySelector('#app-outlet');

    if (!this.#navbar || !this.#outlet) {
      throw new Error('AppPresenter: app-navbar or #app-outlet not found in index.html');
    }

    // Set initial user on navbar
    this.#navbar.setUser(this.#auth.getUser());

    // Listen to custom navigation and logout events from Custom Elements
    document.body.addEventListener('navigate', (event) => {
      this.#navigate(event.detail.path);
    });

    document.body.addEventListener('logout', () => {
      this.#handleLogout();
    });

    // Sync on browser back/forward buttons
    window.addEventListener('popstate', () => {
      this.#navigate(window.location.pathname, false);
    });

    await this.#navigate(window.location.pathname, false);
  }

  // ── Private — Routing ──────────────────────────────────────────────────────

  #registerRoutes() {
    this.#router.register('/',          'home');
    this.#router.register('/login',     'login');
    this.#router.register('/register',  'register');
    this.#router.register('/dashboard', 'dashboard');
    this.#router.register('/screening', 'screening');
    this.#router.register('/history',   'history');
    this.#router.register('/about',     'about');
  }

  async #navigate(path, pushState = true) {
    const routeName = this.#router.resolve(path) ?? 'notFound';

    // Auth gate — redirect unauthenticated users to login (except public pages)
    const publicRoutes = ['login', 'register', 'about', 'home', 'dashboard', 'screening', 'history'];
    if (!this.#auth.isAuthenticated() && !publicRoutes.includes(routeName)) {
      this.#router.replace('/login');
      return this.#showLoginPage();
    }

    // Redirect authenticated users away from login
    if (this.#auth.isAuthenticated() && (routeName === 'login' || routeName === 'register')) {
      this.#router.replace('/dashboard');
      return this.#showDashboardPage();
    }

    if (pushState) this.#router.push(path);
    
    // Highlight the active menu item in navbar
    this.#navbar.highlightActiveRoute(path);

    switch (routeName) {
      case 'home':
      case 'dashboard':
        return this.#showDashboardPage();
      case 'login':
        return this.#showLoginPage();
      case 'register':
        return this.#showRegisterPage();
      case 'screening':
        return this.#showScreeningPage();
      case 'history':
        return this.#showHistoryPage();
      case 'about':
        return this.#showAboutPage();
      default:
        return this.#showNotFound();
    }
  }

  // ── Private — Page Renderers ───────────────────────────────────────────────

  #setPage(htmlContent) {
    this.#outlet.innerHTML = '';
    if (typeof htmlContent === 'string') {
      this.#outlet.innerHTML = htmlContent;
    } else if (htmlContent instanceof HTMLElement) {
      this.#outlet.appendChild(htmlContent);
    }
  }

  #showLoginPage() {
    const view = new LoginView();
    this.#setPage(view.getTemplate());
    view.onSubmit(async ({ username, password }) => {
      view.clearErrors();
      view.setLoading(true);
      try {
        await this.#auth.login(username, password);
        this.#navbar.setUser(this.#auth.getUser()); // Sync user to navbar
        this.#navigate('/dashboard');
        this.showToast('Berhasil masuk!', 'success');
      } catch (err) {
        view.setLoading(false);
        view.showError(err.message || 'Login gagal. Periksa kembali kredensial Anda.');
      }
    });
    view.bindEvents();
  }

  #showRegisterPage() {
    const view = new RegisterView();
    this.#setPage(view.getTemplate());
    view.onSubmit(async (userData) => {
      view.clearErrors();
      view.setLoading(true);
      try {
        await this.#auth.register(userData);
        this.#navigate('/login');
        this.showToast('Registrasi berhasil! Silakan masuk.', 'success');
      } catch (err) {
        view.setLoading(false);
        view.showError(err.message || 'Pendaftaran gagal. Silakan coba lagi.');
      }
    });
    view.bindEvents();
  }

  #showDashboardPage() {
    const user = this.#auth.getUser();
    // Simulate getting last stats (mocked or retrieved from local storage / API later)
    const stats = {
      totalScreenings: 18,
      lastRisk: 'Sedang',
      lastDate: '02 Jun 2026'
    };

    const view = document.createElement('dashboard-view');
    this.#setPage(view);
    view.setData(user, stats);
  }

  #showScreeningPage() {
    const view = document.createElement('screening-view');
    this.#setPage(view);

    view.addEventListener('onPredict', async (event) => {
      const patientData = event.detail;
      view.showPredicting(); // Menampilkan status "Sedang memproses..."
      
      try {
        const result = await this.#prediction.calculateRisk(patientData);
        view.showResult(result);
        this.showToast('Prediksi berhasil dikalkulasi.', 'success');
      } catch (err) {
        view.showResult('Gagal memproses prediksi');
        this.showToast('Prediksi gagal.', 'danger');
      }
    });
  }

  #showHistoryPage() {
    this.#setPage(`
      <section class="placeholder-page container">
        <h1>📋 Riwayat Skrining Pasien</h1>
        <p class="text-secondary">Daftar riwayat lengkap hasil deteksi diabetes pasien akan ditampilkan di sini.</p>
        <button class="btn btn-secondary" style="margin-top: var(--space-4);" id="btn-history-back">Kembali</button>
      </section>
    `);
    document.getElementById('btn-history-back')?.addEventListener('click', () => this.#navigate('/'));
  }

  #showAboutPage() {
    const view = document.createElement('about-view');
    this.#setPage(view);
  }

  #showNotFound() {
    this.#setPage(`
      <section class="placeholder-page container">
        <h1>404 – Halaman Tidak Ditemukan</h1>
        <p class="text-secondary">Maaf, halaman yang Anda cari tidak tersedia.</p>
        <button class="btn btn-primary" id="btn-go-home" style="margin-top: var(--space-4);">Kembali ke Beranda</button>
      </section>
    `);
    document.getElementById('btn-go-home')?.addEventListener('click', () => this.#navigate('/'));
  }

  // ── Private — Auth ─────────────────────────────────────────────────────────

  #handleLogout() {
    this.#auth.logout();
    this.#navbar.setUser(null);
    this.#navigate('/login');
    this.showToast('Berhasil keluar.', 'info');
  }

  // ── Toast Notification & Loading Helpers ────────────────────────────────────

  showToast(message, type = 'info', durationMs = 4000) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
      <span class="toast__icon">${this.#toastIcon(type)}</span>
      <span class="toast__message">${this.#escapeHtml(message)}</span>
    `;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast--fade-out');
      setTimeout(() => toast.remove(), 250);
    }, durationMs);
  }

  showLoading(message = 'Memuat...') {
    this.#setPage(`
      <div class="sp-loading">
        <div class="sp-loading__ring"></div>
        <p class="sp-loading__text">${this.#escapeHtml(message)}</p>
      </div>
    `);
  }

  #toastIcon(type) {
    const icons = { 
      success: '<i class="bi bi-check-circle-fill"></i>', 
      warning: '<i class="bi bi-exclamation-triangle-fill"></i>', 
      danger: '<i class="bi bi-x-circle-fill"></i>', 
      info: '<i class="bi bi-info-circle-fill"></i>' 
    };
    return icons[type] || icons.info;
  }

  #escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = String(str ?? '');
    return div.innerHTML;
  }
}
