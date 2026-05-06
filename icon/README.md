# UniCare Medicine E-commerce Platform

A full-featured e-commerce platform for medical products and devices.

## Features

- Product catalog with categories (Medicines, Medical Devices, Supplements)
- Search functionality
- Shopping cart
- Order management
- Responsive design
- Real-time stock updates

## Tech Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express
- Database: MongoDB
- Additional: Mongoose for ODM

## Setup Instructions

1. Install MongoDB on your system if not already installed
2. Clone this repository
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a .env file in the root directory with the following content:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/unicare
   JWT_SECRET=your_jwt_secret_key_here
   ```
5. Start the server:
   ```bash
   npm run dev
   ```
6. Open `index.html` in your browser

## Project Structure

```
unicare/
├── public/
│   ├── images/
│   ├── css/
│   └── js/
├── index.html
├── medicines.html
├── server.js
├── package.json
└── README.md
```

## API Endpoints

- GET `/api/products` - Get all products
- GET `/api/products/category/:category` - Get products by category
- GET `/api/products/search?q=:searchTerm` - Search products
- POST `/api/orders` - Create new order
- GET `/api/orders/:orderId` - Get order status

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request 