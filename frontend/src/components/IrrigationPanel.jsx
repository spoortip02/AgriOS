import { useState } from "react"

const CROPS = ["tomato", "potato", "corn", "wheat", "rice", "soybean", "pepper", "grape", "apple", "strawberry"]
const SOILS = ["sandy", "loam", "clay", "silt"]

const URGENCY_COLORS = {
  low: { bg: "#EAF3DE", border: "#97C459", text: "#3B6D11" },
  medium: { bg: "#FAEEDA", border: "#EF9F27", text: "#854F0B" },
  high: { bg: "#FCEBEB", border: "#F09595", text: "#A32D2D" }
}

export default function IrrigationPanel({ apiUrl, weatherData }) {
  const [crop, setCrop] = useState("tomato")
  const [soil, setSoil] = useState("loam")
  const [fieldSize, setFieldSize] = useState(100)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Use weather data if available
  const temp = weatherData?.forecast?.[0]?.temp_max || 25
  const humidity = weatherData?.forecast?.[0]?.humidity || 60
  const rain = weatherData?.forecast?.[0]?.rain || 0

  async function handleCalculate() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${apiUrl}/irrigation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          crop,
          soil,
          field_size: fieldSize,
          temp,
          humidity,
          rain_forecast: rain
        })
      })
      if (!res.ok) throw new Error("Calculation failed")
      const data = await res.json()
      setResult(data)
    } catch (e) {
      setError("Could not calculate irrigation. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ marginTop: 32 }}>
      <h2 style={{ fontSize: 18, fontWeight: 600, color: "#1a1a1a", marginBottom: 4 }}>
        💧 Predictive Irrigation
      </h2>
      <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 20 }}>
        Get AI-powered water recommendations based on your crop, soil, and today's weather.
      </p>

      {/* Input form */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
        <div>
          <label style={{ fontSize: 12, fontWeight: 500, color: "#374151", display: "block", marginBottom: 6 }}>Crop Type</label>
          <select
            value={crop}
            onChange={e => setCrop(e.target.value)}
            style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 13, background: "#fff" }}
          >
            {CROPS.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
          </select>
        </div>

        <div>
          <label style={{ fontSize: 12, fontWeight: 500, color: "#374151", display: "block", marginBottom: 6 }}>Soil Type</label>
          <select
            value={soil}
            onChange={e => setSoil(e.target.value)}
            style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 13, background: "#fff" }}
          >
            {SOILS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
        </div>

        <div>
          <label style={{ fontSize: 12, fontWeight: 500, color: "#374151", display: "block", marginBottom: 6 }}>Field Size (m²)</label>
          <input
            type="number"
            value={fieldSize}
            onChange={e => setFieldSize(e.target.value)}
            style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 13, background: "#fff" }}
          />
        </div>
      </div>

      {/* Weather being used */}
      <div style={{ padding: "10px 14px", background: "#E6F1FB", border: "1px solid #B8D4F0", borderRadius: 8, marginBottom: 16, fontSize: 12, color: "#185FA5" }}>
        📡 Using today's weather: {temp}°C · {humidity}% humidity · {rain}mm rain forecast
      </div>

      <button
        onClick={handleCalculate}
        disabled={loading}
        style={{
          width: "100%", padding: "12px", borderRadius: 8,
          background: loading ? "#9ca3af" : "#3B6D11",
          color: "#fff", border: "none", fontSize: 14,
          fontWeight: 500, cursor: loading ? "not-allowed" : "pointer",
          marginBottom: 16
        }}
      >
        {loading ? "Calculating..." : "Calculate Irrigation Need"}
      </button>

      {error && (
        <div style={{ padding: 16, background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, color: "#991b1b", marginBottom: 16 }}>
          {error}
        </div>
      )}

      {result && (
        <div style={{ border: `1px solid ${URGENCY_COLORS[result.urgency].border}`, borderRadius: 12, overflow: "hidden" }}>
          {/* Header */}
          <div style={{ background: URGENCY_COLORS[result.urgency].bg, padding: "16px 20px", borderBottom: `1px solid ${URGENCY_COLORS[result.urgency].border}` }}>
            <p style={{ fontSize: 13, fontWeight: 500, color: URGENCY_COLORS[result.urgency].text, marginBottom: 4 }}>
              {result.crop.toUpperCase()} · {result.soil} soil · {result.field_size}m²
            </p>
            <p style={{ fontSize: 20, fontWeight: 600, color: "#1a1a1a" }}>{result.recommendation}</p>
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0 }}>
            <div style={{ padding: "16px 20px", borderRight: "1px solid #f3f4f6", textAlign: "center" }}>
              <p style={{ fontSize: 24, fontWeight: 700, color: "#185FA5" }}>{result.total_liters}L</p>
              <p style={{ fontSize: 12, color: "#6b7280" }}>Total water needed</p>
            </div>
            <div style={{ padding: "16px 20px", borderRight: "1px solid #f3f4f6", textAlign: "center" }}>
              <p style={{ fontSize: 24, fontWeight: 700, color: "#3B6D11" }}>{result.water_needed_per_sqm}L</p>
              <p style={{ fontSize: 12, color: "#6b7280" }}>Per m²</p>
            </div>
            <div style={{ padding: "16px 20px", textAlign: "center" }}>
              <p style={{ fontSize: 24, fontWeight: 700, color: "#854F0B" }}>{result.savings_percentage}%</p>
              <p style={{ fontSize: 12, color: "#6b7280" }}>Water saved vs average</p>
            </div>
          </div>

          {/* Rain offset */}
          {result.rain_offset > 0 && (
            <div style={{ padding: "12px 20px", background: "#E6F1FB", borderTop: "1px solid #f3f4f6" }}>
              <p style={{ fontSize: 12, color: "#185FA5" }}>
                🌧️ {result.rain_offset}mm of expected rainfall already accounted for in this calculation
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}