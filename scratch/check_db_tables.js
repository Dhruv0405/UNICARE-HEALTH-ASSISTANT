const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkDb() {
    const pool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'unicare'
    });

    try {
        const [rows] = await pool.query('SHOW TABLES');
        console.log('Tables in database:', rows.map(r => Object.values(r)[0]));
        
        const [columns] = await pool.query('SHOW COLUMNS FROM user_addresses');
        console.log('Columns in user_addresses:', columns.map(c => c.Field));
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await pool.end();
    }
}

checkDb();
