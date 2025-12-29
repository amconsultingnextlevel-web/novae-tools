import TrailerSelectionSystem from "../components/TrailerSelectionSystem";

export default function SelectorPage() {
  return (
    <div style={{ background: "#F9FAFB", minHeight: "100vh" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: 24 }}>
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            padding: "14px 18px",
            background: "#FFFFFF",
            border: "1px solid #E5E7EB",
            borderRadius: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <img
              src="/novae-logo.png"
              alt="Novae Trailers"
              style={{ height: 38, width: "auto" }}
            />
            <div>
          <div style={{ fontWeight: 800, color: "#111827" }}>
          Trailer Finder
        </div>
        <div style={{ fontSize: 13, color: "#6B7280" }}>
        Answer a few questions. We’ll recommend the best trailer type and material fit.
      </div>
            </div>
          </div>

          <a
            href="/calculator"
            style={{
              background: "#F97316",
              color: "#000",
              fontWeight: 800,
              padding: "10px 14px",
              borderRadius: 12,
              textDecoration: "none",
              border: "1px solid rgba(0,0,0,0.1)",
            }}
          >
            Compare Total Cost
          </a>
        </header>

        <div style={{ marginTop: 18 }}>
          <TrailerSelectionSystem />
        </div>
      </div>
    </div>
  );
}
