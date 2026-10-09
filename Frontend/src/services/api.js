const API_BASE_URL = 'http://localhost:5000/api';

const isDemoToken = (token) => {
  if (!token) return false;
  return token.startsWith('mock_jwt_token_') || token === 'mock_jwt_token' || token.startsWith('jwt_token_');
};

// Helper for making API calls with fallback to mock data if backend server is unreachable
async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    if (response.status === 401) {
      if (!isDemoToken(token)) {
        localStorage.removeItem('token');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login?expired=true';
        }
      }
      throw new Error('401 Unauthorized: Session expired or invalid token');
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn('Backend API request failed:', error.message);
    return null;
  }
}

export const authService = {
  login: async (identifier, password) => {
    const data = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ identifier, password })
    });
    if (!data?.success || !data.token || !data.user) {
      throw new Error(data?.message || 'Unable to sign in. Check the API server and your credentials.');
    }
    return data;
  }
};

// 📊 1. Centralized Citizen Content Service
export const contentService = {
  getLandingContent: async () => {
    const data = await apiFetch('/content/landing');
    return data || {
      hero: {
        title: {
          hindi: "सशक्त नागरिक, सशक्त भारत",
          english: "Empowering Citizens, Building India"
        },
        subtitle: "AI-Powered Platform for Government Scheme Discovery & Application",
        ctas: [
          { text: "Explore Schemes", url: "/schemes", variant: "primary" },
          { text: "Get Started", url: "/signup", variant: "outline" }
        ],
        stats: [
          { label: "Total Schemes", value: 500, icon: "📋" },
          { label: "Active Citizens", value: 50000, icon: "👥" },
          { label: "Success Rate", value: 98, icon: "⭐" }
        ],
        trustIndicators: [
          "Govt of India Initiative",
          "Secure & Verified",
          "Free Service"
        ]
      }
    };
  },

  getHowItWorks: async () => {
    const data = await apiFetch('/content/how-it-works');
    return data || {
      steps: [
        {
          step: 1,
          title: "Create Your Profile",
          description: "Complete your citizen profile in 5 minutes with 15+ datapoints",
          icon: "UserPlus",
          features: ["Aadhaar Integration", "Document Upload", "Profile Verification"]
        },
        {
          step: 2,
          title: "Discover Schemes",
          description: "AI finds personalized schemes matched to your eligibility",
          icon: "Search",
          features: ["Eligibility Check", "Smart Matching", "Real-time Updates"]
        },
        {
          step: 3,
          title: "Apply & Track",
          description: "Apply seamlessly online and track progress in real-time",
          icon: "CheckCircle",
          features: ["Application Status", "Document Management", "Timeline Tracking"]
        }
      ]
    };
  },

  getFeaturedSchemes: async () => {
    const data = await apiFetch('/schemes/featured');
    if (data) return data;
    const allSchemes = await apiFetch('/schemes');
    return allSchemes || [
      {
        id: 1,
        name: "Pradhan Mantri Awas Yojana (PMAY)",
        department: { name: "Ministry of Housing & Urban Affairs", logo: "🏛️" },
        category: "Housing",
        description: "Affordable housing scheme offering credit linked interest subsidy for urban & rural poor",
        benefits: "₹2.5L subsidy on home loans",
        matchPercentage: 92,
        applicants: 25847,
        status: "active"
      },
      {
        id: 2,
        name: "PM-KISAN Samman Nidhi",
        department: { name: "Ministry of Agriculture", logo: "🌾" },
        category: "Agriculture",
        description: "Direct income support of ₹6,000 per year in 3 equal installments to small & marginal farmers",
        benefits: "₹6,000 per year direct transfer",
        matchPercentage: 85,
        applicants: 98200,
        status: "active"
      },
      {
        id: 3,
        name: "Ayushman Bharat PM-JAY",
        department: { name: "Ministry of Health & Family Welfare", logo: "🏥" },
        category: "Healthcare",
        description: "Health insurance coverage up to ₹5 Lakhs per family per year for secondary & tertiary hospital care",
        benefits: "₹5L/year health cover",
        matchPercentage: 95,
        applicants: 154000,
        status: "active"
      }
    ];
  },

  getSuccessStories: async () => {
    const data = await apiFetch('/content/success-stories');
    return data || [
      {
        id: 1,
        citizenName: "Rajesh Kumar",
        location: "Mumbai, Maharashtra",
        schemeName: "Pradhan Mantri Awas Yojana",
        benefit: "Housing subsidy of ₹2.5L",
        story: "I was able to build my dream home. ADHIKARAI guided me through the entire eligibility check and application process seamlessly!",
        rating: 5,
        photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
      },
      {
        id: 2,
        citizenName: "Sunita Devi",
        location: "Chennai, Tamil Nadu",
        schemeName: "PM-KISAN",
        benefit: "Direct support ₹6,000/yr",
        story: "The AI assistant explained the exact document checklist in Tamil and helped me receive direct farmer benefits without hassle.",
        rating: 5,
        photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150"
      }
    ];
  },

  getStatistics: async () => {
    const data = await apiFetch('/content/statistics');
    return data || {
      totalSchemes: 520,
      verifiedApplicants: 125000,
      totalSubsidiesDisbursed: "₹450 Cr+",
      satisfactionRate: "99.2%"
    };
  },

  getDepartments: async () => {
    const data = await apiFetch('/departments');
    return data || [
      {
        id: 1,
        name: "Ministry of Housing and Urban Affairs",
        abbreviation: "MoHUA",
        logo: "🏛️",
        schemeCount: 12,
        description: "Formulation of policies and housing schemes in urban areas."
      },
      {
        id: 2,
        name: "Ministry of Agriculture & Farmers Welfare",
        abbreviation: "MoAFW",
        logo: "🌾",
        schemeCount: 18,
        description: "Promoting sustainable agriculture and farmer income support."
      },
      {
        id: 3,
        name: "Ministry of Health and Family Welfare",
        abbreviation: "MoHFW",
        logo: "🏥",
        schemeCount: 15,
        description: "Health insurance and public wellness infrastructure."
      },
      {
        id: 4,
        name: "Ministry of Social Justice and Empowerment",
        abbreviation: "MoSJE",
        logo: "⚖️",
        schemeCount: 22,
        description: "Welfare and social security programs for targeted communities."
      }
    ];
  },

  getDashboardData: async () => {
    const data = await apiFetch('/dashboard');
    return data || {
      user: {
        name: "Rajesh Kumar",
        email: "citizen@adhikarai.gov.in",
        memberSince: "2024-01-15",
        lastLogin: new Date().toISOString()
      },
      stats: {
        eligibleSchemes: 12,
        applications: 5,
        approved: 3,
        profileStrength: 85
      },
      timeline: {
        steps: [
          { id: 1, label: "Personal Info", completed: true },
          { id: 2, label: "Contact Details", completed: true },
          { id: 3, label: "Economic Status", completed: true },
          { id: 4, label: "Documents", completed: false },
          { id: 5, label: "Verification", completed: false }
        ]
      }
    };
  },

  getRecentActivity: async () => {
    const data = await apiFetch('/dashboard/activity');
    return data || [
      {
        id: 1,
        type: "application",
        action: "Applied for Pradhan Mantri Awas Yojana (PMAY)",
        timestamp: "2 hours ago",
        status: "pending",
        icon: "📄"
      },
      {
        id: 2,
        type: "profile",
        action: "Updated income details (Annual Income: ₹4,50,000)",
        timestamp: "1 day ago",
        status: "completed",
        icon: "✏️"
      },
      {
        id: 3,
        type: "system",
        action: "AI matched 3 new eligible schemes for your profile",
        timestamp: "3 days ago",
        status: "completed",
        icon: "🤖"
      }
    ];
  },

  getRecommendations: async () => {
    const data = await apiFetch('/schemes/recommendations');
    return data || {
      recommendations: [
        {
          schemeId: 1,
          name: "Pradhan Mantri Awas Yojana",
          matchPercentage: 92,
          benefits: "₹2.5L housing subsidy",
          reason: "Matches your income (₹4.5L < ₹6L limit) and location (Maharashtra)",
          eligibility: "eligible",
          priority: "high"
        },
        {
          schemeId: 2,
          name: "PM-KISAN Samman Nidhi",
          matchPercentage: 85,
          benefits: "₹6,000/year direct credit",
          reason: "Matches landholding farmer criteria",
          eligibility: "eligible",
          priority: "medium"
        },
        {
          schemeId: 3,
          name: "Ayushman Bharat PM-JAY",
          matchPercentage: 95,
          benefits: "₹5L family health coverage",
          reason: "Income bracket eligible for PM-JAY health insurance",
          eligibility: "eligible",
          priority: "high"
        }
      ],
      totalFound: 7,
      nextSteps: "Complete your profile for 100% accurate matching"
    };
  },

  getSchemes: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    const data = await apiFetch(`/schemes?${queryParams}`);
    return data || [
      {
        id: 1,
        name: "Pradhan Mantri Awas Yojana (PMAY)",
        department: "Ministry of Housing & Urban Affairs",
        category: "Housing",
        description: "Affordable housing scheme for urban and rural poor providing subsidy on home loan interest.",
        benefits: "₹2.5L housing subsidy",
        eligibilityAgeMin: 18,
        eligibilityAgeMax: 65,
        incomeLimit: 600000,
        documents: ["Aadhaar Card", "Income Certificate", "Address Proof"]
      },
      {
        id: 2,
        name: "PM-KISAN Samman Nidhi",
        department: "Ministry of Agriculture",
        category: "Agriculture",
        description: "Income support for landholding farmer families across India.",
        benefits: "₹6,000 per year",
        eligibilityAgeMin: 18,
        eligibilityAgeMax: 99,
        incomeLimit: null,
        documents: ["Aadhaar Card", "Land Ownership Record"]
      },
      {
        id: 3,
        name: "Ayushman Bharat PM-JAY",
        department: "Ministry of Health & Family Welfare",
        category: "Healthcare",
        description: "World's largest health assurance scheme giving cash-free hospital care up to ₹5 Lakhs.",
        benefits: "₹5L health coverage per year",
        eligibilityAgeMin: 0,
        eligibilityAgeMax: 99,
        incomeLimit: 500000,
        documents: ["Aadhaar Card", "Ration Card / BPL Proof"]
      }
    ];
  },

  getSchemeDetails: async (id) => {
    const data = await apiFetch(`/schemes/${id}`);
    return data || {
      id: parseInt(id),
      name: "Pradhan Mantri Awas Yojana (PMAY)",
      department: {
        id: 1,
        name: "Ministry of Housing and Urban Affairs",
        logo: "mohua.png",
        website: "https://pmaymis.gov.in"
      },
      category: "Housing",
      description: "Affordable housing scheme providing subsidy on home loans for urban and rural poor.",
      benefits: {
        subsidy: "₹2.5L",
        interestRate: "6.5%",
        loanAmount: "Up to ₹12L"
      },
      eligibility: {
        ageMin: 18,
        ageMax: 65,
        incomeLimit: 600000,
        states: ["Maharashtra", "Gujarat", "Tamil Nadu", "All India"],
        casteCategories: ["General", "OBC", "SC", "ST", "EWS"],
        occupation: ["All"]
      },
      documents: [
        { name: "Aadhaar Card", required: true, uploadStatus: "uploaded" },
        { name: "Income Certificate", required: true, uploadStatus: "uploaded" },
        { name: "Address Proof", required: true, uploadStatus: "missing" },
        { name: "Bank Account Details", required: true, uploadStatus: "uploaded" }
      ],
      applicationProcess: [
        "Check eligibility online on ADHIKARAI",
        "Gather required documents (Aadhaar, Income cert)",
        "Fill application form online or through CSC",
        "Submit online and track verification status",
        "Receive direct benefit disbursement"
      ],
      statistics: {
        totalApplicants: 25847,
        successRate: 78,
        averageTime: "15 days"
      },
      userEligibility: {
        eligible: true,
        matchPercentage: 92,
        reasons: [
          "Age: 35 (Within 18-65 range)",
          "Income: ₹4.5L (Below ₹6L limit)",
          "Location: Maharashtra (Eligible state)",
          "Caste: OBC (Eligible category)"
        ],
        missingCriteria: ["Land / House Non-Ownership Proof"]
      }
    };
  },

  getProfile: async () => {
    const data = await apiFetch('/profile');
    return data || {
      fullName: "Rajesh Kumar",
      dateOfBirth: "1989-05-15",
      gender: "Male",
      maritalStatus: "Married",
      nationality: "Indian",
      aadharNumber: "9876-5432-1098",
      panCard: "ABCDE1234F",
      email: "citizen@adhikarai.gov.in",
      phoneNumber: "+91 98765 43210",
      state: "Maharashtra",
      district: "Mumbai",
      pincode: "400001",
      address: "123 Green Park Colony, Andheri West, Mumbai",
      annualIncome: 450000,
      employmentType: "Salaried",
      occupation: "Technician",
      familyMembers: 4,
      bplCardStatus: false,
      casteCategory: "OBC",
      educationLevel: "Graduate"
    };
  },

  updateProfile: async (profileData) => {
    const data = await apiFetch('/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
    return data || { success: true, message: "Profile updated successfully!" };
  },

  sendChatMessage: async (message) => {
    const data = await apiFetch('/assistant/chat', {
      method: 'POST',
      body: JSON.stringify({ message })
    });
    return data || {
      success: true,
      response: {
        type: "eligibility_check",
        content: {
          summary: `Based on your query "${message}", I analyzed your profile against active central & state databases. You are currently eligible for key welfare schemes!`,
          recommendations: [
            {
              id: 1,
              name: "Pradhan Mantri Awas Yojana (PMAY)",
              ministry: "Ministry of Housing & Urban Affairs",
              matchScore: 92,
              benefits: "₹2.67 Lakh Credit Linked Subsidy",
              requirements: ["Aadhaar Card", "Income Certificate", "Bank Passbook"],
              applyUrl: "/apply/1"
            },
            {
              id: 2,
              name: "PM-KISAN Samman Nidhi",
              ministry: "Ministry of Agriculture",
              matchScore: 95,
              benefits: "₹6,000/year Direct Bank Transfer",
              requirements: ["Aadhaar Card", "Land Records", "Bank Passbook"],
              applyUrl: "/apply/2"
            }
          ],
          missingInfo: ["Address Proof in Vault"],
          nextSteps: "Complete your document uploads in the Smart Vault for 1-click application submission."
        },
        suggestions: [
          "Tell me more about PMAY",
          "Check eligibility for PM-KISAN",
          "What documents do I need for Ayushman Bharat?",
          "Nearest e-Seva office"
        ]
      }
    };
  },

  getApplications: async () => {
    const data = await apiFetch('/applications');
    return data || [
      {
        id: "APP-2026-001",
        schemeName: "Pradhan Mantri Awas Yojana (PMAY)",
        department: "Ministry of Housing & Urban Affairs",
        appliedDate: "2026-07-20",
        status: "In Verification",
        stage: "Document Verification",
        progress: 65
      },
      {
        id: "APP-2026-002",
        schemeName: "PM-KISAN Samman Nidhi",
        department: "Ministry of Agriculture",
        appliedDate: "2026-06-10",
        status: "Approved",
        stage: "Benefit Disbursed",
        progress: 100
      }
    ];
  },

  submitApplication: async (appData) => {
    const data = await apiFetch('/applications', {
      method: 'POST',
      body: JSON.stringify(appData)
    });
    return data || {
      success: true,
      applicationId: `APP-2026-${Math.floor(100 + Math.random() * 900)}`,
      message: "Application submitted successfully to department portal!"
    };
  }
};

