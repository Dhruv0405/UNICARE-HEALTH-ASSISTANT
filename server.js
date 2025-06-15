// Replace the simple users array with persistent storage
const express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer'); // Add this line
require('dotenv').config();

const app = express();

// Add CORS headers
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow any origin
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        return res.status(200).json({});
    }
    next();
});

// Middleware
app.use(express.json());
app.use(express.static('.')); // Serve static files

// File path for storing users
const usersFilePath = path.join(__dirname, 'users.json');

// Load users from file or initialize empty array
let users = [];
try {
    if (fs.existsSync(usersFilePath)) {
        const data = fs.readFileSync(usersFilePath, 'utf8');
        users = JSON.parse(data);
        console.log(`Loaded ${users.length} users from storage`);
    }
} catch (error) {
    console.error('Error loading users:', error);
}

// Function to save users to file
function saveUsers() {
    try {
        fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
        console.log('Users saved to storage');
    } catch (error) {
        console.error('Error saving users:', error);
    }
}

// Health Check Route
app.get('/api/health', (req, res) => {
    res.status(200).json({ 
        status: 'ok'
    });
});

// Signup Route
app.post('/api/signup', (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = users.find(user => user.email === email);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user (in a real app, you would hash the password)
        const newUser = {
            id: Date.now().toString(),
            name,
            email,
            password, // In a real app, NEVER store plain text passwords
            date: new Date()
        };

        // Save user to in-memory array
        users.push(newUser);
        console.log('User created:', email);
        
        // Save to file
        saveUsers();

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login Route
app.post('/api/login', (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = users.find(user => user.email === email);
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Validate password (simple comparison since we're not hashing)
        if (user.password !== password) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create and send JWT token
        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET || 'fallback_secret_key',
            { expiresIn: '1h' }
        );

        res.json({ token });
    } catch (error) {
        console.error(error);
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
    const searchTerm = req.query.q.toLowerCase();
    const searchResults = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm) || 
        p.description.toLowerCase().includes(searchTerm)
    );
    res.json(searchResults);
});

// Simple in-memory orders
let orders = [];

app.post('/api/orders', (req, res) => {
    try {
        const order = {
            id: Date.now().toString(),
            ...req.body,
            date: new Date()
        };
        orders.push(order);
        res.status(201).json(order);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.get('/api/orders/:orderId', (req, res) => {
    const order = orders.find(o => o.id === req.params.orderId);
    if (order) {
        res.json(order);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
});

// Start the server with port fallback
const startServer = (port) => {
    const server = app.listen(port)
        .on('error', (error) => {
            if (error.code === 'EADDRINUSE') {
                console.log(`Port ${port} is busy, trying port ${port + 1}`);
                startServer(port + 1);
            } else {
                console.error('Error starting server:', error);
            }
        })
        .on('listening', () => {
            console.log(`Server is running on port ${port}`);
        });
};

const PORT = process.env.PORT || 3002; // Change from 3001 to 3002
startServer(PORT);
// Delete or comment out this line
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });
// Add this route to protect users.json with admin authentication
app.get('/api/users', (req, res) => {
    // In a real app, you would check for admin authentication here
    // For now, we'll just return the users array
    res.json(users);
});

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail', // You can use other services like 'hotmail', 'yahoo', etc.
    auth: {
        user: 'jagannathuniversity29@gmail.com', // Your email address
        pass: 'hkjn kzrd iuts jugt' // Replace with your app password (not your regular password)
    }
});

// Add contact form submission endpoint
app.post('/api/contact', (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        
        // Email content
        const mailOptions = {
            from: 'jagannathuniversity29@gmail.com', // Your email address
            to: 'jagannathuniversity29@gmail.com', // Your email address (where you want to receive messages)
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