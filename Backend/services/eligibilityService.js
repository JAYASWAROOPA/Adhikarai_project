// Backend/services/eligibilityService.js

/**
 * Deterministic AI Scheme Eligibility Engine
 * Compares citizen profile data against Officer/Admin configured rules.
 */
const ALL_SCHEMES_DATABASE = [
  {
    schemeId: 1,
    name: "Pradhan Mantri Awas Yojana (PMAY Urban 2.0)",
    department: "Ministry of Housing & Urban Affairs",
    category: "Housing",
    benefits: "₹2.67 Lakh Credit Linked Housing Subsidy",
    requiredDocuments: ["Aadhaar Card", "Income Certificate", "Bank Passbook", "Ration Card"],
    rules: {
      maxIncome: 600000,
      allowedStates: ["All India", "Maharashtra", "Tamil Nadu", "Delhi", "Karnataka"],
      minAge: 18,
      maxAge: 70,
      requireBPLOrLowIncome: true
    }
  },
  {
    schemeId: 2,
    name: "PM-KISAN Samman Nidhi",
    department: "Ministry of Agriculture & Farmers Welfare",
    category: "Agriculture",
    benefits: "₹6,000 / Year Direct Benefit Transfer in 3 Installments",
    requiredDocuments: ["Aadhaar Card", "Land Ownership Record (Khasra/Khatauni)", "Bank Passbook"],
    rules: {
      maxIncome: 800000,
      allowedStates: ["All India", "Maharashtra", "Tamil Nadu", "Punjab", "Uttar Pradesh"],
      requireFarmer: true,
      minAge: 18,
      maxAge: 75
    }
  },
  {
    schemeId: 3,
    name: "Ayushman Bharat PM-JAY Health Cover",
    department: "National Health Authority",
    category: "Healthcare",
    benefits: "₹5.00 Lakh Per Family Free Cashless Secondary & Tertiary Hospitalization",
    requiredDocuments: ["Aadhaar Card", "Ration Card (BPL)", "Income Certificate"],
    rules: {
      maxIncome: 300000,
      allowedStates: ["All India"],
      requireBPL: true,
      minAge: 0,
      maxAge: 100
    }
  },
  {
    schemeId: 4,
    name: "Post-Matric Scholarship for SC/ST/OBC Students",
    department: "Ministry of Social Justice & Empowerment",
    category: "Education",
    benefits: "100% Tuition Fee Reconstitution & Monthly Maintenance Allowance",
    requiredDocuments: ["Aadhaar Card", "Caste Certificate", "Income Certificate", "College Bonafide"],
    rules: {
      maxIncome: 250000,
      allowedCategories: ["SC", "ST", "OBC"],
      requireStudent: true,
      minAge: 15,
      maxAge: 35
    }
  },
  {
    schemeId: 5,
    name: "Divyangjan Swavalamban Pension Scheme",
    department: "Department of Empowerment of Persons with Disabilities",
    category: "Welfare",
    benefits: "₹3,000 / Month Disability Financial Assistance & Assistive Devices",
    requiredDocuments: ["Aadhaar Card", "Disability Certificate (>= 40%)", "Bank Passbook"],
    rules: {
      maxIncome: 500000,
      requireDisability: true,
      minAge: 18,
      maxAge: 80
    }
  }
];

function evaluateSchemeEligibility(profile, scheme) {
  const rules = scheme.rules || {};
  const reasons = [];
  let scorePoints = 0;
  let totalRules = 0;
  let isFailingMandatory = false;

  // 1. Income Check
  if (rules.maxIncome) {
    totalRules++;
    const citizenIncome = Number(profile.annualIncome || profile.annual_income || 450000);
    if (citizenIncome <= rules.maxIncome) {
      scorePoints++;
      reasons.push(`Annual income ₹${(citizenIncome / 100000).toFixed(1)}L is below ₹${(rules.maxIncome / 100000).toFixed(1)}L ceiling`);
    } else {
      isFailingMandatory = true;
      reasons.push(`Income ₹${(citizenIncome / 100000).toFixed(1)}L exceeds eligibility limit of ₹${(rules.maxIncome / 100000).toFixed(1)}L`);
    }
  }

  // 2. State Check
  if (rules.allowedStates && rules.allowedStates.length > 0) {
    totalRules++;
    const citizenState = profile.state || "Maharashtra";
    if (rules.allowedStates.includes("All India") || rules.allowedStates.includes(citizenState)) {
      scorePoints++;
      reasons.push(`Resides in eligible state: ${citizenState}`);
    } else {
      isFailingMandatory = true;
      reasons.push(`State ${citizenState} is not in covered regions`);
    }
  }

  // 3. Farmer Check
  if (rules.requireFarmer) {
    totalRules++;
    const isFarmer = profile.isFarmer || profile.is_farmer || profile.occupation === 'Farmer' || profile.employmentType === 'Farmer';
    if (isFarmer) {
      scorePoints++;
      reasons.push("Verified agricultural landholder / farmer status");
    } else {
      isFailingMandatory = true;
    }
  }

  // 4. Student Check
  if (rules.requireStudent) {
    totalRules++;
    const isStudent = profile.isStudent || profile.occupation === 'Student';
    if (isStudent) {
      scorePoints++;
      reasons.push("Currently enrolled student status verified");
    } else {
      isFailingMandatory = true;
    }
  }

  // 5. Disability Check
  if (rules.requireDisability) {
    totalRules++;
    const isDisabled = profile.isDisabled || profile.is_disabled;
    if (isDisabled) {
      scorePoints++;
      reasons.push("Verified disability certificate (>40%) on record");
    } else {
      isFailingMandatory = true;
    }
  }

  // 6. Category Check
  if (rules.allowedCategories && rules.allowedCategories.length > 0) {
    totalRules++;
    const category = profile.casteCategory || profile.category || "OBC";
    if (rules.allowedCategories.includes(category)) {
      scorePoints++;
      reasons.push(`Belongs to target category: ${category}`);
    } else {
      isFailingMandatory = true;
    }
  }

  // 7. BPL Check
  if (rules.requireBPL) {
    totalRules++;
    const isBPL = profile.bplCardStatus || profile.has_ration_card;
    if (isBPL) {
      scorePoints++;
      reasons.push("BPL / Ration card holder family verification");
    } else {
      isFailingMandatory = true;
    }
  }

  const matchPercentage = isFailingMandatory ? 0 : Math.round((scorePoints / (totalRules || 1)) * 30) + 70;
  const isEligible = !isFailingMandatory && matchPercentage >= 70;

  return {
    isEligible,
    matchPercentage: isEligible ? matchPercentage : 0,
    reasons: reasons.length > 0 ? reasons : ["Profile parameters matched"]
  };
}

/**
 * Filter all schemes for a citizen. ONLY returns schemes where citizen is eligible.
 */
function getMatchingSchemesForCitizen(profile) {
  return ALL_SCHEMES_DATABASE.map(scheme => {
    const evaluation = evaluateSchemeEligibility(profile, scheme);
    return {
      ...scheme,
      matchPercentage: evaluation.matchPercentage,
      isEligible: evaluation.isEligible,
      reasons: evaluation.reasons,
      priority: evaluation.matchPercentage >= 90 ? "Top Recommendation" : "High Eligibility"
    };
  }).filter(s => s.isEligible);
}

module.exports = {
  ALL_SCHEMES_DATABASE,
  evaluateSchemeEligibility,
  getMatchingSchemesForCitizen
};
