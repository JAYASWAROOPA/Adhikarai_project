// Backend/services/aiAssistantService.js

// Mock Citizen Profile (30+ Data Points)
const DEFAULT_CITIZEN_PROFILE = {
  name: "Rajesh Kumar",
  age: 35,
  gender: "Male",
  district: "Mumbai",
  state: "Maharashtra",
  annualIncome: 450000,
  casteCategory: "OBC",
  bplStatus: false,
  farmerStatus: true,
  landDetails: "Khasra No. 402/B (1.5 Acres)",
  aadhaarNumber: "9876-5432-1098",
  rationCardNumber: "RAT-2024-8890"
};

// Vault Documents
const VAULT_DOCUMENTS = [
  'Aadhaar Card',
  'Income Certificate',
  'Bank Passbook',
  'Land Records'
];

exports.processUserMessage = async (userPrompt, profile = DEFAULT_CITIZEN_PROFILE) => {
  const query = (userPrompt || '').toLowerCase();
  
  let intent = 'general_query';
  let summary = '';
  let recommendations = [];
  let missingInfo = [];
  let requiredDocs = [];
  let suggestions = [];

  // 1. Affection / Appreciation Intent
  if (/\b(i love you|love you|love u|i love u|thank you|thanks|awesome|best bot|great job)\b/.test(query)) {
    intent = 'affection';
    summary = `That is so kind of you, ${profile.name}! 💙 As your AI Government Welfare Assistant, my true passion is empowering citizens like you with direct, seamless access to government schemes, housing subsidies, and welfare benefits. How can I assist you with your welfare applications today?`;
    suggestions = [
      'What schemes am I eligible for?',
      'Tell me about PMAY Housing Scheme',
      'Check PM-KISAN Farmer Grant',
      'Where is my nearest Tahsildar office?'
    ];
  }
  // 2. Greeting Intent
  else if (/\b(hi|hello|hey|namaste|greetings|who are you)\b/.test(query)) {
    intent = 'greeting';
    summary = `Hello ${profile.name}! I am your AI Government Scheme Assistant powered by LangChain reasoning. I can check your eligibility across 500+ welfare schemes, tell you required documents, or navigate you to nearest e-Seva offices. What can I help you with today?`;
    suggestions = [
      'What schemes am I eligible for?',
      'Tell me about PMAY Housing Scheme',
      'Check PM-KISAN Farmer Grant',
      'Where is my nearest Tahsildar office?'
    ];
  }
  // 2. Eligibility Check Intent
  else if (/\b(eligible|eligibility|my schemes|what can i get|qualify|matches)\b/.test(query)) {
    intent = 'eligibility_check';
    summary = `Based on your profile (Age: ${profile.age}, Income: ₹${profile.annualIncome.toLocaleString()}, Caste: ${profile.casteCategory}, Location: ${profile.district}, ${profile.state}), I evaluated active database rules and found 3 high-matching schemes for you:`;
    
    recommendations = [
      {
        id: 1,
        name: "Pradhan Mantri Awas Yojana (PMAY)",
        ministry: "Ministry of Housing & Urban Affairs",
        matchScore: 92,
        benefits: "Up to ₹2.67 Lakh Interest Subsidy on Housing Loan",
        reasons: [`Income ₹${profile.annualIncome.toLocaleString()} falls under EWS/LIG ceiling`, `Resident of ${profile.state}`, `First-time home buyer`],
        requirements: ["Aadhaar Card", "Income Certificate", "Bank Passbook"],
        applyUrl: "/apply/1"
      },
      {
        id: 2,
        name: "PM-KISAN Samman Nidhi",
        ministry: "Ministry of Agriculture & Farmers Welfare",
        matchScore: 95,
        benefits: "₹6,000 Direct Bank Transfer annually in 3 installments",
        reasons: [`Registered Landholding Farmer`, `Khasra Land Survey Verified (${profile.landDetails})`, `Active Aadhaar-NPCI Bank Seeding`],
        requirements: ["Aadhaar Card", "Land Records", "Bank Passbook"],
        applyUrl: "/apply/2"
      },
      {
        id: 3,
        name: "Ayushman Bharat PM-JAY",
        ministry: "Ministry of Health & Family Welfare",
        matchScore: 88,
        benefits: "₹5.00 Lakh Free Cashless Health Cover per Family",
        reasons: [`OBC Beneficiary Category`, `District ${profile.district} Empaneled Hospitals`],
        requirements: ["Aadhaar Card", "Ration Card"],
        applyUrl: "/apply/3"
      }
    ];

    suggestions = [
      'How do I apply for PMAY?',
      'What documents do I need for PM-KISAN?',
      'Nearest e-Seva office to apply',
      'Update my annual income'
    ];
  }
  // 3. PMAY Scheme Intent
  else if (/\b(pmay|housing|awas|house|home|flat|pucca)\b/.test(query)) {
    intent = 'scheme_pmay';
    summary = `Pradhan Mantri Awas Yojana (PMAY) provides financial assistance up to ₹2.67 Lakhs for constructing or purchasing a home. Your profile matches 92% with this scheme!`;
    
    recommendations = [
      {
        id: 1,
        name: "Pradhan Mantri Awas Yojana (PMAY Urban 2.0)",
        ministry: "Ministry of Housing",
        matchScore: 92,
        benefits: "₹2.67 Lakh Credit Linked Subsidy",
        reasons: [`Income ₹${profile.annualIncome.toLocaleString()} is eligible for LIG tier`, `Location ${profile.district}`],
        requirements: ["Aadhaar Card", "Income Certificate", "Bank Passbook", "Address Proof"],
        applyUrl: "/apply/1"
      }
    ];

    requiredDocs = [
      { name: 'Aadhaar Card', status: 'verified', inVault: true },
      { name: 'Income Certificate', status: 'verified', inVault: true },
      { name: 'Bank Passbook', status: 'verified', inVault: true },
      { name: 'Address Proof', status: 'missing', inVault: false }
    ];

    missingInfo = ['Address Proof Document in Vault'];

    suggestions = [
      'Apply now via AI Auto-Fill Engine',
      'Upload Address Proof to Vault',
      'What is the income limit for PMAY?',
      'Nearest Tahsildar Office'
    ];
  }
  // 4. PM-KISAN Intent
  else if (/\b(kisan|farmer|agriculture|crop|land|pm-kisan)\b/.test(query)) {
    intent = 'scheme_pmkisan';
    summary = `PM-KISAN provides ₹6,000 per year directly to your bank account in 3 equal installments of ₹2,000. You are 95% eligible as a registered farmer!`;
    
    recommendations = [
      {
        id: 2,
        name: "PM-KISAN Samman Nidhi",
        ministry: "Ministry of Agriculture",
        matchScore: 95,
        benefits: "₹6,000/year Direct Benefit Transfer (DBT)",
        reasons: [`Farmer Status: Active`, `Land Record: ${profile.landDetails}`],
        requirements: ["Aadhaar Card", "Land Records", "Bank Passbook"],
        applyUrl: "/apply/2"
      }
    ];

    requiredDocs = [
      { name: 'Aadhaar Card', status: 'verified', inVault: true },
      { name: 'Land Records (Khasra)', status: 'verified', inVault: true },
      { name: 'Bank Passbook', status: 'verified', inVault: true }
    ];

    suggestions = [
      'Apply for PM-KISAN now',
      'Check DBT bank account status',
      'Nearest Agriculture Office',
      'Back to main recommendations'
    ];
  }
  // 5. Document Query Intent
  else if (/\b(document|documents|paper|papers|certificate|vault)\b/.test(query)) {
    intent = 'document_query';
    summary = `Your Smart Document Vault currently has 4 verified documents: Aadhaar Card, Income Certificate, Bank Passbook, and Land Records. Most welfare schemes require these exact documents, so you can apply without re-uploading!`;
    
    requiredDocs = [
      { name: 'Aadhaar Card', status: 'verified', inVault: true },
      { name: 'Income Certificate', status: 'verified', inVault: true },
      { name: 'Bank Passbook', status: 'verified', inVault: true },
      { name: 'Land Records', status: 'verified', inVault: true }
    ];

    suggestions = [
      'Go to Smart Document Vault',
      'What schemes can I apply for with these docs?',
      'Upload Ration Card',
      'Check PMAY documents'
    ];
  }
  // 6. Nearest Office Query Intent
  else if (/\b(office|offices|location|tahsildar|csc|e-seva|bank|where|near|nearest)\b/.test(query)) {
    intent = 'nearest_office';
    summary = `Based on your location (${profile.district}, ${profile.state}), here are nearby government service centers for application verification:`;
    
    recommendations = [
      {
        id: 101,
        name: "Tahsildar & Revenue Office - Andheri West",
        ministry: "Revenue Department",
        matchScore: 100,
        benefits: "Income Cert, Caste Cert & Estate Verification (1.8 km away • 6 mins drive)",
        requirements: ["S.V. Road, Andheri West"],
        applyUrl: "/offices/101"
      },
      {
        id: 102,
        name: "Common Service Center (CSC) - Bandra e-Seva",
        ministry: "Digital India CSC",
        matchScore: 100,
        benefits: "Aadhaar Print, PMAY Online Submission (2.4 km away • 8 mins drive)",
        requirements: ["Hill Road, Bandra West"],
        applyUrl: "/offices/102"
      }
    ];

    suggestions = [
      'Open Office Locator Map',
      'Filter by Tahsildar Offices',
      'Filter by DBT Banks',
      'What schemes am I eligible for?'
    ];
  }
  // 7. General Fallback
  else {
    intent = 'general_query';
    summary = `I analyzed your query "${userPrompt}". Based on your citizen profile in ${profile.district}, ${profile.state}, you are eligible for central and state welfare programs across Housing, Agriculture, and Health.`;
    
    recommendations = [
      {
        id: 1,
        name: "Pradhan Mantri Awas Yojana (PMAY)",
        ministry: "Ministry of Housing",
        matchScore: 92,
        benefits: "₹2.67 Lakh Housing Subsidy",
        applyUrl: "/apply/1"
      },
      {
        id: 2,
        name: "PM-KISAN Samman Nidhi",
        ministry: "Ministry of Agriculture",
        matchScore: 95,
        benefits: "₹6,000/year Direct Credit",
        applyUrl: "/apply/2"
      }
    ];

    suggestions = [
      'Am I eligible for PMAY?',
      'Show my document vault',
      'Nearest government offices',
      'Reset conversation'
    ];
  }

  return {
    type: intent,
    content: {
      summary,
      recommendations,
      missingInfo,
      requiredDocs
    },
    suggestions
  };
};
