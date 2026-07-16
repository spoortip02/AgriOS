import os
import httpx
from pinecone import Pinecone
from dotenv import load_dotenv

load_dotenv()

def get_pinecone_index():
    api_key = os.getenv("PINECONE_API_KEY")
    index_host = os.getenv("PINECONE_INDEX_HOST")
    pc = Pinecone(api_key=api_key)
    return pc.Index(host=index_host)

async def search_knowledge_base(query: str, top_k: int = 5) -> str:
    try:
        index = get_pinecone_index()
        results = index.search(
            namespace="agrios",
            query={
                "inputs": {"text": query},
                "top_k": top_k
            }
        )
        
        chunks = []
        for match in results.get("result", {}).get("hits", []):
            text = match.get("fields", {}).get("text", "")
            if text:
                chunks.append(text)
        
        return "\n\n".join(chunks) if chunks else ""
    except Exception as e:
        print(f"Pinecone search error: {e}")
        return ""

async def get_farm_advice(question: str, context: dict) -> str:
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise Exception("GROQ_API_KEY not configured")

    # Search knowledge base for relevant information
    knowledge = await search_knowledge_base(question)

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
        irrigation_summary = f"Latest: {irrigation.get('recommendation', 'N/A')} Total: {irrigation.get('total_liters', 'N/A')}L"
    else:
        irrigation_summary = "No irrigation data available."

    system_prompt = f"""You are AgriOS Farm Advisor — an expert AI agronomist for USA farmers.

RETRIEVED KNOWLEDGE BASE (use this for precise recommendations):
{knowledge if knowledge else "No specific knowledge retrieved."}

FARMER'S REAL DATA:
Disease Scan History:
{scan_summary}

Current Weather:
{weather_summary}

Irrigation Status:
{irrigation_summary}

Instructions:
- Use the knowledge base for precise chemical names, dosages, and thresholds
- Reference the farmer's actual scan history when relevant
- Give actionable, specific advice with exact quantities when available
- For chemical recommendations always mention pre-harvest intervals
- Be concise — 3-5 sentences maximum
- If asking about a specific crop or disease, pull exact data from knowledge base"""

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
        "max_tokens": 400,
        "temperature": 0.3
    }

    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers=headers,
            json=body
        )
        data = response.json()

    if "choices" not in data:
        raise Exception(f"Groq API error: {data}")

    return data["choices"][0]["message"]["content"]