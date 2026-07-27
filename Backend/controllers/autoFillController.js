// Backend/controllers/autoFillController.js
const path = require('path');

// Standard Field Mapping Dictionary between Citizen Profile keys and Scheme Form keys
const PROFILE_TO_SCHEME_MAP = {
  // Personal
  full_name: ['fullName', 'name', 'applicantName', 'citizenName'],
  father_name: ['fatherName', 'fathersName'],
  mother_name: ['motherName', 'mothersName'],
  gender: ['gender', 'sex'],
  date_of_birth: ['dob', 'dateOfBirth', 'birthDate'],
  age: ['age', 'applicantAge'],
  aadhaar_number: ['aadhaar', 'aadhar', 'aadharNumber', 'aadhaarNumber'],
  pan_number: ['pan', 'panNumber', 'panCard'],
  mobile_number: ['mobile', 'phone', 'phoneNumber', 'mobileNumber'],
  email: ['email', 'emailAddress'],
  
  // Location
  address: ['address', 'residentialAddress', 'communicationAddress'],
  district: ['district', 'city'],
  state: ['state', 'province'],
  pincode: ['pincode', 'postalCode', 'zip'],

  // Economic & Demographic
  occupation: ['occupation', 'profession', 'jobType'],
  annual_income: ['income', 'annualIncome', 'familyIncome', 'totalIncome'],
  caste_category: ['category', 'caste', 'casteCategory', 'socialCategory'],
  religion: ['religion'],
  bpl_status: ['bplStatus', 'isBpl', 'bplCardHolder'],
  disability_status: ['isDisabled', 'disabilityStatus'],
  disability_percentage: ['disabilityPercentage'],
  marital_status: ['maritalStatus'],
  education: ['education', 'educationLevel', 'qualification'],
  
  // Bank Details
  bank_name: ['bankName', 'bank'],
  ifsc_code: ['ifsc', 'ifscCode', 'paymentIfsc'],
  account_number: ['accountNumber', 'bankAccount', 'bankAccountNumber'],
  
  // Agricultural & Land
  farmer_status: ['isFarmer', 'farmerStatus'],
  land_ownership_details: ['landDetails', 'landRecord', 'landArea'],
  ration_card_number: ['rationCard', 'rationCardNumber']
};

