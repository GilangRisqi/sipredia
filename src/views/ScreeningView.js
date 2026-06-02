/**
 * ScreeningView
 * Layer   : View
 * Purpose : Renders the 6-parameter diabetes screening form and result display.
 *           No prediction logic.
 */
export class ScreeningView {
  #onSubmit = null;

  /** Return the screening form HTML string. */
  getTemplate() {
    return `
      <section class="screening-page">
        <div class="container">
          <div class="screening-header">
            <h1 class="screening-header__title">🔬 Skrining Risiko Diabetes</h1>
            <p class="screening-header__sub">Isi 6 parameter di bawah ini untuk mendapatkan estimasi risiko diabetes Anda.</p>
          </div>

          <form class="screening-form card" id="screening-form" novalidate>
            <div class="form-grid">
              <!-- Age -->
              <div class="form-group">
                <label class="form-label" for="input-age">Usia (tahun)</label>
                <input class="form-input" type="number" id="input-age" name="age"
                  placeholder="cth: 35" min="1" max="120" required aria-required="true" />
                <span class="form-error" id="error-age"></span>
              </div>

              <!-- BMI -->
              <div class="form-group">
                <label class="form-label" for="input-bmi">BMI (kg/m²)</label>
                <input class="form-input" type="number" id="input-bmi" name="bmi"
                  placeholder="cth: 28.5" min="10" max="80" step="0.1" required aria-required="true" />
                <span class="form-error" id="error-bmi"></span>
              </div>

              <!-- Glucose Level -->
              <div class="form-group">
                <label class="form-label" for="input-glucose">Kadar Glukosa (mg/dL)</label>
                <input class="form-input" type="number" id="input-glucose" name="glucoseLevel"
                  placeholder="cth: 120" min="0" max="500" required aria-required="true" />
                <span class="form-error" id="error-glucose"></span>
              </div>

              <!-- Blood Pressure -->
              <div class="form-group">
                <label class="form-label" for="input-bp">Tekanan Darah Diastolik (mmHg)</label>
                <input class="form-input" type="number" id="input-bp" name="bloodPressure"
                  placeholder="cth: 80" min="0" max="200" required aria-required="true" />
                <span class="form-error" id="error-bp"></span>
              </div>

              <!-- Insulin -->
              <div class="form-group">
                <label class="form-label" for="input-insulin">Kadar Insulin (μU/mL)</label>
                <input class="form-input" type="number" id="input-insulin" name="insulinLevel"
                  placeholder="cth: 85" min="0" max="900" required aria-required="true" />
                <span class="form-error" id="error-insulin"></span>
              </div>

              <!-- Skin Thickness -->
              <div class="form-group">
                <label class="form-label" for="input-skin">Tebal Kulit Triceps (mm)</label>
                <input class="form-input" type="number" id="input-skin" name="skinThickness"
                  placeholder="cth: 20" min="0" max="100" required aria-required="true" />
                <span class="form-error" id="error-skin"></span>
              </div>
            </div>

            <div class="screening-form__actions">
              <button type="reset" class="btn btn-secondary" id="btn-reset">Reset</button>
              <button type="submit" class="btn btn-primary" id="btn-predict">Prediksi Sekarang</button>
            </div>
          </form>

          <!-- Result Panel (hidden until prediction arrives) -->
          <div class="result-panel card" id="result-panel" hidden aria-live="polite"></div>
        </div>
      </section>
    `;
  }

  /** Bind events after injection into DOM. */
  bindEvents() {
    const form = document.getElementById('screening-form');
    if (form && this.#onSubmit) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = this.#collectFormData(form);
        if (this.#validateForm(data)) {
          this.#onSubmit(data);
        }
      });
    }
  }

  /** Show a loading spinner in the result panel. */
  showPredicting() {
    const panel = document.getElementById('result-panel');
    if (!panel) return;
    panel.hidden = false;
    panel.innerHTML = `
      <div class="sp-loading">
        <div class="sp-loading__ring"></div>
        <p class="sp-loading__text">Memproses prediksi AI...</p>
      </div>
    `;
  }

  /** Render the prediction result. */
  showResult(result) {
    const panel = document.getElementById('result-panel');
    if (!panel) return;
    const badgeMap = { Rendah: 'success', Sedang: 'warning', Tinggi: 'danger' };
    const badge    = badgeMap[result.riskLevel] ?? 'info';
    panel.hidden   = false;
    panel.innerHTML = `
      <div class="result-content">
        <h2 class="result-title">Hasil Prediksi</h2>
        <div class="result-risk">
          <span class="result-risk__label">Tingkat Risiko</span>
          <span class="badge badge-${badge} result-risk__badge">${result.riskLevel}</span>
        </div>
        <div class="result-probability">
          <span class="result-prob__label">Probabilitas</span>
          <span class="result-prob__value">${result.probability}%</span>
        </div>
        <div class="result-probability-bar">
          <div class="result-probability-bar__fill result-probability-bar__fill--${badge}"
               style="width: ${result.probability}%"></div>
        </div>
        <p class="result-recommendation">${result.recommendation}</p>
        <p class="result-disclaimer">
          ⚠️ Ini adalah estimasi berbasis AI, bukan diagnosis medis. Konsultasikan dengan dokter.
        </p>
      </div>
    `;
  }

  /** Show an error in the result panel. */
  showError(message) {
    const panel = document.getElementById('result-panel');
    if (!panel) return;
    panel.hidden = false;
    panel.innerHTML = `<p class="form-error">${message}</p>`;
  }

  /** Set loading state on predict button. */
  setLoading(isLoading) {
    const btn = document.getElementById('btn-predict');
    if (!btn) return;
    btn.disabled    = isLoading;
    btn.textContent = isLoading ? 'Memproses...' : 'Prediksi Sekarang';
  }

  /** Register submit callback. */
  onSubmit(callback) { this.#onSubmit = callback; }

  // ── Private ────────────────────────────────────────────────────────────────

  #collectFormData(form) {
    const fd = new FormData(form);
    return {
      age:           parseFloat(fd.get('age'))          || 0,
      bmi:           parseFloat(fd.get('bmi'))          || 0,
      glucoseLevel:  parseFloat(fd.get('glucoseLevel')) || 0,
      bloodPressure: parseFloat(fd.get('bloodPressure'))|| 0,
      insulinLevel:  parseFloat(fd.get('insulinLevel')) || 0,
      skinThickness: parseFloat(fd.get('skinThickness'))|| 0,
    };
  }

  #validateForm(data) {
    let valid = true;
    const checks = [
      { key: 'age',           id: 'error-age',     label: 'Usia',                   min: 1,   max: 120 },
      { key: 'bmi',           id: 'error-bmi',     label: 'BMI',                    min: 10,  max: 80  },
      { key: 'glucoseLevel',  id: 'error-glucose', label: 'Kadar Glukosa',          min: 0,   max: 500 },
      { key: 'bloodPressure', id: 'error-bp',      label: 'Tekanan Darah',          min: 0,   max: 200 },
      { key: 'insulinLevel',  id: 'error-insulin', label: 'Kadar Insulin',          min: 0,   max: 900 },
      { key: 'skinThickness', id: 'error-skin',    label: 'Tebal Kulit',            min: 0,   max: 100 },
    ];

    checks.forEach(({ key, id, label, min, max }) => {
      const el  = document.getElementById(id);
      const val = data[key];
      if (!el) return;
      if (isNaN(val) || val < min || val > max) {
        el.textContent = `${label} harus antara ${min} dan ${max}.`;
        valid = false;
      } else {
        el.textContent = '';
      }
    });

    return valid;
  }
}
