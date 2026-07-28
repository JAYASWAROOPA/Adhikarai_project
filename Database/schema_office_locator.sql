-- ADHIKARAI: Nearby Government Office Locator SQL Schema

USE railway;

-- 1. Office Categories Table
CREATE TABLE IF NOT EXISTS office_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE
);

-- Pre-seed Office Categories
INSERT INTO office_categories (code, name, description, icon) VALUES
('tahsildar', 'Tahsildar Office', 'Land revenue, income certificates, community certificates & estate administration', 'AccountBalance'),
('panchayat', 'Panchayat Office', 'Gram panchayat rural welfare, housing schemes & local village administration', 'Villa'),
('municipal', 'Municipal Office / Corporation', 'Urban housing, water connections, trade licenses & municipal services', 'Apartment'),
('csc', 'Common Service Center (CSC)', 'Digital e-Seva application submission, Aadhaar print & citizen services', 'Computer'),
('collectorate', 'District Collectorate', 'District magistrate administration, grievance appeals & nodal officer hub', 'AssuredWorkload'),
('dbt_bank', 'DBT-Linked Bank Branch', 'Direct Benefit Transfer (DBT) bank accounts, Aadhaar seeding & PM-KISAN payouts', 'AccountBalanceWallet'),
('post_office', 'India Post Payments Bank', 'DBT account opening, rural postal savings & Aadhaar update centers', 'LocalPostOffice'),
('aadhaar_center', 'Aadhaar Enrollment Center', 'Fresh Aadhaar enrollment, biometric updates, mobile & address updates', 'Fingerprint'),
('bdo', 'Block Development Office (BDO)', 'Rural development schemes, MGNREGA job cards & self-help group funding', 'Engineering')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 2. Government Offices Table
CREATE TABLE IF NOT EXISTS government_offices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    category_id INT NOT NULL,
    address TEXT NOT NULL,
    district VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,
    contact_number VARCHAR(20),
    email VARCHAR(100),
    officer_name VARCHAR(100),
    timings VARCHAR(100) DEFAULT '09:30 AM - 05:30 PM (Mon-Sat)',
    is_open BOOLEAN DEFAULT TRUE,
    wheelchair_accessible BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES office_categories(id) ON DELETE CASCADE
);

-- 3. Office Services Table
CREATE TABLE IF NOT EXISTS office_services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    office_id INT NOT NULL,
    service_name VARCHAR(150) NOT NULL,
    description TEXT,
    FOREIGN KEY (office_id) REFERENCES government_offices(id) ON DELETE CASCADE
);

-- 4. Scheme Required Offices Junction Table
CREATE TABLE IF NOT EXISTS scheme_required_offices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    scheme_id INT NOT NULL,
    category_id INT NOT NULL,
    priority INT DEFAULT 1,
    FOREIGN KEY (scheme_id) REFERENCES GovernmentSchemes(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES office_categories(id) ON DELETE CASCADE
);
