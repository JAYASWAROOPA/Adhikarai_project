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
    appliedDate: "2026-07-20",
    status: "Officer Verification",
    stage: "Stage 3 of 5",
    attachedDocs: ["Aadhaar Card", "Income Certificate", "Bank Passbook"],
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
    appliedDate: "2026-07-24",
    status: "Document Review",
    stage: "Stage 2 of 5",
    attachedDocs: ["Aadhaar Card", "Ration Card (BPL)"],
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
    const { status, remarks } = req.body;

    const appIndex = MOCK_ASSIGNED_APPLICATIONS.findIndex(a => a.id === appId);
    if (appIndex !== -1) {
      MOCK_ASSIGNED_APPLICATIONS[appIndex].status = status || "APPROVED";
      MOCK_ASSIGNED_APPLICATIONS[appIndex].officerNotes = remarks || "Verified and approved by Nodal Officer";
    }

    res.json({
      success: true,
      message: `Application ${appId} updated to ${status} with officer decision.`,
      application: MOCK_ASSIGNED_APPLICATIONS[appIndex] || null
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating application status" });
  }
};
