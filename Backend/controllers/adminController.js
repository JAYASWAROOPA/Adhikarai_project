// Backend/controllers/adminController.js
const bcrypt = require('bcryptjs');

let MOCK_OFFICERS = [
  {
    id: 201,
    name: "Suresh Patil",
    email: "officer@adhikarai.gov.in",
    department: "Ministry of Housing & Urban Affairs",
    district: "Mumbai Suburban",
    verificationLimit: "₹5,00,000",
    status: "ACTIVE",
    createdDate: "2026-07-01"
  },
  {
    id: 202,
    name: "Meenakshi Sundaram",
    email: "meenakshi.officer@adhikarai.gov.in",
    department: "Ministry of Agriculture & Farmers Welfare",
    district: "Chennai / Kanchipuram",
    verificationLimit: "₹10,00,000",
    status: "ACTIVE",
    createdDate: "2026-07-10"
  }
];

let MOCK_AUDIT_LOGS = [
  { id: 1001, timestamp: "2026-07-31 22:15:00", user: "admin@adhikarai.gov.in", role: "admin", action: "OFFICER_ACCOUNT_CREATED", status: "SUCCESS", ip: "192.168.1.10" },
  { id: 1002, timestamp: "2026-07-31 21:40:12", user: "officer@adhikarai.gov.in", role: "officer", action: "APPLICATION_APPROVED_PMAY", status: "SUCCESS", ip: "192.168.1.44" },
  { id: 1003, timestamp: "2026-07-31 20:10:05", user: "citizen@adhikarai.gov.in", role: "citizen", action: "PROFILE_UPDATED_100%", status: "SUCCESS", ip: "103.21.12.5" }
];

exports.createOfficer = async (req, res) => {
  try {
    const { name, email, tempPassword, department, district, verificationLimit } = req.body;

    if (!name || !email || !tempPassword || !department) {
      return res.status(400).json({ success: false, message: "Officer name, email, temporary password, and department are required." });
    }

    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const newOfficer = {
      id: Date.now(),
      name,
      email: email.toLowerCase().trim(),
      passwordHash: hashedPassword,
      department,
      district: district || "All Districts",
      verificationLimit: verificationLimit || "₹5,00,000",
      status: "ACTIVE",
      createdDate: new Date().toISOString().split('T')[0]
    };

    MOCK_OFFICERS.unshift(newOfficer);

    MOCK_AUDIT_LOGS.unshift({
      id: Date.now(),
      timestamp: new Date().toLocaleString(),
      user: req.user?.email || "admin@adhikarai.gov.in",
      role: "admin",
      action: `OFFICER_CREATED: ${email}`,
      status: "SUCCESS",
      ip: req.ip || "127.0.0.1"
    });

    res.status(201).json({
      success: true,
      message: `Nodal Officer account created successfully for ${name}. Official login credentials generated.`,
      officer: newOfficer
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error creating officer account", error: error.message });
  }
};

exports.getOfficers = async (req, res) => {
  try {
    res.json({ success: true, officers: MOCK_OFFICERS });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error listing officers" });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    res.json({
      success: true,
      analytics: {
        totalCitizens: 54200,
        activeOfficers: MOCK_OFFICERS.length,
        schemesManaged: 520,
        totalDisbursedAmount: "₹142.5 Crores",
        pendingApplications: 1240,
        systemHealth: "99.98% Uptime (MySQL + Railway DB Synced)"
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error loading analytics" });
  }
};

exports.getAuditLogs = async (req, res) => {
  try {
    res.json({ success: true, auditLogs: MOCK_AUDIT_LOGS });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching audit logs" });
  }
};
