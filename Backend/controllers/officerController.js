// Backend/controllers/officerController.js

let MOCK_ASSIGNED_APPLICATIONS = [
  {
    id: "APP-2026-9082",
    applicantName: "Rajesh Kumar",
    applicantEmail: "citizen@adhikarai.gov.in",
    schemeName: "Pradhan Mantri Awas Yojana (PMAY Urban 2.0)",
    department: "Ministry of Housing & Urban Affairs",
    district: "Mumbai Suburban",
    income: "₹4,50,000",
    eligibilityCriteria: [
      { criterion: "Annual household income", applicantValue: "₹4,50,000", requiredValue: "At or below ₹6,00,000", result: "Passed" },
      { criterion: "Location", applicantValue: "Mumbai Suburban", requiredValue: "Eligible urban area", result: "Needs review" }
    ],
    appliedDate: "2026-07-20",
    status: "Officer Verification",
    stage: "Stage 3 of 5",
    attachedDocs: ["Aadhaar Card", "Income Certificate", "Bank Passbook"],
    documentsStatus: {},
    verificationHistory: [],
    matchPercentage: 92,
    officerNotes: null
  },
  {
    id: "APP-2026-7811",
    applicantName: "Priya Sharma",
    applicantEmail: "priya.s@gmail.com",
    schemeName: "Ayushman Bharat PM-JAY",
    department: "National Health Authority",
    district: "Mumbai City",
    income: "₹2,20,000",
    eligibilityCriteria: [
      { criterion: "Annual household income", applicantValue: "₹2,20,000", requiredValue: "Within scheme income limit", result: "Passed" },
      { criterion: "Beneficiary identity", applicantValue: "Identity documents submitted", requiredValue: "Valid identity proof", result: "Needs review" }
    ],
    appliedDate: "2026-07-24",
    status: "Document Review",
    stage: "Stage 2 of 5",
    attachedDocs: ["Aadhaar Card", "Ration Card (BPL)"],
    documentsStatus: {},
    verificationHistory: [],
    matchPercentage: 95,
    officerNotes: null
  }
];

exports.getAssignedApplications = async (req, res) => {
  try {
    res.json({
      success: true,
      officer: {
        name: req.user?.username || "Suresh Patil",
        department: "Ministry of Housing & Urban Affairs",
        district: "Mumbai Suburban"
      },
      applications: MOCK_ASSIGNED_APPLICATIONS
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching assigned applications" });
  }
};

exports.updateApplicationAction = async (req, res) => {
  try {
    const { appId } = req.params;
    const { status, remarks, action, documentName, documentStatus } = req.body;

    if (status === "REJECTED" && !String(remarks || "").trim()) {
      return res.status(400).json({ success: false, message: "A rejection reason is required" });
    }
    if (["CORRECTION_REQUESTED", "DOCUMENTS_MISSING"].includes(status) && !String(remarks || "").trim()) {
      return res.status(400).json({ success: false, message: "A message is required for correction or document requests" });
    }
    const allowedStatuses = ["VERIFIED", "APPROVED", "REJECTED", "UNDER_REVIEW", "DOCUMENTS_MISSING", "CORRECTION_REQUESTED"];
    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Unsupported application status" });
    }

    const appIndex = MOCK_ASSIGNED_APPLICATIONS.findIndex(a => a.id === appId);
    if (appIndex === -1) return res.status(404).json({ success: false, message: "Assigned application not found" });

    const application = MOCK_ASSIGNED_APPLICATIONS[appIndex];
    if (status) application.status = status;
    if (remarks !== undefined) application.officerNotes = remarks;
    if (documentName && documentStatus) {
      application.documentsStatus = { ...application.documentsStatus, [documentName]: documentStatus };
    }
    const historyEntry = {
      id: `${Date.now()}-${application.verificationHistory.length}`,
      officer: req.user?.username || "Officer",
      officerId: req.user?.userId || null,
      action: action || status || "Updated application",
      timestamp: new Date().toISOString(),
      remarks: remarks || ""
    };
    application.verificationHistory.unshift(historyEntry);

    res.json({
      success: true,
      message: `Application ${appId} updated successfully.`,
      application,
      historyEntry
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating application status" });
  }
};
