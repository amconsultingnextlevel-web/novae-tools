"use client";

import React, { useMemo, useState } from "react";

const TotalCostCalculator = () => {
  const [step, setStep] = useState(1);
  const [showResults, setShowResults] = useState(false);
  const [animateResults, setAnimateResults] = useState(false);

  const [inputs, setInputs] = useState({
    annualMiles: 5000,
    yearsOwnership: 10,
    fuelCost: 3.5,
    towMpg: 12,

    corrosionExposure: "moderate",
    cargoType: "equipment",
    trailerLength: "20",

    aluminumPrice: 8500,
    steelPrice: 6500,

    materialPreference: "none", // "none" | "steel" | "aluminum"
    priorities: ["resale", "weight"], // array (resale, weight, lowmaint)
  });

  const corrosionMultipliers = {
    low: { steel: 1.0, label: "Low (Dry Climate, Covered Storage)" },
    moderate: { steel: 1.5, label: "Moderate (Mixed Climate, Some Exposure)" },
    high: { steel: 2.2, label: "High (Salt, Humidity, Coastal)" },
    severe: { steel: 3.0, label: "Severe (Daily Salt/Chemical Exposure)" },
  };

  const trailerLengths = useMemo(() => {
    const arr = [];
    for (let i = 10; i <= 30; i++) arr.push(i.toString());
    return arr;
  }, []);

  const formatCurrency = (num) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Number.isFinite(num) ? num : 0);

  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

  const getFuelPenalty = ({ totalMiles, fuelPrice, weightPenaltyLbs, priorities, towMpg }) => {
    const baseMpg = Math.max(6, towMpg ?? 12);

    // MPG loss per 1000 lbs of extra trailer weight (tunable)
    let mpgLossPer1000 = 0.30;
    if (priorities?.includes("weight")) mpgLossPer1000 *= 1.15;

    const weightFactor = weightPenaltyLbs / 1000;
    const steelMpg = Math.max(5, baseMpg - weightFactor * mpgLossPer1000);

    const gallonsAl = totalMiles / baseMpg;
    const gallonsSteel = totalMiles / steelMpg;

    const extraGallons = gallonsSteel - gallonsAl;
    const fuelPenalty = extraGallons * fuelPrice;

    return Math.round(fuelPenalty);
  };

  const calculateCosts = () => {
    const years = inputs.yearsOwnership;
    const milesPerYear = inputs.annualMiles;
    const totalMiles = milesPerYear * years;
    const fuelPrice = inputs.fuelCost;

    const corrosionMult = corrosionMultipliers[inputs.corrosionExposure]?.steel ?? 1.0;
    const length = parseInt(inputs.trailerLength, 10);
    const lengthFactor = length / 20;
    const priorities = inputs.priorities || [];

    const aluminumPurchase = inputs.aluminumPrice;
    const steelPurchase = inputs.steelPrice;

    // Weight penalty estimate (steel heavier)
    const steelWeightPenaltyLbs = 600 + length * 15;

    const steelFuelPenalty = getFuelPenalty({
      totalMiles,
      fuelPrice,
      weightPenaltyLbs: steelWeightPenaltyLbs,
      priorities,
      towMpg: inputs.towMpg,
    });

    const steelMaintenance = Math.round(120 * years * corrosionMult * lengthFactor);

    const steelRepairs = Math.round(
      (corrosionMult > 1.5
        ? years > 5
          ? 1500 * lengthFactor
          : 500 * lengthFactor
        : years > 7
          ? 1000 * lengthFactor
          : 250 * lengthFactor)
    );

    const steelFloorReplacement = years >= 7 ? Math.round(800 * lengthFactor) : 0;

    let steelResale =
      years >= 10 ? steelPurchase * 0.15 : steelPurchase * (0.5 - years * 0.035);

    let aluminumResale =
      years >= 10 ? aluminumPurchase * 0.45 : aluminumPurchase * (0.75 - years * 0.03);

    steelResale = Math.max(0, steelResale);
    aluminumResale = Math.max(0, aluminumResale);

    if (priorities.includes("resale")) {
      steelResale *= 1.05;
      aluminumResale *= 1.05;
    }

    const aluminumMaintenance = Math.round(35 * years);
    const aluminumRepairs = years > 8 ? 350 : 100;

    const steelTotal = Math.round(
      steelPurchase +
        steelFuelPenalty +
        steelMaintenance +
        steelRepairs +
        steelFloorReplacement -
        steelResale
    );

    const aluminumTotal = Math.round(
      aluminumPurchase + aluminumMaintenance + aluminumRepairs - aluminumResale
    );

    const savings = Math.round(steelTotal - aluminumTotal);
    const priceDifference = Math.round(aluminumPurchase - steelPurchase);

    const steelExtrasTotal =
      steelFuelPenalty + steelMaintenance + steelRepairs + steelFloorReplacement;

    const extrasPerYear = steelExtrasTotal / Math.max(1, years);
    const yearsToBreakeven = extrasPerYear > 0 ? Math.ceil(priceDifference / extrasPerYear) : 0;

    return {
      steel: {
        purchase: Math.round(steelPurchase),
        fuel: Math.round(steelFuelPenalty),
        maintenance: Math.round(steelMaintenance),
        repairs: Math.round(steelRepairs),
        floorReplacement: Math.round(steelFloorReplacement),
        resale: Math.round(steelResale),
        total: Math.round(steelTotal),
      },
      aluminum: {
        purchase: Math.round(aluminumPurchase),
        fuel: 0,
        maintenance: Math.round(aluminumMaintenance),
        repairs: Math.round(aluminumRepairs),
        resale: Math.round(aluminumResale),
        total: Math.round(aluminumTotal),
      },
      savings,
      priceDifference,
      yearsToBreakeven: clamp(yearsToBreakeven, 1, 99),
      comparisonBasis: {
        length,
        corrosion: inputs.corrosionExposure,
        totalMiles,
        steelWeightPenaltyLbs,
      },
    };
  };

  const results = useMemo(calculateCosts, [inputs]);

  const handleInputChange = (field, value) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const handleCalculate = () => {
    setShowResults(true);
    setTimeout(() => setAnimateResults(true), 100);
  };

  const handleReset = () => {
    setAnimateResults(false);
    setTimeout(() => {
      setShowResults(false);
      setStep(1);
    }, 300);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(165deg, #0a0f1a 0%, #1a1f2e 50%, #0d1117 100%)",
        fontFamily: "'IBM Plex Sans', -apple-system, sans-serif",
        color: "#e8eaed",
        padding: "40px 20px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle grid background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: "900px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <div
            style={{
              display: "inline-block",
              padding: "8px 16px",
              background: "rgba(245, 158, 11, 0.1)",
              border: "1px solid rgba(245, 158, 11, 0.3)",
              borderRadius: "4px",
              fontSize: "12px",
              fontWeight: "600",
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              color: "#f59e0b",
              marginBottom: "20px",
            }}
          >
            NOVAE TOOLS
          </div>

          <h1
            style={{
              fontSize: "clamp(28px, 5vw, 42px)",
              fontWeight: "300",
              margin: "0 0 16px 0",
              letterSpacing: "-0.5px",
              lineHeight: "1.2",
            }}
          >
            Total Cost of Ownership
            <span style={{ display: "block", fontWeight: "600", color: "#3b82f6" }}>
              Calculator
            </span>
          </h1>

          <p
            style={{
              fontSize: "16px",
              color: "#9ca3af",
              maxWidth: "520px",
              margin: "0 auto",
              lineHeight: "1.6",
            }}
          >
            Compare long-term ownership costs based on corrosion exposure, miles towed,
            and resale — not just sticker price.
          </p>
        </div>

        {!showResults ? (
          <div
            style={{
              background: "rgba(255, 255, 255, 0.02)",
              border: "1px solid rgba(255, 255, 255, 0.06)",
              borderRadius: "16px",
              padding: "clamp(24px, 5vw, 40px)",
              backdropFilter: "blur(10px)",
            }}
          >
            {/* Progress indicator */}
            <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "40px" }}>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  style={{
                    width: i === step ? "32px" : "8px",
                    height: "8px",
                    borderRadius: "4px",
                    background: i <= step ? "#3b82f6" : "rgba(255,255,255,0.1)",
                    transition: "all 0.3s ease",
                  }}
                />
              ))}
            </div>

            {/* STEP 1 */}
            {step === 1 && (
              <div style={{ animation: "fadeIn 0.3s ease" }}>
                <h2 style={{ fontSize: "20px", fontWeight: "500", marginBottom: "8px", textAlign: "center" }}>
                  Trailer Configuration
                </h2>
                <p style={{ color: "#9ca3af", fontSize: "14px", textAlign: "center", marginBottom: "32px" }}>
                  Enter real-world prices for the trailers you’re comparing
                </p>

                <div style={{ display: "grid", gap: "24px" }}>
                  {/* Trailer Length */}
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "500", marginBottom: "8px", color: "#d1d5db" }}>
                      Trailer Length
                    </label>
                    <select
                      value={inputs.trailerLength}
                      onChange={(e) => handleInputChange("trailerLength", e.target.value)}
                      style={{
                        width: "100%",
                        padding: "14px 16px",
                        background: "rgba(255,255,255,0.02)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "8px",
                        color: "#e8eaed",
                        fontSize: "15px",
                        cursor: "pointer",
                        appearance: "none",
                        backgroundImage:
                          `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%239ca3af' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10l-5 5z'/%3E%3C/svg%3E")`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right 16px center",
                      }}
                    >
                      {trailerLengths.map((length) => (
                        <option key={length} value={length} style={{ background: "#1a1f2e", color: "#e8eaed" }}>
                          {length}' ({length} feet)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Aluminum Price */}
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "500", marginBottom: "8px", color: "#d1d5db" }}>
                      Aluminum Trailer Price
                    </label>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af", fontSize: "15px" }}>$</span>
                      <input
                        type="number"
                        value={inputs.aluminumPrice}
                        onChange={(e) => handleInputChange("aluminumPrice", parseInt(e.target.value, 10) || 0)}
                        min="3000"
                        max="80000"
                        step="100"
                        style={{
                          width: "100%",
                          padding: "14px 16px 14px 32px",
                          background: "rgba(255,255,255,0.02)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: "8px",
                          color: "#e8eaed",
                          fontSize: "15px",
                          outline: "none",
                          boxSizing: "border-box",
                        }}
                      />
                    </div>
                  </div>

                  {/* Steel Price */}
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "500", marginBottom: "8px", color: "#d1d5db" }}>
                      Steel Trailer Price
                    </label>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af", fontSize: "15px" }}>$</span>
                      <input
                        type="number"
                        value={inputs.steelPrice}
                        onChange={(e) => handleInputChange("steelPrice", parseInt(e.target.value, 10) || 0)}
                        min="2000"
                        max="80000"
                        step="100"
                        style={{
                          width: "100%",
                          padding: "14px 16px 14px 32px",
                          background: "rgba(255,255,255,0.02)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: "8px",
                          color: "#e8eaed",
                          fontSize: "15px",
                          outline: "none",
                          boxSizing: "border-box",
                        }}
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  style={{
                    width: "100%",
                    marginTop: "32px",
                    padding: "16px",
                    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: "15px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Continue →
                </button>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div style={{ animation: "fadeIn 0.3s ease" }}>
                <h2 style={{ fontSize: "20px", fontWeight: "500", marginBottom: "8px", textAlign: "center" }}>
                  Operating Conditions
                </h2>
                <p style={{ color: "#9ca3af", fontSize: "14px", textAlign: "center", marginBottom: "32px" }}>
                  These factors drive long-term cost differences
                </p>

                <div style={{ display: "grid", gap: "28px" }}>
                  {/* Annual miles */}
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                      <label style={{ fontSize: "13px", fontWeight: "500", color: "#d1d5db" }}>Annual Miles Towed</label>
                      <span style={{ fontSize: "18px", fontWeight: "600", color: "#3b82f6" }}>
                        {inputs.annualMiles.toLocaleString()}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1000"
                      max="20000"
                      step="500"
                      value={inputs.annualMiles}
                      onChange={(e) => handleInputChange("annualMiles", parseInt(e.target.value, 10))}
                      style={{ width: "100%", height: "8px", borderRadius: "4px", outline: "none", cursor: "pointer" }}
                    />
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#6b7280", marginTop: "6px" }}>
                      <span>1,000</span>
                      <span>20,000</span>
                    </div>
                  </div>

                  {/* years */}
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                      <label style={{ fontSize: "13px", fontWeight: "500", color: "#d1d5db" }}>Years of Ownership</label>
                      <span style={{ fontSize: "18px", fontWeight: "600", color: "#3b82f6" }}>
                        {inputs.yearsOwnership} years
                      </span>
                    </div>
                    <input
                      type="range"
                      min="3"
                      max="15"
                      step="1"
                      value={inputs.yearsOwnership}
                      onChange={(e) => handleInputChange("yearsOwnership", parseInt(e.target.value, 10))}
                      style={{ width: "100%", height: "8px", borderRadius: "4px", outline: "none", cursor: "pointer" }}
                    />
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#6b7280", marginTop: "6px" }}>
                      <span>3 years</span>
                      <span>15 years</span>
                    </div>
                  </div>

                  {/* corrosion */}
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "500", marginBottom: "12px", color: "#d1d5db" }}>
                      Corrosion Exposure Level
                    </label>
                    <div style={{ display: "grid", gap: "8px" }}>
                      {Object.entries(corrosionMultipliers).map(([key, val]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => handleInputChange("corrosionExposure", key)}
                          style={{
                            padding: "12px 16px",
                            background: inputs.corrosionExposure === key ? "rgba(59, 130, 246, 0.15)" : "rgba(255,255,255,0.02)",
                            border: `1px solid ${inputs.corrosionExposure === key ? "#3b82f6" : "rgba(255,255,255,0.08)"}`,
                            borderRadius: "8px",
                            color: inputs.corrosionExposure === key ? "#e8eaed" : "#9ca3af",
                            cursor: "pointer",
                            fontSize: "13px",
                            textAlign: "left",
                          }}
                        >
                          {val.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "12px", marginTop: "32px" }}>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    style={{
                      padding: "16px 24px",
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "8px",
                      color: "#9ca3af",
                      fontSize: "15px",
                      cursor: "pointer",
                    }}
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    style={{
                      flex: 1,
                      padding: "16px",
                      background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                      border: "none",
                      borderRadius: "8px",
                      color: "#fff",
                      fontSize: "15px",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    Continue →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div style={{ animation: "fadeIn 0.3s ease" }}>
                <h2 style={{ fontSize: "20px", fontWeight: "500", marginBottom: "8px", textAlign: "center" }}>
                  Fuel Cost
                </h2>
                <p style={{ color: "#9ca3af", fontSize: "14px", textAlign: "center", marginBottom: "32px" }}>
                  We estimate extra fuel burn due to steel’s added towing weight
                </p>

                {/* Fuel slider */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                    <label style={{ fontSize: "13px", fontWeight: "500", color: "#d1d5db" }}>Price per Gallon</label>
                    <span style={{ fontSize: "24px", fontWeight: "600", color: "#3b82f6" }}>
                      ${inputs.fuelCost.toFixed(2)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="2.5"
                    max="6.0"
                    step="0.1"
                    value={inputs.fuelCost}
                    onChange={(e) => handleInputChange("fuelCost", parseFloat(e.target.value))}
                    style={{ width: "100%", height: "8px", borderRadius: "4px", outline: "none", cursor: "pointer" }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#6b7280", marginTop: "6px" }}>
                    <span>$2.50</span>
                    <span>$6.00</span>
                  </div>
                </div>

                {/* MPG input (IMPORTANT: NOT inside any button) */}
                <div style={{ marginTop: "18px" }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "500", marginBottom: "8px", color: "#d1d5db" }}>
                    Tow Vehicle MPG (while towing)
                  </label>

                  <input
                    type="number"
                    min="6"
                    max="25"
                    step="0.5"
                    value={inputs.towMpg}
                    onChange={(e) => handleInputChange("towMpg", parseFloat(e.target.value) || 12)}
                    onKeyDown={(e) => e.stopPropagation()} // prevents arrow keys affecting surrounding UI
                    style={{
                      width: "100%",
                      padding: "14px 16px",
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "8px",
                      color: "#e8eaed",
                      fontSize: "15px",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />

                  <p style={{ fontSize: "12px", color: "#6b7280", marginTop: "6px" }}>
                    Enter your typical MPG while towing (ex: 10–14 for many trucks depending on load/speed).
                  </p>
                </div>

                {/* Buttons row */}
                <div style={{ display: "flex", gap: "12px", marginTop: "32px" }}>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    style={{
                      padding: "16px 24px",
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "8px",
                      color: "#9ca3af",
                      fontSize: "15px",
                      cursor: "pointer",
                    }}
                  >
                    ← Back
                  </button>

                  <button
                    type="button"
                    onClick={handleCalculate}
                    style={{
                      flex: 1,
                      padding: "16px",
                      background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                      border: "none",
                      borderRadius: "8px",
                      color: "#fff",
                      fontSize: "15px",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    Calculate True Cost →
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div
            style={{
              opacity: animateResults ? 1 : 0,
              transform: animateResults ? "translateY(0)" : "translateY(20px)",
              transition: "all 0.5s ease",
            }}
          >
            {/* Savings headline */}
            <div
              style={{
                textAlign: "center",
                marginBottom: "40px",
                padding: "32px",
                background:
                  results.savings > 0
                    ? "linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.02) 100%)"
                    : "rgba(255,255,255,0.02)",
                border: `1px solid ${
                  results.savings > 0 ? "rgba(34, 197, 94, 0.3)" : "rgba(255,255,255,0.06)"
                }`,
                borderRadius: "16px",
              }}
            >
              <div style={{ fontSize: "14px", color: "#9ca3af", marginBottom: "8px" }}>
                Over {inputs.yearsOwnership} years, aluminum is estimated to cost less by
              </div>
              <div
                style={{
                  fontSize: "clamp(36px, 8vw, 56px)",
                  fontWeight: "700",
                  color: results.savings > 0 ? "#22c55e" : "#ef4444",
                  letterSpacing: "-2px",
                }}
              >
                {formatCurrency(Math.abs(results.savings))}
              </div>
              <div style={{ fontSize: "14px", color: "#6b7280", marginTop: "8px" }}>
                Estimated initial price difference (Al − Steel): {formatCurrency(results.priceDifference)} | Breakeven:{" "}
                {results.yearsToBreakeven ? `Year ${results.yearsToBreakeven}` : "N/A"}
              </div>
              <div style={{ fontSize: "13px", color: "#6b7280", marginTop: "10px" }}>
                Comparison basis: Aluminum ≈ {formatCurrency(results.aluminum.purchase)} | Steel ≈{" "}
                {formatCurrency(results.steel.purchase)}
              </div>
            </div>

            {/* Comparison table */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "32px" }}>
              {/* Steel */}
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "24px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#9ca3af", marginBottom: "20px" }}>
                  Steel Trailer
                </h3>
                <div style={{ display: "grid", gap: "14px" }}>
                  {[
                    ["Purchase Price", formatCurrency(results.steel.purchase), "#e8eaed"],
                    ["Fuel (weight penalty)", `+${formatCurrency(results.steel.fuel)}`, "#ef4444"],
                    ["Maintenance", `+${formatCurrency(results.steel.maintenance)}`, "#ef4444"],
                    ["Repairs", `+${formatCurrency(results.steel.repairs)}`, "#ef4444"],
                    ...(results.steel.floorReplacement > 0 ? [["Floor Replacement", `+${formatCurrency(results.steel.floorReplacement)}`, "#ef4444"]] : []),
                    ["Resale Value", `−${formatCurrency(results.steel.resale)}`, "#22c55e"],
                  ].map(([label, val, color]) => (
                    <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                      <span style={{ color: "#6b7280" }}>{label}</span>
                      <span style={{ color }}>{val}</span>
                    </div>
                  ))}
                  <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "14px", marginTop: "6px", display: "flex", justifyContent: "space-between", fontSize: "16px", fontWeight: "600" }}>
                    <span style={{ color: "#9ca3af" }}>True Cost</span>
                    <span style={{ color: "#e8eaed" }}>{formatCurrency(results.steel.total)}</span>
                  </div>
                </div>
              </div>

              {/* Aluminum */}
              <div style={{ background: "rgba(59, 130, 246, 0.05)", border: "1px solid rgba(59, 130, 246, 0.2)", borderRadius: "12px", padding: "24px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#3b82f6", marginBottom: "20px" }}>
                  Aluminum Trailer
                </h3>
                <div style={{ display: "grid", gap: "14px" }}>
                  {[
                    ["Purchase Price", formatCurrency(results.aluminum.purchase), "#e8eaed"],
                    ["Fuel impact", formatCurrency(results.aluminum.fuel), "#22c55e"],
                    ["Maintenance", `+${formatCurrency(results.aluminum.maintenance)}`, "#e8eaed"],
                    ["Repairs", `+${formatCurrency(results.aluminum.repairs)}`, "#e8eaed"],
                    ["Resale Value", `−${formatCurrency(results.aluminum.resale)}`, "#22c55e"],
                  ].map(([label, val, color]) => (
                    <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                      <span style={{ color: "#6b7280" }}>{label}</span>
                      <span style={{ color }}>{val}</span>
                    </div>
                  ))}
                  <div style={{ borderTop: "1px solid rgba(59, 130, 246, 0.2)", paddingTop: "14px", marginTop: "6px", display: "flex", justifyContent: "space-between", fontSize: "16px", fontWeight: "600" }}>
                    <span style={{ color: "#9ca3af" }}>True Cost</span>
                    <span style={{ color: "#3b82f6" }}>{formatCurrency(results.aluminum.total)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ textAlign: "center" }}>
              <button
                type="button"
                onClick={handleReset}
                style={{
                  padding: "16px 24px",
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "8px",
                  color: "#9ca3af",
                  fontSize: "15px",
                  cursor: "pointer",
                }}
              >
                Recalculate
              </button>
            </div>
          </div>
        )}

        {/* Footer + Branding */}
        <div
          style={{
            textAlign: "center",
            marginTop: "56px",
            fontSize: "12px",
            color: "#6b7280",
            lineHeight: "1.6",
          }}
        >
          <p style={{ margin: "0 0 6px 0" }}>
            Calculations are directional estimates based on typical ownership patterns.
          </p>
          <p style={{ margin: "0 0 18px 0" }}>
            Tune fuel, maintenance, and resale assumptions to match real-world usage.
          </p>

          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", opacity: 0.85 }}>
            <span>Powered by</span>
            <a
              href="https://nextlevelworldwide.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#3b82f6", fontWeight: "600", textDecoration: "none" }}
            >
              Next Level Consulting
            </a>
          </div>

          <div style={{ marginTop: "6px", fontSize: "11px", opacity: 0.6 }}>
            © {new Date().getFullYear()} Next Level Consulting. All rights reserved.
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        input[type="range"] { -webkit-appearance: none; appearance: none; }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 20px; height: 20px;
          background: #3b82f6;
          border-radius: 50%;
          cursor: pointer;
          border: 3px solid #1a1f2e;
        }
        input[type="range"]::-moz-range-thumb {
          width: 20px; height: 20px;
          background: #3b82f6;
          border-radius: 50%;
          cursor: pointer;
          border: 3px solid #1a1f2e;
        }
      `}</style>
    </div>
  );
};

export default TotalCostCalculator;
