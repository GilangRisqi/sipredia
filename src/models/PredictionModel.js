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
   * Simulate a prediction result (development / offline mode).
   * Returns after a 2-second artificial delay.
   * @param {object} params
   * @returns {Promise<object>}
   */
  async simulatePredict(params) {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const riskScore = this.#calculateDummyRisk(params);
    return {
      riskLevel:      riskScore > 0.65 ? 'Tinggi' : riskScore > 0.35 ? 'Sedang' : 'Rendah',
      probability:    parseFloat((riskScore * 100).toFixed(1)),
      recommendation: riskScore > 0.65
        ? 'Segera konsultasikan kondisi Anda dengan dokter spesialis.'
        : riskScore > 0.35
        ? 'Pantau pola makan dan aktifitas fisik secara rutin.'
        : 'Pertahankan gaya hidup sehat Anda.',
    };
  }

  // ── Private ──────────────────────────────────────────────────────────────

  #calculateDummyRisk({ age, bmi, glucoseLevel, bloodPressure }) {
    let score = 0;
    if (age > 45) score += 0.2;
    if (bmi > 30) score += 0.25;
    if (glucoseLevel > 140) score += 0.35;
    if (bloodPressure > 90) score += 0.2;
    return Math.min(score + Math.random() * 0.1, 1);
  }
}
