/**
 * LoginView
 * Layer   : View
 * Purpose : Renders the login form and emits submit/input events.
 *           No authentication logic here.
 */
export class LoginView {
  #onSubmit = null;

  /** Return the HTML string for the login page. */
  getTemplate() {
    return `
      <section class="login-page">
        <div class="login-card card">
          <!-- Branding -->
          <div class="login-card__brand">
            <div class="login-card__icon">🩺</div>
            <h1 class="login-card__title">SIPREDIA</h1>
            <p class="login-card__subtitle">Sistem Prediksi Diabetes</p>
          </div>

          <!-- Form -->
          <form class="login-form" id="login-form" novalidate autocomplete="on">
            <div class="form-group">
              <label class="form-label" for="input-username">Username</label>
              <input
                class="form-input"
                type="text"
                id="input-username"
                name="username"
                placeholder="Masukkan username"
                autocomplete="username"
                required
                aria-required="true"
              />
              <span class="form-error" id="error-username" aria-live="polite"></span>
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
                >👁</button>
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
        const username = document.getElementById('input-username')?.value.trim() ?? '';
        const password = document.getElementById('input-password')?.value ?? '';
        this.#onSubmit({ username, password });
      });
    }

    // Password visibility toggle
    const toggleBtn = document.getElementById('btn-toggle-pw');
    const pwInput   = document.getElementById('input-password');
    if (toggleBtn && pwInput) {
      toggleBtn.addEventListener('click', () => {
        const isHidden = pwInput.type === 'password';
        pwInput.type = isHidden ? 'text' : 'password';
        toggleBtn.textContent = isHidden ? '🙈' : '👁';
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
    ['error-username', 'error-password', 'error-global'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.textContent = '';
    });
  }

  /** Register submit callback (Presenter attaches this). */
  onSubmit(callback) { this.#onSubmit = callback; }
}
