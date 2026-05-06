const mysql = require('mysql2/promise');
require('dotenv').config();

async function migrate() {
    const pool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'unicare',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });

    try {
        console.log("Checking columns for user_addresses...");
        const [columns] = await pool.query("SHOW COLUMNS FROM user_addresses LIKE 'landmark'");
        if (columns.length === 0) {
            console.log("Adding landmark column...");
            await pool.query("ALTER TABLE user_addresses ADD COLUMN landmark VARCHAR(255) AFTER street");
            console.log("Success: Added landmark column.");
        } else {
            console.log("Landmark column already exists.");
        }
        
        // Also check if mobile_number is VARCHAR(20) or similar
        const [mobileCols] = await pool.query("SHOW COLUMNS FROM user_addresses LIKE 'mobile_number'");
        console.log("Mobile number column info:", mobileCols[0]);

    } catch (err) {
        console.error("Migration failed:", err);
    } finally {
        await pool.end();
    }
}

migrate();
