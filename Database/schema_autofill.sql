-- ADHIKARAI: AI Auto Form Filling & Smart Document Reuse SQL Schema

USE railway;

-- 1. Expanded Citizen Profiles (30+ Data Points)
CREATE TABLE IF NOT EXISTS citizen_profiles (
    user_id INT PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    father_name VARCHAR(150),
    mother_name VARCHAR(150),
    gender ENUM('Male', 'Female', 'Other') NOT NULL,
    date_of_birth DATE NOT NULL,
    age INT,
    aadhaar_number VARCHAR(20) UNIQUE NOT NULL,
    pan_number VARCHAR(15),
    mobile_number VARCHAR(15) NOT NULL,
    email VARCHAR(150) NOT NULL,
    address TEXT NOT NULL,
    district VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    occupation VARCHAR(100),
    annual_income DECIMAL(15,2) NOT NULL,
    family_income DECIMAL(15,2),
    caste_category VARCHAR(50) NOT NULL,
    religion VARCHAR(50),
    bpl_status BOOLEAN DEFAULT FALSE,
    disability_status BOOLEAN DEFAULT FALSE,
    disability_percentage INT DEFAULT 0,
    marital_status VARCHAR(50),
    education VARCHAR(100),
    bank_name VARCHAR(100),
    ifsc_code VARCHAR(20),
    account_number VARCHAR(30),
    farmer_status BOOLEAN DEFAULT FALSE,
    land_ownership_details VARCHAR(255),
    ration_card_number VARCHAR(50),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

-- 2. Dynamic Scheme Required Fields Metadata
CREATE TABLE IF NOT EXISTS scheme_required_fields (
    id INT AUTO_INCREMENT PRIMARY KEY,
    scheme_id INT NOT NULL,
    field_key VARCHAR(100) NOT NULL,
    field_label VARCHAR(150) NOT NULL,
    field_type VARCHAR(50) NOT NULL, -- 'text', 'number', 'select', 'date', 'boolean'
    profile_mapping_key VARCHAR(100), -- Maps to citizen_profiles column (e.g. 'annual_income', 'state')
    is_required BOOLEAN DEFAULT TRUE,
    options JSON, -- For dropdown fields
    FOREIGN KEY (scheme_id) REFERENCES GovernmentSchemes(id) ON DELETE CASCADE
);

-- 3. Dynamic Scheme Required Documents Metadata
CREATE TABLE IF NOT EXISTS scheme_required_documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    scheme_id INT NOT NULL,
    document_type VARCHAR(100) NOT NULL, -- 'Aadhaar', 'PAN', 'Income Certificate', etc.
    is_mandatory BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (scheme_id) REFERENCES GovernmentSchemes(id) ON DELETE CASCADE
);

-- 4. Smart Document Vault Table
CREATE TABLE IF NOT EXISTS uploaded_documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    document_type VARCHAR(100) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    file_size_kb INT,
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expiry_date DATE,
    status ENUM('verified', 'pending', 'expired') DEFAULT 'verified',
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

-- 5. Applications Table
CREATE TABLE IF NOT EXISTS applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    application_number VARCHAR(50) UNIQUE NOT NULL,
    user_id INT NOT NULL,
    scheme_id INT NOT NULL,
    form_data JSON NOT NULL,
    completion_percentage INT DEFAULT 0,
    missing_fields JSON,
    status ENUM('draft', 'submitted', 'under_verification', 'approved', 'rejected') DEFAULT 'submitted',
    pdf_url VARCHAR(255),
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (scheme_id) REFERENCES GovernmentSchemes(id) ON DELETE CASCADE
);

-- 6. Application Document Junction Table
CREATE TABLE IF NOT EXISTS application_documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    application_id INT NOT NULL,
    document_id INT NOT NULL,
    auto_attached BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
    FOREIGN KEY (document_id) REFERENCES uploaded_documents(id) ON DELETE CASCADE
);

-- 7. Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    details JSON,
    ip_address VARCHAR(45),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
