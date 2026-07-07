import { useState, useEffect } from "react"

const RISK_COLORS = {
  high: { bg: "#FCEBEB", border: "#F09595", text: "#A32D2D", label: "High Risk" },
  medium: { bg: "#FAEEDA", border: "#EF9F27", text: "#854F0B", label: "Medium Risk" },
  low: { bg: "#EAF3DE", border: "#97C459", text: "#3B6D11", label: "Low Risk" }
}

const ICONS = {
  high: "⚠️",
  medium: "🌤️",
  low: "✅"
}

function formatDate(dateStr) {
  const date = new Date(dateStr)
  return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
}

export default function WeatherPanel({ apiUrl }) {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [location, setLocation] = useState(null)

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => setLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
        () => setLocation({ lat: 40.7128, lon: -74.0060 }) // default NYC
      )
    }
  }, [])

  useEffect(() => {
    if (!location) return
    fetchWeather()
  }, [location])

  async function fetchWeather() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${apiUrl}/weather?lat=${location.lat}&lon=${location.lon}`)
      if (!res.ok) throw new Error("Failed to fetch weather")
      const data = await res.json()
      setWeather(data)
    } catch (e) {
      setError("Could not load weather data.")
    } finally {
      setLoading(false)
    }
  }

  if (loading) return (
    <div style={{ textAlign: "center", padding: "2rem", color: "#6b7280" }}>
      <div style={{ fontSize: 32, marginBottom: 8 }}>🌤️</div>
      <p>Loading weather risk analysis...</p>
    </div>
  )

  if (error) return (
    <div style={{ padding: 16, background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, color: "#991b1b" }}>
      {error}
    </div>
  )

  if (!weather) return null

  const highRiskDays = weather.forecast.filter(d => d.risk_level === "high").length

  return (
    <div style={{ marginTop: 32 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: "#1a1a1a", marginBottom: 2 }}>
            🌾 Disease Risk Forecast
          </h2>
          <p style={{ fontSize: 13, color: "#6b7280" }}>{weather.summary}</p>
        </div>
        <button
          onClick={fetchWeather}
          style={{ fontSize: 12, padding: "6px 12px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer", color: "#6b7280" }}
        >
          Refresh
        </button>
      </div>

      {/* Alert banner for high risk */}
      {highRiskDays > 0 && (
        <div style={{ padding: "12px 16px", background: "#FCEBEB", border: "1px solid #F09595", borderRadius: 8, marginBottom: 16, display: "flex", gap: 10, alignItems: "center" }}>
          <span style={{ fontSize: 20 }}>⚠️</span>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#A32D2D" }}>High disease risk detected</p>
            <p style={{ fontSize: 12, color: "#A32D2D" }}>{highRiskDays} high-risk day{highRiskDays > 1 ? "s" : ""} in the next 7 days. Take preventive action now.</p>
          </div>
        </div>
      )}

      {/* 7 day forecast */}
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

      {/* Risk details */}
      {weather.forecast.some(d => d.risks.length > 0) && (
        <div>
          <p style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 10 }}>Active risk alerts:</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {weather.forecast
              .filter(d => d.risks.length > 0)
              .slice(0, 3)
              .map((day, i) => (
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
              ))}
          </div>
        </div>
      )}
    </div>
  )
}