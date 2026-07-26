const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

async function runMigration() {
    console.log('Connecting to: ', process.env.DATABASE_URL);
    
    // We must pass multipleStatements: true to run the entire init.sql at once
    const connection = await mysql.createConnection({
        uri: process.env.DATABASE_URL,
        multipleStatements: true,
        ssl: {
          rejectUnauthorized: false
        }
    });

    console.log('Successfully connected to Railway MySQL!');
    
    try {
        const sqlPath = path.join(__dirname, 'init.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');
        
        console.log('Executing init.sql...');
        
        await connection.query(sql);
        
        console.log('Migration completed successfully! All tables created.');
    } catch (error) {
        console.error('Error executing migration:', error);
    } finally {
        await connection.end();
        console.log('Connection closed.');
    }
}

runMigration();
