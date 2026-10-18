
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

// Calculate overall order statistics
app.get('/analytics/summary', (req, res) => {
    const totalOrders = orders.length;

    const totalRevenue = orders.reduce((sum, order) => {
        return sum + order.totalPrice;
    }, 0);

    const averageOrderValue = totalOrders > 0
        ? totalRevenue / totalOrders
        : 0;

    res.json({
        totalOrders,
        totalRevenue: Number(totalRevenue.toFixed(2)),
        averageOrderValue: Number(averageOrderValue.toFixed(2))
    });
});

// Start the HTTP server
app.listen(PORT, () => {
    console.log(`Analytics service running on port ${PORT}`);
});

module.exports = orders; // Export orders for testing purposes