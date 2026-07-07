import { useState, useEffect } from "react"

const RISK_COLORS = {
  high: { bg: "#FCEBEB", border: "#F09595", text: "#A32D2D", label: "High Risk" },
  medium: { bg: "#FAEEDA", border: "#EF9F27", text: "#854F0B", label: "Medium Risk" },
  low: { bg: "#EAF3DE", border: "#97C459", text: "#3B6D11", label: "Low Risk" }
}

const ICONS = { high: "⚠️", medium: "🌤️", low: "✅" }

function formatDate(dateStr) {
  const date = new Date(dateStr)
  return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
}

async function cityToCoords(city) {
  const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`)
  const data = await res.json()
  if (!data.results || data.results.length === 0) throw new Error("City not found")
  return { lat: data.results[0].latitude, lon: data.results[0].longitude, name: data.results[0].name, country: data.results[0].country }
}

export default function WeatherPanel({ apiUrl }) {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [cityInput, setCityInput] = useState("")
  const [locationName, setLocationName] = useState("")

  async function handleCitySearch() {
  if (!cityInput.trim()) return
  setLoading(true)
  setError(null)
  try {
    const coords = await cityToCoords(cityInput)
    setLocationName(`${coords.name}, ${coords.country}`)
    await fetchWeather(coords.lat, coords.lon)
  } catch (e) {
    setError(`Error: ${e.message}`)
    setLoading(false)
  }
}

  async function fetchWeather(lat, lon) {
  setLoading(true)
  setError(null)
  try {
    const url = `${apiUrl}/weather?lat=${lat}&lon=${lon}`
    console.log("Fetching:", url)
    const res = await fetch(url)
    console.log("Status:", res.status)
    if (!res.ok) throw new Error(`Server returned ${res.status}`)
    const data = await res.json()
    setWeather(data)
  } catch (e) {
    setError(`Could not load weather: ${e.message}`)
  } finally {
    setLoading(false)
  }
}

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          setLocationName("Your location")
          fetchWeather(pos.coords.latitude, pos.coords.longitude)
        },
        () => {} // silently fail, let user type city
      )
    }
  }, [])

  const highRiskDays = weather?.forecast.filter(d => d.risk_level === "high").length || 0

  return (
    <div style={{ marginTop: 32 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: "#1a1a1a", marginBottom: 2 }}>
            🌾 Disease Risk Forecast
          </h2>
          {locationName && <p style={{ fontSize: 12, color: "#6b7280" }}>📍 {locationName}</p>}
        </div>
      </div>

      {/* City search */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Enter your city (e.g. Mumbai, London, Nairobi)"
          value={cityInput}
          onChange={e => setCityInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleCitySearch()}
          style={{
            flex: 1, padding: "10px 14px", borderRadius: 8,
            border: "1px solid #e5e7eb", fontSize: 13,
            outline: "none", background: "#fff"
          }}
        />
        <button
          onClick={handleCitySearch}
          style={{
            padding: "10px 18px", borderRadius: 8,
            background: "#3B6D11", color: "#fff",
            border: "none", fontSize: 13, fontWeight: 500,
            cursor: "pointer"
          }}
        >
          Search
        </button>
      </div>

      {loading && (
        <div style={{ textAlign: "center", padding: "2rem", color: "#6b7280" }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🌤️</div>
          <p>Loading weather risk analysis...</p>
        </div>
      )}

      {error && (
        <div style={{ padding: 16, background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, color: "#991b1b", marginBottom: 16 }}>
          {error}
        </div>
      )}

      {!loading && !weather && !error && (
        <div style={{ textAlign: "center", padding: "2rem", color: "#9ca3af", border: "1px dashed #e5e7eb", borderRadius: 12 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🌍</div>
          <p style={{ fontSize: 14 }}>Enter your city to see disease risk forecast</p>
        </div>
      )}

      {weather && !loading && (
        <>
          {highRiskDays > 0 && (
            <div style={{ padding: "12px 16px", background: "#FCEBEB", border: "1px solid #F09595", borderRadius: 8, marginBottom: 16, display: "flex", gap: 10, alignItems: "center" }}>
              <span style={{ fontSize: 20 }}>⚠️</span>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#A32D2D" }}>High disease risk detected</p>
                <p style={{ fontSize: 12, color: "#A32D2D" }}>{highRiskDays} high-risk day{highRiskDays > 1 ? "s" : ""} in the next 7 days. Take preventive action now.</p>
              </div>
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8, marginBottom: 20 }}>
            {weather.forecast.map((day, i) => {
              const color = RISK_COLORS[day.risk_level]
              return (
                <div key={i} style={{ background: color.bg, border: `1px solid ${color.border}`, borderRadius: 8, padding: "10px 6px", textAlign: "center" }}>
                  <p style={{ fontSize: 10, color: "#6b7280", marginBottom: 4 }}>{formatDate(day.date)}</p>
                  <p style={{ fontSize: 18, marginBottom: 4 }}>{ICONS[day.risk_level]}</p>
                  <p style={{ fontSize: 11, fontWeight: 600, color: color.text, marginBottom: 6 }}>{color.label}</p>
                  <p style={{ fontSize: 11, color: "#374151" }}>{Math.round(day.temp_max)}°/{Math.round(day.temp_min)}°</p>
                  <p style={{ fontSize: 10, color: "#6b7280" }}>💧{day.humidity}%</p>
                  {day.rain > 0 && <p style={{ fontSize: 10, color: "#3B82F6" }}>🌧️{day.rain}mm</p>}
                </div>
              )
            })}
          </div>

          {weather.forecast.some(d => d.risks.length > 0) && (
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 10 }}>Active risk alerts:</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {weather.forecast
                  .filter(d => d.risks.length > 0)
                  .slice(0, 3)
                  .map((day, i) =>
                    day.risks.map((risk, j) => (
                      <div key={`${i}-${j}`} style={{ padding: "10px 14px", background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, borderLeft: `3px solid ${RISK_COLORS[day.risk_level].border}` }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                          <p style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>{risk.type} Disease Risk</p>
                          <p style={{ fontSize: 11, color: "#6b7280" }}>{formatDate(day.date)}</p>
                        </div>
                        <p style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>Diseases: {risk.diseases.join(", ")}</p>
                        <p style={{ fontSize: 12, color: "#374151" }}>💡 {risk.advice}</p>
                      </div>
                    ))
                  )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}