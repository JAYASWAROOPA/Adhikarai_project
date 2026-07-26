// src/constants/roles.js
export const ROLES = {
  ADMIN: 'admin',           // System administrator - Full access
  OFFICER: 'officer',       // Government officer - Verification authority
  CITIZEN: 'citizen'        // Regular citizen - Scheme access
};

export const PERMISSIONS = {
  admin: [
    'view_all_users',
    'manage_roles',
    'view_all_applications',
    'verify_officers',
    'manage_schemes',
    'view_analytics',
    'manage_departments',
    'system_settings',
    'view_audit_logs',
    'manage_content',
    'export_data',
    'generate_reports'
  ],
  officer: [
    'verify_applications',
    'review_documents',
    'view_assigned_schemes',
    'update_application_status',
    'schedule_interviews',
    'view_citizen_profiles',
    'generate_certificates',
    'send_notifications',
    'view_analytics'
  ],
  citizen: [
    'view_profile',
    'edit_profile',
    'view_schemes',
    'apply_schemes',
    'track_applications',
    'upload_documents',
    'ai_chat_assistant',
    'view_eligibility',
    'download_certificates',
    'receive_notifications'
  ]
};

export const DEFAULT_USERS = {
  admin: {
    id: 101,
    email: 'admin@adhikarai.gov.in',
    password: 'Admin@2026#Secure',
    name: 'Dr. Ananya Sharma',
    firstName: 'Ananya',
    lastName: 'Sharma',
    role: 'admin',
    department: 'Ministry of Electronics & IT',
    employeeId: 'ADMIN-001',
    phone: '+91-9876543210'
  },
  officer: {
    id: 202,
    email: 'officer@adhikarai.gov.in',
    password: 'Officer@2026#Verify',
    name: 'Mr. Vikram Singh',
    firstName: 'Vikram',
    lastName: 'Singh',
    role: 'officer',
    department: 'Ministry of Housing & Urban Affairs',
    employeeId: 'OFF-2024-001',
    phone: '+91-8765432109',
    officerDetails: {
      designation: 'District Welfare Officer',
      jurisdiction: 'Mumbai District',
      verificationLimit: 50,
      specialization: ['Housing', 'Education']
    }
  },
  citizen: {
    id: 303,
    email: 'citizen@adhikarai.gov.in',
    password: 'Citizen@2026#Apply',
    name: 'Rajesh Kumar',
    firstName: 'Rajesh',
    lastName: 'Kumar',
    role: 'citizen',
    aadhar: '9876-5432-1098',
    phone: '+91-7654321098'
  }
};
