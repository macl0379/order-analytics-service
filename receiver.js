// Code developed with ChatGPT comments added by Collin MacLeod

// import the amqplib library for RabbitMQ communication
const amqp = require('amqplib');

// import orders array from index.js local storage for demo purposes only
const orders = require('./orders');

// define RabbitMQ string
const RABBITMQ_CONNECTION_STRING = process.env.RABBITMQ_CONNECTION_STRING || 'amqp://localhost';

// function to receive orders from the RabbitMQ queue
async function receiveOrders() {
  // Ensure that service is connected to RabbitMQ before consuming messages
  const connection = await amqp.connect(RABBITMQ_CONNECTION_STRING);
  // create channel for communication with RabbitMQ
  const channel = await connection.createChannel();

  // create the queue and ensure it follows the required properties
  await channel.assertQueue('order_queue', { durable: true });

 channel.consume('order_queue', (msg) => {
    // check if message is not empty and parse the order from the message content
    if (msg) {
      console.log('Received order message:')
      try {
        // parse the order
        const order = JSON.parse(msg.content.toString());
        order.totalPrice = Number(order.totalPrice.toFixed(2));
        
        // send order to local storage for demo purposes only
        orders.push(order);

        // acknowledge the message to RabbitMQ to indicate successful processing
        channel.ack(msg);

        // log the received order for debugging purposes
        console.log('Order received:', order);
      } catch (error) {
        // Error handling
        console.error('Error processing order:', error);
        channel.nack(msg, false, false);
      }
    }
  });
}

module.exports = receiveOrders;