// Default Mock Scheme Definitions for Fallback Dynamic Form Generation
const MOCK_SCHEMES_FIELDS = {
  1: [ // Pradhan Mantri Awas Yojana (PMAY)
    { field_key: 'fullName', field_label: 'Full Applicant Name', field_type: 'text', profile_key: 'full_name', is_required: true },
    { field_key: 'aadhaarNumber', field_label: 'Aadhaar Number', field_type: 'text', profile_key: 'aadhaar_number', is_required: true },
    { field_key: 'mobileNumber', field_label: 'Mobile Number', field_type: 'tel', profile_key: 'mobile_number', is_required: true },
    { field_key: 'annualIncome', field_label: 'Annual Family Income (₹)', field_type: 'number', profile_key: 'annual_income', is_required: true },
    { field_key: 'residentialAddress', field_label: 'Residential Address', field_type: 'text', profile_key: 'address', is_required: true },
    { field_key: 'district', field_label: 'District', field_type: 'text', profile_key: 'district', is_required: true },
    { field_key: 'state', field_label: 'State', field_type: 'text', profile_key: 'state', is_required: true },
    { field_key: 'bankName', field_label: 'Bank Name for Subsidy', field_type: 'text', profile_key: 'bank_name', is_required: true },
    { field_key: 'ifscCode', field_label: 'Bank IFSC Code', field_type: 'text', profile_key: 'ifsc_code', is_required: true },
    { field_key: 'accountNumber', field_label: 'Bank Account Number', field_type: 'text', profile_key: 'account_number', is_required: true },
    { field_key: 'existingHouseStatus', field_label: 'Do you own a Pucca House?', field_type: 'select', profile_key: null, is_required: true, options: ['No', 'Yes'] }
  ],
  2: [ // PM-KISAN Samman Nidhi
    { field_key: 'fullName', field_label: 'Farmer Full Name', field_type: 'text', profile_key: 'full_name', is_required: true },
    { field_key: 'aadhaarNumber', field_label: 'Aadhaar Card Number', field_type: 'text', profile_key: 'aadhaar_number', is_required: true },
    { field_key: 'farmerStatus', field_label: 'Are you a Landholding Farmer?', field_type: 'boolean', profile_key: 'farmer_status', is_required: true },
    { field_key: 'landDetails', field_label: 'Khasra / Land Survey Number', field_type: 'text', profile_key: 'land_ownership_details', is_required: true },
    { field_key: 'district', field_label: 'District', field_type: 'text', profile_key: 'district', is_required: true },
    { field_key: 'bankName', field_label: 'Bank Name', field_type: 'text', profile_key: 'bank_name', is_required: true },
    { field_key: 'ifscCode', field_label: 'IFSC Code', field_type: 'text', profile_key: 'ifsc_code', is_required: true },
    { field_key: 'accountNumber', field_label: 'Account Number', field_type: 'text', profile_key: 'account_number', is_required: true }
  ],
  3: [ // Ayushman Bharat PM-JAY
    { field_key: 'fullName', field_label: 'Head of Family Name', field_type: 'text', profile_key: 'full_name', is_required: true },
    { field_key: 'aadhaarNumber', field_label: 'Aadhaar Number', field_type: 'text', profile_key: 'aadhaar_number', is_required: true },
    { field_key: 'rationCardNumber', field_label: 'Ration Card / BPL Number', field_type: 'text', profile_key: 'ration_card_number', is_required: true },
    { field_key: 'casteCategory', field_label: 'Caste Category', field_type: 'select', profile_key: 'caste_category', is_required: true, options: ['General', 'OBC', 'SC', 'ST', 'EWS'] },
    { field_key: 'annualIncome', field_label: 'Annual Income', field_type: 'number', profile_key: 'annual_income', is_required: true }
  ]
};

const MOCK_SCHEME_REQUIRED_DOCUMENTS = {
  1: [
    { document_type: 'Aadhaar Card', is_mandatory: true },
    { document_type: 'Income Certificate', is_mandatory: true },
    { document_type: 'Address Proof', is_mandatory: true },
    { document_type: 'Bank Passbook', is_mandatory: true }
  ],
  2: [
    { document_type: 'Aadhaar Card', is_mandatory: true },
    { document_type: 'Land Records', is_mandatory: true },
    { document_type: 'Bank Passbook', is_mandatory: true }
  ],
  3: [
    { document_type: 'Aadhaar Card', is_mandatory: true },
    { document_type: 'Ration Card', is_mandatory: true },
    { document_type: 'Income Certificate', is_mandatory: true }
  ]
};

