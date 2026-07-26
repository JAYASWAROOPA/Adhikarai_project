const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

async function seedData() {
  const dbUrl = process.env.DATABASE_URL || process.env.DATABASE_URL_INTERNAL;
  console.log('Seeding Database at:', dbUrl);

  const connection = await mysql.createConnection({
    uri: dbUrl,
    ssl: dbUrl && dbUrl.includes('railway') ? { rejectUnauthorized: false } : false
  });

  try {
    // 1. Insert Department
    const [deptResult] = await connection.query(
      `INSERT INTO Departments (name, state, department_type) VALUES 
       ('Ministry of Housing and Urban Affairs', NULL, 'Central'),
       ('Ministry of Agriculture & Farmers Welfare', NULL, 'Central')
       ON DUPLICATE KEY UPDATE id=id`
    );

    // 2. Insert Schemes
    await connection.query(
      `INSERT INTO GovernmentSchemes (id, department_id, name, description, scheme_type, state_specific, official_website, application_process) VALUES 
       (1, 1, 'Pradhan Mantri Awas Yojana', 'Affordable housing scheme providing subsidy on home loans for urban and rural poor.', 'Central', NULL, 'https://pmaymis.gov.in', 'Apply online via PMAY portal or CSC centres.'),
       (2, 2, 'PM-KISAN Samman Nidhi', 'Direct income support of Rs 6,000 per year to landholding farmer families across India.', 'Central', NULL, 'https://pmkisan.gov.in', 'Self-registration on PM-KISAN portal or via local Revenue Officer.')
       ON DUPLICATE KEY UPDATE name=VALUES(name)`
    );

    // 3. Insert Documents Required
    await connection.query(
      `INSERT INTO DocumentsRequired (scheme_id, document_name, is_mandatory) VALUES 
       (1, 'Aadhaar Card', 1),
       (1, 'Income Proof Certificate', 1),
       (1, 'Address Proof', 1),
       (2, 'Aadhaar Card', 1),
       (2, 'Land Ownership Record', 1)
       ON DUPLICATE KEY UPDATE document_name=VALUES(document_name)`
    );

    console.log('Database seeded with initial government schemes successfully!');
  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    await connection.end();
  }
}

seedData();
