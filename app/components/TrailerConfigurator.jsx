import React, { useState } from 'react';

const TrailerConfigurator = () => {
  // Configuration - Dealer/Manufacturer can customize these
  const [brandConfig] = useState({
    logo: null, // URL to logo image
    companyName: 'Your Dealer Name',
    primaryColor: '#d97706', // Orange - can be customized
    showPoweredBy: true
  });

  const [stage, setStage] = useState(1); // 1: Needs, 2: Configuration, 3: Comparison/Results
  const [step, setStep] = useState(0);
  const [showLeadCapture, setShowLeadCapture] = useState(false);
  const [leadCaptureMode, setLeadCaptureMode] = useState(null); // 'email' or 'download'
  
  const [needsAssessment, setNeedsAssessment] = useState({
    primaryUse: null,
    frequency: null,
    towVehicle: null,
    terrain: null,
    priorities: [] // Multi-select
  });

  const [configuration, setConfiguration] = useState({
    material: null,
    axleCount: null,
    axleCapacity: null,
    hitchType: null,
    lengthRange: null,
    deckType: null,
    sideConfig: null,
    rampStyle: null,
    brakeType: null,
    budget: null
  });

  const [contactInfo, setContactInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });

  // Stage 1: Needs Assessment Questions
  const needsQuestions = [
    {
      id: 'primaryUse',
      title: 'What will you primarily haul?',
      subtitle: 'Select the category that best describes your typical loads',
      type: 'single',
      options: [
        { value: 'heavy_equipment', label: 'Heavy Equipment', desc: 'Skid steers, mini excavators, forklifts, etc.', icon: '🏗️' },
        { value: 'vehicles', label: 'Vehicles', desc: 'Cars or trucks', icon: '🚗' },
        { value: 'powersports', label: 'Powersports', desc: 'UTV, ATV, motorcycle', icon: '🏍️' },
        { value: 'landscape', label: 'Landscape & Materials', desc: 'Gravel, rock, mulch, debris, mowers, equipment', icon: '🌿' },
        { value: 'livestock', label: 'Livestock & Agriculture', desc: 'Animals, hay, farm equipment', icon: '🐴' },
        { value: 'cargo', label: 'Cargo', desc: 'Mixed loads, furniture, supplies, tools, household', icon: '📦' },
        { value: 'protected', label: 'Protected Cargo', desc: 'Weather-sensitive, secured items', icon: '🔒' },
        { value: 'other', label: 'Other', desc: 'Something not shown above', icon: '❓' }
      ]
    },
    {
      id: 'frequency',
      title: 'How often will you haul?',
      subtitle: 'Usage frequency impacts which features matter most',
      type: 'single',
      options: [
        { value: 'daily', label: 'Daily', desc: 'Commercial or business use', icon: '📅' },
        { value: 'weekly', label: 'Several Times Weekly', desc: 'Regular work or farm use', icon: '🔄' },
        { value: 'monthly', label: 'Few Times Monthly', desc: 'Project-based or seasonal', icon: '📆' },
        { value: 'occasional', label: 'Occasionally', desc: 'Personal or weekend use', icon: '🌤️' }
      ]
    },
    {
      id: 'towVehicle',
      title: "What's your tow vehicle?",
      subtitle: 'This determines safe weight limits and tongue weight capacity',
      type: 'single',
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
      subtitle: 'Environment affects durability needs and material choice',
      type: 'single',
      options: [
        { value: 'highway', label: 'Primarily Highway', desc: 'Paved roads, minimal off-road', icon: '🛣️' },
        { value: 'mixed', label: 'Mixed Use', desc: 'Roads plus jobsites or farms', icon: '🔀' },
        { value: 'offroad', label: 'Frequent Off-Road', desc: 'Construction sites, fields, trails', icon: '🏔️' },
        { value: 'coastal', label: 'Coastal / Salt Exposure', desc: 'Beach access, salt-treated roads', icon: '🌊' }
      ]
    },
    {
      id: 'priorities',
      title: 'What matters most to you?',
      subtitle: 'Select all that apply',
      type: 'multi',
      options: [
        { value: 'durability', label: 'Long-Term Durability', desc: 'Built to last 15+ years', icon: '🛡️' },
        { value: 'weight', label: 'Weight Savings', desc: 'Maximize payload, reduce fuel', icon: '⚖️' },
        { value: 'versatility', label: 'Versatility', desc: 'Handle multiple load types', icon: '🔧' },
        { value: 'lowmaint', label: 'Low Maintenance', desc: 'Minimal upkeep required', icon: '✨' },
        { value: 'resale', label: 'Resale Value', desc: 'Retain value over time', icon: '💰' },
        { value: 'budget', label: 'Budget-Friendly', desc: 'Best value for the money', icon: '💵' }
      ]
    }
  ];

  // Stage 2: Configuration Questions (with conditional logic)
  const getConfigQuestions = () => {
    const questions = [];
    const { primaryUse, towVehicle } = needsAssessment;

    // Material - skip for livestock (usually steel)
    if (primaryUse !== 'livestock') {
      questions.push({
        id: 'material',
        title: 'Aluminum or Steel?',
        subtitle: 'Each has distinct advantages',
        type: 'single',
        options: [
          { value: 'aluminum', label: 'Aluminum', desc: 'Lighter, no rust, higher resale, higher upfront cost', icon: '✨' },
          { value: 'steel', label: 'Steel', desc: 'Lower cost, heavier, requires maintenance', icon: '🔩' },
          { value: 'unsure', label: 'Not Sure Yet', desc: 'I want to compare options', icon: '🤔' }
        ]
      });
    }

    // Axle Count
    questions.push({
      id: 'axleCount',
      title: 'Axle Configuration?',
      subtitle: 'More axles = more capacity and stability',
      type: 'single',
      options: [
        { value: 'single', label: 'Single Axle', desc: 'Lighter, easier to maneuver, lower capacity', icon: '1️⃣' },
        { value: 'tandem', label: 'Tandem (2) Axle', desc: 'Most common, balanced capacity and handling', icon: '2️⃣' },
        { value: 'tri', label: 'Tri (3) Axle', desc: 'Maximum capacity for heavy loads', icon: '3️⃣' },
        { value: 'unsure', label: 'Not Sure Yet', desc: 'Recommend based on my needs', icon: '🤔' }
      ]
    });

    // Axle Capacity - filter based on tow vehicle
    const axleOptions = [
      { value: '3500', label: '3,500 lb', desc: 'Light duty, single axle common', icon: '🔹' },
      { value: '5200', label: '5,200 lb', desc: 'Medium duty, versatile', icon: '🔹' },
      { value: '7000', label: '7,000 lb', desc: 'Heavy duty, most popular', icon: '🔸' }
    ];
    
    // Only show heavier options for appropriate tow vehicles
    if (towVehicle !== 'halfton' && towVehicle !== 'suv') {
      axleOptions.push(
        { value: '8000', label: '8,000 lb', desc: 'Extra heavy duty', icon: '🔸' },
        { value: '10000', label: '10,000 lb', desc: 'Commercial grade', icon: '🔶' }
      );
    }
    if (towVehicle === 'oneton' || towVehicle === 'commercial') {
      axleOptions.push(
        { value: '12000', label: '12,000 lb', desc: 'Maximum capacity', icon: '🔶' },
        { value: '15000', label: '15,000 lb', desc: 'Extreme duty', icon: '🟠' }
      );
    }
    axleOptions.push({ value: 'unsure', label: 'Not Sure Yet', desc: 'Recommend based on my loads', icon: '🤔' });

    questions.push({
      id: 'axleCapacity',
      title: 'Axle Weight Rating?',
      subtitle: 'Per axle capacity - total GVWR depends on axle count',
      type: 'single',
      options: axleOptions
    });

    // Hitch Type
    const hitchOptions = [
      { value: 'bumper', label: 'Bumper Pull', desc: 'Standard ball hitch, most common', icon: '🔗' }
    ];
    // Only show gooseneck for appropriate tow vehicles
    if (towVehicle !== 'suv') {
      hitchOptions.push(
        { value: 'gooseneck', label: 'Gooseneck', desc: 'Mounts in truck bed, better weight distribution', icon: '🦢' }
      );
    }
    hitchOptions.push({ value: 'unsure', label: 'Not Sure Yet', desc: 'What do you recommend?', icon: '🤔' });

    questions.push({
      id: 'hitchType',
      title: 'Hitch Type?',
      subtitle: 'How the trailer connects to your vehicle',
      type: 'single',
      options: hitchOptions
    });

    // Length Range
    questions.push({
      id: 'lengthRange',
      title: 'Trailer Length?',
      subtitle: 'Longer = more capacity, but harder to maneuver',
      type: 'single',
      options: [
        { value: '10-14', label: "10' - 14'", desc: 'Compact, easy to store and maneuver', icon: '📏' },
        { value: '14-18', label: "14' - 18'", desc: 'Mid-size, versatile for most needs', icon: '📏' },
        { value: '18-22', label: "18' - 22'", desc: 'Full-size, room for larger equipment', icon: '📐' },
        { value: '22-26', label: "22' - 26'", desc: 'Large capacity for multiple items', icon: '📐' },
        { value: '26-30', label: "26' - 30'", desc: 'Commercial size, maximum capacity', icon: '📐' },
        { value: '30+', label: "30'+", desc: 'Extra-long for specialized needs', icon: '📐' },
        { value: 'unsure', label: 'Not Sure Yet', desc: 'Recommend based on my loads', icon: '🤔' }
      ]
    });

    // Deck Type - skip for enclosed/protected
    if (primaryUse !== 'protected' && primaryUse !== 'livestock') {
      questions.push({
        id: 'deckType',
        title: 'Deck/Floor Type?',
        subtitle: 'What the trailer floor is made of',
        type: 'single',
        options: [
          { value: 'aluminum', label: 'Aluminum Plank', desc: 'Durable, no rot, lightweight', icon: '✨' },
          { value: 'wood', label: 'Treated Wood', desc: 'Lower cost, replaceable, good traction', icon: '🪵' },
          { value: 'steel', label: 'Steel', desc: 'Heavy duty, often diamond plate', icon: '🔩' },
          { value: 'unsure', label: 'Not Sure Yet', desc: 'What do you recommend?', icon: '🤔' }
        ]
      });
    }

    // Side Configuration - skip for enclosed/protected
    if (primaryUse !== 'protected') {
      questions.push({
        id: 'sideConfig',
        title: 'Side Configuration?',
        subtitle: 'Side rails and walls',
        type: 'single',
        options: [
          { value: 'open', label: 'Open (No Sides)', desc: 'Maximum access, flatbed style', icon: '➖' },
          { value: 'rail', label: 'Rail Sides', desc: 'Low rails for tie-downs', icon: '🔲' },
          { value: 'solid', label: 'Solid Sides', desc: 'Contains loose materials', icon: '🔳' },
          { value: 'mesh', label: 'Mesh Sides', desc: 'Visibility and airflow', icon: '🔘' },
          { value: 'unsure', label: 'Not Sure Yet', desc: 'Depends on the trailer type', icon: '🤔' }
        ]
      });
    }

    // Ramp/Gate Style
    if (primaryUse !== 'protected' && primaryUse !== 'livestock') {
      questions.push({
        id: 'rampStyle',
        title: 'Ramp/Gate Style?',
        subtitle: 'How you load the trailer',
        type: 'single',
        options: [
          { value: 'folddown', label: 'Fold-Down Gate', desc: 'Simple, doubles as ramp', icon: '⬇️' },
          { value: 'standup', label: 'Stand-Up Ramps', desc: 'Separate ramps, store upright', icon: '⬆️' },
          { value: 'bifold', label: 'Bifold Ramp', desc: 'Folds in half, heavy-duty', icon: '📂' },
          { value: 'slidein', label: 'Slide-In Ramps', desc: 'Store under deck', icon: '➡️' },
          { value: 'tilt', label: 'Tilt Deck', desc: 'Whole deck tilts for loading', icon: '↗️' },
          { value: 'unsure', label: 'Not Sure Yet', desc: 'What works best for my loads?', icon: '🤔' }
        ]
      });
    }

    // Brake Type
    questions.push({
      id: 'brakeType',
      title: 'Brake Type?',
      subtitle: 'Required for trailers over certain weights (varies by state)',
      type: 'single',
      options: [
        { value: 'electric', label: 'Electric Brakes', desc: 'Most common, requires brake controller', icon: '⚡' },
        { value: 'surge', label: 'Surge Brakes', desc: 'Self-activating, no controller needed', icon: '🌊' },
        { value: 'none', label: 'No Brakes', desc: 'Light trailers only, check local laws', icon: '❌' },
        { value: 'unsure', label: 'Not Sure Yet', desc: 'What do I need?', icon: '🤔' }
      ]
    });

    // Budget
    questions.push({
      id: 'budget',
      title: 'Budget Range?',
      subtitle: 'Optional - helps narrow down options',
      type: 'single',
      options: [
        { value: 'under5k', label: 'Under $5,000', desc: 'Entry level, smaller trailers', icon: '💵' },
        { value: '5-10k', label: '$5,000 - $10,000', desc: 'Mid-range, good selection', icon: '💵' },
        { value: '10-15k', label: '$10,000 - $15,000', desc: 'Quality builds, more features', icon: '💰' },
        { value: '15-25k', label: '$15,000 - $25,000', desc: 'Premium options', icon: '💰' },
        { value: '25k+', label: '$25,000+', desc: 'Top-tier, commercial grade', icon: '💎' },
        { value: 'skip', label: 'Prefer Not to Say', desc: 'Show me all options', icon: '⏭️' }
      ]
    });

    return questions;
  };

  // Determine recommended trailer type based on needs
  const getRecommendedType = () => {
    const { primaryUse } = needsAssessment;
    
    const typeMap = {
      heavy_equipment: { name: 'Equipment Hauler', icon: '🏗️', category: 'Heavy-Duty Open Trailer' },
      vehicles: { name: 'Car Hauler', icon: '🚗', category: 'Vehicle Transport Trailer' },
      powersports: { name: 'Utility / Powersports Trailer', icon: '🏍️', category: 'Recreational Trailer' },
      landscape: { name: 'Landscape / Utility Trailer', icon: '🌿', category: 'Commercial Service Trailer' },
      livestock: { name: 'Stock / Livestock Trailer', icon: '🐴', category: 'Animal Transport Trailer' },
      cargo: { name: 'Utility Trailer', icon: '📦', category: 'General Purpose Trailer' },
      protected: { name: 'Enclosed Cargo Trailer', icon: '🔒', category: 'Protected Cargo Trailer' },
      other: { name: 'Custom Configuration', icon: '⚙️', category: 'Specialized Trailer' }
    };

    return typeMap[primaryUse] || typeMap.other;
  };

  // Generate comparison options based on configuration
  const getComparisonOptions = () => {
    const { primaryUse, frequency, towVehicle, priorities } = needsAssessment;
    const { material, axleCount, budget } = configuration;

    // This would be configurable by the dealer/manufacturer
    // For now, generating smart defaults based on selections
    const options = [];

    const baseType = getRecommendedType();

    // Option A: Best Match
    options.push({
      id: 'best_match',
      label: 'Best Match',
      badge: 'RECOMMENDED',
      badgeColor: '#059669',
      name: baseType.name,
      icon: baseType.icon,
      description: 'Closest match to your specified configuration',
      specs: {
        material: material === 'unsure' ? 'Aluminum' : (material === 'aluminum' ? 'Aluminum' : 'Steel'),
        axles: axleCount === 'unsure' ? 'Tandem' : (axleCount === 'single' ? 'Single' : axleCount === 'tri' ? 'Tri-Axle' : 'Tandem'),
        capacity: configuration.axleCapacity === 'unsure' ? '7,000 lb/axle' : `${parseInt(configuration.axleCapacity).toLocaleString()} lb/axle`,
        length: configuration.lengthRange === 'unsure' ? "18' - 20'" : configuration.lengthRange.replace('-', "' - ") + "'",
        hitch: configuration.hitchType === 'unsure' ? 'Bumper Pull' : (configuration.hitchType === 'gooseneck' ? 'Gooseneck' : 'Bumper Pull')
      },
      priceRange: budget === '5-10k' ? '$7,000 - $10,000' : budget === '10-15k' ? '$10,000 - $14,000' : '$8,000 - $12,000',
      pros: ['Matches your exact specifications', 'Right-sized for your needs', 'Optimal for your use case'],
      cons: ['May need to order if not in stock']
    });

    // Option B: Budget-Friendly Alternative
    if (!priorities.includes('budget') || budget !== 'under5k') {
      options.push({
        id: 'budget_friendly',
        label: 'Budget-Friendly',
        badge: 'VALUE',
        badgeColor: '#2563eb',
        name: baseType.name + ' (Standard)',
        icon: '💵',
        description: 'Similar functionality at a lower price point',
        specs: {
          material: 'Steel',
          axles: axleCount === 'tri' ? 'Tandem' : (axleCount === 'tandem' ? 'Tandem' : 'Single'),
          capacity: '5,200 lb/axle',
          length: configuration.lengthRange === '22-26' || configuration.lengthRange === '26-30' ? "18' - 22'" : "14' - 18'",
          hitch: 'Bumper Pull'
        },
        priceRange: '$4,500 - $7,500',
        pros: ['Lower upfront cost', 'Widely available', 'Gets the job done'],
        cons: ['Heavier than aluminum', 'Requires more maintenance', 'Lower resale value']
      });
    }

    // Option C: Premium Upgrade
    if (budget !== '25k+') {
      options.push({
        id: 'premium',
        label: 'Premium Option',
        badge: 'UPGRADE',
        badgeColor: '#7c3aed',
        name: baseType.name + ' (Heavy-Duty)',
        icon: '⭐',
        description: 'Maximum durability and capacity for demanding use',
        specs: {
          material: 'Aluminum',
          axles: axleCount === 'single' ? 'Tandem' : 'Tandem/Tri-Axle',
          capacity: towVehicle === 'oneton' || towVehicle === 'commercial' ? '10,000 lb/axle' : '7,000 lb/axle',
          length: configuration.lengthRange === '10-14' || configuration.lengthRange === '14-18' ? "18' - 22'" : "22' - 26'",
          hitch: towVehicle !== 'suv' && towVehicle !== 'halfton' ? 'Gooseneck Available' : 'Bumper Pull'
        },
        priceRange: '$12,000 - $20,000',
        pros: ['Maximum payload capacity', 'Built for daily commercial use', 'Excellent resale value', 'Minimal maintenance'],
        cons: ['Higher upfront investment', 'May exceed current needs']
      });
    }

    return options;
  };

  // Handle single selection
  const handleSingleSelect = (questionId, value, stageData, setStageData) => {
    setStageData(prev => ({ ...prev, [questionId]: value }));
  };

  // Handle multi-select (for priorities)
  const handleMultiSelect = (questionId, value, stageData, setStageData) => {
    setStageData(prev => {
      const current = prev[questionId] || [];
      if (current.includes(value)) {
        return { ...prev, [questionId]: current.filter(v => v !== value) };
      } else {
        return { ...prev, [questionId]: [...current, value] };
      }
    });
  };

  // Navigation
  const handleNext = () => {
    if (stage === 1) {
      if (step < needsQuestions.length - 1) {
        setStep(step + 1);
      } else {
        // Move to Stage 2
        setStage(2);
        setStep(0);
      }
    } else if (stage === 2) {
      const configQuestions = getConfigQuestions();
      if (step < configQuestions.length - 1) {
        setStep(step + 1);
      } else {
        // Move to Stage 3
        setStage(3);
      }
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    } else if (stage === 2) {
      setStage(1);
      setStep(needsQuestions.length - 1);
    } else if (stage === 3) {
      setStage(2);
      const configQuestions = getConfigQuestions();
      setStep(configQuestions.length - 1);
    }
  };

  const handleSkipToResults = () => {
    setStage(3);
  };

  const handleReset = () => {
    setStage(1);
    setStep(0);
    setNeedsAssessment({
      primaryUse: null,
      frequency: null,
      towVehicle: null,
      terrain: null,
      priorities: []
    });
    setConfiguration({
      material: null,
      axleCount: null,
      axleCapacity: null,
      hitchType: null,
      lengthRange: null,
      deckType: null,
      sideConfig: null,
      rampStyle: null,
      brakeType: null,
      budget: null
    });
    setContactInfo({ name: '', email: '', phone: '' });
    setShowLeadCapture(false);
  };

  const handleLeadCapture = (mode) => {
    setLeadCaptureMode(mode);
    setShowLeadCapture(true);
  };

  const handleSubmitContact = () => {
    // Here you would send the data to your CRM/email system
    console.log('Contact submitted:', contactInfo);
    console.log('Configuration:', { needsAssessment, configuration });
    
    if (leadCaptureMode === 'download') {
      // Trigger PDF download
      alert('PDF Download would trigger here');
    } else if (leadCaptureMode === 'email') {
      // Send email
      alert('Email would be sent here');
    }
    
    setShowLeadCapture(false);
  };

  // Get current question based on stage
  const getCurrentQuestion = () => {
    if (stage === 1) {
      return needsQuestions[step];
    } else if (stage === 2) {
      return getConfigQuestions()[step];
    }
    return null;
  };

  const currentQuestion = getCurrentQuestion();
  const currentData = stage === 1 ? needsAssessment : configuration;
  const setCurrentData = stage === 1 ? setNeedsAssessment : setConfiguration;
  const currentSelection = currentQuestion ? currentData[currentQuestion.id] : null;
  
  const totalSteps = stage === 1 ? needsQuestions.length : getConfigQuestions().length;
  const overallProgress = stage === 1 
    ? ((step + 1) / needsQuestions.length) * 50 
    : 50 + ((step + 1) / getConfigQuestions().length) * 50;

  const isNextDisabled = currentQuestion?.type === 'multi' 
    ? (currentData[currentQuestion?.id]?.length || 0) === 0
    : !currentSelection;

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8fafc',
      fontFamily: "'Inter', -apple-system, sans-serif",
      color: '#1a1a1a'
    }}>
      {/* Header - Configurable */}
      <div style={{
        background: '#fff',
        borderBottom: '1px solid #e2e8f0',
        padding: '16px 24px'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {brandConfig.logo ? (
              <img src={brandConfig.logo} alt={brandConfig.companyName} style={{ height: '40px' }} />
            ) : (
              <div style={{
                width: '40px',
                height: '40px',
                background: `linear-gradient(135deg, ${brandConfig.primaryColor}, ${brandConfig.primaryColor}dd)`,
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: '700',
                fontSize: '18px'
              }}>
                {brandConfig.companyName.charAt(0)}
              </div>
            )}
            <div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#1a1a1a' }}>
                {brandConfig.companyName}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                Trailer Selection Tool
              </div>
            </div>
          </div>
          {stage > 1 && (
            <button
              onClick={handleReset}
              style={{
                padding: '8px 16px',
                background: 'transparent',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                fontSize: '13px',
                color: '#64748b',
                cursor: 'pointer'
              }}
            >
              Start Over
            </button>
          )}
        </div>
      </div>

      {/* Lead Capture Modal */}
      {showLeadCapture && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '450px',
            width: '100%'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', margin: '0 0 8px 0' }}>
              {leadCaptureMode === 'download' ? 'Download Your Configuration' : 'Email Your Results'}
            </h3>
            <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 24px 0' }}>
              {leadCaptureMode === 'download' 
                ? 'Enter your information to download a PDF of your trailer configuration.'
                : 'We\'ll send your configuration summary to your email.'}
            </p>
            
            <div style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px', color: '#374151' }}>
                  Name *
                </label>
                <input
                  type="text"
                  value={contactInfo.name}
                  onChange={(e) => setContactInfo(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Your full name"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '15px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px', color: '#374151' }}>
                  Email *
                </label>
                <input
                  type="email"
                  value={contactInfo.email}
                  onChange={(e) => setContactInfo(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="your@email.com"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '15px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px', color: '#374151' }}>
                  Phone *
                </label>
                <input
                  type="tel"
                  value={contactInfo.phone}
                  onChange={(e) => setContactInfo(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="(555) 555-5555"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '15px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button
                onClick={() => setShowLeadCapture(false)}
                style={{
                  flex: 1,
                  padding: '14px',
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '15px',
                  color: '#64748b',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitContact}
                disabled={!contactInfo.name || !contactInfo.email || !contactInfo.phone}
                style={{
                  flex: 1,
                  padding: '14px',
                  background: contactInfo.name && contactInfo.email && contactInfo.phone 
                    ? `linear-gradient(135deg, ${brandConfig.primaryColor}, ${brandConfig.primaryColor}dd)`
                    : '#e2e8f0',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '15px',
                  fontWeight: '600',
                  color: contactInfo.name && contactInfo.email && contactInfo.phone ? '#fff' : '#94a3b8',
                  cursor: contactInfo.name && contactInfo.email && contactInfo.phone ? 'pointer' : 'not-allowed'
                }}
              >
                {leadCaptureMode === 'download' ? 'Download PDF' : 'Send Email'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px' }}>
        
        {/* Stage 1 & 2: Questions */}
        {stage < 3 && currentQuestion && (
          <>
            {/* Progress */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    padding: '4px 10px',
                    background: stage === 1 ? `${brandConfig.primaryColor}15` : '#e0f2fe',
                    color: stage === 1 ? brandConfig.primaryColor : '#0369a1',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    {stage === 1 ? 'STEP 1: YOUR NEEDS' : 'STEP 2: CONFIGURATION'}
                  </span>
                </div>
                <span style={{ fontSize: '13px', color: '#64748b' }}>
                  Question {step + 1} of {totalSteps}
                </span>
              </div>
              <div style={{
                height: '6px',
                background: '#e2e8f0',
                borderRadius: '3px',
                overflow: 'hidden'
              }}>
                <div style={{
                  height: '100%',
                  width: `${overallProgress}%`,
                  background: `linear-gradient(90deg, ${brandConfig.primaryColor}, ${brandConfig.primaryColor}cc)`,
                  borderRadius: '3px',
                  transition: 'width 0.3s ease'
                }} />
              </div>
            </div>

            {/* Question */}
            <div style={{ marginBottom: '28px' }}>
              <h1 style={{
                fontSize: 'clamp(22px, 4vw, 28px)',
                fontWeight: '600',
                margin: '0 0 8px 0',
                color: '#1a1a1a'
              }}>
                {currentQuestion.title}
              </h1>
              <p style={{
                fontSize: '15px',
                color: '#64748b',
                margin: 0
              }}>
                {currentQuestion.subtitle}
              </p>
            </div>

            {/* Options */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '12px',
              marginBottom: '28px'
            }}>
              {currentQuestion.options.map(option => {
                const isSelected = currentQuestion.type === 'multi'
                  ? (currentData[currentQuestion.id] || []).includes(option.value)
                  : currentData[currentQuestion.id] === option.value;

                return (
                  <button
                    key={option.value}
                    onClick={() => {
                      if (currentQuestion.type === 'multi') {
                        handleMultiSelect(currentQuestion.id, option.value, currentData, setCurrentData);
                      } else {
                        handleSingleSelect(currentQuestion.id, option.value, currentData, setCurrentData);
                      }
                    }}
                    style={{
                      padding: '18px',
                      background: isSelected ? `${brandConfig.primaryColor}08` : '#fff',
                      border: `2px solid ${isSelected ? brandConfig.primaryColor : '#e2e8f0'}`,
                      borderRadius: '12px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                      position: 'relative'
                    }}
                  >
                    {isSelected && (
                      <div style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        width: '22px',
                        height: '22px',
                        background: brandConfig.primaryColor,
                        borderRadius: currentQuestion.type === 'multi' ? '4px' : '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontSize: '12px'
                      }}>
                        ✓
                      </div>
                    )}
                    <div style={{ fontSize: '22px', marginBottom: '10px' }}>
                      {option.icon}
                    </div>
                    <div style={{
                      fontSize: '15px',
                      fontWeight: '600',
                      color: '#1a1a1a',
                      marginBottom: '4px'
                    }}>
                      {option.label}
                    </div>
                    <div style={{
                      fontSize: '13px',
                      color: '#64748b',
                      lineHeight: '1.4'
                    }}>
                      {option.desc}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Navigation */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {(step > 0 || stage > 1) && (
                <button
                  onClick={handleBack}
                  style={{
                    padding: '14px 24px',
                    background: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '15px',
                    color: '#64748b',
                    cursor: 'pointer'
                  }}
                >
                  ← Back
                </button>
              )}
              <button
                onClick={handleNext}
                disabled={isNextDisabled}
                style={{
                  flex: 1,
                  minWidth: '200px',
                  padding: '14px 24px',
                  background: isNextDisabled 
                    ? '#e2e8f0'
                    : `linear-gradient(135deg, ${brandConfig.primaryColor}, ${brandConfig.primaryColor}dd)`,
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '15px',
                  fontWeight: '600',
                  color: isNextDisabled ? '#94a3b8' : '#fff',
                  cursor: isNextDisabled ? 'not-allowed' : 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {stage === 1 && step === needsQuestions.length - 1 
                  ? 'Continue to Configuration →'
                  : stage === 2 && step === getConfigQuestions().length - 1
                    ? 'See My Options →'
                    : 'Continue →'}
              </button>
              {stage === 1 && step === needsQuestions.length - 1 && (
                <button
                  onClick={handleSkipToResults}
                  disabled={isNextDisabled}
                  style={{
                    padding: '14px 24px',
                    background: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '15px',
                    color: '#64748b',
                    cursor: isNextDisabled ? 'not-allowed' : 'pointer',
                    opacity: isNextDisabled ? 0.5 : 1
                  }}
                >
                  Skip to Results
                </button>
              )}
            </div>
          </>
        )}

        {/* Stage 3: Results & Comparison */}
        {stage === 3 && (
          <div style={{ animation: 'fadeIn 0.4s ease' }}>
            {/* Recommended Type Header */}
            <div style={{
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              overflow: 'hidden',
              marginBottom: '24px'
            }}>
              <div style={{
                background: `linear-gradient(135deg, ${brandConfig.primaryColor}, ${brandConfig.primaryColor}dd)`,
                padding: '28px 32px',
                color: '#fff'
              }}>
                <div style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  opacity: 0.9,
                  marginBottom: '8px'
                }}>
                  BASED ON YOUR NEEDS, YOU'RE LOOKING FOR A
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ fontSize: '48px' }}>{getRecommendedType().icon}</div>
                  <div>
                    <h2 style={{ fontSize: '28px', fontWeight: '700', margin: '0 0 4px 0' }}>
                      {getRecommendedType().name}
                    </h2>
                    <div style={{ fontSize: '15px', opacity: 0.9 }}>
                      {getRecommendedType().category}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Comparison Cards */}
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              margin: '0 0 16px 0',
              color: '#1a1a1a'
            }}>
              Options That Match Your Configuration
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '16px',
              marginBottom: '32px'
            }}>
              {getComparisonOptions().map(option => (
                <div
                  key={option.id}
                  style={{
                    background: '#fff',
                    border: option.id === 'best_match' ? `2px solid ${brandConfig.primaryColor}` : '1px solid #e2e8f0',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    position: 'relative'
                  }}
                >
                  {/* Badge */}
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    padding: '4px 10px',
                    background: option.badgeColor,
                    color: '#fff',
                    borderRadius: '12px',
                    fontSize: '10px',
                    fontWeight: '700',
                    letterSpacing: '0.5px'
                  }}>
                    {option.badge}
                  </div>

                  <div style={{ padding: '24px' }}>
                    <div style={{ fontSize: '32px', marginBottom: '12px' }}>{option.icon}</div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>
                      {option.label}
                    </div>
                    <h4 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 8px 0' }}>
                      {option.name}
                    </h4>
                    <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 16px 0', lineHeight: '1.5' }}>
                      {option.description}
                    </p>

                    {/* Specs */}
                    <div style={{
                      background: '#f8fafc',
                      borderRadius: '8px',
                      padding: '14px',
                      marginBottom: '16px'
                    }}>
                      <div style={{ display: 'grid', gap: '8px', fontSize: '13px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#64748b' }}>Material</span>
                          <span style={{ fontWeight: '500' }}>{option.specs.material}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#64748b' }}>Axles</span>
                          <span style={{ fontWeight: '500' }}>{option.specs.axles}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#64748b' }}>Capacity</span>
                          <span style={{ fontWeight: '500' }}>{option.specs.capacity}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#64748b' }}>Length</span>
                          <span style={{ fontWeight: '500' }}>{option.specs.length}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#64748b' }}>Hitch</span>
                          <span style={{ fontWeight: '500' }}>{option.specs.hitch}</span>
                        </div>
                      </div>
                    </div>

                    {/* Price Range */}
                    <div style={{
                      background: `${brandConfig.primaryColor}10`,
                      borderRadius: '8px',
                      padding: '12px 14px',
                      marginBottom: '16px',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '2px' }}>
                        TYPICAL PRICE RANGE
                      </div>
                      <div style={{ fontSize: '18px', fontWeight: '700', color: brandConfig.primaryColor }}>
                        {option.priceRange}
                      </div>
                    </div>

                    {/* Pros */}
                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ fontSize: '11px', fontWeight: '600', color: '#059669', marginBottom: '6px' }}>
                        PROS
                      </div>
                      {option.pros.map((pro, i) => (
                        <div key={i} style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '6px',
                          fontSize: '12px',
                          color: '#374151',
                          marginBottom: '4px'
                        }}>
                          <span style={{ color: '#059669' }}>✓</span> {pro}
                        </div>
                      ))}
                    </div>

                    {/* Cons */}
                    <div>
                      <div style={{ fontSize: '11px', fontWeight: '600', color: '#dc2626', marginBottom: '6px' }}>
                        CONSIDERATIONS
                      </div>
                      {option.cons.map((con, i) => (
                        <div key={i} style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '6px',
                          fontSize: '12px',
                          color: '#374151',
                          marginBottom: '4px'
                        }}>
                          <span style={{ color: '#dc2626' }}>•</span> {con}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Your Configuration Summary */}
            <div style={{
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '24px'
            }}>
              <h3 style={{
                fontSize: '14px',
                fontWeight: '600',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                color: '#64748b',
                margin: '0 0 16px 0'
              }}>
                Your Configuration Summary
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
                {/* Needs */}
                <div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Primary Use</div>
                  <div style={{ fontSize: '14px', fontWeight: '500' }}>
                    {needsQuestions[0].options.find(o => o.value === needsAssessment.primaryUse)?.label || '-'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Frequency</div>
                  <div style={{ fontSize: '14px', fontWeight: '500' }}>
                    {needsQuestions[1].options.find(o => o.value === needsAssessment.frequency)?.label || '-'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Tow Vehicle</div>
                  <div style={{ fontSize: '14px', fontWeight: '500' }}>
                    {needsQuestions[2].options.find(o => o.value === needsAssessment.towVehicle)?.label || '-'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Environment</div>
                  <div style={{ fontSize: '14px', fontWeight: '500' }}>
                    {needsQuestions[3].options.find(o => o.value === needsAssessment.terrain)?.label || '-'}
                  </div>
                </div>
                
                {/* Configuration specs if filled */}
                {configuration.material && (
                  <div>
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Material</div>
                    <div style={{ fontSize: '14px', fontWeight: '500', textTransform: 'capitalize' }}>
                      {configuration.material}
                    </div>
                  </div>
                )}
                {configuration.axleCount && (
                  <div>
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Axles</div>
                    <div style={{ fontSize: '14px', fontWeight: '500', textTransform: 'capitalize' }}>
                      {configuration.axleCount}
                    </div>
                  </div>
                )}
                {configuration.lengthRange && (
                  <div>
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Length</div>
                    <div style={{ fontSize: '14px', fontWeight: '500' }}>
                      {configuration.lengthRange === 'unsure' ? 'Flexible' : configuration.lengthRange.replace('-', "' - ") + "'"}
                    </div>
                  </div>
                )}
                {configuration.hitchType && (
                  <div>
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Hitch</div>
                    <div style={{ fontSize: '14px', fontWeight: '500', textTransform: 'capitalize' }}>
                      {configuration.hitchType === 'bumper' ? 'Bumper Pull' : configuration.hitchType === 'gooseneck' ? 'Gooseneck' : 'Flexible'}
                    </div>
                  </div>
                )}
              </div>

              {/* Priorities */}
              {needsAssessment.priorities.length > 0 && (
                <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '8px' }}>Your Priorities</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {needsAssessment.priorities.map(p => (
                      <span key={p} style={{
                        padding: '4px 10px',
                        background: `${brandConfig.primaryColor}15`,
                        color: brandConfig.primaryColor,
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>
                        {needsQuestions[4].options.find(o => o.value === p)?.label}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div style={{
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '24px',
              textAlign: 'center'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 8px 0' }}>
                What would you like to do next?
              </h3>
              <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 20px 0' }}>
                Save your configuration or start fresh
              </p>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
                <button
                  onClick={() => handleLeadCapture('email')}
                  style={{
                    padding: '14px 28px',
                    background: `linear-gradient(135deg, ${brandConfig.primaryColor}, ${brandConfig.primaryColor}dd)`,
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '15px',
                    fontWeight: '600',
                    color: '#fff',
                    cursor: 'pointer'
                  }}
                >
                  📧 Email My Results
                </button>
                <button
                  onClick={() => handleLeadCapture('download')}
                  style={{
                    padding: '14px 28px',
                    background: '#fff',
                    border: `2px solid ${brandConfig.primaryColor}`,
                    borderRadius: '8px',
                    fontSize: '15px',
                    fontWeight: '600',
                    color: brandConfig.primaryColor,
                    cursor: 'pointer'
                  }}
                >
                  📄 Download PDF
                </button>
                <button
                  onClick={handleReset}
                  style={{
                    padding: '14px 28px',
                    background: '#f1f5f9',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '15px',
                    fontWeight: '500',
                    color: '#64748b',
                    cursor: 'pointer'
                  }}
                >
                  🔄 Start Over
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer - Powered By */}
      {brandConfig.showPoweredBy && (
        <div style={{
          textAlign: 'center',
          padding: '24px',
          borderTop: '1px solid #e2e8f0',
          marginTop: '40px'
        }}>
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>
            Powered by <span style={{ fontWeight: '600', color: '#64748b' }}>Next Level Consulting</span>
          </span>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        button:hover {
          transform: translateY(-1px);
        }
        input:focus {
          border-color: ${brandConfig.primaryColor};
          box-shadow: 0 0 0 3px ${brandConfig.primaryColor}20;
        }
      `}</style>
    </div>
  );
};

export default TrailerConfigurator;
