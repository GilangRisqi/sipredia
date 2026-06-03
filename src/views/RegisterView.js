/**
 * RegisterView
 * Layer   : View
 * Purpose : Renders the register form and emits submit/input events.
 *           No logic here.
 */
export class RegisterView {
  #onSubmit = null;

  /** Return the HTML string for the register page. */
  getTemplate() {
    return `
      <section class="login-page">
        <div class="login-card card">
          <!-- Branding -->
          <div class="login-card__brand">
            <div class="login-card__icon"><i class="bi bi-heart-pulse-fill"></i></div>
            <h1 class="login-card__title">Daftar Akun</h1>
            <p class="login-card__subtitle">SIPREDIA</p>
          </div>

          <!-- Form -->
          <form class="login-form" id="register-form" novalidate autocomplete="off">
            <div class="form-group">
              <label class="form-label" for="input-nama">Nama Lengkap</label>
              <input
                class="form-input"
                type="text"
                id="input-nama"
                name="nama"
                placeholder="Masukkan nama lengkap"
                required
              />
            </div>

            <div class="form-group">
              <label class="form-label" for="input-tgl-lahir">Tanggal Lahir</label>
              <input
                class="form-input"
                type="date"
                id="input-tgl-lahir"
                name="tgl-lahir"
                required
              />
            </div>

            <div class="form-group">
              <label class="form-label" for="input-email">Email</label>
              <input
                class="form-input"
                type="email"
                id="input-email"
                name="email"
                placeholder="Masukkan email"
                required
              />
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
                  required
                />
                <button
                  type="button"
                  class="btn-toggle-pw"
                  id="btn-toggle-pw"
                  aria-label="Tampilkan/sembunyikan password"
                ><i class="bi bi-eye"></i></button>
              </div>
            </div>

            <button
              type="submit"
              class="btn btn-primary btn-block"
              id="btn-register-submit"
            >
              Daftar
            </button>

            <div style="text-align: center; margin-top: var(--space-4);">
              <span class="text-secondary">Sudah punya akun ? </span>
              <a href="#" id="link-login" style="color: var(--color-primary); text-decoration: none; font-weight: 500;">Masuk</a>
            </div>

            <p class="login-form__global-error form-error" id="error-global" aria-live="assertive"></p>
          </form>
        </div>
      </section>
    `;
  }

  /** Bind DOM events after the template has been injected into the DOM. */
  bindEvents() {
    const form = document.getElementById('register-form');
    if (form && this.#onSubmit) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const nama = document.getElementById('input-nama')?.value.trim() ?? '';
        const tglLahir = document.getElementById('input-tgl-lahir')?.value ?? '';
        const email = document.getElementById('input-email')?.value.trim() ?? '';
        const password = document.getElementById('input-password')?.value ?? '';
        this.#onSubmit({ nama, tglLahir, email, password });
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

    // Navigasi ke halaman login
    const linkLogin = document.getElementById('link-login');
    if (linkLogin) {
      linkLogin.addEventListener('click', (e) => {
        e.preventDefault();
        document.body.dispatchEvent(new CustomEvent('navigate', {
          detail: { path: '/login' },
          bubbles: true,
          composed: true
        }));
      });
    }
  }

  /** Show loading state on the submit button. */
  setLoading(isLoading) {
    const btn = document.getElementById('btn-register-submit');
    if (!btn) return;
    btn.disabled    = isLoading;
    btn.textContent = isLoading ? 'Mendaftar...' : 'Daftar';
  }

  /** Display a global error message. */
  showError(message) {
    const el = document.getElementById('error-global');
    if (el) el.textContent = message;
  }

  /** Clear all inline error messages. */
  clearErrors() {
    const el = document.getElementById('error-global');
    if (el) el.textContent = '';
  }

  /** Register submit callback (Presenter attaches this). */
  onSubmit(callback) { this.#onSubmit = callback; }
}
