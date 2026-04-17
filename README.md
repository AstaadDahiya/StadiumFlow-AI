# 🏟️ StadiumFlow AI

**Real-time crowd intelligence for smarter stadium experiences.**

> StadiumFlow AI is a mobile-first progressive web application that leverages Google's Gemini AI to provide fans with live crowd density maps, smart navigation tips, concession wait times, and personalized seat-level insights — all in real time.

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-stadiumflow--ai--34106.web.app-blue?style=for-the-badge)](https://stadiumflow-ai-34106.web.app)
[![Firebase](https://img.shields.io/badge/Hosted_on-Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Gemini](https://img.shields.io/badge/Powered_by-Gemini_AI-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)

---

## 🎯 Chosen Vertical

**Smart Stadium Assistant** — A context-aware, AI-powered crowd management tool for live sporting events and large venue operations.

## 🧠 Approach & Logic

StadiumFlow AI tackles a real problem: **information asymmetry in crowded venues**. When 60,000+ fans are in a stadium, nobody knows which corridors are jammed, which food lines are shortest, or which gates to avoid.

**How it works:**
1. **Data Layer** → The application maintains real-time occupancy data across 9 distinct stadium zones and 3 concession stands with live wait times.
2. **AI Analysis** → When the user opens the Smart Assistant, all current venue data is dynamically injected into a carefully engineered prompt and sent to Google's **Gemini 2.0 Flash** via the REST API. Gemini analyzes crowd patterns relative to the user's specific seat location and returns 2-3 hyper-contextual, actionable tips.
3. **Decision Engine** → The heatmap visualization uses a density-threshold algorithm (`< 0.4 = Low`, `0.4–0.7 = Medium`, `> 0.7 = High`) to color-code zones, enabling instant visual decision-making.
4. **Secure Rendering** → Every piece of dynamic content (including raw AI responses) is sanitized through DOMPurify before DOM injection, preventing XSS attacks.

**Architecture:** Fully modular ES6 — the monolithic codebase was refactored into 8 focused single-responsibility modules (`auth.js`, `mapRenderer.js`, `geminiAssistant.js`, `foodStalls.js`, `alerts.js`, `googleMaps.js`, `firebase.js`, `utils.js`).

## 📝 Assumptions

- Crowd density data is simulated via a centralized mock data store (`mockData.js`) to demonstrate the UI and AI integration without requiring a backend sensor network.
- The Gemini API key is stored client-side via Vite environment variables (`.env`), which is acceptable for hackathon prototyping but would be proxied through Firebase Functions in production.
- The stadium modeled is MetLife Stadium (East Rutherford, NJ) as a representative large venue with 9 zones and ~28,000 tracked seats.
- Firebase Authentication is configured with Google Sign-In only; email/password sign-in uses a mock flow for demo purposes.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🗺️ **Live Crowd Density Map** | Interactive SVG stadium heatmap showing real-time occupancy levels across 9 distinct zones |
| 🤖 **Gemini AI Smart Assistant** | Context-aware tips powered by Google's Gemini 2.0 Flash, analyzing live crowd & concession data |
| 🍕 **Food & Drink Finder** | Browse concession stalls with live wait times, filterable by category (Grill, Pizza, Drinks) |
| 🔔 **Smart Alerts Feed** | Filterable live notifications for crowd surges, promotions, and navigation advisories |
| 💺 **My Seat Dashboard** | Personalized seat card with nearby amenities and an embedded Google Maps view |
| 🔐 **Google Sign-In** | Secure authentication via Firebase Auth with real Google OAuth popup |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Vanilla JavaScript (ES Modules), HTML5, CSS3 |
| **Build Tool** | Vite 8 |
| **AI** | Google Gemini 2.0 Flash (REST API) |
| **Auth** | Firebase Authentication (Google Provider) |
| **Analytics** | Firebase Analytics (GA4) |
| **Maps** | Google Maps Embed API |
| **Hosting** | Firebase Hosting (Google Cloud Edge Network) |
| **Security** | DOMPurify for XSS prevention |
| **Testing** | Vitest + jsdom |

---

## 🚀 Google Services Integrated

This application demonstrates deep integration with **6 Google Cloud & AI services**:

1. **Google Gemini AI** — Real-time stadium intelligence and contextual recommendations
2. **Firebase Authentication** — Secure Google Sign-In with OAuth 2.0 popup flow
3. **Firebase Analytics (GA4)** — Event tracking for user sign-ins and page interactions
4. **Google Maps Embed API** — Interactive stadium location map with directions
5. **Firebase Hosting** — Production deployment on Google's global CDN
6. **Google Fonts** — Inter typeface served via Google's font delivery network

---

## 📁 Project Structure

```
StadiumFlow AI/
├── index.html              # App shell with auth overlay & tab panels
├── firebase.json           # Firebase Hosting configuration
├── .firebaserc             # Firebase project binding
├── vite.config.js          # Vite build configuration
├── package.json            # Dependencies & scripts
├── .env                    # API keys (not committed)
└── src/
    ├── main.js             # App entry point & tab routing
    ├── auth.js             # Firebase Auth (Google Sign-In)
    ├── firebase.js         # Firebase config, Auth & Analytics init
    ├── geminiAssistant.js  # Gemini AI prompt engine & REST client
    ├── googleMaps.js       # Google Maps Embed integration
    ├── mapRenderer.js      # SVG stadium heatmap renderer
    ├── foodStalls.js       # Concession stall cards & filtering
    ├── alerts.js           # Live alerts feed & seat dashboard
    ├── mockData.js         # Centralized data store
    ├── utils.js            # Shared utility functions
    ├── utils.test.js       # Unit tests (Vitest)
    └── style.css           # Complete design system
```

---

## ⚡ Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/AstaadDahiya/StadiumFlow-AI.git
cd StadiumFlow-AI

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Add your API keys to .env
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_GOOGLE_MAPS_KEY=your_google_maps_api_key_here
```

- **Gemini API Key**: Get one free at [Google AI Studio](https://aistudio.google.com/apikey)
- **Maps API Key**: Get one at [Google Cloud Console](https://console.cloud.google.com/apis/credentials)

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Testing

```bash
npm run test
```

### Production Build & Deploy

```bash
npm run build
firebase deploy --only hosting
```

---

## 🔒 Security

- **XSS Prevention**: All dynamic HTML injections are sanitized through DOMPurify
- **Environment Isolation**: API keys stored in `.env`, excluded from version control via `.gitignore`
- **Secure Auth**: Authentication handled entirely by Firebase Auth SDK (no custom credential storage)

---

## ♿ Accessibility

- Semantic ARIA roles (`tablist`, `tabpanel`, `dialog`) throughout the interface
- `aria-live="polite"` regions for dynamic content updates (alerts, AI responses)
- High-contrast dark mode palette meeting WCAG guidelines
- Keyboard-navigable tab interface

---

## 📄 License

This project is built for the Google Cloud Hackathon. All rights reserved.

---

<p align="center">
  <b>Built with ❤️ using Google Cloud & Gemini AI</b>
</p>
