/**
 * src/index.js
 * Application entry point.
 * Bootstraps the SPA: registers the Service Worker, imports styles,
 * and initializes the root Presenter.
 */

import '@assets/css/main.css';
import '@assets/css/pages.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { AppPresenter } from './presenters/AppPresenter.js';

// ── Service Worker Registration ──────────────────────────────────────────────
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => console.log('[SW] Registered, scope:', reg.scope))
      .catch((err) => console.error('[SW] Registration failed:', err));
  });
}

// ── Boot Application ─────────────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  const app = new AppPresenter();
  app.init().catch((err) => {
    console.error('[App] Fatal boot error:', err);
    const outlet = document.getElementById('app-outlet') || document.body;
    outlet.innerHTML = `
      <div style="padding:2rem; text-align:center; color:#ef4444;">
        <h1>⚠️ Gagal Memuat Aplikasi</h1>
        <p>${err.message}</p>
      </div>
    `;
  });
});
