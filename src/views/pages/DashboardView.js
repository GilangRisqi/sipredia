/**
 * DashboardView Component
 * Layer   : View
 * Purpose : Custom Web Component for the Home/Dashboard screen.
 *           Renders the hero section with background image, stats panel,
 *           quick action cards, and dispatches custom 'navigate' events.
 */

export class DashboardView extends HTMLElement {
  #user = {};
  #stats = {};

  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    this.bindEvents();
  }

  /**
   * Set user and stats data to be rendered.
   * @param {object} user - { name, username }
   * @param {object} stats - { totalScreenings, lastRisk, lastDate }
   */
  setData(user = {}, stats = {}) {
    this.#user = user;
    this.#stats = stats;
    this.render();
    this.bindEvents();
  }

  render() {
    const greeting = this.#getGreeting();
    const displayName = this.#user?.name || this.#user?.username || 'Dokter Puskesmas';
    const totalScreenings = this.#stats?.totalScreenings ?? 0;
    const lastRisk = this.#stats?.lastRisk ?? '–';
    const lastDate = this.#stats?.lastDate ?? '–';

    this.innerHTML = `
      <section class="dashboard-page">
        <!-- Hero Section using CSS Grid -->
        <div class="dashboard-hero-wrapper">
          <div class="container dashboard-hero-grid">
            <div class="hero-content">
              <span class="hero-greeting">${greeting}, ${displayName}</span>
              <h1 class="hero-title">SIPREDIA <br><span class="text-gradient">Sistem Prediksi Diabetes</span></h1>
              <p class="hero-subtitle">Alat bantu dokter untuk deteksi dini risiko diabetes pasien secara cepat, akurat, dan berbasis kecerdasan buatan.</p>
              <div class="hero-actions">
                <button class="btn btn-primary btn-cta" data-route="/screening" aria-label="Mulai melakukan prediksi diabetes">
                  🩺 Mulai Prediksi Baru
                </button>
              </div>
            </div>
            
            <div class="hero-visual">
              <div class="hero-card-preview card">
                <div class="preview-header">
                  <span class="preview-pulse"></span>
                  <span class="preview-title">Sistem Penunjang Keputusan</span>
                </div>
                <div class="preview-body">
                  <div class="preview-item">
                    <span class="preview-label">Akurasi Model ML</span>
                    <strong class="text-accent">94.2%</strong>
                  </div>
                  <div class="preview-progress">
                    <div class="preview-progress-bar" style="width: 94.2%"></div>
                  </div>
                  <div class="preview-badge-row">
                    <span class="badge badge-success">Offline Ready</span>
                    <span class="badge badge-info">PIMA Dataset</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="container">
          <!-- Stats Bar -->
          <div class="dashboard-stats">
            <div class="stat-card card">
              <span class="stat-card__label">Total Skrining Pasien</span>
              <span class="stat-card__value" id="stat-total">${totalScreenings}</span>
            </div>
            <div class="stat-card card">
              <span class="stat-card__label">Kategori Risiko Terakhir</span>
              <span class="stat-card__value" id="stat-risk">
                ${lastRisk !== '–' 
                  ? `<span class="badge badge-${this.#riskBadgeColor(lastRisk)}">${lastRisk}</span>`
                  : '<span class="text-muted">–</span>'}
              </span>
            </div>
            <div class="stat-card card">
              <span class="stat-card__label">Skrining Terakhir</span>
              <span class="stat-card__value" id="stat-date">${lastDate}</span>
            </div>
          </div>

          <!-- Quick Actions -->
          <h2 class="dashboard-section-title">Aksi Cepat</h2>
          <div class="quick-actions">
            <button class="action-card card" data-route="/screening" aria-label="Mulai skrining baru">
              <div class="action-card__icon">🔬</div>
              <div class="action-card__body">
                <h3 class="action-card__title">Input Skrining Baru</h3>
                <p class="action-card__desc">Isi 6 parameter klinis pasien untuk menganalisis risiko diabetes saat ini.</p>
              </div>
              <span class="action-card__arrow">→</span>
            </button>

            <button class="action-card card" data-route="/history" aria-label="Lihat riwayat skrining">
              <div class="action-card__icon">📋</div>
              <div class="action-card__body">
                <h3 class="action-card__title">Riwayat Skrining</h3>
                <p class="action-card__desc">Lihat riwayat skrining pasien terdahulu dan pantau perkembangannya.</p>
              </div>
              <span class="action-card__arrow">→</span>
            </button>
          </div>

          <!-- Info Banner -->
          <div class="info-banner card">
            <span class="info-banner__icon">💡</span>
            <p class="info-banner__text">
              SIPREDIA menggunakan model pembelajaran mesin yang menganalisis parameter glukosa, indeks massa tubuh (IMT), tekanan darah, ketebalan kulit, insulin, dan usia untuk memperkirakan kemungkinan diabetes. Selalu gunakan pertimbangan klinis Anda sebelum mendiagnosis pasien.
            </p>
          </div>
        </div>
      </section>
    `;
  }

  bindEvents() {
    this.querySelectorAll('[data-route]').forEach((el) => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        const path = el.getAttribute('data-route');
        
        // Dispatch navigate event to be handled by Presenter
        this.dispatchEvent(new CustomEvent('navigate', {
          detail: { path },
          bubbles: true,
          composed: true
        }));
      });
    });
  }

  #getGreeting() {
    const hour = new Date().getHours();
    if (hour < 11) return '🌅 Selamat pagi';
    if (hour < 15) return '☀️ Selamat siang';
    if (hour < 18) return '🌤 Selamat sore';
    return '🌙 Selamat malam';
  }

  #riskBadgeColor(risk) {
    const map = { Rendah: 'success', Sedang: 'warning', Tinggi: 'danger' };
    return map[risk] ?? 'info';
  }
}

customElements.define('dashboard-view', DashboardView);
