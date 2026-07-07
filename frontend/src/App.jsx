import { useState } from "react"
import UploadZone from "./components/UploadZone.jsx"
import DiagnosisCard from "./components/DiagnosisCard.jsx"
import WeatherPanel from "./components/WeatherPanel.jsx"

export default function App() {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleUpload(file) {
    setLoading(true)
    setError(null)
    setResult(null)
    
    const formData = new FormData()
    formData.append("file", file)
    
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/predict`, {
        method: "POST",
        body: formData,
      })
      if (!res.ok) throw new Error("Prediction failed")
      const data = await res.json()
      setResult(data)
    } catch (e) {
      setError("Could not analyze image. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f8faf5", fontFamily: "system-ui, sans-serif" }}>
      <header style={{ background: "#fff", borderBottom: "1px solid #e8f0e0", padding: "1rem 2rem", display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{ width: 32, height: 32, background: "#3B6D11", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 600 }}>A</div>
        <span style={{ fontWeight: 600, fontSize: 18, color: "#1a1a1a" }}>AgriOS</span>
        <span style={{ fontSize: 12, color: "#6b7280", background: "#EAF3DE", padding: "2px 8px", borderRadius: 99, color: "#3B6D11" }}>v1.0 · Crop Disease Detection</span>
      </header>

      <main style={{ maxWidth: 680, margin: "3rem auto", padding: "0 1.5rem" }}>
        <h1 style={{ fontSize: 28, fontWeight: 600, color: "#1a1a1a", marginBottom: 8 }}>Diagnose your crop</h1>
        <p style={{ color: "#6b7280", marginBottom: 32 }}>Upload a photo of a leaf and get an instant AI diagnosis with treatment recommendations.</p>
        
        <UploadZone onUpload={handleUpload} loading={loading} />
        
        {error && (
          <div style={{ marginTop: 24, padding: 16, background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, color: "#991b1b" }}>
            {error}
          </div>
        )}
        
        {result && <DiagnosisCard result={result} />}
        <WeatherPanel apiUrl={import.meta.env.VITE_API_URL} />
      </main>
    </div>
  )
}