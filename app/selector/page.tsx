import Image from "next/image";
import TrailerSelectionSystem from "../components/TrailerSelectionSystem";

export default function SelectorPage() {
  return (
    <div style={{ background: "var(--aluma-bg)", minHeight: "100vh" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: 24 }}>
        <header style={{
          display:"flex", alignItems:"center", justifyContent:"space-between",
          padding:16, background:"#fff", border:`1px solid var(--aluma-border)`, borderRadius:16
        }}>
          <div style={{ display:"flex", gap:12, alignItems:"center" }}>
            <Image src="/aluma-logo.jpg" alt="Aluma" width={160} height={40} priority />
            <div>
              <div style={{ fontWeight:800, color:"var(--aluma-charcoal)" }}>Trailer Selector</div>
              <div style={{ fontSize:13, color:"#6B7280" }}>Answer a few questions. Get a best-fit starting point.</div>
            </div>
          </div>

          <a href="/calculator" style={{
            background:"var(--aluma-yellow)", color:"#000", fontWeight:800,
            padding:"10px 14px", borderRadius:12, textDecoration:"none"
          }}>
            Compare Total Cost
          </a>
        </header>

        <div style={{ marginTop:18 }}>
          <TrailerSelectionSystem />
        </div>
      </div>
    </div>
  );
}
