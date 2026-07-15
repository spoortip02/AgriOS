import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Circle, Popup, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"

function RecenterMap({ lat, lon }) {
  const map = useMap()
  useEffect(() => {
    map.setView([lat, lon], 15)
  }, [lat, lon])
  return null
}

export default function FieldMap({ apiUrl, weatherData }) {
  const [ndviData, setNdviData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [location, setLocation] = useState(null)

  const temp = weatherData?.forecast?.[0]?.temp_max || 25
  const humidity = weatherData?.forecast?.[0]?.humidity || 60

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => setLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
        () => setLocation({ lat: 19.0760, lon: 72.8777 })
      )
    } else {
      setLocation({ lat: 19.0760, lon: 72.8777 })
    }
  }, [])

  async function analyzeField() {
    if (!location) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(
        `${apiUrl}/ndvi?lat=${location.lat}&lon=${location.lon}&temp=${temp}&humidity=${humidity}&field_size=1000`
      )
      if (!res.ok) throw new Error("Failed")
      const data = await res.json()
      setNdviData(data)
    } catch (e) {
      setError("Could not analyze field. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ marginTop: 32 }}>
      <h2 style={{ fontSize: 18, fontWeight: 600, color: "#1a1a1a", marginBottom: 4 }}>
        🛰️ Satellite Field Intelligence
      </h2>
      <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 16 }}>
        NDVI-based plant health analysis across your field zones.
      </p>

      {/* Overall health banner */}
      {ndviData && (
        <div style={{
          padding: "12px 16px", borderRadius: 8, marginBottom: 16,
          background: ndviData.avg_ndvi >= 0.6 ? "#EAF3DE" : ndviData.avg_ndvi >= 0.4 ? "#FAEEDA" : "#FCEBEB",
          border: `1px solid ${ndviData.avg_ndvi >= 0.6 ? "#97C459" : ndviData.avg_ndvi >= 0.4 ? "#EF9F27" : "#F09595"}`
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>
                Field Health: {ndviData.overall_health}
              </p>
              <p style={{ fontSize: 12, color: "#6b7280" }}>{ndviData.recommendation}</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: 24, fontWeight: 700, color: "#3B6D11" }}>{ndviData.avg_ndvi}</p>
              <p style={{ fontSize: 11, color: "#6b7280" }}>Avg NDVI</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
            <p style={{ fontSize: 12, color: "#3B6D11" }}>✅ {ndviData.healthy_zones} healthy zones</p>
            <p style={{ fontSize: 12, color: "#854F0B" }}>⚠️ {ndviData.total_zones - ndviData.healthy_zones} need attention</p>
          </div>
        </div>
      )}

      {/* Map */}
      {location && (
        <div style={{ height: 350, borderRadius: 12, overflow: "hidden", border: "1px solid #e5e7eb", marginBottom: 16 }}>
          <MapContainer
            center={[location.lat, location.lon]}
            zoom={15}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='© OpenStreetMap'
            />
            {ndviData && <RecenterMap lat={location.lat} lon={location.lon} />}
            {ndviData?.zones.map((zone, i) => (
              <Circle
                key={i}
                center={[zone.lat, zone.lon]}
                radius={50}
                pathOptions={{
                  color: zone.color,
                  fillColor: zone.color,
                  fillOpacity: 0.7
                }}
              >
                <Popup>
                  <div style={{ fontSize: 12 }}>
                    <p style={{ fontWeight: 600 }}>{zone.zone}</p>
                    <p>NDVI: {zone.ndvi}</p>
                    <p>Status: {zone.status}</p>
                  </div>
                </Popup>
              </Circle>
            ))}
          </MapContainer>
        </div>
      )}

      <button
        onClick={analyzeField}
        disabled={loading}
        style={{
          width: "100%", padding: "12px", borderRadius: 8,
          background: loading ? "#9ca3af" : "#3B6D11",
          color: "#fff", border: "none", fontSize: 14,
          fontWeight: 500, cursor: loading ? "not-allowed" : "pointer"
        }}
      >
        {loading ? "Analyzing field..." : "🛰️ Analyze Field with NDVI"}
      </button>

      {error && (
        <div style={{ marginTop: 12, padding: 16, background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, color: "#991b1b" }}>
          {error}
        </div>
      )}

      {/* Legend */}
      <div style={{ display: "flex", gap: 16, marginTop: 16, flexWrap: "wrap" }}>
        {[
          { color: "#2d6a4f", label: "Excellent (>0.6)" },
          { color: "#52b788", label: "Good (0.4-0.6)" },
          { color: "#d4a017", label: "Moderate (0.2-0.4)" },
          { color: "#d62828", label: "Poor (<0.2)" },
        ].map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: item.color }} />
            <span style={{ fontSize: 11, color: "#6b7280" }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}