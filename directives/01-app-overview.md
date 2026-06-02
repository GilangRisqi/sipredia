# Directive 01 – SIPREDIA Application Overview

> **Layer**: Directive (Layer 1)
> **Status**: Active
> **Last Updated**: 2026-06-02

---

## 1. Application Identity

| Field        | Value                                    |
|--------------|------------------------------------------|
| App Name     | SIPREDIA                                 |
| Full Name    | Sistem Prediksi Diabetes                 |
| Architecture | SPA – Model-View-Presenter (MVP)         |
| PWA          | Yes – Service Worker + manifest.json     |
| Bundler      | Webpack 5                                |
| Language     | Vanilla JavaScript (ES2022+)             |
| Auth         | JWT / Token via localStorage             |

---

## 2. Feature Map

| Route         | Feature                   | Status        |
|---------------|---------------------------|---------------|
| `/login`      | Authentication Form       | ✅ Scaffolded  |
| `/dashboard`  | Home Dashboard            | ✅ Scaffolded  |
| `/screening`  | 6-Parameter Screening Form| ✅ Scaffolded  |
| `/history`    | Screening History Table   | 🔲 Placeholder |
| `/profile`    | User Profile              | 🔲 Not started |

---

## 3. Screening Parameters

The ML model expects exactly 6 numeric parameters:

| #  | Parameter       | Unit    | Valid Range |
|----|-----------------|---------|-------------|
| 1  | `age`           | years   | 1 – 120     |
| 2  | `bmi`           | kg/m²   | 10 – 80     |
| 3  | `glucoseLevel`  | mg/dL   | 0 – 500     |
| 4  | `bloodPressure` | mmHg    | 0 – 200     |
| 5  | `insulinLevel`  | μU/mL   | 0 – 900     |
| 6  | `skinThickness` | mm      | 0 – 100     |

---

## 4. API Endpoints

All requests use `Authorization: Bearer <token>` header.

| Method | Endpoint              | Purpose                    |
|--------|-----------------------|----------------------------|
| POST   | `/api/auth/login/`    | Exchange credentials → token |
| POST   | `/api/predict/`       | Submit params → prediction result |
| GET    | `/api/history/`       | Fetch user screening history |
| GET    | `/api/profile/`       | Fetch user profile         |

**Base URL**: Set via `process.env.API_BASE_URL` (default: `http://localhost:8000`)

---

## 5. Prediction Response Schema

```json
{
  "riskLevel":      "Rendah | Sedang | Tinggi",
  "probability":    75.4,
  "recommendation": "Segera konsultasikan kondisi Anda dengan dokter spesialis."
}
```

---

## 6. MVP Module Map

```
src/
├── models/
│   ├── RouterModel.js      ← SPA routing state, History API
│   ├── AuthModel.js        ← Login API, token persistence
│   └── PredictionModel.js  ← ML prediction API + offline simulation
├── views/
│   ├── AppShellView.js     ← Header, nav, main outlet, toasts
│   ├── LoginView.js        ← Login form rendering + events
│   ├── DashboardView.js    ← Welcome, stats, quick actions
│   └── ScreeningView.js    ← 6-param form, result panel
└── presenters/
    └── AppPresenter.js     ← Master orchestrator: routing + auth gate
```

---

## 7. PWA Strategy

| Asset Type          | Cache Strategy              |
|---------------------|-----------------------------|
| Static shell (HTML, CSS, JS) | Cache-First      |
| API requests (`/api/*`)      | Network-First    |
| Images / fonts               | Cache-First      |

Cache name versioning: `sipredia-cache-v1` — increment on breaking changes.

---

## 8. Development Commands

```bash
npm run dev    # Start webpack-dev-server on port 3000 with HMR
npm run build  # Production bundle into /dist
```

---

## 9. Known Constraints & Decisions

- **Offline Simulation**: `PredictionModel.simulatePredict()` is used until the real backend is live. Swap to `PredictionModel.predict()` in `AppPresenter.#showScreeningPage()`.
- **History Page**: Placeholder only — needs `HistoryModel` + `HistoryView` + Presenter wiring.
- **No framework**: Vanilla JS + Webpack. No React, Vue, or Angular.
- **Auth token**: Stored in `localStorage` under keys `sipredia_token` and `sipredia_user`.

---

## 10. Next Steps

1. Connect real Django REST backend (`API_BASE_URL`)
2. Implement `HistoryModel` + `HistoryView`
3. Add PWA push notification support
4. Add IndexedDB for offline history caching
5. Add profile page (`/profile`)
