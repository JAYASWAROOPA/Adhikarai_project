-- ADHIKARAI Phase 2: MySQL Database Initialization

CREATE DATABASE IF NOT EXISTS railway;
USE railway;

-- 1. Users Table (Citizen, Admin)
CREATE TABLE IF NOT EXISTS Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('Citizen', 'Admin') DEFAULT 'Citizen',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. UserProfiles Table (Module 2 requirements)
CREATE TABLE IF NOT EXISTS UserProfiles (
    user_id INT PRIMARY KEY,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    age INT,
    gender VARCHAR(20),
    occupation VARCHAR(100),
    annual_income DECIMAL(15,2),
    state VARCHAR(100),
    district VARCHAR(100),
    village VARCHAR(100),
    category VARCHAR(50),      -- e.g., SC/ST/OBC/General
    education_level VARCHAR(100),
    is_disabled BOOLEAN DEFAULT FALSE,
    is_farmer BOOLEAN DEFAULT FALSE,
    is_student BOOLEAN DEFAULT FALSE,
    is_senior_citizen BOOLEAN DEFAULT FALSE,
    has_aadhaar BOOLEAN DEFAULT FALSE,
    has_ration_card BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

-- 3. Departments
CREATE TABLE IF NOT EXISTS Departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    state VARCHAR(100),        -- NULL implies Central Government department
    department_type ENUM('Central', 'State') NOT NULL
);

-- 4. GovernmentSchemes
CREATE TABLE IF NOT EXISTS GovernmentSchemes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    department_id INT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    scheme_type ENUM('Central', 'State') NOT NULL,
    state_specific VARCHAR(100), -- E.g., 'Tamil Nadu' or NULL for central
    official_website VARCHAR(255),
    application_process TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES Departments(id) ON DELETE SET NULL
);

-- 5. EligibilityRules (Used by AI / Rule Engine)
CREATE TABLE IF NOT EXISTS EligibilityRules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    scheme_id INT NOT NULL,
    min_age INT,
    max_age INT,
    max_income DECIMAL(15,2),
    required_category VARCHAR(50),
    required_occupation VARCHAR(100),
    required_gender VARCHAR(20),
    must_be_farmer BOOLEAN,
    must_be_student BOOLEAN,
    must_be_senior_citizen BOOLEAN,
    FOREIGN KEY (scheme_id) REFERENCES GovernmentSchemes(id) ON DELETE CASCADE
);

-- 6. DocumentsRequired
CREATE TABLE IF NOT EXISTS DocumentsRequired (
    id INT AUTO_INCREMENT PRIMARY KEY,
    scheme_id INT NOT NULL,
    document_name VARCHAR(150) NOT NULL,
    is_mandatory BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (scheme_id) REFERENCES GovernmentSchemes(id) ON DELETE CASCADE
);

-- 7. User Tracker / Schemes Saved (Module 9)
CREATE TABLE IF NOT EXISTS UserApplications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    scheme_id INT NOT NULL,
    status ENUM('Saved', 'Pending', 'Under Verification', 'Approved', 'Rejected') DEFAULT 'Saved',
    applied_date DATE,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (scheme_id) REFERENCES GovernmentSchemes(id) ON DELETE CASCADE
);
