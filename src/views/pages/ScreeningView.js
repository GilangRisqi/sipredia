/**
 * ScreeningView Component
 * Layer   : View
 * Purpose : Custom Element for patient screening form.
 *           Handles DOM manipulation and real-time BMI calculation.
 *           Dispatches 'onPredict' event with raw form data.
 */

export class ScreeningView extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    this.bindEvents();
  }

  render() {
    this.innerHTML = `
      <section class="screening-page container" style="padding-top: var(--space-8); padding-bottom: var(--space-16);">
        <div class="screening-header" style="text-align: center; margin-bottom: var(--space-8);">
          <h1 class="screening-header__title" style="font-size: var(--font-size-3xl); font-weight: 800; color: var(--color-text-primary); margin-bottom: var(--space-2);"><i class="bi bi-clipboard2-pulse-fill" style="color: var(--color-accent); margin-right: 0.5rem;"></i> Skrining Risiko Diabetes</h1>
          <p class="screening-header__sub text-secondary">Isi 9 parameter klinis pasien di bawah ini secara akurat.</p>
        </div>

        <form class="screening-form card" id="screening-form" style="margin-bottom: var(--space-6);" novalidate>
          <div class="form-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: var(--space-5);">
            
            <!-- 1. Umur -->
            <div class="form-group">
              <label class="form-label" for="input-age">Umur Pasien (Tahun)</label>
              <input class="form-input" type="number" id="input-age" name="patientAge" placeholder="cth: 45" min="1" max="120" required />
            </div>

            <!-- 2. Berat Badan -->
            <div class="form-group">
              <label class="form-label" for="input-weight">Berat Badan (kg)</label>
              <input class="form-input" type="number" id="input-weight" name="weight" placeholder="cth: 65" min="10" max="250" required />
            </div>

            <!-- 3. Tinggi Badan -->
            <div class="form-group">
              <label class="form-label" for="input-height">Tinggi Badan (cm)</label>
              <input class="form-input" type="number" id="input-height" name="height" placeholder="cth: 165" min="50" max="250" required />
            </div>

            <!-- Real-time BMI Display -->
            <div class="form-group" style="justify-content: center; background: var(--color-bg-secondary); padding: var(--space-3); border-radius: var(--radius-md); border: 1px solid var(--color-border);">
              <label class="form-label" style="margin-bottom: 0;">Estimasi BMI Real-time</label>
              <div id="bmi-result" style="font-size: var(--font-size-xl); font-weight: 700; color: var(--color-accent);">0.00</div>
            </div>

            <!-- 4. Jenis Kelamin -->
            <div class="form-group">
              <label class="form-label">Jenis Kelamin</label>
              <div class="form-input" style="display: flex; gap: var(--space-6); align-items: center; cursor: default; height: 100%;">
                <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; margin: 0; font-weight: 500;">
                  <input type="radio" name="sex" value="Pria" required style="accent-color: var(--color-accent); width: 1.2rem; height: 1.2rem; cursor: pointer;" /> Laki-Laki
                </label>
                <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; margin: 0; font-weight: 500;">
                  <input type="radio" name="sex" value="Wanita" required style="accent-color: var(--color-accent); width: 1.2rem; height: 1.2rem; cursor: pointer;" /> Perempuan
                </label>
              </div>
            </div>

            <!-- 5. Riwayat Darah Tinggi -->
            <div class="form-group">
              <label class="form-label">Riwayat Darah Tinggi</label>
              <div class="form-input" style="display: flex; gap: var(--space-6); align-items: center; cursor: default; height: 100%;">
                <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; margin: 0; font-weight: 500;">
                  <input type="radio" name="highBloodPressure" value="Ya" required style="accent-color: var(--color-accent); width: 1.2rem; height: 1.2rem; cursor: pointer;" /> Ya
                </label>
                <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; margin: 0; font-weight: 500;">
                  <input type="radio" name="highBloodPressure" value="Tidak" required style="accent-color: var(--color-accent); width: 1.2rem; height: 1.2rem; cursor: pointer;" /> Tidak
                </label>
              </div>
            </div>

            <!-- 6. Riwayat Kolesterol Tinggi -->
            <div class="form-group">
              <label class="form-label">Riwayat Kolesterol Tinggi</label>
              <div class="form-input" style="display: flex; gap: var(--space-6); align-items: center; cursor: default; height: 100%;">
                <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; margin: 0; font-weight: 500;">
                  <input type="radio" name="highCholesterol" value="Ya" required style="accent-color: var(--color-accent); width: 1.2rem; height: 1.2rem; cursor: pointer;" /> Ya
                </label>
                <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; margin: 0; font-weight: 500;">
                  <input type="radio" name="highCholesterol" value="Tidak" required style="accent-color: var(--color-accent); width: 1.2rem; height: 1.2rem; cursor: pointer;" /> Tidak
                </label>
              </div>
            </div>

            <!-- 7. Riwayat Penyakit Jantung -->
            <div class="form-group">
              <label class="form-label">Riwayat Penyakit Jantung</label>
              <div class="form-input" style="display: flex; gap: var(--space-6); align-items: center; cursor: default; height: 100%;">
                <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; margin: 0; font-weight: 500;">
                  <input type="radio" name="heartDisease" value="Ya" required style="accent-color: var(--color-accent); width: 1.2rem; height: 1.2rem; cursor: pointer;" /> Ya
                </label>
                <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; margin: 0; font-weight: 500;">
                  <input type="radio" name="heartDisease" value="Tidak" required style="accent-color: var(--color-accent); width: 1.2rem; height: 1.2rem; cursor: pointer;" /> Tidak
                </label>
              </div>
            </div>

            <!-- 8. Tingkat Kesehatan -->
            <div class="form-group" style="display: flex; flex-direction: column; height: 100%;">
              <label class="form-label" for="input-health">Tingkat Kesehatan Berdasarkan Keluhan (Skala 1-5)</label>
              <input class="form-input" type="number" id="input-health" name="generalHealth" placeholder="1 (Sangat Baik) - 5 (Buruk)" min="1" max="5" required />
            </div>

            <!-- 9. Jumlah Hari Sakit -->
            <div class="form-group" style="display: flex; flex-direction: column; justify-content: space-between; height: 100%;">
              <label class="form-label" for="input-sick">Jumlah Hari Sakit (1 Bulan Terakhir)</label>
              <input class="form-input" type="number" id="input-sick" name="sickDays" placeholder="0 - 30" min="0" max="30" required />
            </div>

          </div>

          <div class="screening-form__actions" style="display: flex; justify-content: flex-end; gap: var(--space-3); margin-top: var(--space-6); border-top: 1px solid var(--color-border); padding-top: var(--space-5);">
            <button type="reset" class="btn btn-secondary">Reset</button>
            <button type="submit" class="btn btn-primary" id="btn-submit">Cek Risiko</button>
          </div>
        </form>

        <!-- Container for Result -->
        <div id="result-container" hidden></div>
      </section>
    `;
  }

  bindEvents() {
    const form = this.querySelector('#screening-form');
    const weightInput = this.querySelector('#input-weight');
    const heightInput = this.querySelector('#input-height');
    const bmiResult = this.querySelector('#bmi-result');

    // Real-time BMI Calculation
    const calculateBMI = () => {
      const weight = parseFloat(weightInput.value);
      const heightCm = parseFloat(heightInput.value);
      
      if (weight > 0 && heightCm > 0) {
        const heightM = heightCm / 100;
        const bmi = weight / (heightM * heightM);
        bmiResult.textContent = bmi.toFixed(2);
      } else {
        bmiResult.textContent = '0.00';
      }
    };

    weightInput.addEventListener('input', calculateBMI);
    heightInput.addEventListener('input', calculateBMI);

    // Form Submission
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Validation check
        if (!form.checkValidity()) {
          form.reportValidity();
          return;
        }

        const formData = new FormData(form);
        const data = {
          highBloodPressure: formData.get('highBloodPressure'),
          highCholesterol: formData.get('highCholesterol'),
          heartDisease: formData.get('heartDisease'),
          weight: parseFloat(formData.get('weight')),
          height: parseFloat(formData.get('height')),
          generalHealth: parseInt(formData.get('generalHealth'), 10),
          sickDays: parseInt(formData.get('sickDays'), 10),
          sex: formData.get('sex'),
          patientAge: parseInt(formData.get('patientAge'), 10)
        };

        // Dispatch Custom Event to Presenter
        this.dispatchEvent(new CustomEvent('onPredict', {
          detail: data,
          bubbles: true,
          composed: true
        }));
      });
    }
  }

  /**
   * Called by Presenter to update the view state during calculation.
   */
  showPredicting() {
    const btn = this.querySelector('#btn-submit');
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Sedang memproses...';
    }

    const container = this.querySelector('#result-container');
    if (container) {
      container.hidden = false;
      container.innerHTML = `
        <div class="card" style="text-align: center; padding: var(--space-8);">
          <div class="sp-loading__ring" style="margin: 0 auto var(--space-4);"></div>
          <p class="text-secondary">AI sedang menganalisis probabilitas risiko...</p>
        </div>
      `;
    }
  }

  /**
   * Called by Presenter to render the final result.
   */
  showResult(resultString) {
    const btn = this.querySelector('#btn-submit');
    if (btn) {
      btn.disabled = false;
      btn.textContent = 'Cek Risiko Ulang';
    }

    const container = this.querySelector('#result-container');
    if (container) {
      container.hidden = false;
      
      let badgeClass = '';
      let icon = '';
      // TAMBAHKAN VARIABEL INI
      let pesanBawah = ''; 

      if (resultString === 'Berisiko diabetes') {
        badgeClass = 'badge-danger';
        icon = '<i class="bi bi-exclamation-triangle-fill" style="color: var(--color-danger);"></i>';
        pesanBawah = "<strong>Disclaimer:</strong> SIPREDIA adalah sistem pendukung keputusan. Keputusan klinis akhir tetap berada pada kewenangan dokter.";
      } else if (resultString === 'Tidak berisiko diabetes') {
        badgeClass = 'badge-success';
        icon = '<i class="bi bi-check-circle-fill" style="color: var(--color-success);"></i>';
        pesanBawah = "<strong>Disclaimer:</strong> Jaga pola makan dan gaya hidup sehat Anda. Lakukan pemeriksaan rutin di Puskesmas.";
      } else {
        // KONDISI ERROR (Server Mati)
        badgeClass = 'badge-warning'; 
        icon = '<i class="bi bi-x-circle-fill" style="color: var(--color-warning);"></i>';
        // PESAN KHUSUS SAAT ERROR
        pesanBawah = "<strong>Peringatan Sistem:</strong> Gagal terhubung ke Machine Learning. Pastikan server Python API telah dinyalakan dan koneksi internet stabil.";
      }

      container.innerHTML = `
        <div class="card result-panel" style="margin-top: var(--space-6); text-align: center;">
          <h2 style="font-size: var(--font-size-xl); margin-bottom: var(--space-4);">Hasil Analisis Sistem</h2>
          <div style="padding: var(--space-5); border: 2px dashed var(--color-border); border-radius: var(--radius-md); background: var(--color-bg-secondary); margin-bottom: var(--space-4);">
            <span style="font-size: 3rem; display: block; margin-bottom: var(--space-2);">${icon}</span>
            <span class="badge ${badgeClass}" style="font-size: var(--font-size-lg); padding: var(--space-2) var(--space-6);">
              ${resultString}
            </span>
          </div>
          <p class="text-secondary" style="font-size: var(--font-size-sm);">
            ${pesanBawah}
          </p>
        </div>
      `;
    }
  }
}

customElements.define('screening-view', ScreeningView);