// 1. Get AutoFill Data endpoint
exports.getAutoFillData = async (req, res) => {
  try {
    const schemeId = parseInt(req.params.schemeId) || 1;

    // Default mock citizen profile (30+ fields)
    const profile = {
      full_name: "Rajesh Kumar",
      father_name: "Ramesh Kumar",
      mother_name: "Sunita Devi",
      gender: "Male",
      date_of_birth: "1989-05-15",
      age: 35,
      aadhaar_number: "9876-5432-1098",
      pan_number: "ABCDE1234F",
      mobile_number: "+91 98765 43210",
      email: "citizen@adhikarai.gov.in",
      address: "123 Green Park Colony, Andheri West",
      district: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
      occupation: "Technician",
      annual_income: 450000,
      family_income: 450000,
      caste_category: "OBC",
      religion: "Hindu",
      bpl_status: false,
      disability_status: false,
      disability_percentage: 0,
      marital_status: "Married",
      education: "Graduate",
      bank_name: "State Bank of India",
      ifsc_code: "SBIN0001234",
      account_number: "30987654321",
      farmer_status: true,
      land_ownership_details: "Khasra No. 402/B (1.5 Acres)",
      ration_card_number: "RAT-2024-8890"
    };

    // User's Smart Document Vault
    const vaultDocuments = [
      { id: 101, document_type: 'Aadhaar Card', file_name: 'aadhaar_card_rajesh.pdf', status: 'verified', upload_date: '2026-07-20' },
      { id: 102, document_type: 'Income Certificate', file_name: 'income_certificate_2026.pdf', status: 'verified', upload_date: '2026-07-21' },
      { id: 103, document_type: 'Bank Passbook', file_name: 'passbook_sbi.pdf', status: 'verified', upload_date: '2026-07-22' },
      { id: 104, document_type: 'Land Records', file_name: 'khasra_772_land.pdf', status: 'verified', upload_date: '2026-07-22' }
    ];

    const requiredFields = MOCK_SCHEMES_FIELDS[schemeId] || MOCK_SCHEMES_FIELDS[1];
    const requiredDocs = MOCK_SCHEME_REQUIRED_DOCUMENTS[schemeId] || MOCK_SCHEMES_FIELDS[1];

    const prefilledData = {};
    const autofilledFields = [];
    const missingFields = [];

    // Intelligent Matching Engine between Scheme Required Fields & Citizen Profile
    requiredFields.forEach(field => {
      let matchedVal = null;
      if (field.profile_key && profile[field.profile_key] !== undefined && profile[field.profile_key] !== null) {
        matchedVal = profile[field.profile_key];
      }

      if (matchedVal !== null && matchedVal !== '') {
        prefilledData[field.field_key] = matchedVal;
        autofilledFields.push(field.field_key);
      } else {
        prefilledData[field.field_key] = '';
        if (field.is_required) {
          missingFields.push({ field_key: field.field_key, label: field.field_label });
        }
      }
    });

    // Auto-Attach Smart Document Vault matching
    const autoAttachedDocuments = [];
    const missingDocuments = [];

    requiredDocs.forEach(reqDoc => {
      const matchInVault = vaultDocuments.find(v => v.document_type.toLowerCase() === reqDoc.document_type.toLowerCase());
      if (matchInVault) {
        autoAttachedDocuments.push(matchInVault);
      } else if (reqDoc.is_mandatory) {
        missingDocuments.push(reqDoc.document_type);
      }
    });

    // Calculate Completion Percentage
    const totalRequired = requiredFields.filter(f => f.is_required).length + requiredDocs.filter(d => d.is_mandatory).length;
    const completedCount = autofilledFields.length + autoAttachedDocuments.length;
    const completionPercentage = Math.min(100, Math.round((completedCount / (totalRequired || 1)) * 100));

    res.json({
      success: true,
      schemeId,
      profile,
      requiredFields,
      prefilledData,
      autofilledFields,
      missingFields,
      autoAttachedDocuments,
      missingDocuments,
      completionPercentage
    });
  } catch (error) {
    console.error('Error in autoFillController.getAutoFillData:', error);
    res.status(500).json({ success: false, message: 'Server error generating auto-fill form' });
  }
};

// 2. Submit Application Endpoint
exports.submitApplication = async (req, res) => {
  try {
    const { schemeId, formData, attachedDocumentIds, completionPercentage } = req.body;
    const appId = `APP-2026-${Math.floor(100000 + Math.random() * 900000)}`;

    res.json({
      success: true,
      applicationId: appId,
      message: 'Application auto-filled and submitted successfully!',
      pdfUrl: `/api/application/pdf/${appId}`,
      submittedAt: new Date().toISOString(),
      qrCodeData: `ADHIKARAI-GOV-${appId}-${schemeId || 1}`
    });
  } catch (error) {
    console.error('Error submitting application:', error);
    res.status(500).json({ success: false, message: 'Error submitting application' });
  }
};
