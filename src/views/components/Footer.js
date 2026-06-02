/**
 * AppFooter Component
 * Layer   : View
 * Purpose : Custom Web Component for the application footer.
 */

export class AppFooter extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
      <footer class="shell-footer">
        <div class="container shell-footer__inner">
          <div class="shell-footer__content">
            <span class="shell-footer__logo">🩺 SIPREDIA</span>
            <p class="shell-footer__clinic">
              Layanan Penunjang Keputusan Klinis Puskesmas. Membantu dokter dalam mendeteksi secara dini risiko diabetes mellitus tipe 2 pada pasien.
            </p>
          </div>
          <div class="shell-footer__bottom">
            <p class="shell-footer__copy">
              &copy; ${new Date().getFullYear()} SIPREDIA (Sistem Prediksi Diabetes). Hak Cipta Dilindungi Undang-Undang.
            </p>
            <p class="shell-footer__version">Versi 1.0.0 (PWA)</p>
          </div>
        </div>
      </footer>
    `;
  }
}

customElements.define('app-footer', AppFooter);
