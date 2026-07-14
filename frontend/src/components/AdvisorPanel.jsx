import { useState } from "react"

const SUGGESTED_QUESTIONS = [
  "What diseases should I watch out for?",
  "Should I irrigate today?",
  "What's the biggest risk on my farm right now?",
  "Give me a summary of my farm's health",
]

export default function AdvisorPanel({ apiUrl, weatherData, irrigationData }) {
  const [question, setQuestion] = useState("")
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)

  async function askQuestion(q) {
    const userQuestion = q || question
    if (!userQuestion.trim()) return

    setMessages(prev => [...prev, { role: "user", text: userQuestion }])
    setQuestion("")
    setLoading(true)

    try {
      const res = await fetch(`${apiUrl}/advisor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: userQuestion,
          weather: weatherData || {},
          irrigation: irrigationData || {}
        })
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: "advisor", text: data.answer }])
    } catch (e) {
      setMessages(prev => [...prev, { role: "advisor", text: "Sorry, I couldn't get an answer. Please try again." }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ marginTop: 32 }}>
      <h2 style={{ fontSize: 18, fontWeight: 600, color: "#1a1a1a", marginBottom: 4 }}>
        🤖 AI Farm Advisor
      </h2>
      <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 16 }}>
        Ask anything about your farm — powered by your real scan history and weather data.
      </p>

      {/* Suggested questions */}
      {messages.length === 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
          {SUGGESTED_QUESTIONS.map((q, i) => (
            <button
              key={i}
              onClick={() => askQuestion(q)}
              style={{
                padding: "8px 14px", borderRadius: 99,
                border: "1px solid #e5e7eb", background: "#fff",
                fontSize: 12, color: "#374151", cursor: "pointer"
              }}
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Chat messages */}
      {messages.length > 0 && (
        <div style={{
          border: "1px solid #e5e7eb", borderRadius: 12,
          padding: 16, marginBottom: 16, maxHeight: 300,
          overflowY: "auto", display: "flex", flexDirection: "column", gap: 12
        }}>
          {messages.map((msg, i) => (
            <div key={i} style={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start"
            }}>
              <div style={{
                maxWidth: "80%", padding: "10px 14px", borderRadius: 12,
                background: msg.role === "user" ? "#3B6D11" : "#f3f4f6",
                color: msg.role === "user" ? "#fff" : "#1a1a1a",
                fontSize: 13, lineHeight: 1.6
              }}>
                {msg.role === "advisor" && (
                  <p style={{ fontSize: 11, fontWeight: 600, color: "#3B6D11", marginBottom: 4 }}>
                    🌿 AgriOS Advisor
                  </p>
                )}
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: "flex", justifyContent: "flex-start" }}>
              <div style={{ padding: "10px 14px", borderRadius: 12, background: "#f3f4f6", fontSize: 13, color: "#6b7280" }}>
                🌿 Thinking...
              </div>
            </div>
          )}
        </div>
      )}

      {/* Input */}
      <div style={{ display: "flex", gap: 8 }}>
        <input
          type="text"
          placeholder="Ask about your farm..."
          value={question}
          onChange={e => setQuestion(e.target.value)}
          onKeyDown={e => e.key === "Enter" && askQuestion()}
          style={{
            flex: 1, padding: "10px 14px", borderRadius: 8,
            border: "1px solid #e5e7eb", fontSize: 13, outline: "none"
          }}
        />
        <button
          onClick={() => askQuestion()}
          disabled={loading}
          style={{
            padding: "10px 18px", borderRadius: 8,
            background: loading ? "#9ca3af" : "#3B6D11",
            color: "#fff", border: "none", fontSize: 13,
            fontWeight: 500, cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          Ask
        </button>
      </div>
    </div>
  )
}