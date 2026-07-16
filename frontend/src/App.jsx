import { useState } from "react"
import UploadZone from "./components/UploadZone.jsx"
import DiagnosisCard from "./components/DiagnosisCard.jsx"
import WeatherPanel from "./components/WeatherPanel.jsx"
import IrrigationPanel from "./components/IrrigationPanel.jsx"
import AdvisorPanel from "./components/AdvisorPanel.jsx"
import FieldMap from "./components/FieldMap.jsx"

const TABS = [
  { id: "disease", label: "Disease Detection", icon: "🔬" },
  { id: "weather", label: "Weather Risk", icon: "🌤️" },
  { id: "irrigation", label: "Irrigation", icon: "💧" },
  { id: "advisor", label: "AI Advisor", icon: "🤖" },
  { id: "field", label: "Field Map", icon: "🛰️" },
]

export default function App() {
  const [activeTab, setActiveTab] = useState("disease")
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [weatherData, setWeatherData] = useState(null)
  const [irrigationData, setIrrigationData] = useState(null)

  const API_URL = import.meta.env.VITE_API_URL

  async function handleUpload(file) {
    setLoading(true)
    setError(null)
    setResult(null)
    const formData = new FormData()
    formData.append("file", file)
    try {
      const res = await fetch(`${API_URL}/predict`, { method: "POST", body: formData })
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
    <div style={{ minHeight: "100vh", background: "#f0f4f0", fontFamily: "system-ui, sans-serif" }}>

      {/* Header */}
      <header style={{
        background: "#fff",
        borderBottom: "1px solid #e5e7eb",
        padding: "0 2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: 60,
        position: "sticky",
        top: 0,
        zIndex: 100,
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 34, height: 34, background: "linear-gradient(135deg, #3B6D11, #52a018)",
            borderRadius: 8, display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 18
          }}>🌿</div>
          <div>
            <span style={{ fontWeight: 700, fontSize: 16, color: "#1a1a1a" }}>AgriOS</span>
            <span style={{ fontSize: 11, color: "#6b7280", marginLeft: 8 }}>AI Farm Management</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e" }} />
          <span style={{ fontSize: 12, color: "#6b7280" }}>Live</span>
        </div>
      </header>

      {/* Hero */}
      <div style={{
        background: "linear-gradient(135deg, #1a3a0a 0%, #2d6a4f 100%)",
        padding: "2.5rem 2rem",
        textAlign: "center",
        color: "#fff"
      }}>
        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#a8d5b5", marginBottom: 8 }}>
          AI-Powered Precision Agriculture
        </p>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, lineHeight: 1.2 }}>
          Your AI Farm Advisor
        </h1>
        <p style={{ fontSize: 14, color: "#a8d5b5", maxWidth: 480, margin: "0 auto" }}>
          Detect crop diseases, analyze weather risks, optimize irrigation, and get expert AI advice — all in one platform.
        </p>

        {/* Stats */}
        <div style={{ display: "flex", justifyContent: "center", gap: 32, marginTop: 24 }}>
          {[
            { value: "99.8%", label: "Model Accuracy" },
            { value: "38", label: "Disease Classes" },
            { value: "54K+", label: "Training Images" },
            { value: "5", label: "AI Features" },
          ].map((stat, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <p style={{ fontSize: 20, fontWeight: 700, color: "#fff" }}>{stat.value}</p>
              <p style={{ fontSize: 11, color: "#a8d5b5" }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{
        background: "#fff",
        borderBottom: "1px solid #e5e7eb",
        padding: "0 2rem",
        display: "flex",
        gap: 0,
        overflowX: "auto",
        position: "sticky",
        top: 60,
        zIndex: 99,
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
      }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: "14px 20px",
              border: "none",
              background: "none",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: activeTab === tab.id ? 600 : 400,
              color: activeTab === tab.id ? "#3B6D11" : "#6b7280",
              borderBottom: activeTab === tab.id ? "2px solid #3B6D11" : "2px solid transparent",
              whiteSpace: "nowrap",
              transition: "all 0.15s ease",
              display: "flex",
              alignItems: "center",
              gap: 6
            }}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <main style={{ maxWidth: 720, margin: "2rem auto", padding: "0 1.5rem 4rem" }}>

        {/* Disease Detection */}
        {activeTab === "disease" && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 20, fontWeight: 600, color: "#1a1a1a", marginBottom: 4 }}>🔬 Crop Disease Detection</h2>
              <p style={{ fontSize: 13, color: "#6b7280" }}>Upload a photo of a leaf for instant AI diagnosis across 38 disease classes.</p>
            </div>
            <div style={{ background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
              <UploadZone onUpload={handleUpload} loading={loading} />
              {error && (
                <div style={{ marginTop: 16, padding: 14, background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, color: "#991b1b", fontSize: 13 }}>
                  {error}
                </div>
              )}
              {result && <div style={{ marginTop: 16 }}><DiagnosisCard result={result} /></div>}
            </div>

            {/* How it works */}
            <div style={{ marginTop: 16, background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>How it works</p>
              <div style={{ display: "flex", gap: 16 }}>
                {[
                  { step: "1", text: "Upload leaf photo" },
                  { step: "2", text: "AI analyzes with MobileNetV2" },
                  { step: "3", text: "Get diagnosis + treatment" },
                ].map((item, i) => (
                  <div key={i} style={{ flex: 1, textAlign: "center" }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#EAF3DE", color: "#3B6D11", fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px" }}>{item.step}</div>
                    <p style={{ fontSize: 12, color: "#6b7280" }}>{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Weather Risk */}
        {activeTab === "weather" && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 20, fontWeight: 600, color: "#1a1a1a", marginBottom: 4 }}>🌤️ Weather Risk Analysis</h2>
              <p style={{ fontSize: 13, color: "#6b7280" }}>7-day disease risk forecast based on real weather conditions in your area.</p>
            </div>
            <div style={{ background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
              <WeatherPanel apiUrl={API_URL} onWeatherLoad={setWeatherData} />
            </div>
          </div>
        )}

        {/* Irrigation */}
        {activeTab === "irrigation" && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 20, fontWeight: 600, color: "#1a1a1a", marginBottom: 4 }}>💧 Predictive Irrigation</h2>
              <p style={{ fontSize: 13, color: "#6b7280" }}>AI-powered water recommendations based on your crop, soil, and today's weather.</p>
            </div>
            <div style={{ background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
              <IrrigationPanel apiUrl={API_URL} weatherData={weatherData} onIrrigationResult={setIrrigationData} />
            </div>
          </div>
        )}

        {/* AI Advisor */}
        {activeTab === "advisor" && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 20, fontWeight: 600, color: "#1a1a1a", marginBottom: 4 }}>🤖 AI Farm Advisor</h2>
              <p style={{ fontSize: 13, color: "#6b7280" }}>Powered by Groq LLM + Pinecone RAG — answers using your real farm data and agricultural knowledge base.</p>
            </div>
            <div style={{ background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
              <AdvisorPanel apiUrl={API_URL} weatherData={weatherData} irrigationData={irrigationData} />
            </div>
            {/* Tech badges */}
            <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["Pinecone Vector DB", "Groq Llama 3.3 70B", "RAG Architecture", "22 Knowledge Chunks"].map((badge, i) => (
                <span key={i} style={{ fontSize: 11, padding: "4px 10px", borderRadius: 99, background: "#EEEDFE", color: "#534AB7", border: "1px solid #c4c2f5" }}>
                  {badge}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Field Map */}
        {activeTab === "field" && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 20, fontWeight: 600, color: "#1a1a1a", marginBottom: 4 }}>🛰️ Satellite Field Intelligence</h2>
              <p style={{ fontSize: 13, color: "#6b7280" }}>NDVI-based plant health analysis across your field zones using satellite data.</p>
            </div>
            <div style={{ background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
              <FieldMap apiUrl={API_URL} weatherData={weatherData} />
            </div>
          </div>
        )}

      </main>
    </div>
  )
}