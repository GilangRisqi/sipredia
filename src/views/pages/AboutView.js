/**
 * AboutView Component
 * Layer   : View
 * Purpose : Renders the 'Tentang' (About) page.
 *           Pure DOM manipulation and rendering.
 */

export class AboutView extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    this.bindEvents();
  }

  render() {
    this.innerHTML = `
      <section class="container" style="padding-top: var(--space-8); padding-bottom: var(--space-16);">
        
        <header style="text-align: center; margin-bottom: var(--space-10);">
          <h1 style="font-size: var(--font-size-3xl); font-weight: 800; color: var(--color-text-primary); margin-bottom: var(--space-2);">Tentang SIPREDIA</h1>
          <p class="text-secondary" style="font-size: var(--font-size-lg);">Sistem Prediksi Risiko Diabetes</p>
        </header>

        <!-- 1. Tujuan dan Manfaat -->
        <div class="card" style="margin-bottom: var(--space-6);">
          <h2 style="font-size: var(--font-size-xl); color: var(--color-accent); margin-bottom: var(--space-3); display: flex; align-items: center; gap: var(--space-2);">
            <span><i class="bi bi-bullseye"></i></span> Tujuan dan Manfaat
          </h2>
          <p class="text-secondary" style="line-height: 1.8;">
            Aplikasi web ini bertujuan untuk mendukung proses skrining awal risiko diabetes di tingkat fasilitas kesehatan pertama (Puskesmas). SIPREDIA membantu tenaga kesehatan mengidentifikasi pasien yang berisiko diabetes berdasarkan faktor-faktor risiko yang tersedia pada data pasien. Hasil prediksi yang diberikan bersifat sebagai alat bantu dan tidak dimaksudkan untuk menggantikan diagnosis medis maupun pemeriksaan laboratorium.
          </p>
        </div>

        <!-- 2. Cara Penggunaan PWA -->
        <div class="card" style="margin-bottom: var(--space-6);">
          <h2 style="font-size: var(--font-size-xl); color: var(--color-accent); margin-bottom: var(--space-3); display: flex; align-items: center; gap: var(--space-2);">
            <span><i class="bi bi-phone"></i></span> Cara Penggunaan PWA
          </h2>
          <p class="text-secondary" style="line-height: 1.8; margin-bottom: var(--space-3);">
            SIPREDIA dirancang sebagai <strong>Progressive Web App (PWA)</strong>. Artinya, aplikasi ini dapat diinstal di perangkat Anda (baik desktop maupun seluler) dan memiliki kemampuan untuk berjalan meskipun tanpa koneksi internet (offline).
          </p>
          <ol class="text-secondary" style="line-height: 1.8; margin-left: var(--space-5);">
            <li>Pilih menu <strong>Prediksi</strong> melalui bilah navigasi.</li>
            <li>Masukkan data dan parameter klinis pasien secara lengkap pada form skrining.</li>
            <li>Klik tombol <strong>Hitung Risiko</strong> untuk melihat hasil kalkulasi probabilitas.</li>
            <li>Sistem akan menampilkan tingkat risiko beserta rekomendasi tindakan.</li>
          </ol>
        </div>

        <!-- 3. Metodologi dan Parameter Prediksi -->
        <div class="card" style="margin-bottom: var(--space-6);">
          <h2 style="font-size: var(--font-size-xl); color: var(--color-accent); margin-bottom: var(--space-3); display: flex; align-items: center; gap: var(--space-2);">
            <span><i class="bi bi-bar-chart-fill"></i></span> Metodologi dan Parameter Prediksi
          </h2>
          <p class="text-secondary" style="margin-bottom: var(--space-4); line-height: 1.8;">
            Sistem ini menggunakan algoritma Machine Learning yang memproses 8 parameter klinis utama untuk menghasilkan prediksi risiko diabetes:
          </p>
          
          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; text-align: left;" class="text-secondary">
              <thead>
                <tr style="border-bottom: 2px solid var(--color-border);">
                  <th style="padding: var(--space-3) var(--space-2); font-weight: 600;">No</th>
                  <th style="padding: var(--space-3) var(--space-2); font-weight: 600;">Parameter</th>
                  <th style="padding: var(--space-3) var(--space-2); font-weight: 600;">Keterangan</th>
                  <th style="padding: var(--space-3) var(--space-2); font-weight: 600;">Tipe Data</th>
                </tr>
              </thead>
              <tbody>
                <tr style="border-bottom: 1px solid var(--color-border);">
                  <td style="padding: var(--space-3) var(--space-2);">1</td>
                  <td style="font-weight: 500; color: var(--color-text-primary);">Riwayat Darah Tinggi</td>
                  <td style="padding: var(--space-3) var(--space-2);">Apakah pasien memiliki riwayat atau pernah didiagnosis menderita tekanan darah tinggi (hipertensi).</td>
                  <td style="padding: var(--space-3) var(--space-2);">Ya / Tidak</td>
                </tr>
                <tr style="border-bottom: 1px solid var(--color-border);">
                  <td style="padding: var(--space-3) var(--space-2);">2</td>
                  <td style="font-weight: 500; color: var(--color-text-primary);">Riwayat Kolesterol</td>
                  <td style="padding: var(--space-3) var(--space-2);">Apakah pasien memiliki riwayat kadar kolesterol tinggi atau pernah didiagnosis hiperkolesterolemia.</td>
                  <td style="padding: var(--space-3) var(--space-2);">Ya / Tidak</td>
                </tr>
                <tr style="border-bottom: 1px solid var(--color-border);">
                  <td style="padding: var(--space-3) var(--space-2);">3</td>
                  <td style="font-weight: 500; color: var(--color-text-primary);">Riwayat Penyakit Jantung</td>
                  <td style="padding: var(--space-3) var(--space-2);">Apakah pasien memiliki riwayat penyakit jantung, seperti penyakit jantung koroner, gagal jantung, atau gangguan jantung lainnya.</td>
                  <td style="padding: var(--space-3) var(--space-2);">Ya / Tidak</td>
                </tr>
                <tr style="border-bottom: 1px solid var(--color-border);">
                  <td style="padding: var(--space-3) var(--space-2);">4</td>
                  <td style="font-weight: 500; color: var(--color-text-primary);">BMI (Body Mass Index)</td>
                  <td style="padding: var(--space-3) var(--space-2);">Nilai indeks massa tubuh yang dihitung berdasarkan berat badan dan tinggi badan pasien untuk mengetahui status berat badan.</td>
                  <td style="padding: var(--space-3) var(--space-2);">Angka</td>
                </tr>
                <tr style="border-bottom: 1px solid var(--color-border);">
                  <td style="padding: var(--space-3) var(--space-2);">5</td>
                  <td style="font-weight: 500; color: var(--color-text-primary);">Tingkat Kesehatan Berdasarkan Keluhan</td>
                  <td style="padding: var(--space-3) var(--space-2);">
                    Penilaian kondisi kesehatan pasien berdasarkan tingkat keparahan keluhan, mulai dari 1 (Sangat Baik) hingga 5 (Buruk).
                    <div style="margin-top: var(--space-2);">
                      <button type="button" class="btn btn-secondary btn-sm" id="btn-toggle-scale" style="padding: var(--space-1) var(--space-2); font-size: 0.75rem;">Lihat Detail Skala <i class="bi bi-chevron-down" id="icon-toggle-scale"></i></button>
                      <div id="scale-details" style="display: none; margin-top: var(--space-2); padding: var(--space-3); background: var(--color-bg-secondary); border-radius: var(--radius-sm); border: 1px solid var(--color-border); font-size: var(--font-size-sm);">
                        <ul style="list-style-type: none; margin: 0; padding: 0;">
                          <li style="margin-bottom: var(--space-2);"><strong>1 (Sangat Baik)</strong>: Pasien datang untuk kontrol rutin dan tidak memiliki keluhan kesehatan.</li>
                          <li style="margin-bottom: var(--space-2);"><strong>2 (Baik)</strong>: Pasien datang untuk kontrol rutin, pemeriksaan laboratorium, meminta rujukan, atau pengambilan obat tanpa keluhan fisik yang spesifik.</li>
                          <li style="margin-bottom: var(--space-2);"><strong>3 (Cukup Baik)</strong>: Pasien mengalami keluhan ringan seperti pegal ringan, batuk-pilek singkat, atau kondisi kronis yang masih stabil namun mulai menunjukkan gejala awal.</li>
                          <li style="margin-bottom: var(--space-2);"><strong>4 (Kurang Baik)</strong>: Pasien mengalami keluhan yang cukup mengganggu aktivitas sehari-hari, seperti lemas berkepanjangan, mual muntah, pusing, luka diabetes ringan, nyeri sendi, kesemutan, atau kadar gula darah yang tinggi.</li>
                          <li><strong>5 (Buruk)</strong>: Pasien mengalami kondisi serius atau gawat darurat yang memerlukan penanganan segera, seperti pasca stroke, amputasi, luka gangren, sesak napas berat, gangguan bicara, atau gangguan penglihatan berat.</li>
                        </ul>
                      </div>
                    </div>
                  </td>
                  <td style="padding: var(--space-3) var(--space-2);">Skala 1–5</td>
                </tr>
                <tr style="border-bottom: 1px solid var(--color-border);">
                  <td style="padding: var(--space-3) var(--space-2);">6</td>
                  <td style="font-weight: 500; color: var(--color-text-primary);">Jumlah Hari Sakit</td>
                  <td style="padding: var(--space-3) var(--space-2);">Jumlah hari dalam satu bulan terakhir ketika pasien mengalami sakit atau gangguan kesehatan.</td>
                  <td style="padding: var(--space-3) var(--space-2);">1–30 Hari</td>
                </tr>
                <tr style="border-bottom: 1px solid var(--color-border);">
                  <td style="padding: var(--space-3) var(--space-2);">7</td>
                  <td style="font-weight: 500; color: var(--color-text-primary);">Jenis Kelamin</td>
                  <td style="padding: var(--space-3) var(--space-2);">Jenis kelamin biologis pasien yang digunakan sebagai salah satu faktor dalam analisis.</td>
                  <td style="padding: var(--space-3) var(--space-2);">Laki-laki / Perempuan</td>
                </tr>
                <tr style="border-bottom: 1px solid var(--color-border);">
                  <td style="padding: var(--space-3) var(--space-2);">8</td>
                  <td style="font-weight: 500; color: var(--color-text-primary);">Umur</td>
                  <td style="padding: var(--space-3) var(--space-2);">Usia pasien pada saat data dimasukkan ke sistem.</td>
                  <td style="padding: var(--space-3) var(--space-2);">Angka (Tahun)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 4. Disclaimer Medis -->
        <div style="background-color: rgba(245, 158, 11, 0.08); border: 1px solid var(--color-warning); padding: var(--space-6); border-radius: var(--radius-lg);">
          <h3 style="display: flex; align-items: center; gap: var(--space-2); margin-bottom: var(--space-3); font-size: var(--font-size-lg); color: var(--color-warning);">
            <span><i class="bi bi-exclamation-triangle-fill"></i></span> Pernyataan Penyangkalan (Disclaimer) Medis
          </h3>
          <p style="line-height: 1.7; font-size: var(--font-size-sm); color: var(--color-text-primary);">
            <strong>PENTING:</strong> SIPREDIA murni beroperasi sebagai alat bantu pendukung keputusan (<em>decision support tool</em>) bagi tenaga medis. Hasil prediksi probabilitas risiko diabetes yang dikeluarkan oleh sistem ini <strong>TIDAK BOLEH</strong> dijadikan sebagai diagnosis medis mutlak. Keputusan klinis, penanganan pasien, dan diagnosis akhir tetap harus melalui prosedur pemeriksaan klinis langsung dan tes laboratorium standar oleh dokter yang berwenang.
          </p>
        </div>

      </section>
    `;
  }

  bindEvents() {
    const btnToggle = this.querySelector('#btn-toggle-scale');
    const scaleDetails = this.querySelector('#scale-details');
    const iconToggle = this.querySelector('#icon-toggle-scale');

    if (btnToggle && scaleDetails && iconToggle) {
      btnToggle.addEventListener('click', () => {
        const isHidden = scaleDetails.style.display === 'none';
        scaleDetails.style.display = isHidden ? 'block' : 'none';
        iconToggle.className = isHidden ? 'bi bi-chevron-up' : 'bi bi-chevron-down';
      });
    }
  }
}

// Daftarkan Custom Element
customElements.define('about-view', AboutView);
