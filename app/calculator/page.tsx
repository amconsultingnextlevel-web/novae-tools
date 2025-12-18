import Image from "next/image";
import TotalCostCalculator from "../components/TotalCostCalculator";

export default function CalculatorPage() {
  return (
    <div style={{ background: "#F9FAFB", minHeight: "100vh" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: 24 }}>

        {/* HEADER */}
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
              src="/aluma-logo.jpg"
              alt="Aluma Trailers"
              style={{ height: 38, width: "auto" }}
            />
            <div>
              <div style={{ fontWeight: 800, color: "#3C3C3E" }}>
                Total Cost of Ownership
              </div>
              <div style={{ fontSize: 13, color: "#6B7280" }}>
                Compare aluminum vs steel over time
              </div>
            </div>
          </div>

          <a
            href="/selector"
            style={{
              background: "#F8DF2D",
              color: "#000",
              fontWeight: 800,
              padding: "10px 14px",
              borderRadius: 12,
              textDecoration: "none",
              border: "1px solid rgba(0,0,0,0.1)",
            }}
          >
            Trailer Selector
          </a>
        </header>

        {/* TOOL */}
        <div style={{ marginTop: 18 }}>
          <TotalCostCalculator />
        </div>

      </div>
    </div>
  );
}