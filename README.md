# 🌿 AgriOS — AI-Powered Farm Management Platform

> Helping farmers detect crop diseases instantly and understand weather-based disease risks using AI.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20App-green)](https://agri-os-sable.vercel.app)
[![API Docs](https://img.shields.io/badge/API%20Docs-Swagger-blue)](https://agrios-cfqg.onrender.com/docs)

---

## What it does

**V1 — Crop Disease Detection**
Upload a photo of a leaf → AI identifies the disease → get treatment advice instantly.
- 38 disease classes across 14 plant species
- 99.8% accuracy on PlantVillage dataset (54,305 images)
- MobileNetV2 fine-tuned on T4 GPU in Google Colab

**V2 — Weather Risk Analysis**
Enter your city → get a 7-day disease risk forecast based on real weather data.
- Fungal, bacterial, and pest risk scoring
- Actionable prevention advice before disease strikes

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React, Vite → Vercel |
| Backend | FastAPI, Python → Render |
| ML Model | PyTorch, MobileNetV2 |
| Database | PostgreSQL → Supabase |
| Weather | OpenWeatherMap API |

---

## Run Locally

```bash
# Backend
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# Frontend
cd frontend
npm install
npm run dev
```

**Environment variables needed:**
DATABASE_URL=your_supabase_url
OPENWEATHER_API_KEY=your_key
VITE_API_URL=http://localhost:8000
---

## Built by Spoorti Patil
[LinkedIn](https://linkedin.com/in/yourprofile) · [GitHub](https://github.com/spoortip02)