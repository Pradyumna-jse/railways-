# 🚆 TurnWise (RailMarga) Production Deployments

Both the **Frontend (PWA)** and **Backend (API)** are deployed live in production:

| Service | Technology | Production Live URL | Health / Test Endpoint |
| :--- | :--- | :--- | :--- |
| **Backend API** | Express TypeScript Serverless | [https://server-pi-six-57.vercel.app](https://server-pi-six-57.vercel.app) | [`/health`](https://server-pi-six-57.vercel.app/health) · [`/api/station`](https://server-pi-six-57.vercel.app/api/station) |
| **Frontend PWA** | Expo / React Native Web | [https://mobile-sigma-eight.vercel.app](https://mobile-sigma-eight.vercel.app) | [`/`](https://mobile-sigma-eight.vercel.app) |
| **GitHub Repo** | Git Monorepo | [https://github.com/Pradyumna-jse/railways-](https://github.com/Pradyumna-jse/railways-) | Branch `main` |

---

## 🛠️ Backend API Endpoints

The backend is fully live and serves all railway navigation and intelligence endpoints:

- `GET /` — Service overview and API catalog
- `GET /health` — Service health check
- `GET /api/station` — Krantivira Sangolli Rayanna (Bengaluru Railway Station) metadata, viewBox, and levels
- `GET /api/platforms` — All 10 platforms with real-world spatial coordinates
- `GET /api/facilities` — Station amenities (waiting rooms, ticket counters, restrooms, lifts, escalators)
- `GET /api/nodes` — Graph nodes for indoor routing
- `GET /api/status` — Live facility availability engine (Lifts, Escalators, Ramps)
- `GET /api/incidents` — Passenger and staff crowd & maintenance incident reports
- `GET /api/trains` — All-India train search and coach compositions
- `POST /api/route` — Mathematical graph routing with obstacle avoidance & profile weights:
  ```json
  {
    "startNodeId": "node_entry_t1_main_east",
    "destinationNodeId": "node_pf8_center",
    "profileId": "wheelchair"
  }
  ```
- `POST /api/route/coach` — Direct platform walking route to specific coach (e.g. Coach B4)
- `POST /api/assistant` — Multilingual Grounded Gemini Assistant (English, Kannada, Hindi)

---

## 🌐 Deploy to Render (Alternative Web Service)

If you prefer to run a continuous long-polling Docker/Node.js instance on Render, the repository is already pre-configured with [`render.yaml`](./render.yaml):

1. Go to [dashboard.render.com](https://dashboard.render.com/) and click **New +** → **Blueprint**.
2. Select repository `Pradyumna-jse/railways-`.
3. Render automatically reads `render.yaml`:
   - **Root Directory**: `server`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Health Check Path**: `/health`
4. Set `GEMINI_API_KEY` in environment variables.
5. Click **Apply**.
