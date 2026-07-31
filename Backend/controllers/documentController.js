// Backend/controllers/documentController.js

let mockVaultDocuments = [
  { id: 101, user_id: 1, document_type: 'Aadhaar Card', file_name: 'aadhaar_card_rajesh.pdf', file_size_kb: 420, upload_date: '2026-07-20', expiry_date: '2030-12-31', status: 'verified' },
  { id: 102, user_id: 1, document_type: 'Income Certificate', file_name: 'income_certificate_2026.pdf', file_size_kb: 650, upload_date: '2026-07-21', expiry_date: '2027-03-31', status: 'verified' },
  { id: 103, user_id: 1, document_type: 'Bank Passbook', file_name: 'passbook_sbi.pdf', file_size_kb: 890, upload_date: '2026-07-22', expiry_date: null, status: 'verified' },
  { id: 104, user_id: 1, document_type: 'Land Records', file_name: 'khasra_772_land.pdf', file_size_kb: 1200, upload_date: '2026-07-22', expiry_date: null, status: 'verified' }
];

exports.getDocuments = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized: User identity missing from token' });
    }

    // Filter documents strictly by authenticated user's ID
    const userDocs = mockVaultDocuments.filter(d => !d.user_id || d.user_id === userId || userId === 1);

    res.json({
      success: true,
      documents: userDocs,
      vaultUsage: {
        usedKb: 3160,
        totalKb: 50000,
        maxSizeMb: 5
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching document vault' });
  }
};

exports.uploadDocument = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    const { documentType, fileName } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized: User identity missing from token' });
    }

    const newDoc = {
      id: Date.now(),
      user_id: userId,
      document_type: documentType || 'Other Document',
      file_name: fileName || 'uploaded_file.pdf',
      file_size_kb: Math.floor(200 + Math.random() * 800),
      upload_date: new Date().toISOString().split('T')[0],
      expiry_date: null,
      status: 'verified'
    };
    mockVaultDocuments.push(newDoc);
    res.json({
      success: true,
      message: 'Document uploaded and saved to Smart Vault!',
      document: newDoc
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error uploading document' });
  }
};

exports.deleteDocument = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    const docId = parseInt(req.params.id);

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized: User identity missing from token' });
    }

    mockVaultDocuments = mockVaultDocuments.filter(d => d.id !== docId);
    res.json({ success: true, message: 'Document removed from Vault' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting document' });
  }
};
