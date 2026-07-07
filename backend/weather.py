import httpx

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
        f"?latitude={lat}"
        f"&longitude={lon}"
        f"&daily=temperature_2m_max,temperature_2m_min,precipitation_sum"
        f"&hourly=relative_humidity_2m"
        f"&forecast_days=7"
        f"&timezone=auto"
    )
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.get(url)
        data = response.json()
    
    if "daily" not in data:
        raise Exception(f"API error: {data}")
    
    daily = data["daily"]
    hourly_humidity = data["hourly"]["relative_humidity_2m"]
    
    forecast = []
    for i in range(7):
        temp_max = daily["temperature_2m_max"][i]
        temp_min = daily["temperature_2m_min"][i]
        rain = daily["precipitation_sum"][i] or 0
        date = daily["time"][i]
        temp_avg = (temp_max + temp_min) / 2

        # Average humidity for this day
        day_humidity = hourly_humidity[i*24:(i+1)*24]
        humidity = round(sum(day_humidity) / len(day_humidity)) if day_humidity else 70

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
            "temp_max": round(temp_max, 1),
            "temp_min": round(temp_min, 1),
            "humidity": humidity,
            "rain": round(rain, 1),
            "risk_level": risk_level,
            "risks": risks
        })

    return {
        "location": {"lat": lat, "lon": lon},
        "forecast": forecast,
        "summary": f"{sum(1 for d in forecast if d['risk_level'] == 'high')} high risk days in the next 7 days"
    }