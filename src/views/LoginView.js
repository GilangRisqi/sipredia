/**
 * LoginView
 * Layer   : View
 * Purpose : Renders the login form and emits submit/input events.
 * No authentication logic here.
 */
export class LoginView {
  #onSubmit = null;

  /** Return the HTML string for the login page. */
  getTemplate() {
    return `
      <section class="login-page">
        <div class="login-card card">
          <div class="login-card__brand">
            <div class="login-card__icon"><i class="bi bi-heart-pulse-fill"></i></div>
            <h1 class="login-card__title">SIPREDIA</h1>
            <p class="login-card__subtitle">Sistem Prediksi Risiko Kesehatan</p>
          </div>

          <form class="login-form" id="login-form" novalidate autocomplete="on">
            <div class="form-group">
              <label class="form-label" for="input-email">Email</label>
              <input
                class="form-input"
                type="email"
                id="input-email"
                name="email"
                placeholder="Masukkan email"
                autocomplete="email"
                required
                aria-required="true"
              />
              <span class="form-error" id="error-email" aria-live="polite"></span>
            </div>

            <div class="form-group">
              <label class="form-label" for="input-password">Password</label>
              <div class="input-password-wrap">
                <input
                  class="form-input"
                  type="password"
                  id="input-password"
                  name="password"
                  placeholder="Masukkan password"
                  autocomplete="current-password"
                  required
                  aria-required="true"
                />
                <button
                  type="button"
                  class="btn-toggle-pw"
                  id="btn-toggle-pw"
                  aria-label="Tampilkan/sembunyikan password"
                ><i class="bi bi-eye"></i></button>
              </div>
              <span class="form-error" id="error-password" aria-live="polite"></span>
            </div>

            <button
              type="submit"
              class="btn btn-primary btn-block"
              id="btn-login-submit"
            >
              Masuk
            </button>

            <div style="text-align: center; margin-top: var(--space-4);">
              <span class="text-secondary">Belum punya akun ? </span>
              <a href="#" id="link-register" style="color: var(--color-primary); text-decoration: none; font-weight: 500;">Daftar</a>
            </div>

            <p class="login-form__global-error form-error" id="error-global" aria-live="assertive"></p>
          </form>
        </div>
      </section>
    `;
  }

  /** Bind DOM events after the template has been injected into the DOM. */
  bindEvents() {
    const form = document.getElementById('login-form');
    if (form && this.#onSubmit) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Mengubah ID dan variabel penampung menjadi email
        const email = document.getElementById('input-email')?.value.trim() ?? '';
        const password = document.getElementById('input-password')?.value ?? '';
        
        // Mengirimkan objek { email, password } ke Presenter
        this.#onSubmit({ email, password });
      });
    }

    // Password visibility toggle
    const toggleBtn = document.getElementById('btn-toggle-pw');
    const pwInput   = document.getElementById('input-password');
    if (toggleBtn && pwInput) {
      toggleBtn.addEventListener('click', () => {
        const isHidden = pwInput.type === 'password';
        pwInput.type = isHidden ? 'text' : 'password';
        toggleBtn.innerHTML = isHidden ? '<i class="bi bi-eye-slash"></i>' : '<i class="bi bi-eye"></i>';
      });
    }

    // Navigasi ke halaman register
    const linkRegister = document.getElementById('link-register');
    if (linkRegister) {
      linkRegister.addEventListener('click', (e) => {
        e.preventDefault();
        document.body.dispatchEvent(new CustomEvent('navigate', {
          detail: { path: '/register' },
          bubbles: true,
          composed: true
        }));
      });
    }
  }

  /** Show loading state on the submit button. */
  setLoading(isLoading) {
    const btn = document.getElementById('btn-login-submit');
    if (!btn) return;
    btn.disabled    = isLoading;
    btn.textContent = isLoading ? 'Memverifikasi...' : 'Masuk';
  }

  /** Display a global error message. */
  showError(message) {
    const el = document.getElementById('error-global');
    if (el) el.textContent = message;
  }

  /** Clear all inline error messages. */
  clearErrors() {
    // Mengubah error-username menjadi error-email
    ['error-email', 'error-password', 'error-global'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.textContent = '';
    });
  }

  /** Register submit callback (Presenter attaches this). */
  onSubmit(callback) { this.#onSubmit = callback; }
}