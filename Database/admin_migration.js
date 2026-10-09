const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

async function migrate() {
  const pool = mysql.createPool({ uri: process.env.DATABASE_URL || process.env.DATABASE_URL_INTERNAL, waitForConnections: true, connectionLimit: 2, ssl: (process.env.DATABASE_URL || '').includes('railway') ? { rejectUnauthorized: false } : undefined });
  const addColumn = async (table, column, ddl) => {
    const [rows] = await pool.query('SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?', [table, column]);
    if (!rows.length) { await pool.query(`ALTER TABLE \`${table}\` ADD COLUMN \`${column}\` ${ddl}`); console.log(`Added ${table}.${column}`); }
  };
  try {
    await addColumn('users', 'is_active', 'TINYINT(1) NOT NULL DEFAULT 1');
    await addColumn('users', 'is_verified', 'TINYINT(1) NOT NULL DEFAULT 0');
    await addColumn('users', 'last_login', 'TIMESTAMP NULL DEFAULT NULL');
    await addColumn('GovernmentSchemes', 'category', 'VARCHAR(120) NULL');
    await addColumn('GovernmentSchemes', 'benefits', 'TEXT NULL');
    await addColumn('GovernmentSchemes', 'status', "VARCHAR(30) NOT NULL DEFAULT 'active'");
    await addColumn('applications', 'officer_id', 'INT NULL');
    await addColumn('audit_logs', 'username', 'VARCHAR(150) NULL');
    await addColumn('audit_logs', 'role', 'VARCHAR(50) NULL');
    await addColumn('audit_logs', 'status', "VARCHAR(20) NOT NULL DEFAULT 'SUCCESS'");
    await addColumn('audit_logs', 'ip_address', 'VARCHAR(45) NULL');
    await addColumn('audit_logs', 'user_agent', 'TEXT NULL');
    await addColumn('audit_logs', 'details', 'JSON NULL');
    await addColumn('audit_logs', 'entity_type', 'VARCHAR(60) NULL');
    await addColumn('audit_logs', 'entity_id', 'VARCHAR(100) NULL');
    await addColumn('audit_logs', 'created_at', 'TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP');
    await pool.query(`CREATE TABLE IF NOT EXISTS officer_profiles (
      user_id INT PRIMARY KEY,
      department VARCHAR(200) NULL,
      designation VARCHAR(150) NULL,
      assigned_office VARCHAR(200) NULL,
      district VARCHAR(120) NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_officer_profiles_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);
    console.log('Admin module database migration completed.');
  } finally { await pool.end(); }
}

migrate().catch(error => { console.error('Admin module migration failed:', error.message); process.exitCode = 1; });
