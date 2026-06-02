/**
 * PredictionModel
 * Layer   : Model
 * Purpose : Sends patient screening data to the ML API and returns predictions.
 *           No DOM access.
 */

const API_BASE = (typeof process !== 'undefined' && process.env && process.env.API_BASE_URL) || 'http://localhost:8000';

export class PredictionModel {
  /**
   * Submit screening parameters to the backend prediction endpoint.
   * @param {object} params - Patient screening parameters
   * @param {number} params.age
   * @param {number} params.bmi
   * @param {number} params.glucoseLevel
   * @param {number} params.bloodPressure
   * @param {number} params.insulinLevel
   * @param {number} params.skinThickness
   * @param {string} token  - Bearer auth token
   * @returns {Promise<{riskLevel: string, probability: number, recommendation: string}>}
   */
  async predict(params, token) {
    const response = await fetch(`${API_BASE}/api/predict/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.detail || `Prediction failed (${response.status})`);
    }

    return response.json();
  }

  /**
   * Calculate prediction risk locally (development / offline mode).
   * @param {object} patientData
   * @returns {Promise<string>}
   */
  async calculateRisk(patientData) {
    // Simulasi loading 2 detik
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Convert age to category internally (Model responsibility)
    const ageCategory = this.#convertAgeCategory(patientData.patientAge);
    
    // Algoritma statis/acak berdasarkan permintaan pengguna:
    const isHighRisk = Math.random() > 0.5;
    
    if (isHighRisk) {
      return "Berisiko diabetes";
    } else {
      return "Tidak berisiko diabetes";
    }
  }

  // ── Private ──────────────────────────────────────────────────────────────

  /**
   * Mengonversi Umur Asli menjadi Kategori Umur
   * 1 = 18–24, 2 = 25–29, 3 = 30–34, 4 = 35–39, 5 = 40–44, 6 = 45–49, 
   * 7 = 50–54, 8 = 55–59, 9 = 60–64, 10 = 65–69, 11 = 70–74, 12 = 75–79, 13 = 80+.
   */
  #convertAgeCategory(patientAge) {
    if (patientAge >= 80) return 13;
    if (patientAge >= 75) return 12;
    if (patientAge >= 70) return 11;
    if (patientAge >= 65) return 10;
    if (patientAge >= 60) return 9;
    if (patientAge >= 55) return 8;
    if (patientAge >= 50) return 7;
    if (patientAge >= 45) return 6;
    if (patientAge >= 40) return 5;
    if (patientAge >= 35) return 4;
    if (patientAge >= 30) return 3;
    if (patientAge >= 25) return 2;
    return 1; // 18-24
  }
}
