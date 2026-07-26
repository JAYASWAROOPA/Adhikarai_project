const API_BASE_URL = 'http://localhost:5000/api';

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
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn(`Backend API unavailable at ${endpoint}, using mock fallback:`, error.message);
    return null;
  }
}

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
    const data = await apiFetch('/chat', {
      method: 'POST',
      body: JSON.stringify({ message })
    });
    return data || {
      type: "eligibility_check",
      content: {
        summary: `Based on your query "${message}", I analyzed your profile against active central & state databases. You are currently eligible for 7 key welfare schemes!`,
        recommendations: [
          {
            name: "Pradhan Mantri Awas Yojana (PMAY)",
            matchScore: 92,
            benefits: "₹2.5L housing subsidy",
            requirements: ["Age: 18-65", "Income: <₹6L", "Location: All States"]
          },
          {
            name: "Ayushman Bharat PM-JAY",
            matchScore: 95,
            benefits: "₹5L family health coverage",
            requirements: ["Income: <₹5L", "No existing private insurance"]
          }
        ],
        missingInfo: ["BPL Card Status verification"],
        nextSteps: "Complete your document uploads in the Profile section for instant application submission."
      },
      suggestions: [
        "Tell me more about PMAY",
        "Check eligibility for PM-KISAN",
        "What documents do I need for Ayushman Bharat?",
        "How do I track my active applications?"
      ]
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
export const adminService = {
  getDashboard: async () => {
    const data = await apiFetch('/admin/dashboard');
    return data || {
      stats: {
        totalUsers: 15243,
        totalOfficers: 342,
        totalApplications: 8472,
        pendingVerifications: 1243,
        approvedSchemes: 45,
        activeCitizens: 12345
      },
      charts: {
        applicationsTrend: [
          { month: 'Jan', count: 650 },
          { month: 'Feb', count: 890 },
          { month: 'Mar', count: 1200 },
          { month: 'Apr', count: 1450 },
          { month: 'May', count: 1800 },
          { month: 'Jun', count: 2100 }
        ],
        schemesByDepartment: [
          { department: 'Ministry of Housing', count: 12 },
          { department: 'Ministry of Agriculture', count: 18 },
          { department: 'Ministry of Health', count: 15 },
          { department: 'Social Justice', count: 22 }
        ],
        verificationStatus: [
          { name: 'Approved', value: 5432, color: '#48bb78' },
          { name: 'Pending', value: 1497, color: '#ed8936' },
          { name: 'Rejected', value: 1543, color: '#fc8181' }
        ]
      },
      recentActivities: [
        {
          id: 1,
          user: "Dr. Ananya Sharma (Admin)",
          action: "Verified Nodal Officer: Vikram Singh (Mumbai District)",
          timestamp: "10 mins ago",
          type: "admin_action"
        },
        {
          id: 2,
          user: "System AI Engine",
          action: "Re-calculated eligibility rules for PMAY scheme",
          timestamp: "1 hour ago",
          type: "system_event"
        },
        {
          id: 3,
          user: "Ministry of Housing",
          action: "Published new scheme: PM Awas Urban 2.0",
          timestamp: "3 hours ago",
          type: "scheme_publish"
        }
      ],
      alerts: [
        { id: 1, type: "warning", message: "12 applications pending for over 7 days in District Thane", priority: "high" },
        { id: 2, type: "info", message: "System backup completed successfully", priority: "low" }
      ]
    };
  },

  getUsers: async () => {
    const data = await apiFetch('/admin/users');
    return data || [
      { id: 1, name: 'Dr. Ananya Sharma', email: 'admin@adhikarai.gov.in', role: 'admin', status: 'active', department: 'Ministry of IT', joined: '2024-01-10', applications: 0 },
      { id: 2, name: 'Vikram Singh', email: 'officer@adhikarai.gov.in', role: 'officer', status: 'active', department: 'Ministry of Housing', joined: '2024-02-15', applications: 342 },
      { id: 3, name: 'Rajesh Kumar', email: 'citizen@adhikarai.gov.in', role: 'citizen', status: 'active', department: 'N/A', joined: '2024-03-01', applications: 5 },
      { id: 4, name: 'Sunita Devi', email: 'sunita@gmail.com', role: 'citizen', status: 'active', department: 'N/A', joined: '2024-04-12', applications: 2 },
      { id: 5, name: 'Amit Patel', email: 'officer.patel@adhikarai.gov.in', role: 'officer', status: 'pending', department: 'Ministry of Agriculture', joined: '2026-07-20', applications: 45 }
    ];
  },

  updateUser: async (id, userData) => {
    const data = await apiFetch(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
    return data || { success: true, message: "User updated successfully!" };
  },

  getOfficers: async () => {
    const data = await apiFetch('/admin/officers');
    return data || [
      {
        id: 202,
        name: 'Mr. Vikram Singh',
        email: 'officer@adhikarai.gov.in',
        employeeId: 'OFF-2024-001',
        designation: 'District Welfare Officer',
        department: 'Ministry of Housing',
        jurisdiction: 'Mumbai District',
        verificationLimit: 50,
        completedVerifications: 342,
        specialization: ['Housing', 'Education'],
        status: 'active'
      },
      {
        id: 203,
        name: 'Ms. Priya Rane',
        email: 'priya.rane@adhikarai.gov.in',
        employeeId: 'OFF-2024-088',
        designation: 'Sub-Divisional Officer',
        department: 'Ministry of Agriculture',
        jurisdiction: 'Pune District',
        verificationLimit: 75,
        completedVerifications: 198,
        specialization: ['Agriculture', 'Health'],
        status: 'active'
      }
    ];
  },

  createOfficer: async (officerData) => {
    const data = await apiFetch('/admin/officers', {
      method: 'POST',
      body: JSON.stringify(officerData)
    });
    return data || { success: true, message: "Officer account created & verified successfully!" };
  },

  saveScheme: async (schemeData) => {
    const data = await apiFetch('/admin/schemes', {
      method: 'POST',
      body: JSON.stringify(schemeData)
    });
    return data || { success: true, message: "Scheme saved and published successfully!" };
  },

  getAnalytics: async () => {
    const data = await apiFetch('/admin/analytics');
    return data || {
      applicationMetrics: {
        total: 8472,
        approved: 5432,
        rejected: 1543,
        pending: 1497,
        approvalRate: 64.1,
        averageTime: "12.3 days"
      },
      schemePerformance: [
        { schemeName: "Pradhan Mantri Awas Yojana", applications: 2345, approvalRate: 78.5, avgTime: "8.2 days" },
        { schemeName: "PM-KISAN Samman Nidhi", applications: 3120, approvalRate: 85.0, avgTime: "5.1 days" },
        { schemeName: "Ayushman Bharat PM-JAY", applications: 3007, approvalRate: 72.4, avgTime: "9.4 days" }
      ],
      userDemographics: {
        ageGroups: { "18-25": 20, "26-35": 35, "36-50": 30, "50+": 15 },
        states: { "Maharashtra": 30, "Gujarat": 20, "Tamil Nadu": 25, "Others": 25 },
        incomeGroups: { "BPL": 25, "Low": 40, "Middle": 30, "High": 5 }
      },
      officerPerformance: [
        { officerName: "Vikram Singh", verifications: 342, averageTime: "3.2 days", approvalRate: 82.5 },
        { officerName: "Priya Rane", verifications: 198, averageTime: "4.1 days", approvalRate: 79.0 }
      ]
    };
  },

  getAuditLogs: async () => {
    const data = await apiFetch('/admin/audit-logs');
    return data || [
      {
        id: 1,
        timestamp: new Date().toISOString(),
        userId: 101,
        userName: "Dr. Ananya Sharma",
        role: "admin",
        action: "USER_ROLE_CHANGE",
        details: JSON.stringify({ targetUser: "Vikram Singh", oldRole: "citizen", newRole: "officer" }),
        ipAddress: "192.168.1.100"
      },
      {
        id: 2,
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        userId: 202,
        userName: "Vikram Singh",
        role: "officer",
        action: "APPLICATION_APPROVED",
        details: JSON.stringify({ applicationId: "APP-2026-001", scheme: "PMAY", citizen: "Rajesh Kumar" }),
        ipAddress: "192.168.1.105"
      },
      {
        id: 3,
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        userId: 101,
        userName: "Dr. Ananya Sharma",
        role: "admin",
        action: "SCHEME_UPDATE",
        details: JSON.stringify({ schemeId: 1, name: "PMAY", updatedField: "incomeLimit" }),
        ipAddress: "192.168.1.100"
      }
    ];
  }
};

// 👮 3. Officer API Service
export const officerService = {
  getDashboard: async () => {
    const data = await apiFetch('/officer/dashboard');
    return data || {
      stats: {
        pendingVerifications: 45,
        completedToday: 12,
        totalVerified: 342,
        approvalRate: 82.5,
        averageTime: "3.2 days",
        assignedCases: 45
      },
      priorityQueue: [
        {
          applicationId: "APP-2026-001",
          citizenName: "Rajesh Kumar",
          schemeName: "Pradhan Mantri Awas Yojana",
          submittedDate: "2026-07-20",
          priority: "high",
          daysPending: 6,
          documentsStatus: {
            aadhar: "verified",
            income: "pending",
            address: "verified"
          }
        },
        {
          applicationId: "APP-2026-004",
          citizenName: "Sunita Devi",
          schemeName: "PM-KISAN Samman Nidhi",
          submittedDate: "2026-07-22",
          priority: "medium",
          daysPending: 4,
          documentsStatus: {
            aadhar: "verified",
            income: "verified",
            address: "verified"
          }
        }
      ],
      recentActivity: [
        {
          id: 1,
          action: "Verified & Approved PMAY Application",
          citizen: "Rajesh Kumar",
          timestamp: "Today, 10:30 AM",
          status: "approved"
        },
        {
          id: 2,
          action: "Requested Income Certificate Upload",
          citizen: "Amit Patel",
          timestamp: "Yesterday, 3:15 PM",
          status: "pending"
        }
      ]
    };
  },

  getPendingVerifications: async () => {
    const data = await apiFetch('/officer/applications/pending');
    return data || [
      {
        applicationId: "APP-2026-001",
        citizenId: 303,
        citizenName: "Rajesh Kumar",
        citizenAadhar: "9876-5432-1098",
        citizenAge: 35,
        citizenIncome: 450000,
        citizenLocation: "Mumbai, Maharashtra",
        casteCategory: "OBC",
        schemeName: "Pradhan Mantri Awas Yojana (PMAY)",
        appliedDate: "2026-07-20",
        priority: "high",
        status: "under_review",
        documents: [
          { name: "Aadhaar Card", status: "verified", path: "#" },
          { name: "Income Certificate", status: "pending", path: "#" },
          { name: "Address Proof", status: "verified", path: "#" }
        ],
        eligibilityRulesCheck: "PASSED (Age 35 within 18-65, Income ₹4.5L < ₹6L)",
        notes: "Requires verification of annual income proof document."
      }
    ];
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

  approveApplication: async (applicationId, comments) => {
    const data = await apiFetch(`/officer/verify/${applicationId}/approve`, {
      method: 'POST',
      body: JSON.stringify({ comments })
    });
    return data || { success: true, message: `Application ${applicationId} approved successfully!` };
  },

  rejectApplication: async (applicationId, reason) => {
    const data = await apiFetch(`/officer/verify/${applicationId}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason })
    });
    return data || { success: true, message: `Application ${applicationId} rejected with reason: ${reason}` };
  },

  requestDocuments: async (applicationId, documents) => {
    const data = await apiFetch(`/officer/verify/${applicationId}/request-documents`, {
      method: 'POST',
      body: JSON.stringify({ documents })
    });
    return data || { success: true, message: `Document request notification sent to citizen!` };
  },

  scheduleInterview: async (applicationId, interviewDetails) => {
    const data = await apiFetch(`/officer/verify/${applicationId}/schedule-interview`, {
      method: 'POST',
      body: JSON.stringify(interviewDetails)
    });
    return data || { success: true, message: `Verification interview scheduled successfully!` };
  },

  generateCertificate: async (applicationId) => {
    const data = await apiFetch(`/officer/verify/${applicationId}/generate-certificate`, {
      method: 'POST'
    });
    return data || {
      success: true,
      certificateNumber: `CERT-${Math.floor(100000 + Math.random() * 900000)}`,
      certificateUrl: `#download-cert-${applicationId}`,
      qrCodeData: `ADHIKARAI-VERIFIED-${applicationId}`
    };
  },

  getAnalytics: async () => {
    const data = await apiFetch('/officer/analytics');
    return data || {
      performance: {
        totalVerified: 342,
        approved: 282,
        rejected: 60,
        approvalRate: 82.5,
        averageTime: "3.2 days",
        monthlyTarget: 50,
        achieved: 42
      },
      workload: {
        assigned: 45,
        completed: 12,
        pending: 33,
        overdue: 5
      },
      schemeDistribution: [
        { scheme: "Pradhan Mantri Awas Yojana", count: 120, avgTime: "2.8 days" },
        { scheme: "PM-KISAN Samman Nidhi", count: 145, avgTime: "1.9 days" },
        { scheme: "Ayushman Bharat PM-JAY", count: 77, avgTime: "4.1 days" }
      ],
      citizenFeedback: {
        rating: 4.8,
        totalReviews: 245,
        positive: 235,
        negative: 10
      }
    };
  }
};

// Legacy exports
export const fetchMockProfile = contentService.getProfile;
export const fetchMockSchemes = contentService.getSchemes;
export const fetchMockRecommendations = contentService.getRecommendations;
