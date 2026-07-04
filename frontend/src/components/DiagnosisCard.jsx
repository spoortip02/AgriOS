export default function DiagnosisCard({ result }) {
  const { crop, condition, confidence, is_healthy, treatment } = result
  const color = is_healthy ? { bg: "#EAF3DE", border: "#97C459", text: "#3B6D11" }
                           : confidence > 80 ? { bg: "#FCEBEB", border: "#F09595", text: "#A32D2D" }
                                             : { bg: "#FAEEDA", border: "#EF9F27", text: "#854F0B" }

  return (
    <div style={{ marginTop: 24, border: `1px solid ${color.border}`, borderRadius: 12, overflow: "hidden", background: "#fff" }}>
      <div style={{ background: color.bg, padding: "16px 20px", borderBottom: `1px solid ${color.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ fontSize: 12, color: color.text, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>{crop}</p>
            <p style={{ fontSize: 20, fontWeight: 600, color: "#1a1a1a" }}>{condition}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: 28, fontWeight: 700, color: color.text }}>{confidence}%</p>
            <p style={{ fontSize: 12, color: "#6b7280" }}>confidence</p>
          </div>
        </div>
      </div>
      <div style={{ padding: "16px 20px" }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Recommended action</p>
        <p style={{ color: "#374151", lineHeight: 1.6 }}>{treatment}</p>
      </div>
    </div>
  )
}