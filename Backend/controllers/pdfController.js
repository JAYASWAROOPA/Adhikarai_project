// Backend/controllers/pdfController.js

exports.generatePDF = async (req, res) => {
  try {
    const applicationId = req.params.id || 'APP-2026-998811';
    
    // Returns HTML/PDF Data payload for official receipt view & print
    res.json({
      success: true,
      applicationId,
      governmentHeader: "GOVERNMENT OF INDIA • NATIONAL WELFARE PORTAL (ADHIKARAI)",
      schemeName: "Pradhan Mantri Awas Yojana (PMAY)",
      applicantName: "Rajesh Kumar",
      aadhaarNumber: "9876-5432-1098",
      submissionDate: new Date().toLocaleDateString('en-IN', { dateStyle: 'full' }),
      qrCodeData: `ADHIKARAI-VERIFIED-APPLICATION-${applicationId}`,
      pdfUrl: `/download/applications/${applicationId}.pdf`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error generating PDF' });
  }
};
