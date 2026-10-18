//  AI Disclosure:
// ChatGPT was used to assist with writing code
// All code was reviewed, tested, and understood before submission.


const express = require('express');
require('dotenv').config();

// Create an Express application
const app = express();

// Middleware to parse incoming JSON
app.use(express.json());

// Use Azure's port or 4000 for local development
const PORT = process.env.PORT || 4000;

// Import the receiveOrders function from receiver.js and start receiving orders from RabbitMQ
const receiveOrders = require('./receiver');
receiveOrders().catch((error) => {
    console.error('Error receiving orders:', error);
    process.exit(1);
});

// In-memory storage for incoming orders
const orders = require('./orders');


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


app.get('/analytics/products', (req, res) => {
    const products = {};

    orders.forEach(order => {
        const name = order.product.name;

        if (!products[name]) {
            products[name] = {
                productName: name,
                orderCount: 0,
                totalRevenue: 0
            };
        }

        products[name].orderCount++;
        products[name].totalRevenue += order.totalPrice;
    });

    // Convert the products object to an array and round totalRevenue to 2 decimal places
    const result = Object.values(products).map(product => ({
        ...product,
        totalRevenue: Number(product.totalRevenue.toFixed(2))
    }));

    res.json(result);
});



app.get('/analytics/top-products', (req, res) => {
    const products = {};

    // Aggregate total quantity sold for each product
    orders.forEach(order => {
        const name = order.product.name;

        if (!products[name]) {
            products[name] = {
                productName: name,
                totalQuantity: 0
            };
        }

        products[name].totalQuantity += order.quantity;
    });

    const topProducts = Object.values(products)
    //sort products by totalQuantity in descending order and slice the top 3
        .sort((a, b) => b.totalQuantity - a.totalQuantity)
        .slice(0, 3);

    res.json(topProducts);
});


// Start the HTTP server
app.listen(PORT, () => {
    console.log(`Analytics service running on port ${PORT}`);
});