// 🏛️ 2. Admin API Service
async function adminFetch(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers
    }
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login?expired=true';
    }
    throw new Error(result.message || `Admin request failed (${response.status})`);
  }
  return result;
}

export const adminService = {
  getDashboard: () => adminFetch('/admin/dashboard'),
  getUsers: (params = {}) => adminFetch(`/admin/users?${new URLSearchParams(params)}`),

  updateUser: async (id, userData) => {
    return adminFetch(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
  },
  getOfficers: (params = {}) => adminFetch(`/admin/officers?${new URLSearchParams(params)}`),

  createOfficer: async (officerData) => {
    return adminFetch('/admin/officers', {
      method: 'POST',
      body: JSON.stringify(officerData)
    });
  },
  getSchemes: (params = {}) => adminFetch(`/admin/schemes?${new URLSearchParams(params)}`),
  saveScheme: (schemeData, id) => adminFetch(id ? `/admin/schemes/${id}` : '/admin/schemes', {
      method: id ? 'PUT' : 'POST',
      body: JSON.stringify(schemeData)
  }),
  updateSchemeStatus: (id, status) => adminFetch(`/admin/schemes/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  getAnalytics: () => adminFetch('/admin/analytics'),
  getAuditLogs: (params = {}) => adminFetch(`/admin/audit-logs?${new URLSearchParams(params)}`)
};

// 👮 3. Officer API Service
export const officerService = {
  getApplications: async () => {
    const data = await apiFetch('/officer/applications');
    if (!data?.success || !Array.isArray(data.applications)) {
      throw new Error('Unable to load assigned applications. Check that the officer API is running and try again.');
    }
    return data;
  },

  getDashboard: async () => officerService.getApplications(),

  getPendingVerifications: async () => {
    const data = await officerService.getApplications();
    return data.applications.filter((application) => !['approved', 'verified', 'rejected'].includes(String(application.status).toLowerCase()));
  },

  updateApplicationAction: async (applicationId, action) => {
    const data = await apiFetch(`/officer/applications/${encodeURIComponent(applicationId)}/action`, {
      method: 'POST',
      body: JSON.stringify(action)
    });
    if (!data?.success) throw new Error(data?.message || 'Unable to save the application decision. Please retry.');
    return data;
  },

  getCitizenDetail: async (citizenId) => {
    const data = await apiFetch(`/officer/citizens/${citizenId}`);
    return data || {
      citizen: {
        id: citizenId,
        name: "Rajesh Kumar",
        email: "citizen@adhikarai.gov.in",
        phone: "+91-9876543210",
        aadhar: "9876-5432-1098",
        dob: "1989-05-15",
        age: 35,
        gender: "Male",
        state: "Maharashtra",
        district: "Mumbai",
        address: "123 Green Park Colony, Andheri West, Mumbai",
        income: 450000,
        employment: "Salaried",
        occupation: "Technician",
        caste: "OBC",
        familyMembers: 4,
        bplCard: false,
        education: "Graduate"
      },
      applications: [
        { scheme: "PMAY", status: "under_review", appliedDate: "2026-07-20" },
        { scheme: "PM-KISAN", status: "approved", appliedDate: "2026-06-10" }
      ],
      documents: [
        { name: "Aadhaar Card", status: "verified", uploaded: "2026-07-20" },
        { name: "Income Proof", status: "pending", uploaded: "2026-07-21" },
        { name: "Address Proof", status: "verified", uploaded: "2026-07-20" }
      ],
      verificationHistory: [
        { officer: "Vikram Singh", action: "Documents Review", timestamp: "2026-07-25", notes: "Aadhaar verified. Income certificate pending." }
      ]
    };
  },

  approveApplication: (applicationId, comments) => officerService.updateApplicationAction(applicationId, { status: 'VERIFIED', action: 'Verified', remarks: comments }),

  rejectApplication: async (applicationId, reason) => {
    return officerService.updateApplicationAction(applicationId, { status: 'REJECTED', action: 'Rejected', remarks: reason });
  },

  requestDocuments: async (applicationId, documents) => {
    return officerService.updateApplicationAction(applicationId, { status: 'DOCUMENTS_MISSING', action: 'Additional documents requested', remarks: documents });
  },

  scheduleInterview: async (applicationId, interviewDetails) => {
    return officerService.updateApplicationAction(applicationId, { status: 'UNDER_REVIEW', action: 'Interview scheduled', remarks: JSON.stringify(interviewDetails) });
  },

  generateCertificate: async (_applicationId) => {
    throw new Error('Certificate generation is not available in the officer API yet.');
  },

  getAnalytics: async () => {
    return officerService.getApplications();
  }
};

// ⚡ 4. Auto-Fill & Document Vault Service Engine
export const autoFillService = {
  getAutoFill: async (schemeId) => {
    const data = await apiFetch(`/application/autofill/${schemeId}`);
    return data || {
      success: true,
      schemeId: parseInt(schemeId),
      prefilledData: {
        fullName: "Rajesh Kumar",
        aadhaarNumber: "9876-5432-1098",
        mobileNumber: "+91 98765 43210",
        annualIncome: 450000,
        residentialAddress: "123 Green Park Colony, Andheri West",
        district: "Mumbai",
        state: "Maharashtra",
        bankName: "State Bank of India",
        ifscCode: "SBIN0001234",
        accountNumber: "30987654321"
      },
      autofilledFields: ['fullName', 'aadhaarNumber', 'mobileNumber', 'annualIncome', 'residentialAddress', 'district', 'state', 'bankName', 'ifscCode', 'accountNumber'],
      missingFields: [
        { field_key: 'existingHouseStatus', label: 'Do you own a Pucca House?' }
      ],
      autoAttachedDocuments: [
        { id: 101, document_type: 'Aadhaar Card', file_name: 'aadhaar_card_rajesh.pdf', status: 'verified' },
        { id: 102, document_type: 'Income Certificate', file_name: 'income_certificate_2026.pdf', status: 'verified' },
        { id: 103, document_type: 'Bank Passbook', file_name: 'passbook_sbi.pdf', status: 'verified' }
      ],
      missingDocuments: ['Address Proof'],
      completionPercentage: 87
    };
  },

  submitApplication: async (payload) => {
    const data = await apiFetch('/application/submit', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    return data || {
      success: true,
      applicationId: `APP-2026-${Math.floor(100000 + Math.random() * 900000)}`,
      message: 'Application auto-filled and submitted successfully!',
      pdfUrl: `/api/application/pdf/APP-2026-998811`,
      submittedAt: new Date().toISOString(),
      qrCodeData: `ADHIKARAI-GOV-APP-2026-998811`
    };
  }
};

export const documentVaultService = {
  getDocuments: async () => {
    const data = await apiFetch('/documents');
    return data || {
      success: true,
      documents: [
        { id: 101, document_type: 'Aadhaar Card', file_name: 'aadhaar_card_rajesh.pdf', file_size_kb: 420, upload_date: '2026-07-20', expiry_date: '2030-12-31', status: 'verified' },
        { id: 102, document_type: 'Income Certificate', file_name: 'income_certificate_2026.pdf', file_size_kb: 650, upload_date: '2026-07-21', expiry_date: '2027-03-31', status: 'verified' },
        { id: 103, document_type: 'Bank Passbook', file_name: 'passbook_sbi.pdf', file_size_kb: 890, upload_date: '2026-07-22', expiry_date: null, status: 'verified' },
        { id: 104, document_type: 'Land Records', file_name: 'khasra_772_land.pdf', file_size_kb: 1200, upload_date: '2026-07-22', expiry_date: null, status: 'verified' },
        { id: 105, document_type: 'Ration Card', file_name: 'ration_card_bpl.pdf', file_size_kb: 340, upload_date: '2026-07-23', expiry_date: null, status: 'verified' }
      ],
      vaultUsage: { usedKb: 3500, totalKb: 50000, maxSizeMb: 5 }
    };
  },

  uploadDocument: async (docData) => {
    const data = await apiFetch('/documents/upload', {
      method: 'POST',
      body: JSON.stringify(docData)
    });
    return data || {
      success: true,
      message: 'Document uploaded and attached to Vault!',
      document: {
        id: Date.now(),
        document_type: docData.documentType || 'Other Document',
        file_name: docData.fileName || 'uploaded_document.pdf',
        file_size_kb: 512,
        upload_date: new Date().toISOString().split('T')[0],
        status: 'verified'
      }
    };
  },

  deleteDocument: async (id) => {
    const data = await apiFetch(`/documents/${id}`, { method: 'DELETE' });
    return data || { success: true, message: 'Document removed from Vault' };
  }
};

// 📍 5. Nearby Government Office Locator Service
export const officeService = {
  getNearbyOffices: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const data = await apiFetch(`/offices/nearby?${query}`);
    return data || {
      success: true,
      totalOffices: 6,
      categories: [
        { id: 1, code: 'all', name: 'All Office Categories' },
        { id: 2, code: 'tahsildar', name: 'Tahsildar Office' },
        { id: 3, code: 'panchayat', name: 'Panchayat Office' },
        { id: 4, code: 'municipal', name: 'Municipal Office' },
        { id: 5, code: 'csc', name: 'Common Service Center (CSC)' },
        { id: 6, code: 'collectorate', name: 'District Collectorate' },
        { id: 7, code: 'dbt_bank', name: 'DBT-Linked Bank' },
        { id: 8, code: 'post_office', name: 'Post Office / IPPB' },
        { id: 9, code: 'aadhaar_center', name: 'Aadhaar Center' },
        { id: 10, code: 'bdo', name: 'Block Dev Office (BDO)' }
      ],
      offices: [
        {
          id: 101,
          name: 'Tahsildar & Revenue Office - Andheri West',
          category_code: 'tahsildar',
          category_name: 'Tahsildar Office',
          address: 'Old Police Station Compound, S.V. Road, Andheri West',
          district: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400058',
          distance_km: 1.8,
          travel_time: '6 mins drive (18 mins walk)',
          contact_number: '+91 22 2620 4589',
          email: 'tahsildar.andheri@maharashtra.gov.in',
          officer_name: 'Mr. Suresh Patil (Tehsildar)',
          timings: '09:30 AM - 05:30 PM (Mon-Sat)',
          is_open: true,
          wheelchair_accessible: true,
          google_maps_url: 'https://www.google.com/maps/dir/?api=1&destination=19.1197,72.8464',
          services: ['Income Certificate', 'Community / Caste Certificate', 'Solvency Certificate', 'Land Revenue Verification'],
          parking: 'Free Public Parking Available',
          public_transport: '5 mins walk from Andheri Railway Station'
        },
        {
          id: 102,
          name: 'Common Service Center (CSC) - Bandra e-Seva',
          category_code: 'csc',
          category_name: 'Common Service Center (CSC)',
          address: 'Shop 12, Hill Road, Near Elco Market, Bandra West',
          district: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400050',
          distance_km: 2.4,
          travel_time: '8 mins drive (24 mins walk)',
          contact_number: '+91 98201 45902',
          email: 'csc.bandra@eshop.gov.in',
          officer_name: 'Vikas Kadam (CSC Manager)',
          timings: '09:00 AM - 08:00 PM (Daily)',
          is_open: true,
          wheelchair_accessible: true,
          google_maps_url: 'https://www.google.com/maps/dir/?api=1&destination=19.0544,72.8402',
          services: ['Aadhaar Print & Update', 'PMAY Online Application', 'PM-KISAN E-KYC', 'Ayushman Bharat Card'],
          parking: 'Paid Two-Wheeler Parking',
          public_transport: '10 mins bus from Bandra Station'
        },
        {
          id: 104,
          name: 'State Bank of India (DBT Nodal Branch) - Fort',
          category_code: 'dbt_bank',
          category_name: 'DBT-Linked Bank',
          address: 'Main Building, Horniman Circle, Fort',
          district: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
          distance_km: 3.1,
          travel_time: '12 mins drive',
          contact_number: '+91 22 2266 0123',
          email: 'dbt.fort@sbi.co.in',
          officer_name: 'Priya Nair (Chief Nodal Officer)',
          timings: '10:00 AM - 04:00 PM (Mon-Sat)',
          is_open: true,
          wheelchair_accessible: true,
          google_maps_url: 'https://www.google.com/maps/dir/?api=1&destination=18.9322,72.8335',
          services: ['Direct Benefit Transfer Account Seeding', 'Aadhaar-NPCI Mapper', 'PM-KISAN DBT Beneficiary Account'],
          parking: 'Street Parking (Pay & Park)',
          public_transport: '5 mins walk from CST Railway Station'
        }
      ]
    };
  },

  getOfficeById: async (id) => {
    const data = await apiFetch(`/offices/${id}`);
    return data || {
      success: true,
      office: {
        id: parseInt(id),
        name: 'Tahsildar & Revenue Office - Andheri West',
        category_code: 'tahsildar',
        category_name: 'Tahsildar Office',
        address: 'Old Police Station Compound, S.V. Road, Andheri West',
        district: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400058',
        distance_km: 1.8,
        travel_time: '6 mins drive (18 mins walk)',
        contact_number: '+91 22 2620 4589',
        email: 'tahsildar.andheri@maharashtra.gov.in',
        officer_name: 'Mr. Suresh Patil (Tehsildar)',
        timings: '09:30 AM - 05:30 PM (Mon-Sat)',
        is_open: true,
        wheelchair_accessible: true,
        google_maps_url: 'https://www.google.com/maps/dir/?api=1&destination=19.1197,72.8464',
        services: ['Income Certificate', 'Community / Caste Certificate', 'Solvency Certificate', 'Land Revenue Verification', 'Domicile Certificate'],
        parking: 'Free Public Parking Available',
        public_transport: '5 mins walk from Andheri Railway Station / Metro'
      }
    };
  },

  getOfficesForScheme: async (schemeId) => {
    const data = await apiFetch(`/offices/scheme/${schemeId}`);
    return data || {
      success: true,
      schemeId: parseInt(schemeId),
      recommendedOffices: [
        {
          id: 101,
          name: 'Tahsildar & Revenue Office - Andheri West',
          category_name: 'Tahsildar Office',
          address: 'S.V. Road, Andheri West',
          district: 'Mumbai',
          distance_km: 1.8,
          travel_time: '6 mins drive',
          google_maps_url: 'https://www.google.com/maps/dir/?api=1&destination=19.1197,72.8464'
        },
        {
          id: 102,
          name: 'Common Service Center (CSC) - Bandra e-Seva',
          category_name: 'CSC Center',
          address: 'Hill Road, Bandra West',
          district: 'Mumbai',
          distance_km: 2.4,
          travel_time: '8 mins drive',
          google_maps_url: 'https://www.google.com/maps/dir/?api=1&destination=19.0544,72.8402'
        },
        {
          id: 104,
          name: 'State Bank of India (DBT Branch) - Fort',
          category_name: 'DBT Bank',
          address: 'Horniman Circle, Fort',
          district: 'Mumbai',
          distance_km: 3.1,
          travel_time: '12 mins drive',
          google_maps_url: 'https://www.google.com/maps/dir/?api=1&destination=18.9322,72.8335'
        }
      ]
    };
  }
};

// Legacy exports
export const fetchMockProfile = contentService.getProfile;
export const fetchMockSchemes = contentService.getSchemes;
export const fetchMockRecommendations = contentService.getRecommendations;


