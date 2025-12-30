"use client";

import React, { useState } from "react";

const TrailerSelectionSystem = () => {
  const [step, setStep] = useState(0);

  // ✅ Added materialPref (single-select) + priority remains multi-select array
  const [selections, setSelections] = useState({
    primaryUse: null,
    frequency: null,
    towVehicle: null,
    terrain: null,
    materialPref: null, // ✅ NEW
    priority: [], // ✅ multi-select is an array
  });

  const [showResults, setShowResults] = useState(false);

  const questions = [
    {
      id: "primaryUse",
      title: "What will you primarily haul?",
      subtitle: "Select the category that best describes your typical loads",
      options: [
        {
          value: "equipment",
          label: "Heavy Equipment",
          desc: "Skid steers, mini excavators, forklifts, etc.",
          icon: "🏗️",
        },
        {
          value: "vehicles",
          label: "Cars & Trucks",
          desc: "Cars, trucks, and project vehicles",
          icon: "🏎️",
        },
        {
          value: "powersports",
          label: "Powersports",
          desc: "UTVs, ATVs, motorcycles",
          icon: "🏍️",
        },
        {
          value: "landscape",
          label: "Landscape & Materials",
          desc: "Gravel, rock, mulch, debris, mowers, equipment",
          icon: "🌿",
        },
        {
          value: "livestock",
          label: "Livestock & Agriculture",
          desc: "Animals, hay, farm equipment",
          icon: "🐴",
        },
        {
          value: "general",
          label: "General Cargo",
          desc: "Mixed loads, furniture, supplies",
          icon: "📦",
        },
        {
          value: "enclosed",
          label: "Protected Cargo",
          desc: "Weather-sensitive or secured items",
          icon: "🔒",
        },
        { value: "other", label: "Other", desc: "Something not listed", icon: "🛞" },
      ],
    },
    {
      id: "frequency",
      title: "How often will you haul?",
      subtitle: "Usage frequency impacts which features matter most",
      options: [
        { value: "daily", label: "Daily", desc: "Commercial or business use", icon: "📅" },
        { value: "weekly", label: "Several Times Weekly", desc: "Regular work or farm use", icon: "🔄" },
        { value: "monthly", label: "Few Times Monthly", desc: "Project-based or seasonal", icon: "📆" },
        { value: "occasional", label: "Occasionally", desc: "Personal or weekend use", icon: "🌤️" },
      ],
    },
    {
      id: "towVehicle",
      title: "What's your tow vehicle?",
      subtitle: "This helps estimate comfortable towing + payload limits",
      options: [
        { value: "halfton", label: "Half-Ton Truck", desc: "F-150, Silverado 1500, RAM 1500", icon: "🛻" },
        { value: "threequarter", label: "3/4-Ton Truck", desc: "F-250, Silverado 2500, RAM 2500", icon: "🚛" },
        { value: "oneton", label: "One-Ton Truck", desc: "F-350, Silverado 3500, RAM 3500", icon: "💪" },
        { value: "suv", label: "SUV or Midsize", desc: "Tahoe, Expedition, midsize trucks", icon: "🚙" },
        { value: "commercial", label: "Commercial Vehicle", desc: "Medium-duty trucks / CDL", icon: "🚚" },
      ],
    },
    {
      id: "terrain",
      title: "Where will you operate?",
      subtitle: "Environment affects corrosion exposure, traction, and maintenance needs",
      options: [
        { value: "highway", label: "Primarily Highway", desc: "Paved roads, minimal off-road", icon: "🛣️" },
        { value: "mixed", label: "Mixed Use", desc: "Roads plus jobsites or farms", icon: "🔀" },
        { value: "offroad", label: "Frequent Off-Road", desc: "Construction sites, fields, trails", icon: "🏔️" },
        { value: "coastal", label: "Coastal / Salt Exposure", desc: "Beach access, salt-treated roads", icon: "🌊" },
      ],
    },

    // ✅ NEW MATERIAL QUESTION (neutral)
    {
      id: "materialPref",
      title: "Do you have a material preference?",
      subtitle: "If you’re not sure, we’ll recommend what fits best based on your answers",
      options: [
        { value: "either", label: "No preference", desc: "Recommend best-fit based on priorities + environment", icon: "⚖️" },
        { value: "aluminum", label: "Aluminum", desc: "Often lighter weight and corrosion resistant", icon: "✨" },
        { value: "steel", label: "Steel", desc: "Often lower upfront cost and widely available", icon: "🛠️" },
      ],
    },

    {
      id: "priority",
      title: "What matters most to you?",
      subtitle: "Choose all that apply",
      multi: true,
      options: [
        { value: "durability", label: "Long-Term Durability", desc: "Built to last 15+ years", icon: "🛡️" },
        { value: "weight", label: "Weight Savings", desc: "Maximize payload, reduce fuel", icon: "⚖️" },
        { value: "versatility", label: "Versatility", desc: "Handle multiple load types", icon: "🔧" },
        { value: "lowmaint", label: "Low Maintenance", desc: "Minimal upkeep required", icon: "✨" },
        { value: "resale", label: "Resale Value", desc: "Retain value over time", icon: "💰" },
      ],
    },
  ];

  // ✅ Helper for multi-select highlighting
  const isOptionSelected = (question, optionValue) => {
    const val = selections[question.id];
    if (question.multi) return Array.isArray(val) && val.includes(optionValue);
    return val === optionValue;
  };

  // Trailer TYPE recommendations (categories, not specific models)
  const trailerTypes = {
    equipment_hauler: {
      name: "Equipment Hauler",
      category: "Heavy-Duty Open Trailer",
      icon: "🏗️",
      description:
        "Designed for loading and transporting machinery with higher GVWR needs, heavy-duty ramps, and reinforced decking.",
      idealFor: ["Skid steers", "Mini excavators", "Forklifts", "Compact equipment"],
      keyFeatures: [
        "Wide deck options / drive-over fenders for wide loads",
        "Heavy-duty ramps (standalone / tailgate / bifold depending on build)",
        "Reinforced deck for concentrated loads",
        "Higher GVWR ratings",
      ],
      sizeRange: "18' - 24' typical",
      considerations:
        "Confirm your machine weight, deck width, and ramp capacity. Tie-down placement matters for equipment hauling.",
    },
    car_hauler: {
      name: "Car Hauler",
      category: "Vehicle Transport Trailer",
      icon: "🚗",
      description:
        "Purpose-built for vehicle transport with appropriate deck width, load angle, and secure tie-down systems.",
      idealFor: ["Cars and trucks", "Classic vehicles", "Project vehicles", "Dealer transport"],
      keyFeatures: ["Low load angle for clearance", "Integrated tie-down points", "Tilt or ramp option", "Optional winch mount"],
      sizeRange: "16' - 24' typical",
      considerations: "Make sure deck width fits your widest vehicle and the load angle works for low-clearance vehicles.",
    },
    utility_trailer: {
      name: "Utility Trailer",
      category: "General Purpose Open Trailer",
      icon: "🔧",
      description:
        "Versatile platform for diverse hauling—work gear, recreation, home projects, and general cargo.",
      idealFor: ["UTVs and ATVs", "Motorcycles", "General cargo", "Home projects"],
      keyFeatures: ["Flexible deck configurations", "Multiple tie-down options", "Side rail kits (optional)", "Ramp or gate options"],
      sizeRange: "10' - 24' typical",
      considerations: "Think about your most common load and whether you want open sides or higher rails.",
    },
    landscape_trailer: {
      name: "Landscape Trailer",
      category: "Commercial Service Trailer",
      icon: "🌿",
      description:
        "Optimized for lawn/landscape operations with easy mower access and capacity for materials and debris.",
      idealFor: ["Zero-turn mowers", "Lawn equipment", "Landscape materials", "Debris removal"],
      keyFeatures: ["Low deck height for easy loading", "Side kits available", "Multiple axle configurations", "Gate or ramp access"],
      sizeRange: "8' - 24' typical",
      considerations: "Daily commercial use benefits from strong gate/ramp hardware and ample tie-down points.",
    },
    enclosed_trailer: {
      name: "Enclosed Cargo Trailer",
      category: "Protected Cargo Trailer",
      icon: "🔒",
      description:
        "Fully enclosed for weather protection, security, and a more professional appearance for valuable cargo.",
      idealFor: ["Tools and equipment", "Motorsports", "Mobile businesses", "Valuable cargo"],
      keyFeatures: ["Weather sealing", "Lockable entry doors", "Interior lighting options", "Ventilation options"],
      sizeRange: "12' - 24' typical",
      considerations: "Interior height matters. Choose ramp vs barn doors based on how you load most often.",
    },
    stock_trailer: {
      name: "Stock / Livestock Trailer",
      category: "Animal Transport Trailer",
      icon: "🐴",
      description:
        "Designed for safe animal transport with ventilation and appropriate flooring and divider options.",
      idealFor: ["Cattle", "Horses", "Sheep and goats", "Show animals"],
      keyFeatures: ["Ventilated sides", "Non-slip flooring", "Divider gates", "Escape doors"],
      sizeRange: "12' - 24' typical",
      considerations: "Animal safety is paramount—size, ventilation, and secure gating are the priorities.",
    },
    powersports_trailer: {
      name: "Powersports / Recreation Trailer",
      category: "Recreational Vehicle Trailer",
      icon: "🏍️",
      description:
        "Designed to secure powersports vehicles with the right tie-down approach and deck space for your mix.",
      idealFor: ["Motorcycles", "UTVs or ATVs", "Snowmobiles", "Personal watercraft"],
      keyFeatures: ["Wheel chocks/channels (optional)", "Low deck profile", "Multiple vehicle capacity", "Tie-down flexibility"],
      sizeRange: "10' - 30' typical",
      considerations: "Match deck length to your vehicle combination and decide if you want open vs enclosed protection.",
    },
  };

  const getRecommendation = () => {
    const { primaryUse, frequency, towVehicle, terrain, priority, materialPref } = selections;

    let recommendedType = trailerTypes.utility_trailer;
    let sizeRecommendation = "14' - 18'";
    let additionalNotes = [];

    // --- type recommendation ---
    switch (primaryUse) {
      case "equipment":
        recommendedType = trailerTypes.equipment_hauler;
        sizeRecommendation = frequency === "daily" || frequency === "weekly" ? "20' - 24'" : "18' - 20'";
        break;
      case "vehicles":
        recommendedType = trailerTypes.car_hauler;
        sizeRecommendation = "18' - 20'";
        break;
      case "landscape":
        recommendedType = trailerTypes.landscape_trailer;
        sizeRecommendation = frequency === "daily" ? "16' - 18'" : "12' - 16'";
        break;
      case "livestock":
        recommendedType = trailerTypes.stock_trailer;
        sizeRecommendation = "14' - 20'";
        break;
      case "enclosed":
        recommendedType = trailerTypes.enclosed_trailer;
        sizeRecommendation = frequency === "daily" || frequency === "weekly" ? "16' - 20'" : "12' - 16'";
        break;
      case "powersports":
        recommendedType = trailerTypes.powersports_trailer;
        sizeRecommendation = frequency === "daily" || frequency === "weekly" ? "14' - 20'" : "10' - 14'";
        break;
      case "other":
        recommendedType = trailerTypes.utility_trailer;
        sizeRecommendation = "14' - 18'";
        additionalNotes.push("Tell us what you're hauling and we’ll match you to the best-fit trailer type.");
        break;
      case "general":
      default:
        recommendedType = trailerTypes.utility_trailer;
        sizeRecommendation = frequency === "occasional" ? "10' - 14'" : "14' - 18'";
        break;
    }

    // --- neutral environment note (no forced aluminum) ---
    if (terrain === "coastal") {
      additionalNotes.push("Coastal / salt exposure: prioritize corrosion resistance and plan for maintenance (material choice matters here).");
    }
    if (terrain === "offroad") {
      additionalNotes.push("Frequent off-road: prioritize frame strength, deck support, and quality suspension/tires.");
    }

    // --- priority notes (neutral wording) ---
    if (priority?.includes("weight")) {
      additionalNotes.push("Weight savings matters: a lighter trailer can improve towing comfort and help stay within ratings (depending on build).");
    }
    if (priority?.includes("durability")) {
      additionalNotes.push("Durability matters: prioritize a strong frame design, quality welds, and proven components.");
    }
    if (priority?.includes("resale")) {
      additionalNotes.push("Resale matters: well-maintained trailers with quality construction and brand reputation often hold value better.");
    }
    if (priority?.includes("lowmaint")) {
      additionalNotes.push("Low maintenance matters: choose materials/finishes/components that reduce rust, repainting, and frequent service.");
    }

    // --- tow vehicle note ---
    if (towVehicle === "halfton" || towVehicle === "suv") {
      additionalNotes.push("Tow vehicle: staying within payload and towing limits is key—choose GVWR and empty weight carefully.");
      if (primaryUse === "equipment") {
        sizeRecommendation = "16' - 18'";
        additionalNotes.push("Equipment + half-ton/SUV: consider a smaller size or lighter setup to stay within limits when loaded.");
      }
    }

    if (frequency === "daily") {
      additionalNotes.push("Daily use: prioritize durability, good tie-downs, and the right ramp/loading setup.");
    }

    // --- MATERIAL recommendation (NEW) ---
    let materialRecommendation = "Either Aluminum or Steel";
    let materialReasons = [];

    if (materialPref === "aluminum") {
      materialRecommendation = "Aluminum";
      materialReasons.push("You selected aluminum as your preference.");
    } else if (materialPref === "steel") {
      materialRecommendation = "Steel";
      materialReasons.push("You selected steel as your preference.");
    } else {
      // either/no preference
      const wantsWeight = priority?.includes("weight");
      const wantsResale = priority?.includes("resale");
      const coastal = terrain === "coastal";

      if (coastal) {
        materialRecommendation = "Aluminum (recommended), Steel (possible with extra care)";
        materialReasons.push("Salt exposure increases corrosion risk—aluminum is often preferred for longevity in these conditions.");
      } else if (wantsWeight || wantsResale) {
        materialRecommendation = "Aluminum (recommended), Steel (acceptable)";
        if (wantsWeight) materialReasons.push("Weight savings is a top priority—aluminum is often lighter depending on the build.");
        if (wantsResale) materialReasons.push("Resale value is a priority—aluminum often holds value well in many markets.");
      } else {
        materialRecommendation = "Either Aluminum or Steel";
        materialReasons.push("Your answers don’t require one material—choose based on budget, availability, and preferred features.");
      }
    }

    return {
      type: recommendedType,
      sizeRecommendation,
      additionalNotes,
      materialRecommendation,
      materialReasons,
    };
  };

  const handleSelect = (questionId, value) => {
    const q = questions.find((x) => x.id === questionId);

    setSelections((prev) => {
      if (q?.multi) {
        const current = Array.isArray(prev[questionId]) ? prev[questionId] : [];
        const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
        return { ...prev, [questionId]: next };
      }
      return { ...prev, [questionId]: value };
    });
  };

  const handleNext = () => {
    if (step < questions.length - 1) setStep(step + 1);
    else setShowResults(true);
  };

  const handleBack = () => {
    if (showResults) setShowResults(false);
    else if (step > 0) setStep(step - 1);
  };

  const handleReset = () => {
    setSelections({
      primaryUse: null,
      frequency: null,
      towVehicle: null,
      terrain: null,
      materialPref: null, // ✅ NEW reset
      priority: [],
    });
    setStep(0);
    setShowResults(false);
  };

  const currentQuestion = questions[step];
  const currentSelection = selections[currentQuestion?.id];

  const isAnswered = currentQuestion?.multi
    ? Array.isArray(currentSelection) && currentSelection.length > 0
    : !!currentSelection;

  const recommendation = getRecommendation();

  // ✅ Format usage profile value (multi-safe)
  const getProfileLabel = (question, value) => {
    if (!question) return "";
    if (question.multi && Array.isArray(value)) {
      return value
        .map((v) => question.options.find((o) => o.value === v)?.label)
        .filter(Boolean)
        .join(", ");
    }
    return question.options.find((o) => o.value === value)?.label || "";
  };

  const year = new Date().getFullYear();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#fafafa",
        fontFamily: "'Inter', -apple-system, sans-serif",
        color: "#1a1a1a",
      }}
    >
      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e5e5e5", padding: "20px 24px" }}>
        <div
          style={{
            maxWidth: "800px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "11px",
                fontWeight: "700",
                letterSpacing: "1.5px",
                color: "#d97706",
                textTransform: "uppercase",
                marginBottom: "4px",
              }}
            >
              NOVAE TRAILERS
            </div>
            <div style={{ fontSize: "18px", fontWeight: "600", color: "#1a1a1a" }}>
              Trailer Selection System
            </div>
          </div>

          {(step > 0 || showResults) && (
            <button
              type="button"
              onClick={handleReset}
              style={{
                padding: "8px 16px",
                background: "transparent",
                border: "1px solid #e5e5e5",
                borderRadius: "6px",
                fontSize: "13px",
                color: "#666",
                cursor: "pointer",
              }}
            >
              Start Over
            </button>
          )}
        </div>
      </div>

      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 24px" }}>
        {!showResults ? (
          <>
            {/* Progress bar */}
            <div style={{ marginBottom: "40px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ fontSize: "13px", color: "#666" }}>
                  Question {step + 1} of {questions.length}
                </span>
                <span style={{ fontSize: "13px", color: "#666" }}>
                  {Math.round(((step + 1) / questions.length) * 100)}% Complete
                </span>
              </div>
              <div style={{ height: "4px", background: "#e5e5e5", borderRadius: "2px", overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%",
                    width: `${((step + 1) / questions.length) * 100}%`,
                    background: "linear-gradient(90deg, #d97706, #f59e0b)",
                    borderRadius: "2px",
                    transition: "width 0.3s ease",
                  }}
                />
              </div>
            </div>

            {/* Question */}
            <div style={{ marginBottom: "32px" }}>
              <h1
                style={{
                  fontSize: "clamp(24px, 4vw, 32px)",
                  fontWeight: "600",
                  margin: "0 0 8px 0",
                  color: "#1a1a1a",
                }}
              >
                {currentQuestion.title}
              </h1>
              <p style={{ fontSize: "16px", color: "#666", margin: 0 }}>{currentQuestion.subtitle}</p>
            </div>

            {/* Options */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "12px",
                marginBottom: "32px",
              }}
            >
              {currentQuestion.options.map((option) => {
                const selected = isOptionSelected(currentQuestion, option.value);

                return (
                  <button
                    type="button"
                    key={option.value}
                    onClick={() => handleSelect(currentQuestion.id, option.value)}
                    style={{
                      padding: "20px",
                      background: selected ? "#fffbeb" : "#fff",
                      border: `2px solid ${selected ? "#d97706" : "#e5e5e5"}`,
                      borderRadius: "12px",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.2s ease",
                      position: "relative",
                    }}
                  >
                    {selected && (
                      <div
                        style={{
                          position: "absolute",
                          top: "12px",
                          right: "12px",
                          width: "24px",
                          height: "24px",
                          background: "#d97706",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#fff",
                          fontSize: "14px",
                        }}
                      >
                        ✓
                      </div>
                    )}
                    <div style={{ fontSize: "24px", marginBottom: "12px" }}>{option.icon}</div>
                    <div style={{ fontSize: "16px", fontWeight: "600", color: "#1a1a1a", marginBottom: "4px" }}>
                      {option.label}
                    </div>
                    <div style={{ fontSize: "14px", color: "#666", lineHeight: "1.4" }}>{option.desc}</div>
                  </button>
                );
              })}
            </div>

            {/* Navigation */}
            <div style={{ display: "flex", gap: "12px" }}>
              {step > 0 && (
                <button
                  type="button"
                  onClick={handleBack}
                  style={{
                    padding: "14px 24px",
                    background: "#fff",
                    border: "1px solid #e5e5e5",
                    borderRadius: "8px",
                    fontSize: "15px",
                    color: "#666",
                    cursor: "pointer",
                  }}
                >
                  ← Back
                </button>
              )}

              <button
                type="button"
                onClick={handleNext}
                disabled={!isAnswered}
                style={{
                  flex: 1,
                  padding: "14px 24px",
                  background: isAnswered ? "linear-gradient(135deg, #d97706 0%, #b45309 100%)" : "#e5e5e5",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "15px",
                  fontWeight: "600",
                  color: isAnswered ? "#fff" : "#999",
                  cursor: isAnswered ? "pointer" : "not-allowed",
                  transition: "all 0.2s ease",
                }}
              >
                {step < questions.length - 1 ? "Continue →" : "See My Recommendation →"}
              </button>
            </div>
          </>
        ) : (
          /* Results */
          <div style={{ animation: "fadeIn 0.4s ease" }}>
            <div
              style={{
                background: "#fff",
                border: "1px solid #e5e5e5",
                borderRadius: "16px",
                overflow: "hidden",
                marginBottom: "24px",
              }}
            >
              <div
                style={{
                  background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
                  padding: "32px",
                  color: "#fff",
                }}
              >
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: "600",
                    letterSpacing: "1.5px",
                    textTransform: "uppercase",
                    color: "#f59e0b",
                    marginBottom: "12px",
                  }}
                >
                  RECOMMENDED TRAILER TYPE
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <div style={{ fontSize: "48px" }}>{recommendation.type.icon}</div>
                  <div>
                    <h2 style={{ fontSize: "clamp(24px, 5vw, 32px)", fontWeight: "700", margin: "0 0 4px 0" }}>
                      {recommendation.type.name}
                    </h2>
                    <div style={{ fontSize: "16px", color: "#999" }}>{recommendation.type.category}</div>
                  </div>
                </div>
              </div>

              <div style={{ padding: "32px" }}>
                <p style={{ fontSize: "16px", lineHeight: "1.7", color: "#333", margin: "0 0 24px 0" }}>
                  {recommendation.type.description}
                </p>

                {/* Size recommendation */}
                <div
                  style={{
                    background: "#f0f9ff",
                    border: "1px solid #bae6fd",
                    borderRadius: "10px",
                    padding: "16px 20px",
                    marginBottom: "16px",
                  }}
                >
                  <div style={{ fontSize: "13px", fontWeight: "600", color: "#0369a1", marginBottom: "4px" }}>
                    Recommended Size Range
                  </div>
                  <div style={{ fontSize: "20px", fontWeight: "700", color: "#0c4a6e" }}>
                    {recommendation.sizeRecommendation}
                  </div>
                </div>

                {/* ✅ Material recommendation */}
                <div
                  style={{
                    background: "#f9fafb",
                    border: "1px solid #e5e7eb",
                    borderRadius: "10px",
                    padding: "16px 20px",
                    marginBottom: "24px",
                  }}
                >
                  <div style={{ fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "4px" }}>
                    Recommended Material
                  </div>
                  <div style={{ fontSize: "18px", fontWeight: "800", color: "#111827" }}>
                    {recommendation.materialRecommendation}
                  </div>
                  {!!recommendation.materialReasons?.length && (
                    <div style={{ marginTop: 8, fontSize: 14, color: "#4b5563", lineHeight: 1.5 }}>
                      {recommendation.materialReasons.join(" ")}
                    </div>
                  )}
                </div>

                {recommendation.additionalNotes.length > 0 && (
                  <div style={{ background: "#f9fafb", borderRadius: "12px", padding: "20px" }}>
                    <div style={{ fontSize: "13px", fontWeight: "600", color: "#666", marginBottom: "12px" }}>
                      Based on Your Selections:
                    </div>
                    {recommendation.additionalNotes.map((note, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "12px",
                          marginBottom: i < recommendation.additionalNotes.length - 1 ? "12px" : 0,
                        }}
                      >
                        <div
                          style={{
                            width: "6px",
                            height: "6px",
                            background: "#d97706",
                            borderRadius: "50%",
                            flexShrink: 0,
                            marginTop: "7px",
                          }}
                        />
                        <span style={{ fontSize: "14px", color: "#333", lineHeight: "1.5" }}>{note}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Usage profile */}
            <div
              style={{
                background: "#fff",
                border: "1px solid #e5e5e5",
                borderRadius: "12px",
                padding: "24px",
                marginBottom: "24px",
              }}
            >
              <h3
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  color: "#999",
                  marginBottom: "16px",
                }}
              >
                Your Usage Profile
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                  gap: "16px",
                }}
              >
                {Object.entries(selections).map(([key, value]) => {
                  const question = questions.find((q) => q.id === key);
                  const label = getProfileLabel(question, value);
                  return (
                    <div key={key}>
                      <div style={{ fontSize: "12px", color: "#999", marginBottom: "4px" }}>
                        {question?.title?.replace("?", "")}
                      </div>
                      <div style={{ fontSize: "14px", fontWeight: "500", color: "#333" }}>{label}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CTA */}
            <div
              style={{
                background: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",
                border: "1px solid #fcd34d",
                borderRadius: "12px",
                padding: "32px",
                textAlign: "center",
              }}
            >
              <h3 style={{ fontSize: "20px", fontWeight: "600", margin: "0 0 8px 0", color: "#1a1a1a" }}>
                Ready to Explore {recommendation.type.name}s?
              </h3>
              <p style={{ fontSize: "15px", color: "#666", margin: "0 0 24px 0" }}>
                Check availability with a local dealer near you.
              </p>

              {/* ✅ FIXED: use styled <a> (no button inside anchor) */}
              <a
                href="https://app.christianbusinessentrepreneur.com/v2/preview/Urf6oVVTJKH1icODwuSo?notrack=true"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-block",
                  padding: "16px 32px",
                  background: "linear-gradient(135deg, #d97706 0%, #b45309 100%)",
                  borderRadius: "8px",
                  fontSize: "15px",
                  fontWeight: "600",
                  color: "#fff",
                  cursor: "pointer",
                  marginRight: "12px",
                  textDecoration: "none",
                  border: "none",
                }}
              >
                Find Local Availability
              </a>

              <button
                type="button"
                onClick={handleReset}
                style={{
                  padding: "16px 24px",
                  background: "#fff",
                  border: "1px solid #e5e5e5",
                  borderRadius: "8px",
                  fontSize: "15px",
                  color: "#666",
                  cursor: "pointer",
                }}
              >
                Try Different Options
              </button>
            </div>
          </div>
        )}

        {/* ✅ Footer (Powered by / Copyright) */}
        <div
          style={{
            textAlign: "center",
            marginTop: "56px",
            paddingTop: "22px",
            borderTop: "1px solid #e5e5e5",
            fontSize: "12px",
            color: "#9ca3af",
            lineHeight: "1.6",
          }}
        >
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <span>Powered by</span>
            <a
              href="https://nextlevelworldwide.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#2563eb", fontWeight: "700", textDecoration: "none" }}
            >
              Next Level Consulting
            </a>
          </div>

          <div style={{ marginTop: "6px", fontSize: "11px", opacity: 0.8 }}>
            © {year} Next Level Consulting. All rights reserved.
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        button:hover { transform: translateY(-1px); }
      `}</style>
    </div>
  );
};

export default TrailerSelectionSystem;

