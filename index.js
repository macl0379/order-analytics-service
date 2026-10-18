
const express = require('express');
require('dotenv').config();

// Create an Express application
const app = express();

// Middleware to parse incoming JSON
app.use(express.json());

// Use Azure's port or 4000 for local development
const PORT = process.env.PORT || 4000;

// In-memory storage for incoming orders
const orders = [];

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'order-analytics-service'
    });
});

// Retrieve all orders
app.get('/orders', (req, res) => {
    res.json(orders);
});

// Start the HTTP server
app.listen(PORT, () => {
    console.log(`Analytics service running on port ${PORT}`);
});
