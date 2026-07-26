// Mock API Responses for Frontend Development

export const fetchMockProfile = async () => {
    return {
      userId: 1,
      fullName: "Rajesh Kumar",
      dateOfBirth: "1990-05-15",
      age: 36,
      gender: "Male",
      email: "rajesh@email.com",
      phone: "9876543210",
      state: "Maharashtra",
      district: "Mumbai",
      annualIncome: 450000,
      employmentType: "Salaried",
      casteCategory: "OBC",
      educationLevel: "Graduate",
      bplCardStatus: false
    };
  };
  
  export const fetchMockSchemes = async () => {
    return [
      {
        id: 1,
        name: "Pradhan Mantri Awas Yojana",
        department: "Ministry of Housing",
        description: "Affordable housing scheme for urban poor",
        benefits: "₹2.5L subsidy",
        eligibilityAgeMin: 18,
        eligibilityAgeMax: 65,
        incomeLimit: 600000,
        documents: ["Aadhar", "Income Proof", "Address Proof"]
      },
      {
        id: 2,
        name: "PM-KISAN Samman Nidhi",
        department: "Ministry of Agriculture",
        description: "Income support for landholding farmer families",
        benefits: "₹6,000 per year",
        eligibilityAgeMin: 18,
        eligibilityAgeMax: 99,
        incomeLimit: null,
        documents: ["Aadhar", "Land Papers", "Bank Passbook"]
      }
    ];
  };
  
  export const fetchMockRecommendations = async () => {
    return [
      {
        schemeId: 1,
        matchPercentage: 92,
        reason: "Matches your income (₹4.5L < ₹6L) and location (Urban Maharashtra)"
      }
    ];
  };
