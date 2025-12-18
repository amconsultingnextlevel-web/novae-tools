"use client";


import React, { useState, useEffect } from 'react';

const TotalCostCalculator = () => {
  const [step, setStep] = useState(1);
  const [showResults, setShowResults] = useState(false);
  const [animateResults, setAnimateResults] = useState(false);
  
  const [inputs, setInputs] = useState({
    annualMiles: 5000,
    yearsOwnership: 10,
    fuelCost: 3.50,
    corrosionExposure: 'moderate',
    cargoType: 'equipment',
    trailerLength: '20',
    aluminumPrice: 8500
  });

  const corrosionMultipliers = {
    low: { steel: 1.0, label: 'Low (Dry Climate, Covered Storage)' },
    moderate: { steel: 1.5, label: 'Moderate (Mixed Climate, Some Exposure)' },
    high: { steel: 2.2, label: 'High (Salt, Humidity, Coastal)' },
    severe: { steel: 3.0, label: 'Severe (Daily Salt/Chemical Exposure)' }
  };

  // Generate trailer lengths from 10' to 30'
  const trailerLengths = [];
  for (let i = 10; i <= 30; i++) {
    trailerLengths.push(i.toString());
  }

  // Calculate estimated steel price based on aluminum price (typically 55-65% of aluminum)
  const calculateSteelPrice = (aluminumPrice, length) => {
    const baseRatio = 0.60; // Steel is typically 60% of aluminum price
    const lengthFactor = parseInt(length) / 20; // Normalize around 20' as baseline
    return Math.round(aluminumPrice * baseRatio * (0.9 + (lengthFactor * 0.1)));
  };

  const calculateCosts = () => {
    const aluminumPrice = inputs.aluminumPrice;
    const steelPrice = calculateSteelPrice(aluminumPrice, inputs.trailerLength);
    const years = inputs.yearsOwnership;
    const miles = inputs.annualMiles;
    const fuelPrice = inputs.fuelCost;
    const corrosionMult = corrosionMultipliers[inputs.corrosionExposure].steel;
    const lengthFactor = parseInt(inputs.trailerLength) / 20; // Normalize costs by length

    // Steel calculations
    const steelPurchase = steelPrice;
    const steelWeightPenalty = 600 + (parseInt(inputs.trailerLength) * 15); // Weight difference scales with length
    const steelFuelPenalty = (miles * years * steelWeightPenalty * 0.00004 * fuelPrice);
    const steelMaintenance = (120 * years * corrosionMult * lengthFactor); // Annual rust prevention, touch-up
    const steelRepairs = corrosionMult > 1.5 
      ? (years > 5 ? 1500 * lengthFactor : 500 * lengthFactor) 
      : (years > 7 ? 1000 * lengthFactor : 250 * lengthFactor);
    const steelFloorReplacement = years >= 7 ? (800 * lengthFactor) : 0; // Wood floor replacement
    const steelResale = years >= 10 
      ? steelPurchase * 0.15 
      : steelPurchase * (0.5 - (years * 0.035));
    const steelTotal = steelPurchase + steelFuelPenalty + steelMaintenance + steelRepairs + steelFloorReplacement - Math.max(0, steelResale);

    // Aluminum calculations
    const aluminumPurchase = aluminumPrice;
    const aluminumFuelSavings = 0; // baseline
    const aluminumMaintenance = (35 * years); // Minimal maintenance
    const aluminumRepairs = years > 8 ? 350 : 100;
    const aluminumResale = years >= 10 
      ? aluminumPurchase * 0.45 
      : aluminumPurchase * (0.75 - (years * 0.03));
    const aluminumTotal = aluminumPurchase + aluminumMaintenance + aluminumRepairs - Math.max(0, aluminumResale);

    return {
      steel: {
        purchase: steelPurchase,
        fuel: Math.round(steelFuelPenalty),
        maintenance: Math.round(steelMaintenance),
        repairs: Math.round(steelRepairs),
        floorReplacement: Math.round(steelFloorReplacement),
        resale: Math.round(Math.max(0, steelResale)),
        total: Math.round(steelTotal)
      },
      aluminum: {
        purchase: aluminumPurchase,
        fuel: 0,
        maintenance: Math.round(aluminumMaintenance),
        repairs: aluminumRepairs,
        resale: Math.round(Math.max(0, aluminumResale)),
        total: Math.round(aluminumTotal)
      },
      savings: Math.round(steelTotal - aluminumTotal),
      priceDifference: aluminumPrice - steelPrice,
      yearsToBreakeven: Math.ceil((aluminumPrice - steelPrice) / ((steelFuelPenalty + steelMaintenance + steelRepairs + steelFloorReplacement) / years))
    };
  };

  const handleInputChange = (field, value) => {
    setInputs(prev => ({ ...prev, [field]: value }));
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

  const results = calculateCosts();

  const formatCurrency = (num) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(num);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(165deg, #0a0f1a 0%, #1a1f2e 50%, #0d1117 100%)',
      fontFamily: "'IBM Plex Sans', -apple-system, sans-serif",
      color: '#e8eaed',
      padding: '40px 20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Subtle grid background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(59, 130, 246, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(59, 130, 246, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
        pointerEvents: 'none'
      }} />

      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{
            display: 'inline-block',
            padding: '8px 16px',
            background: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: '600',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            color: '#f59e0b',
            marginBottom: '20px'
          }}>
            ALUMA TRAILERS
          </div>
          <h1 style={{
            fontSize: 'clamp(28px, 5vw, 42px)',
            fontWeight: '300',
            margin: '0 0 16px 0',
            letterSpacing: '-0.5px',
            lineHeight: '1.2'
          }}>
            Total Cost of Ownership
            <span style={{ display: 'block', fontWeight: '600', color: '#3b82f6' }}>Calculator</span>
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#9ca3af',
            maxWidth: '500px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            The cheapest trailer is rarely the least expensive. Calculate what your next trailer will actually cost over its lifetime.
          </p>
        </div>

        {!showResults ? (
          <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '16px',
            padding: 'clamp(24px, 5vw, 40px)',
            backdropFilter: 'blur(10px)'
          }}>
            {/* Progress indicator */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '8px',
              marginBottom: '40px'
            }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{
                  width: i === step ? '32px' : '8px',
                  height: '8px',
                  borderRadius: '4px',
                  background: i <= step ? '#3b82f6' : 'rgba(255,255,255,0.1)',
                  transition: 'all 0.3s ease'
                }} />
              ))}
            </div>

            {step === 1 && (
              <div style={{ animation: 'fadeIn 0.3s ease' }}>
                <h2 style={{ fontSize: '20px', fontWeight: '500', marginBottom: '8px', textAlign: 'center' }}>
                  Trailer Configuration
                </h2>
                <p style={{ color: '#9ca3af', fontSize: '14px', textAlign: 'center', marginBottom: '32px' }}>
                  Tell us about the trailer you're considering
                </p>

                <div style={{ display: 'grid', gap: '24px' }}>
                  {/* Trailer Length Dropdown */}
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '8px', color: '#d1d5db' }}>
                      Trailer Length
                    </label>
                    <select
                      value={inputs.trailerLength}
                      onChange={(e) => handleInputChange('trailerLength', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        color: '#e8eaed',
                        fontSize: '15px',
                        cursor: 'pointer',
                        appearance: 'none',
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%239ca3af' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10l-5 5z'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 16px center'
                      }}
                    >
                      {trailerLengths.map(length => (
                        <option key={length} value={length} style={{ background: '#1a1f2e', color: '#e8eaed' }}>
                          {length}' ({length} feet)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Aluminum Price Input */}
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '8px', color: '#d1d5db' }}>
                      Aluminum Trailer Price You're Considering
                    </label>
                    <div style={{ position: 'relative' }}>
                      <span style={{
                        position: 'absolute',
                        left: '16px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#9ca3af',
                        fontSize: '15px'
                      }}>$</span>
                      <input
                        type="number"
                        value={inputs.aluminumPrice}
                        onChange={(e) => handleInputChange('aluminumPrice', parseInt(e.target.value) || 0)}
                        min="3000"
                        max="50000"
                        step="100"
                        style={{
                          width: '100%',
                          padding: '14px 16px 14px 32px',
                          background: 'rgba(255,255,255,0.02)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '8px',
                          color: '#e8eaed',
                          fontSize: '15px',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                    <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '6px' }}>
                      Enter the price of the aluminum trailer you're evaluating
                    </p>
                  </div>

                  {/* Cargo Type */}
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '8px', color: '#d1d5db' }}>
                      What will you haul?
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                      {[
                        { value: 'equipment', label: 'Equipment / Machinery' },
                        { value: 'vehicles', label: 'Vehicles / UTVs' },
                        { value: 'landscape', label: 'Landscape Materials' },
                        { value: 'general', label: 'General Cargo' }
                      ].map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => handleInputChange('cargoType', opt.value)}
                          style={{
                            padding: '14px 16px',
                            background: inputs.cargoType === opt.value ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255,255,255,0.02)',
                            border: `1px solid ${inputs.cargoType === opt.value ? '#3b82f6' : 'rgba(255,255,255,0.08)'}`,
                            borderRadius: '8px',
                            color: inputs.cargoType === opt.value ? '#3b82f6' : '#9ca3af',
                            cursor: 'pointer',
                            fontSize: '14px',
                            textAlign: 'left',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setStep(2)}
                  style={{
                    width: '100%',
                    marginTop: '32px',
                    padding: '16px',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                  }}
                >
                  Continue →
                </button>
              </div>
            )}

            {step === 2 && (
              <div style={{ animation: 'fadeIn 0.3s ease' }}>
                <h2 style={{ fontSize: '20px', fontWeight: '500', marginBottom: '8px', textAlign: 'center' }}>
                  Operating Conditions
                </h2>
                <p style={{ color: '#9ca3af', fontSize: '14px', textAlign: 'center', marginBottom: '32px' }}>
                  These factors significantly impact long-term costs
                </p>

                <div style={{ display: 'grid', gap: '28px' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <label style={{ fontSize: '13px', fontWeight: '500', color: '#d1d5db' }}>
                        Annual Miles Towed
                      </label>
                      <span style={{ fontSize: '18px', fontWeight: '600', color: '#3b82f6' }}>
                        {inputs.annualMiles.toLocaleString()}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1000"
                      max="20000"
                      step="500"
                      value={inputs.annualMiles}
                      onChange={(e) => handleInputChange('annualMiles', parseInt(e.target.value))}
                      style={{
                        width: '100%',
                        height: '8px',
                        background: `linear-gradient(to right, #3b82f6 ${(inputs.annualMiles - 1000) / 190}%, rgba(255,255,255,0.1) ${(inputs.annualMiles - 1000) / 190}%)`,
                        borderRadius: '4px',
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#6b7280', marginTop: '6px' }}>
                      <span>1,000</span>
                      <span>20,000</span>
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <label style={{ fontSize: '13px', fontWeight: '500', color: '#d1d5db' }}>
                        Years of Ownership
                      </label>
                      <span style={{ fontSize: '18px', fontWeight: '600', color: '#3b82f6' }}>
                        {inputs.yearsOwnership} years
                      </span>
                    </div>
                    <input
                      type="range"
                      min="3"
                      max="15"
                      step="1"
                      value={inputs.yearsOwnership}
                      onChange={(e) => handleInputChange('yearsOwnership', parseInt(e.target.value))}
                      style={{
                        width: '100%',
                        height: '8px',
                        background: `linear-gradient(to right, #3b82f6 ${(inputs.yearsOwnership - 3) / 12 * 100}%, rgba(255,255,255,0.1) ${(inputs.yearsOwnership - 3) / 12 * 100}%)`,
                        borderRadius: '4px',
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#6b7280', marginTop: '6px' }}>
                      <span>3 years</span>
                      <span>15 years</span>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '12px', color: '#d1d5db' }}>
                      Corrosion Exposure Level
                    </label>
                    <div style={{ display: 'grid', gap: '8px' }}>
                      {Object.entries(corrosionMultipliers).map(([key, val]) => (
                        <button
                          key={key}
                          onClick={() => handleInputChange('corrosionExposure', key)}
                          style={{
                            padding: '12px 16px',
                            background: inputs.corrosionExposure === key ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255,255,255,0.02)',
                            border: `1px solid ${inputs.corrosionExposure === key ? '#3b82f6' : 'rgba(255,255,255,0.08)'}`,
                            borderRadius: '8px',
                            color: inputs.corrosionExposure === key ? '#e8eaed' : '#9ca3af',
                            cursor: 'pointer',
                            fontSize: '13px',
                            textAlign: 'left',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          {val.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
                  <button
                    onClick={() => setStep(1)}
                    style={{
                      padding: '16px 24px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      color: '#9ca3af',
                      fontSize: '15px',
                      cursor: 'pointer'
                    }}
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    style={{
                      flex: 1,
                      padding: '16px',
                      background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '15px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Continue →
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div style={{ animation: 'fadeIn 0.3s ease' }}>
                <h2 style={{ fontSize: '20px', fontWeight: '500', marginBottom: '8px', textAlign: 'center' }}>
                  Current Fuel Cost
                </h2>
                <p style={{ color: '#9ca3af', fontSize: '14px', textAlign: 'center', marginBottom: '32px' }}>
                  Weight differences affect fuel consumption every mile
                </p>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <label style={{ fontSize: '13px', fontWeight: '500', color: '#d1d5db' }}>
                      Price per Gallon
                    </label>
                    <span style={{ fontSize: '24px', fontWeight: '600', color: '#3b82f6' }}>
                      ${inputs.fuelCost.toFixed(2)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="2.50"
                    max="6.00"
                    step="0.10"
                    value={inputs.fuelCost}
                    onChange={(e) => handleInputChange('fuelCost', parseFloat(e.target.value))}
                    style={{
                      width: '100%',
                      height: '8px',
                      background: `linear-gradient(to right, #3b82f6 ${(inputs.fuelCost - 2.5) / 3.5 * 100}%, rgba(255,255,255,0.1) ${(inputs.fuelCost - 2.5) / 3.5 * 100}%)`,
                      borderRadius: '4px',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#6b7280', marginTop: '6px' }}>
                    <span>$2.50</span>
                    <span>$6.00</span>
                  </div>
                </div>

                {/* Summary preview */}
                <div style={{
                  marginTop: '32px',
                  padding: '20px',
                  background: 'rgba(255,255,255,0.02)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.06)'
                }}>
                  <div style={{ fontSize: '12px', fontWeight: '500', color: '#6b7280', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Your Configuration
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', fontSize: '14px' }}>
                    <div><span style={{ color: '#6b7280' }}>Length:</span> <span style={{ color: '#e8eaed' }}>{inputs.trailerLength}'</span></div>
                    <div><span style={{ color: '#6b7280' }}>Aluminum Price:</span> <span style={{ color: '#e8eaed' }}>{formatCurrency(inputs.aluminumPrice)}</span></div>
                    <div><span style={{ color: '#6b7280' }}>Miles/Year:</span> <span style={{ color: '#e8eaed' }}>{inputs.annualMiles.toLocaleString()}</span></div>
                    <div><span style={{ color: '#6b7280' }}>Ownership:</span> <span style={{ color: '#e8eaed' }}>{inputs.yearsOwnership} years</span></div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
                  <button
                    onClick={() => setStep(2)}
                    style={{
                      padding: '16px 24px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      color: '#9ca3af',
                      fontSize: '15px',
                      cursor: 'pointer'
                    }}
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handleCalculate}
                    style={{
                      flex: 1,
                      padding: '16px',
                      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '15px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Calculate True Cost →
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div style={{
            opacity: animateResults ? 1 : 0,
            transform: animateResults ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.5s ease'
          }}>
            {/* Savings headline */}
            <div style={{
              textAlign: 'center',
              marginBottom: '40px',
              padding: '32px',
              background: results.savings > 0 
                ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.02) 100%)'
                : 'rgba(255,255,255,0.02)',
              border: `1px solid ${results.savings > 0 ? 'rgba(34, 197, 94, 0.3)' : 'rgba(255,255,255,0.06)'}`,
              borderRadius: '16px'
            }}>
              <div style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '8px' }}>
                Over {inputs.yearsOwnership} years, aluminum saves you
              </div>
              <div style={{
                fontSize: 'clamp(36px, 8vw, 56px)',
                fontWeight: '700',
                color: results.savings > 0 ? '#22c55e' : '#ef4444',
                letterSpacing: '-2px'
              }}>
                {formatCurrency(Math.abs(results.savings))}
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '8px' }}>
                Initial price difference: {formatCurrency(results.priceDifference)} | Breakeven: Year {results.yearsToBreakeven > 0 && results.yearsToBreakeven <= inputs.yearsOwnership ? results.yearsToBreakeven : 'N/A'}
              </div>
            </div>

            {/* Comparison table */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px',
              marginBottom: '32px'
            }}>
              {/* Steel column */}
              <div style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '12px',
                padding: '24px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  right: '0',
                  height: '3px',
                  background: '#6b7280'
                }} />
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#9ca3af', marginBottom: '20px' }}>
                  Steel Trailer
                </h3>
                <div style={{ display: 'grid', gap: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                    <span style={{ color: '#6b7280' }}>Purchase Price</span>
                    <span style={{ color: '#e8eaed' }}>{formatCurrency(results.steel.purchase)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                    <span style={{ color: '#6b7280' }}>Fuel Penalty</span>
                    <span style={{ color: '#ef4444' }}>+{formatCurrency(results.steel.fuel)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                    <span style={{ color: '#6b7280' }}>Maintenance</span>
                    <span style={{ color: '#ef4444' }}>+{formatCurrency(results.steel.maintenance)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                    <span style={{ color: '#6b7280' }}>Repairs</span>
                    <span style={{ color: '#ef4444' }}>+{formatCurrency(results.steel.repairs)}</span>
                  </div>
                  {results.steel.floorReplacement > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                      <span style={{ color: '#6b7280' }}>Floor Replacement</span>
                      <span style={{ color: '#ef4444' }}>+{formatCurrency(results.steel.floorReplacement)}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                    <span style={{ color: '#6b7280' }}>Resale Value</span>
                    <span style={{ color: '#22c55e' }}>−{formatCurrency(results.steel.resale)}</span>
                  </div>
                  <div style={{ 
                    borderTop: '1px solid rgba(255,255,255,0.1)', 
                    paddingTop: '14px', 
                    marginTop: '6px',
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    fontSize: '16px',
                    fontWeight: '600'
                  }}>
                    <span style={{ color: '#9ca3af' }}>True Cost</span>
                    <span style={{ color: '#e8eaed' }}>{formatCurrency(results.steel.total)}</span>
                  </div>
                </div>
              </div>

              {/* Aluminum column */}
              <div style={{
                background: 'rgba(59, 130, 246, 0.05)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                borderRadius: '12px',
                padding: '24px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  right: '0',
                  height: '3px',
                  background: 'linear-gradient(90deg, #3b82f6, #60a5fa)'
                }} />
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#3b82f6', marginBottom: '20px' }}>
                  Aluminum Trailer
                </h3>
                <div style={{ display: 'grid', gap: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                    <span style={{ color: '#6b7280' }}>Purchase Price</span>
                    <span style={{ color: '#e8eaed' }}>{formatCurrency(results.aluminum.purchase)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                    <span style={{ color: '#6b7280' }}>Fuel Penalty</span>
                    <span style={{ color: '#22c55e' }}>{formatCurrency(results.aluminum.fuel)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                    <span style={{ color: '#6b7280' }}>Maintenance</span>
                    <span style={{ color: '#e8eaed' }}>+{formatCurrency(results.aluminum.maintenance)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                    <span style={{ color: '#6b7280' }}>Repairs</span>
                    <span style={{ color: '#e8eaed' }}>+{formatCurrency(results.aluminum.repairs)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                    <span style={{ color: '#6b7280' }}>Resale Value</span>
                    <span style={{ color: '#22c55e' }}>−{formatCurrency(results.aluminum.resale)}</span>
                  </div>
                  <div style={{ 
                    borderTop: '1px solid rgba(59, 130, 246, 0.2)', 
                    paddingTop: '14px', 
                    marginTop: '6px',
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    fontSize: '16px',
                    fontWeight: '600'
                  }}>
                    <span style={{ color: '#9ca3af' }}>True Cost</span>
                    <span style={{ color: '#3b82f6' }}>{formatCurrency(results.aluminum.total)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Key insight */}
            <div style={{
              background: 'rgba(245, 158, 11, 0.08)',
              border: '1px solid rgba(245, 158, 11, 0.2)',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '32px'
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: 'rgba(245, 158, 11, 0.15)',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  fontSize: '20px'
                }}>
                  💡
                </div>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: '600', color: '#f59e0b', marginBottom: '6px' }}>
                    The Real Math
                  </div>
                  <p style={{ fontSize: '14px', color: '#d1d5db', lineHeight: '1.6', margin: 0 }}>
                    The steel trailer's {formatCurrency(results.steel.purchase)} purchase price grows to {formatCurrency(results.steel.total)} when you factor in corrosion maintenance, weight-related fuel costs, {results.steel.floorReplacement > 0 ? 'floor replacement, ' : ''}and depreciation. 
                    The aluminum trailer's higher upfront cost is offset by minimal maintenance, fuel savings, and significantly stronger resale value.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA section */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.02) 100%)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              borderRadius: '12px',
              padding: '32px',
              textAlign: 'center'
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>
                Ready to See Specific Models?
              </h3>
              <p style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '24px' }}>
                Explore Aluma's {inputs.trailerLength}' aluminum trailers built for operations like yours.
              </p>
              <button style={{
                padding: '16px 32px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                marginRight: '12px'
              }}>
                View {inputs.trailerLength}' Models
              </button>
              <button
                onClick={handleReset}
                style={{
                  padding: '16px 24px',
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                  color: '#9ca3af',
                  fontSize: '15px',
                  cursor: 'pointer'
                }}
              >
                Recalculate
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ 
          textAlign: 'center', 
          marginTop: '48px', 
          fontSize: '12px', 
          color: '#6b7280' 
        }}>
          <p style={{ margin: '0 0 8px 0' }}>
            Calculations based on industry averages and typical ownership patterns.
          </p>
          <p style={{ margin: 0 }}>
            Actual costs vary based on usage, storage conditions, and maintenance practices.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 20px;
          height: 20px;
          background: #3b82f6;
          border-radius: 50%;
          cursor: pointer;
          border: 3px solid #1a1f2e;
        }
        input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: #3b82f6;
          border-radius: 50%;
          cursor: pointer;
          border: 3px solid #1a1f2e;
        }
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

export default TotalCostCalculator;
