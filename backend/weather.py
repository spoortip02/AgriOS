import httpx
from datetime import datetime

DISEASE_RISK_RULES = {
    "Fungal": {
        "condition": lambda h, t: h > 80 and 15 < t < 30,
        "diseases": ["Late blight", "Powdery mildew", "Leaf mold"],
        "advice": "Apply preventive fungicide. Avoid overhead irrigation."
    },
    "Bacterial": {
        "condition": lambda h, t: h > 70 and t > 25,
        "diseases": ["Bacterial spot", "Bacterial blight"],
        "advice": "Apply copper bactericide. Improve air circulation."
    },
    "Pest": {
        "condition": lambda h, t: h < 40 and t > 28,
        "diseases": ["Spider mites", "Aphids"],
        "advice": "Monitor plants closely. Apply neem oil if needed."
    }
}

async def get_weather_and_risk(lat: float, lon: float):
    url = (
        f"https://api.open-meteo.com/v1/forecast"
        f"?latitude={lat}&longitude={lon}"
        f"&daily=temperature_2m_max,temperature_2m_min,precipitation_sum"
        f"&hourly=relative_humidity_2m"
        f"&forecast_days=7"
        f"&timezone=auto"
    )
    
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        data = response.json()
    
    daily = data["daily"]
    hourly = data["hourly"]
    
    forecast = []
    for i in range(7):
        temp_max = daily["temperature_2m_max"][i]
        temp_min = daily["temperature_2m_min"][i]
        rain = daily["precipitation_sum"][i]
        date = daily["time"][i]
        temp_avg = (temp_max + temp_min) / 2
        
        # Get average humidity for this day (24 hours per day)
        day_humidity = hourly["relative_humidity_2m"][i*24:(i+1)*24]
        humidity = sum(day_humidity) / len(day_humidity) if day_humidity else 70
        
        risks = []
        for risk_type, rule in DISEASE_RISK_RULES.items():
            if rule["condition"](humidity, temp_avg):
                risks.append({
                    "type": risk_type,
                    "diseases": rule["diseases"],
                    "advice": rule["advice"]
                })
        
        risk_level = "high" if len(risks) >= 2 else "medium" if len(risks) == 1 else "low"
        
        forecast.append({
            "date": date,
            "temp_max": temp_max,
            "temp_min": temp_min,
            "humidity": round(humidity),
            "rain": rain,
            "risk_level": risk_level,
            "risks": risks
        })
    
    return {
        "location": {"lat": lat, "lon": lon},
        "forecast": forecast,
        "summary": f"{sum(1 for d in forecast if d['risk_level'] == 'high')} high risk days in the next 7 days"
    }