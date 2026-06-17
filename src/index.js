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


  // ── Service Worker Registration & Update ─────────────────────────────────────
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        console.log('[SW] Registered, scope:', reg.scope);
        
        // Mendeteksi adanya pembaruan Service Worker
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          newWorker.addEventListener('statechange', () => {
            // Jika worker baru sudah terinstal dan ada worker lama yang masih mengontrol halaman
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              app.showUpdateAvailable();
            }
          });
        });
      })
      .catch((err) => console.error('[SW] Registration failed:', err));
  }
});
