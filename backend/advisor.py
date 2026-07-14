import os
import httpx

GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

async def get_farm_advice(question: str, context: dict) -> str:
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise Exception("GROQ_API_KEY not configured")

    # Build context from farm data
    scans = context.get("scans", [])
    weather = context.get("weather", {})
    irrigation = context.get("irrigation", {})

    scan_summary = ""
    if scans:
        scan_summary = "\n".join([
            f"- {s['crop']} had {s['condition']} ({s['confidence']}% confidence) on {s['created_at']}"
            for s in scans[:10]
        ])
    else:
        scan_summary = "No disease scans recorded yet."

    weather_summary = ""
    if weather.get("forecast"):
        today = weather["forecast"][0]
        weather_summary = f"Today: {today['temp_max']}°C, {today['humidity']}% humidity, {today['rain']}mm rain. {weather.get('summary', '')}"
    else:
        weather_summary = "No weather data available."

    irrigation_summary = ""
    if irrigation:
        irrigation_summary = f"Latest irrigation recommendation: {irrigation.get('recommendation', 'N/A')} Total water needed: {irrigation.get('total_liters', 'N/A')}L"
    else:
        irrigation_summary = "No irrigation data available."

    system_prompt = f"""You are AgriOS Farm Advisor — an AI assistant that helps farmers make smart decisions.

You have access to this farmer's real data:

DISEASE SCAN HISTORY:
{scan_summary}

CURRENT WEATHER:
{weather_summary}

IRRIGATION STATUS:
{irrigation_summary}

Answer the farmer's question using their specific data. Be concise, practical, and actionable.
If you don't have enough data to answer, say so and suggest what data to collect.
Always respond in 2-4 sentences max."""

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }

    body = {
        "model": "llama-3.3-70b-versatile",
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": question}
        ],
        "max_tokens": 300,
        "temperature": 0.7
    }

    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(GROQ_API_URL, headers=headers, json=body)
        data = response.json()

    if "choices" not in data:
        raise Exception(f"Groq API error: {data}")

    return data["choices"][0]["message"]["content"]