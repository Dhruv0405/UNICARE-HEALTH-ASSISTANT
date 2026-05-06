const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();

// Add CORS headers
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        return res.status(200).json({});
    }
    next();
});

// Middleware
app.use(express.json());
app.use(express.static('.')); // Serve static files from project root

// Database connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'unicare',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Initialize database tables
async function initializeDatabase() {
    try {
        // Test connection first to ensure database exists and credentials are correct.
        // It might be better to create database if not exists, but createPool targets a specific db.
        // So we connect without database first to create it, then connect to pool.
        
        const tempConn = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || ''
        });
        
        await tempConn.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'unicare'}`);
        await tempConn.end();

        const connection = await pool.getConnection();
        
        // Create users table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id VARCHAR(255) PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                date DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create user_addresses table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS user_addresses (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_email VARCHAR(255) NOT NULL,
                nickname VARCHAR(100),
                full_name VARCHAR(255),
                mobile_number VARCHAR(20),
                house_no VARCHAR(255),
                street VARCHAR(255),
                landmark VARCHAR(255),
                city VARCHAR(100),
                state VARCHAR(100),
                pincode VARCHAR(20),
                full_address TEXT,
                is_default BOOLEAN DEFAULT FALSE,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE CASCADE
            )
        `);

        // Check if landmark column exists, add it if not
        try {
            const [columns] = await connection.query("SHOW COLUMNS FROM user_addresses LIKE 'landmark'");
            if (columns.length === 0) {
                await connection.query("ALTER TABLE user_addresses ADD COLUMN landmark VARCHAR(255) AFTER street");
                console.log("Added landmark column to user_addresses table");
            }
        } catch (err) {
            console.error("Error checking/adding landmark column:", err);
        }


        // Create orders table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS orders (
                id VARCHAR(255) PRIMARY KEY,
                user_email VARCHAR(255),
                total_amount DECIMAL(10, 2),
                status VARCHAR(50) DEFAULT 'Pending',
                date DATETIME DEFAULT CURRENT_TIMESTAMP,
                items JSON,
                shipping_address JSON
            )
        `);

        console.log('Database tables initialized successfully');

        // Migrate users from users.json if exists
        const usersFilePath = path.join(__dirname, 'users.json');
        if (fs.existsSync(usersFilePath)) {
            const data = fs.readFileSync(usersFilePath, 'utf8');
            const usersJson = JSON.parse(data);
            
            for (const user of usersJson) {
                try {
                    await connection.query(
                        'INSERT IGNORE INTO users (id, name, email, password) VALUES (?, ?, ?, ?)',
                        [user.id || Date.now().toString(), user.name, user.email, user.password]
                    );
                } catch (err) {
                    console.error('Error migrating user:', user.email, err.message);
                }
            }
            console.log('User migration from JSON checked/completed.');
            
            // Rename users.json to prevent re-migration issues
            fs.renameSync(usersFilePath, usersFilePath + '.bak');
        }

        connection.release();
    } catch (error) {
        console.error('Error connecting to MySQL or initializing database tables. Make sure MySQL is running and credentials are correct.', error.message);
    }
}

// Initialize the database on startup
initializeDatabase();

// Health Check Route
app.get('/api/health', (req, res) => {
    res.status(200).json({ 
        status: 'ok',
        timestamp: new Date().toISOString()
    });
});

// Signup Route
app.post('/api/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please provide name, email and password' });
        }

        // Check if user already exists
        const [existingUsers] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password before storing
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUserId = Date.now().toString();
        await pool.query(
            'INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)',
            [newUserId, name, email, hashedPassword]
        );

        console.log('User created:', email);
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login Route
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        // Check if user exists
        const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const user = users[0];

        // Compare password with bcrypt hash
        // Support legacy plain-text passwords for existing users
        let isMatch = false;
        if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
            // It's a bcrypt hash
            isMatch = await bcrypt.compare(password, user.password);
        } else {
            // Legacy plain-text password — compare and upgrade
            isMatch = (user.password === password);
            if (isMatch) {
                // Upgrade to hashed password
                const salt = await bcrypt.genSalt(10);
                const hashedNewPassword = await bcrypt.hash(password, salt);
                await pool.query('UPDATE users SET password = ? WHERE email = ?', [hashedNewPassword, email]);
                console.log(`Upgraded password hash for user: ${email}`);
            }
        }

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create and send JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email, name: user.name },
            process.env.JWT_SECRET || 'fallback_secret_key',
            { expiresIn: '24h' }
        );

        res.json({ 
            token,
            user: {
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get users list (admin)
app.get('/api/users', async (req, res) => {
    try {
        // Return users without passwords
        const [users] = await pool.query('SELECT id, name, email, date FROM users');
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// User Addresses Routes
app.get('/api/addresses/:email', async (req, res) => {
    try {
        const email = req.params.email;
        const [addresses] = await pool.query('SELECT * FROM user_addresses WHERE user_email = ?', [email]);
        
        // Map database fields to frontend structure
        const mappedAddresses = addresses.map(addr => ({
            id: addr.id.toString(),
            userEmail: addr.user_email,
            nickname: addr.nickname,
            fullName: addr.full_name,
            mobileNumber: addr.mobile_number,
            houseNo: addr.house_no,
            street: addr.street,
            landmark: addr.landmark,
            city: addr.city,
            state: addr.state,
            pincode: addr.pincode,
            fullAddress: addr.full_address,
            isDefault: Boolean(addr.is_default)
        }));
        
        res.json(mappedAddresses);
    } catch (error) {
        console.error('Error fetching addresses:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/addresses', async (req, res) => {
    try {
        const { userEmail, nickname, fullName, mobileNumber, houseNo, street, landmark, city, state, pincode, fullAddress, isDefault } = req.body;
        
        if (!userEmail) return res.status(400).json({ message: 'User email is required' });

        if (isDefault) {
            // Unset other default addresses for this user
            await pool.query('UPDATE user_addresses SET is_default = FALSE WHERE user_email = ?', [userEmail]);
        }

        const [result] = await pool.query(
            `INSERT INTO user_addresses (user_email, nickname, full_name, mobile_number, house_no, street, landmark, city, state, pincode, full_address, is_default) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [userEmail, nickname || 'Address', fullName || '', mobileNumber || '', houseNo || '', street || '', landmark || '', city || '', state || '', pincode || '', fullAddress || '', isDefault || false]
        );

        res.status(201).json({ message: 'Address saved', id: result.insertId.toString() });
    } catch (error) {
        console.error('Error saving address:', error);
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
});

