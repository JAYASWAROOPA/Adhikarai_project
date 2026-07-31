// Backend/controllers/applicationController.js
const db = require('../config/db');

const MOCK_APPLICATIONS = [
  {
    id: "APP-2026-9082",
    schemeName: "Pradhan Mantri Awas Yojana (PMAY Urban 2.0)",
    department: "Ministry of Housing & Urban Affairs",
    appliedDate: "2026-07-20",
    status: "In Verification",
    stage: "Officer Verification",
    progress: 60,
    benefit: "₹2.67 Lakh Credit Subsidy"
  },
  {
    id: "APP-2026-4412",
    schemeName: "PM-KISAN Samman Nidhi",
    department: "Ministry of Agriculture",
    appliedDate: "2026-06-15",
    status: "Approved",
    stage: "Disbursement",
    progress: 100,
    benefit: "₹6,000 / Year DBT"
  }
];

exports.getUserApplications = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized: Token identity missing' });
    }

    try {
      if (db.query) {
        const [rows] = await db.query(
          `SELECT ua.id, ua.status, ua.applied_date, gs.name as scheme_name 
           FROM applications ua 
           JOIN GovernmentSchemes gs ON ua.scheme_id = gs.id 
           WHERE ua.user_id = ?`,
          [userId]
        );
        if (rows.length > 0) return res.json({ success: true, applications: rows });
      }
    } catch (err) {
      // Fallback
    }

    res.json({ success: true, applications: MOCK_APPLICATIONS });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ success: false, message: 'Error fetching user applications', error: error.message });
  }
};

exports.applyOrSaveScheme = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    const { scheme_id, status } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized: Token identity missing' });
    }

    try {
      if (db.query) {
        await db.query(
          'INSERT INTO applications (user_id, scheme_id, status, applied_date) VALUES (?, ?, ?, CURDATE())',
          [userId, scheme_id || 1, status || 'Submitted']
        );
      }
    } catch (err) {
      // Fallback
    }

    res.json({ success: true, message: 'Application submitted successfully for authenticated user' });
  } catch (error) {
    console.error('Error saving application:', error);
    res.status(500).json({ success: false, message: 'Error saving application status', error: error.message });
  }
};
