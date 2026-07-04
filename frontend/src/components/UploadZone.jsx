import { useCallback, useState } from "react"

export default function UploadZone({ onUpload, loading }) {
  const [preview, setPreview] = useState(null)
  const [dragging, setDragging] = useState(false)

  const handleFile = useCallback((file) => {
    if (!file?.type.startsWith("image/")) return
    const url = URL.createObjectURL(file)
    setPreview(url)
    onUpload(file)
  }, [onUpload])

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]) }}
      onClick={() => document.getElementById("file-input").click()}
      style={{
        border: `2px dashed ${dragging ? "#3B6D11" : "#c0dd97"}`,
        borderRadius: 12,
        padding: "3rem 2rem",
        textAlign: "center",
        cursor: "pointer",
        background: dragging ? "#EAF3DE" : "#fff",
        transition: "all 0.15s ease",
        position: "relative"
      }}
    >
      <input
        id="file-input"
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => handleFile(e.target.files[0])}
      />

      {loading ? (
        <div>
          <div style={{ width: 40, height: 40, border: "3px solid #EAF3DE", borderTopColor: "#3B6D11", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
          <p style={{ color: "#3B6D11", fontWeight: 500 }}>Analyzing your crop...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      ) : preview ? (
        <div>
          <img src={preview} style={{ maxHeight: 200, maxWidth: "100%", borderRadius: 8, marginBottom: 12 }} />
          <p style={{ color: "#6b7280", fontSize: 14 }}>Click to upload a different image</p>
        </div>
      ) : (
        <div>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🌿</div>
          <p style={{ fontWeight: 500, color: "#1a1a1a", marginBottom: 4 }}>Drop a leaf photo here</p>
          <p style={{ color: "#9ca3af", fontSize: 14 }}>or click to browse · JPG, PNG up to 10MB</p>
        </div>
      )}
    </div>
  )
}