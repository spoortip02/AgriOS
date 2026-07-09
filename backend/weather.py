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

async def get_weather_and_risk(lat: float, lon: float, api_key: str):
    url = (
        f"https://api.openweathermap.org/data/2.5/forecast"
        f"?lat={lat}&lon={lon}"
        f"&appid={api_key}"
        f"&units=metric"
        f"&cnt=40"
    )

    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.get(url)
        data = response.json()

    if "list" not in data:
        raise Exception(f"API error: {data}")

    # Group forecasts by day
    from collections import defaultdict
    days = defaultdict(list)
    for item in data["list"]:
        date = item["dt_txt"].split(" ")[0]
        days[date].append(item)

    forecast = []
    for date, items in list(days.items())[:7]:
        temps = [i["main"]["temp"] for i in items]
        humidities = [i["main"]["humidity"] for i in items]
        rains = [i.get("rain", {}).get("3h", 0) for i in items]

        temp_max = round(max(temps), 1)
        temp_min = round(min(temps), 1)
        temp_avg = sum(temps) / len(temps)
        humidity = round(sum(humidities) / len(humidities))
        rain = round(sum(rains), 1)

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
            "humidity": humidity,
            "rain": rain,
            "risk_level": risk_level,
            "risks": risks
        })

    return {
        "location": {"lat": lat, "lon": lon},
        "forecast": forecast,
        "summary": f"{sum(1 for d in forecast if d['risk_level'] == 'high')} high risk days in the next 7 days"
    }