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
              <p class="hero-subtitle">Mendukung tenaga kesehatan dalam melakukan skrining awal risiko diabetes menggunakan model Machine Learning berbasis Random Forest. Hasil prediksi digunakan sebagai alat bantu dan tidak menggantikan diagnosis medis maupun pemeriksaan laboratorium.</p>
              <div class="hero-actions">
                <button class="btn btn-primary btn-cta" data-route="/screening" aria-label="Mulai melakukan prediksi diabetes">
                  <i class="bi bi-stethoscope" style="margin-right: 0.5rem;"></i> Mulai Prediksi Baru
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="container">

          <!-- Info Banner -->
          <div class="info-banner card">
            <span class="info-banner__icon"><i class="bi bi-lightbulb-fill"></i></span>
            <p class="info-banner__text">
              SIPREDIA menggunakan model pembelajaran mesin yang menganalisis parameter Riwayat Tekanan Darah Tinggi, Riwayat Kolesterol, Riwayat Penyakit Jantung, Kesehatan Berdasarkan Keluhan, Kesehatan Buruk Sebulan Terakhir, Indeks Massa Tubuh (IMT), Jenis Kelamin, dan Usia untuk memperkirakan kemungkinan diabetes. Selalu gunakan pertimbangan klinis Anda sebelum mendiagnosis pasien.
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
    if (hour < 11) return '<i class="bi bi-sunrise"></i> Selamat pagi';
    if (hour < 15) return '<i class="bi bi-brightness-high"></i> Selamat siang';
    if (hour < 18) return '<i class="bi bi-cloud-sun"></i> Selamat sore';
    return '<i class="bi bi-moon-stars"></i> Selamat malam';
  }

  #riskBadgeColor(risk) {
    const map = { Rendah: 'success', Sedang: 'warning', Tinggi: 'danger' };
    return map[risk] ?? 'info';
  }
}

customElements.define('dashboard-view', DashboardView);
