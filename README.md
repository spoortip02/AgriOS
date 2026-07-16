# 🌿 AgriOS — AI-Powered Farm Management Platform

> Helping farmers detect crop diseases, analyze weather risks, optimize irrigation, and get AI agronomist advice — all in one platform.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20App-green)](https://agri-os-sable.vercel.app)
[![API Docs](https://img.shields.io/badge/API%20Docs-Swagger-blue)](https://agrios-cfqg.onrender.com/docs)
[![GitHub](https://img.shields.io/badge/GitHub-spoortip02-black)](https://github.com/spoortip02/AgriOS)

> ⚠️ First request may take 30–60 seconds (free tier cold start). Open the API docs link first to wake the server.

---

## 🎯 The Problem

Farmers lose **$220 billion** worth of crops every year to disease. 500 million smallholder farmers have no access to affordable diagnostic tools, weather-based risk analysis, or precision irrigation guidance. AgriOS puts an AI agronomist in every farmer's browser.

---

## ✨ Features

### V1 — Crop Disease Detection
- Upload a leaf photo → instant AI diagnosis
- Detects **38 crop diseases** across 14 plant species
- **99.8% validation accuracy** on PlantVillage dataset (54,305 images)
- Fine-tuned MobileNetV2 on T4 GPU in Google Colab
- Treatment recommendations + scan history saved to PostgreSQL

### V2 — Weather Risk Analysis
- Enter any city → 7-day disease risk forecast
- Fungal, bacterial, and pest risk scoring based on real weather data
- Actionable prevention advice before disease strikes
- Powered by OpenWeatherMap API

### V3 — Predictive Irrigation
- Select crop type, soil type, field size → get exact water recommendation
- Weather-adjusted calculation (temperature + humidity + rain forecast)
- Shows total liters needed + water savings vs average farmer
- Supports 10 crops × 4 soil types

### V4 — AI Farm Advisor (RAG)
- Chat with an AI agronomist powered by real agricultural knowledge
- **Pinecone vector database** stores 22+ knowledge chunks on diseases, IPM protocols, soil nutrients, planting guides
- **Groq LLM (Llama 3.3)** retrieves relevant knowledge and answers using YOUR farm's scan history
- Gives exact chemical names, dosages, pre-harvest intervals — not generic advice

### V5 — Satellite Field Intelligence
- NDVI-based plant health analysis across 16 field zones
- Interactive **Leaflet.js map** showing color-coded health heatmap
- Weather-adjusted NDVI scoring (season + temperature + humidity factors)
- Identifies zones needing attention vs healthy zones

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, Vite → Vercel |
| Backend | FastAPI, Python → Render |
| ML Model | PyTorch, MobileNetV2, Google Colab T4 GPU |
| Database | PostgreSQL → Supabase |
| Vector DB | Pinecone (RAG knowledge base) |
| LLM | Groq API (Llama 3.3 70B) |
| Weather | OpenWeatherMap API |
| Maps | Leaflet.js, React-Leaflet |

---

## 🧠 ML Pipeline

- **Dataset:** PlantVillage — 54,305 images, 38 disease classes
- **Architecture:** MobileNetV2 with custom classifier head (38 outputs)
- **Training:** Transfer learning → full fine-tuning, 5 epochs on T4 GPU
- **Result:** 99.8% validation accuracy
- **Inference:** CPU-based on Render, ~200ms per prediction

---

## 🏗️ Architecture
User → React Frontend (Vercel)
↓
FastAPI Backend (Render)
↓              ↓              ↓
MobileNetV2    OpenWeatherMap   Pinecone RAG
(disease)       (weather)      (knowledge)
↓              ↓              ↓
PostgreSQL    Risk Scoring   Groq LLM
(Supabase)   + Irrigation   (advisor)
↓
JSON response → React UI

---

## 🐛 Key Engineering Challenges Solved

- **Docker + PyTorch timeout** — Switched to CPU-only PyTorch (180MB vs 4GB GPU version)
- **PostgreSQL dual version conflict** — Clean reinstall of single version with known credentials
- **CORS errors** — Configured FastAPI CORSMiddleware for cross-origin requests
- **Class label mismatch** — Hardcoded exact training class order from Colab output
- **Render startup timeout** — Background thread downloads model without blocking port binding
- **Open-Meteo IP rate limiting** — Migrated to OpenWeatherMap with API key on Render
- **Pinecone integrated embeddings** — Used llama-text-embed-v2 for semantic search without separate embedding model

---

## 🏃 Run Locally

**Backend:**
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**Environment variables needed:**
```bash
# backend/.env
DATABASE_URL=your_supabase_postgresql_url
OPENWEATHER_API_KEY=your_openweathermap_key
GROQ_API_KEY=your_groq_key
PINECONE_API_KEY=your_pinecone_key
PINECONE_INDEX_HOST=your_pinecone_index_host

# frontend/.env
VITE_API_URL=http://localhost:8000
```

---

## 🗺️ Roadmap

| Version | Feature | Status |
|---------|---------|--------|
| V1 | Crop disease detection | ✅ Live |
| V2 | Weather risk analysis | ✅ Live |
| V3 | Predictive irrigation | ✅ Live |
| V4 | AI farm advisor (RAG) | ✅ Live |
| V5 | Satellite field intelligence | ✅ Live |

---

## 👩‍💻 Built By

**Spoorti Patil** — Full Stack Developer & ML Engineer

[LinkedIn](https://linkedin.com/in/yourprofile) · [GitHub](https://github.com/spoortip02)