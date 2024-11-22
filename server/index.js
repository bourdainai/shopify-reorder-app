require('dotenv').config();
const express = require('express');
const { Shopify } = require('@shopify/shopify-api');
const app = express();

// Initialize Shopify API client
const shopify = new Shopify({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET,
  scopes: process.env.SCOPES.split(','),
  hostName: process.env.HOST.replace(/https?:\/\//, ''),
});

// Middleware to parse JSON requests
app.use(express.json());

// API endpoint to fetch customer's orders
app.get('/api/orders', async (req, res) => {
  try {
    const session = await Shopify.Utils.loadCurrentSession(req, res);
    const client = new Shopify.Clients.Rest(session.shop, session.accessToken);

    const response = await client.get({
      path: 'orders',
      query: { status: 'any', limit: 50 }
    });

    res.json(response.body);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// API endpoint to create a new order based on previous order
app.post('/api/reorder', async (req, res) => {
  try {
    const { orderId } = req.body;
    const session = await Shopify.Utils.loadCurrentSession(req, res);
    const client = new Shopify.Clients.Rest(session.shop, session.accessToken);

    // Get the original order
    const originalOrder = await client.get({
      path: `orders/${orderId}`,
    });

    // Create new order with the same line items
    const newOrder = {
      line_items: originalOrder.body.order.line_items.map(item => ({
        variant_id: item.variant_id,
        quantity: item.quantity
      })),
      customer: originalOrder.body.order.customer,
      shipping_address: originalOrder.body.order.shipping_address,
      billing_address: originalOrder.body.order.billing_address,
    };

    const response = await client.post({
      path: 'orders',
      data: { order: newOrder }
    });

    res.json(response.body);
  } catch (error) {
    console.error('Error creating reorder:', error);
    res.status(500).json({ error: 'Failed to create reorder' });
  }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
