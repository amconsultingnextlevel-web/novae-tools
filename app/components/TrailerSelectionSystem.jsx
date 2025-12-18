"use client";


import React, { useState } from 'react';

const TrailerSelectionSystem = () => {
  const [step, setStep] = useState(0);
  const [selections, setSelections] = useState({
    primaryUse: null,
    frequency: null,
    towVehicle: null,
    terrain: null,
    priority: null
  });
  const [showResults, setShowResults] = useState(false);

  const questions = [
    {
      id: 'primaryUse',
      title: 'What will you primarily haul?',
      subtitle: 'Select the category that best describes your typical loads',
      options: [
        { value: 'equipment', label: 'Heavy Equipment', desc: 'Skid steers, mini excavators, forklifts', icon: '🏗️' },
        { value: 'vehicles', label: 'Vehicles & Powersports', desc: 'Cars, UTVs, ATVs, motorcycles', icon: '🏎️' },
        { value: 'landscape', label: 'Landscape & Materials', desc: 'Mowers, mulch, debris, tools', icon: '🌿' },
        { value: 'livestock', label: 'Livestock & Agriculture', desc: 'Animals, hay, farm equipment', icon: '🐴' },
        { value: 'general', label: 'General Cargo', desc: 'Mixed loads, furniture, supplies', icon: '📦' },
        { value: 'enclosed', label: 'Protected Cargo', desc: 'Weather-sensitive, secured items', icon: '🔒' }
      ]
    },
    {
      id: 'frequency',
      title: 'How often will you haul?',
      subtitle: 'Usage frequency impacts which features matter most',
      options: [
        { value: 'daily', label: 'Daily', desc: 'Commercial or business use', icon: '📅' },
        { value: 'weekly', label: 'Several Times Weekly', desc: 'Regular work or farm use', icon: '🔄' },
        { value: 'monthly', label: 'Few Times Monthly', desc: 'Project-based or seasonal', icon: '📆' },
        { value: 'occasional', label: 'Occasionally', desc: 'Personal or weekend use', icon: '🌤️' }
      ]
    },
    {
      id: 'towVehicle',
      title: 'What\'s your tow vehicle?',
      subtitle: 'This determines safe weight limits and tongue weight capacity',
      options: [
        { value: 'halfton', label: 'Half-Ton Truck', desc: 'F-150, Silverado 1500, RAM 1500', icon: '🛻' },
        { value: 'threequarter', label: '3/4-Ton Truck', desc: 'F-250, Silverado 2500, RAM 2500', icon: '🚛' },
        { value: 'oneton', label: 'One-Ton Truck', desc: 'F-350, Silverado 3500, RAM 3500', icon: '💪' },
        { value: 'suv', label: 'SUV or Midsize', desc: 'Tahoe, Expedition, midsize trucks', icon: '🚙' },
        { value: 'commercial', label: 'Commercial Vehicle', desc: 'Medium-duty trucks, CDL vehicles', icon: '🚚' }
      ]
    },
    {
      id: 'terrain',
      title: 'Where will you operate?',
      subtitle: 'Environment affects corrosion exposure and durability needs',
      options: [
        { value: 'highway', label: 'Primarily Highway', desc: 'Paved roads, minimal off-road', icon: '🛣️' },
        { value: 'mixed', label: 'Mixed Use', desc: 'Roads plus jobsites or farms', icon: '🔀' },
        { value: 'offroad', label: 'Frequent Off-Road', desc: 'Construction sites, fields, trails', icon: '🏔️' },
        { value: 'coastal', label: 'Coastal / Salt Exposure', desc: 'Beach access, salt-treated roads', icon: '🌊' }
      ]
    },
    {
      id: 'priority',
      title: 'What matters most to you?',
      subtitle: 'Choose your primary decision factor',
      options: [
        { value: 'durability', label: 'Long-Term Durability', desc: 'Built to last 15+ years', icon: '🛡️' },
        { value: 'weight', label: 'Weight Savings', desc: 'Maximize payload, reduce fuel', icon: '⚖️' },
        { value: 'versatility', label: 'Versatility', desc: 'Handle multiple load types', icon: '🔧' },
        { value: 'lowmaint', label: 'Low Maintenance', desc: 'Minimal upkeep required', icon: '✨' },
        { value: 'resale', label: 'Resale Value', desc: 'Retain value over time', icon: '💰' }
      ]
    }
  ];

  // Trailer TYPE recommendations (categories, not specific models)
  const trailerTypes = {
    equipment_hauler: {
      name: 'Equipment Hauler',
      category: 'Heavy-Duty Open Trailer',
      icon: '🏗️',
      description: 'Designed for loading and transporting heavy machinery with drive-over fenders, heavy-duty ramps, and reinforced decking.',
      idealFor: ['Skid steers', 'Mini excavators', 'Forklifts', 'Compact equipment'],
      keyFeatures: ['Drive-over fenders for wide loads', 'Heavy-duty ramps (standalone or bifold)', 'Reinforced deck for concentrated loads', 'Higher GVWR ratings'],
      sizeRange: '18\' - 24\' typical',
      considerations: 'Look for models with adjustable tie-down positions and adequate ramp weight capacity for your heaviest equipment.'
    },
    car_hauler: {
      name: 'Car Hauler',
      category: 'Vehicle Transport Trailer',
      icon: '🚗',
      description: 'Purpose-built for safe vehicle transport with low deck angles, secure tie-down systems, and appropriate deck width.',
      idealFor: ['Cars and trucks', 'Classic vehicles', 'Project vehicles', 'Dealer transport'],
      keyFeatures: ['Low load angle for vehicle clearance', 'Integrated tie-down points', 'Full-width deck options', 'Optional winch mount'],
      sizeRange: '16\' - 22\' typical',
      considerations: 'Ensure deck width accommodates your widest vehicle and ramp angle works with low-clearance vehicles.'
    },
    utility_trailer: {
      name: 'Utility Trailer',
      category: 'General Purpose Open Trailer',
      icon: '🔧',
      description: 'Versatile platform for diverse hauling needs from recreational vehicles to work equipment and general cargo.',
      idealFor: ['UTVs and ATVs', 'Motorcycles', 'General cargo', 'Home projects'],
      keyFeatures: ['Versatile deck configuration', 'Multiple tie-down options', 'Available side rail kits', 'Ramp or gate options'],
      sizeRange: '10\' - 18\' typical',
      considerations: 'Consider your most common load type and whether side rails or an open deck better serves your needs.'
    },
    landscape_trailer: {
      name: 'Landscape Trailer',
      category: 'Commercial Service Trailer',
      icon: '🌿',
      description: 'Optimized for landscape and lawn care operations with easy mower access, debris capacity, and crew efficiency.',
      idealFor: ['Zero-turn mowers', 'Lawn equipment', 'Landscape materials', 'Debris removal'],
      keyFeatures: ['Low deck height for easy loading', 'Mesh or solid side options', 'Trimmer racks and tool storage', 'Gate or ramp access'],
      sizeRange: '12\' - 18\' typical',
      considerations: 'Daily commercial use demands durable construction. Consider gate width for your largest mower.'
    },
    enclosed_trailer: {
      name: 'Enclosed Cargo Trailer',
      category: 'Protected Cargo Trailer',
      icon: '🔒',
      description: 'Fully enclosed for weather protection, security, and professional appearance for valuable or sensitive cargo.',
      idealFor: ['Tools and equipment', 'Motorsports', 'Mobile businesses', 'Valuable cargo'],
      keyFeatures: ['Weather-sealed construction', 'Lockable entry doors', 'Interior lighting options', 'Roof vent and climate options'],
      sizeRange: '12\' - 24\' typical',
      considerations: 'Interior height matters for tall equipment. Consider rear ramp vs. barn doors based on your loading needs.'
    },
    stock_trailer: {
      name: 'Stock / Livestock Trailer',
      category: 'Animal Transport Trailer',
      icon: '🐴',
      description: 'Designed specifically for safe animal transport with proper ventilation, flooring, and compartment options.',
      idealFor: ['Cattle', 'Horses', 'Sheep and goats', 'Show animals'],
      keyFeatures: ['Ventilated sides', 'Non-slip flooring', 'Divider gates', 'Escape doors'],
      sizeRange: '12\' - 24\' typical',
      considerations: 'Animal safety is paramount. Ensure proper ventilation and sizing for your specific livestock.'
    },
    powersports_trailer: {
      name: 'Powersports / Recreation Trailer',
      category: 'Recreational Vehicle Trailer',
      icon: '🏍️',
      description: 'Specialized for recreational vehicles with appropriate tie-downs, deck configurations, and transport features.',
      idealFor: ['Motorcycles', 'ATVs', 'Snowmobiles', 'Personal watercraft'],
      keyFeatures: ['Wheel chocks or channels', 'Low deck profile', 'Lightweight construction', 'Multiple vehicle capacity'],
      sizeRange: '10\' - 16\' typical',
      considerations: 'Match deck length to your vehicle combination. Consider enclosed options for weather protection.'
    }
  };

  // Recommendation logic based on selections
  const getRecommendation = () => {
    const { primaryUse, frequency, towVehicle, terrain, priority } = selections;
    
    let recommendedType;
    let sizeRecommendation;
    let additionalNotes = [];

    // Primary type selection based on use case
    switch (primaryUse) {
      case 'equipment':
        recommendedType = trailerTypes.equipment_hauler;
        sizeRecommendation = frequency === 'daily' || frequency === 'weekly' ? '20\' - 24\'' : '18\' - 20\'';
        break;
      case 'vehicles':
        recommendedType = trailerTypes.car_hauler;
        sizeRecommendation = '18\' - 20\'';
        break;
      case 'landscape':
        recommendedType = trailerTypes.landscape_trailer;
        sizeRecommendation = frequency === 'daily' ? '16\' - 18\'' : '12\' - 16\'';
        break;
      case 'livestock':
        recommendedType = trailerTypes.stock_trailer;
        sizeRecommendation = '14\' - 20\'';
        break;
      case 'enclosed':
        recommendedType = trailerTypes.enclosed_trailer;
        sizeRecommendation = frequency === 'daily' || frequency === 'weekly' ? '16\' - 20\'' : '12\' - 16\'';
        break;
      case 'general':
      default:
        recommendedType = trailerTypes.utility_trailer;
        sizeRecommendation = frequency === 'occasional' ? '10\' - 14\'' : '14\' - 18\'';
        break;
    }

    // Add context-specific notes
    if (terrain === 'coastal' || terrain === 'offroad') {
      additionalNotes.push('All-aluminum construction is especially important in your operating environment to prevent corrosion.');
    }
    
    if (priority === 'weight') {
      additionalNotes.push('Aluminum trailers save 400-800 lbs compared to steel equivalents, maximizing your payload capacity.');
    }
    
    if (priority === 'durability') {
      additionalNotes.push('Look for all-welded aluminum frames with reinforced stress points for maximum longevity.');
    }
    
    if (priority === 'resale') {
      additionalNotes.push('Aluminum trailers typically retain 40-50% more value than steel after 10 years.');
    }
    
    if (priority === 'lowmaint') {
      additionalNotes.push('Aluminum requires no painting, no rust treatment, and no floor replacement—minimal maintenance for years.');
    }
    
    if (towVehicle === 'halfton' || towVehicle === 'suv') {
      additionalNotes.push('With your tow vehicle, aluminum\'s lighter weight helps you stay safely within capacity limits.');
      if (primaryUse === 'equipment') {
        sizeRecommendation = '16\' - 18\'';
        additionalNotes.push('Consider a slightly smaller size to stay within your towing capacity when fully loaded.');
      }
    }

    if (frequency === 'daily') {
      additionalNotes.push('Daily commercial use demands the most durable construction—invest in quality upfront.');
    }

    return {
      type: recommendedType,
      sizeRecommendation,
      additionalNotes
    };
  };

  const handleSelect = (questionId, value) => {
    setSelections(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleBack = () => {
    if (showResults) {
      setShowResults(false);
    } else if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleReset = () => {
    setSelections({
      primaryUse: null,
      frequency: null,
      towVehicle: null,
      terrain: null,
      priority: null
    });
    setStep(0);
    setShowResults(false);
  };

  const currentQuestion = questions[step];
  const currentSelection = selections[currentQuestion?.id];
  const recommendation = getRecommendation();

  return (
    <div style={{
      minHeight: '100vh',
      background: '#fafafa',
      fontFamily: "'Inter', -apple-system, sans-serif",
      color: '#1a1a1a'
    }}>
      {/* Header */}
      <div style={{
        background: '#fff',
        borderBottom: '1px solid #e5e5e5',
        padding: '20px 24px'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ 
              fontSize: '11px', 
              fontWeight: '700', 
              letterSpacing: '1.5px', 
              color: '#d97706',
              textTransform: 'uppercase',
              marginBottom: '4px'
            }}>
              ALUMA TRAILERS
            </div>
            <div style={{ fontSize: '18px', fontWeight: '600', color: '#1a1a1a' }}>
              Trailer Selection System
            </div>
          </div>
          {(step > 0 || showResults) && (
            <button
              onClick={handleReset}
              style={{
                padding: '8px 16px',
                background: 'transparent',
                border: '1px solid #e5e5e5',
                borderRadius: '6px',
                fontSize: '13px',
                color: '#666',
                cursor: 'pointer'
              }}
            >
              Start Over
            </button>
          )}
        </div>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px' }}>
        
        {!showResults ? (
          <>
            {/* Progress bar */}
            <div style={{ marginBottom: '40px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', color: '#666' }}>
                  Question {step + 1} of {questions.length}
                </span>
                <span style={{ fontSize: '13px', color: '#666' }}>
                  {Math.round(((step + 1) / questions.length) * 100)}% Complete
                </span>
              </div>
              <div style={{
                height: '4px',
                background: '#e5e5e5',
                borderRadius: '2px',
                overflow: 'hidden'
              }}>
                <div style={{
                  height: '100%',
                  width: `${((step + 1) / questions.length) * 100}%`,
                  background: 'linear-gradient(90deg, #d97706, #f59e0b)',
                  borderRadius: '2px',
                  transition: 'width 0.3s ease'
                }} />
              </div>
            </div>

            {/* Question */}
            <div style={{ marginBottom: '32px' }}>
              <h1 style={{
                fontSize: 'clamp(24px, 4vw, 32px)',
                fontWeight: '600',
                margin: '0 0 8px 0',
                color: '#1a1a1a'
              }}>
                {currentQuestion.title}
              </h1>
              <p style={{
                fontSize: '16px',
                color: '#666',
                margin: 0
              }}>
                {currentQuestion.subtitle}
              </p>
            </div>

            {/* Options */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '12px',
              marginBottom: '32px'
            }}>
              {currentQuestion.options.map(option => (
                <button
                  key={option.value}
                  onClick={() => handleSelect(currentQuestion.id, option.value)}
                  style={{
                    padding: '20px',
                    background: currentSelection === option.value ? '#fffbeb' : '#fff',
                    border: `2px solid ${currentSelection === option.value ? '#d97706' : '#e5e5e5'}`,
                    borderRadius: '12px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s ease',
                    position: 'relative'
                  }}
                >
                  {currentSelection === option.value && (
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      width: '24px',
                      height: '24px',
                      background: '#d97706',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontSize: '14px'
                    }}>
                      ✓
                    </div>
                  )}
                  <div style={{ fontSize: '24px', marginBottom: '12px' }}>
                    {option.icon}
                  </div>
                  <div style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#1a1a1a',
                    marginBottom: '4px'
                  }}>
                    {option.label}
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: '#666',
                    lineHeight: '1.4'
                  }}>
                    {option.desc}
                  </div>
                </button>
              ))}
            </div>

            {/* Navigation */}
            <div style={{ display: 'flex', gap: '12px' }}>
              {step > 0 && (
                <button
                  onClick={handleBack}
                  style={{
                    padding: '14px 24px',
                    background: '#fff',
                    border: '1px solid #e5e5e5',
                    borderRadius: '8px',
                    fontSize: '15px',
                    color: '#666',
                    cursor: 'pointer'
                  }}
                >
                  ← Back
                </button>
              )}
              <button
                onClick={handleNext}
                disabled={!currentSelection}
                style={{
                  flex: 1,
                  padding: '14px 24px',
                  background: currentSelection 
                    ? 'linear-gradient(135deg, #d97706 0%, #b45309 100%)'
                    : '#e5e5e5',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '15px',
                  fontWeight: '600',
                  color: currentSelection ? '#fff' : '#999',
                  cursor: currentSelection ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s ease'
                }}
              >
                {step < questions.length - 1 ? 'Continue →' : 'See My Recommendation →'}
              </button>
            </div>
          </>
        ) : (
          /* Results */
          <div style={{ animation: 'fadeIn 0.4s ease' }}>
            <div style={{
              background: '#fff',
              border: '1px solid #e5e5e5',
              borderRadius: '16px',
              overflow: 'hidden',
              marginBottom: '24px'
            }}>
              {/* Recommendation header */}
              <div style={{
                background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
                padding: '32px',
                color: '#fff'
              }}>
                <div style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  color: '#f59e0b',
                  marginBottom: '12px'
                }}>
                  RECOMMENDED TRAILER TYPE
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ fontSize: '48px' }}>{recommendation.type.icon}</div>
                  <div>
                    <h2 style={{
                      fontSize: 'clamp(24px, 5vw, 32px)',
                      fontWeight: '700',
                      margin: '0 0 4px 0'
                    }}>
                      {recommendation.type.name}
                    </h2>
                    <div style={{
                      fontSize: '16px',
                      color: '#999'
                    }}>
                      {recommendation.type.category}
                    </div>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div style={{ padding: '32px' }}>
                <p style={{
                  fontSize: '16px',
                  lineHeight: '1.7',
                  color: '#333',
                  margin: '0 0 24px 0'
                }}>
                  {recommendation.type.description}
                </p>

                {/* Size recommendation */}
                <div style={{
                  background: '#f0f9ff',
                  border: '1px solid #bae6fd',
                  borderRadius: '10px',
                  padding: '16px 20px',
                  marginBottom: '24px'
                }}>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: '#0369a1', marginBottom: '4px' }}>
                    Recommended Size Range
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: '#0c4a6e' }}>
                    {recommendation.sizeRecommendation}
                  </div>
                </div>

                {/* Ideal for */}
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{
                    fontSize: '13px',
                    fontWeight: '600',
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                    color: '#666',
                    marginBottom: '12px'
                  }}>
                    Ideal For
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {recommendation.type.idealFor.map((item, i) => (
                      <span key={i} style={{
                        padding: '6px 12px',
                        background: '#f3f4f6',
                        borderRadius: '20px',
                        fontSize: '13px',
                        color: '#374151'
                      }}>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Key features */}
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{
                    fontSize: '13px',
                    fontWeight: '600',
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                    color: '#666',
                    marginBottom: '12px'
                  }}>
                    Key Features to Look For
                  </h3>
                  <div style={{ display: 'grid', gap: '8px' }}>
                    {recommendation.type.keyFeatures.map((feature, i) => (
                      <div key={i} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                      }}>
                        <div style={{
                          width: '20px',
                          height: '20px',
                          background: '#d97706',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          fontSize: '12px',
                          flexShrink: 0
                        }}>
                          ✓
                        </div>
                        <span style={{ fontSize: '14px', color: '#333' }}>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Consideration */}
                <div style={{
                  background: '#fffbeb',
                  border: '1px solid #fcd34d',
                  borderRadius: '10px',
                  padding: '16px 20px',
                  marginBottom: '24px'
                }}>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: '#92400e', marginBottom: '4px' }}>
                    Important Consideration
                  </div>
                  <div style={{ fontSize: '14px', color: '#78350f', lineHeight: '1.5' }}>
                    {recommendation.type.considerations}
                  </div>
                </div>

                {/* Additional notes based on selections */}
                {recommendation.additionalNotes.length > 0 && (
                  <div style={{
                    background: '#f9fafb',
                    borderRadius: '12px',
                    padding: '20px'
                  }}>
                    <div style={{
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#666',
                      marginBottom: '12px'
                    }}>
                      Based on Your Selections:
                    </div>
                    {recommendation.additionalNotes.map((note, i) => (
                      <div key={i} style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                        marginBottom: i < recommendation.additionalNotes.length - 1 ? '12px' : 0
                      }}>
                        <div style={{
                          width: '6px',
                          height: '6px',
                          background: '#d97706',
                          borderRadius: '50%',
                          flexShrink: 0,
                          marginTop: '7px'
                        }} />
                        <span style={{ fontSize: '14px', color: '#333', lineHeight: '1.5' }}>
                          {note}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Your profile summary */}
            <div style={{
              background: '#fff',
              border: '1px solid #e5e5e5',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '24px'
            }}>
              <h3 style={{
                fontSize: '14px',
                fontWeight: '600',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                color: '#999',
                marginBottom: '16px'
              }}>
                Your Usage Profile
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '16px'
              }}>
                {Object.entries(selections).map(([key, value]) => {
                  const question = questions.find(q => q.id === key);
                  const option = question?.options.find(o => o.value === value);
                  return (
                    <div key={key}>
                      <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>
                        {question?.title.replace('?', '')}
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: '500', color: '#333' }}>
                        {option?.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CTA */}
            <div style={{
              background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
              border: '1px solid #fcd34d',
              borderRadius: '12px',
              padding: '32px',
              textAlign: 'center'
            }}>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '600',
                margin: '0 0 8px 0',
                color: '#1a1a1a'
              }}>
                Ready to Explore {recommendation.type.name}s?
              </h3>
              <p style={{
                fontSize: '15px',
                color: '#666',
                margin: '0 0 24px 0'
              }}>
                Check availability with Aluma dealers in your area.
              </p>
              <button style={{
                padding: '16px 32px',
                background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
                border: 'none',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: '600',
                color: '#fff',
                cursor: 'pointer',
                marginRight: '12px'
              }}>
                Find Local Availability
              </button>
              <button
                onClick={handleReset}
                style={{
                  padding: '16px 24px',
                  background: '#fff',
                  border: '1px solid #e5e5e5',
                  borderRadius: '8px',
                  fontSize: '15px',
                  color: '#666',
                  cursor: 'pointer'
                }}
              >
                Try Different Options
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        button:hover {
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
};

export default TrailerSelectionSystem;