app.put('/api/addresses/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { userEmail, nickname, fullName, mobileNumber, houseNo, street, landmark, city, state, pincode, fullAddress, isDefault } = req.body;
        
        if (isDefault && userEmail) {
            await pool.query('UPDATE user_addresses SET is_default = FALSE WHERE user_email = ?', [userEmail]);
        }

        await pool.query(
            `UPDATE user_addresses SET 
                nickname = ?, full_name = ?, mobile_number = ?, house_no = ?, 
                street = ?, landmark = ?, city = ?, state = ?, pincode = ?, 
                full_address = ?, is_default = ? 
             WHERE id = ?`,
            [nickname || 'Address', fullName || '', mobileNumber || '', houseNo || '', street || '', landmark || '', city || '', state || '', pincode || '', fullAddress || '', isDefault || false, id]
        );

        res.json({ message: 'Address updated successfully' });
    } catch (error) {
        console.error('Error updating address:', error);
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
});

app.delete('/api/addresses/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await pool.query('DELETE FROM user_addresses WHERE id = ?', [id]);
        res.json({ message: 'Address deleted' });
    } catch (error) {
        console.error('Error deleting address:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Product routes (simplified with in-memory data)
const products = [
    {
        id: '1',
        name: "Digital Blood Pressure Monitor",
        category: "devices",
        price: 1999.00,
        image: "/images/bpmnitor.jpg",
        description: "Accurate digital blood pressure monitor for home use.",
        details: {
            brand: "HealthTech",
            warranty: "1 Year",
            features: ["LCD Display", "Memory for 60 readings"]
        },
        stock: 50
    },
    {
        id: '2',
        name: "Paracetamol Tablets",
        category: "medicines",
        price: 49.99,
        image: "/images/paraceta.jpg",
        description: "Effective pain relief medication.",
        details: {
            brand: "MediCare",
            composition: "Paracetamol 500mg",
            usage: "As directed by physician"
        },
        stock: 1000
    }
];

app.get('/api/products', (req, res) => {
    res.json(products);
});

app.get('/api/products/category/:category', (req, res) => {
    const categoryProducts = products.filter(p => p.category === req.params.category);
    res.json(categoryProducts);
});

app.get('/api/products/search', (req, res) => {
    const searchTerm = (req.query.q || '').toLowerCase();
    const searchResults = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm) || 
        p.description.toLowerCase().includes(searchTerm)
    );
    res.json(searchResults);
});

// Create order
app.post('/api/orders', async (req, res) => {
    try {
        const orderId = Date.now().toString();
        const userEmail = req.body.userEmail || 'guest@example.com';
        const totalAmount = req.body.totalAmount || 0;
        const items = JSON.stringify(req.body.items || []);
        const shippingAddress = JSON.stringify(req.body.shippingAddress || {});
        const status = 'Pending';
        
        await pool.query(
            'INSERT INTO orders (id, user_email, total_amount, status, items, shipping_address) VALUES (?, ?, ?, ?, ?, ?)',
            [orderId, userEmail, totalAmount, status, items, shippingAddress]
        );
        
        res.status(201).json({ id: orderId, user_email: userEmail, total_amount: totalAmount, status: status, date: new Date() });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
});

// Get order by ID
app.get('/api/orders/:orderId', async (req, res) => {
    try {
        const [orders] = await pool.query('SELECT * FROM orders WHERE id = ?', [req.params.orderId]);
        if (orders.length > 0) {
            res.json(orders[0]);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Configure nodemailer transporter using environment variables
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
        user: process.env.EMAIL_USER || '',
        pass: process.env.EMAIL_PASS || ''
    }
});

// Contact form submission endpoint
app.post('/api/contact', (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !subject || !message) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }
        
        // If email credentials are not configured, just log it
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.log('Contact form submission (email not configured):');
            console.log({ name, email, subject, message });
            return res.status(200).json({ 
                success: true, 
                message: 'Message received successfully' 
            });
        }

        // Email content
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: `New Contact Form Submission: ${subject}`,
            html: `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
                <p><em>This email was sent from your website contact form.</em></p>
            `
        };
        
        // Send email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).json({ success: false, message: 'Failed to send email' });
            }
            
            console.log('Email sent successfully:', info.response);
            res.status(200).json({ success: true, message: 'Message sent successfully' });
        });
    } catch (error) {
        console.error('Error in contact form submission:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Catch-all: serve index.html for any unmatched routes (SPA-like behavior)
app.get('*', (req, res) => {
    // Only serve index.html for routes that don't match a file
    const filePath = path.join(__dirname, req.path);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        res.sendFile(filePath);
    } else {
        res.sendFile(path.join(__dirname, 'index.html'));
    }
});

// Start the server
const PORT = process.env.PORT || 3002;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});