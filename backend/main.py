from fastapi import FastAPI, File, UploadFile, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import get_db, Scan
from model import predict
from schemas import PredictionResponse, ScanHistory
from typing import List
from weather import get_weather_and_risk
from irrigation import calculate_irrigation
import uvicorn
import os

app = FastAPI(title="AgriOS API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/health")
def health():
    return {"status": "ok", "version": "1.0.0"}

@app.post("/predict")
async def predict_disease(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(400, "File must be an image")
    
    image_bytes = await file.read()
    if len(image_bytes) > 10 * 1024 * 1024:
        raise HTTPException(400, "Image too large (max 10MB)")
    
    try:
        result = predict(image_bytes)
        
        scan = Scan(
            crop=result["crop"],
            condition=result["condition"],
            confidence=result["confidence"],
            treatment=result["treatment"],
            is_healthy=str(result["is_healthy"])
        )
        db.add(scan)
        db.commit()
        db.refresh(scan)
        
        return {**result, "scan_id": scan.id}
    except Exception as e:
        print(f"Prediction error: {e}")
        raise HTTPException(500, f"Prediction failed: {str(e)}")

@app.get("/history")
def get_history(db: Session = Depends(get_db), limit: int = 20):
    scans = db.query(Scan).order_by(Scan.created_at.desc()).limit(limit).all()
    return scans

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

@app.get("/weather")
async def get_weather(lat: float, lon: float):
    try:
        api_key = os.getenv("OPENWEATHER_API_KEY")
        if not api_key:
            raise HTTPException(500, "Weather API key not configured")
        data = await get_weather_and_risk(lat, lon, api_key)
        return data
    except Exception as e:
        raise HTTPException(500, f"Weather fetch failed: {str(e)}")
@app.post("/irrigation")
async def get_irrigation(data: dict):
    try:
        result = calculate_irrigation(
            crop=data.get("crop", "tomato"),
            soil=data.get("soil", "loam"),
            field_size=float(data.get("field_size", 100)),
            temp=float(data.get("temp", 25)),
            humidity=float(data.get("humidity", 60)),
            rain_forecast=float(data.get("rain_forecast", 0))
        )
        return result
    except Exception as e:
        raise HTTPException(500, f"Irrigation calculation failed: {str(e)}")
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)