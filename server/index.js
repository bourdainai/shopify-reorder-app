require('dotenv').config();
const express = require('express');
require('@shopify/shopify-api/adapters/node');
const { shopifyApi, LATEST_API_VERSION } = require('@shopify/shopify-api');
const app = express();

// Initialize Shopify API client
const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET,
  scopes: process.env.SCOPES?.split(',') || ['read_orders', 'write_orders'],
  hostName: process.env.HOST?.replace(/https?:\/\//, '') || 'shopify-reorder-app.vercel.app',
  hostScheme: 'https',
  isEmbeddedApp: true,
  apiVersion: LATEST_API_VERSION,
});

// Middleware to parse JSON requests
app.use(express.json());

// API endpoint to fetch customer's orders
app.get('/api/orders', async (req, res) => {
  try {
    // Log environment variables for debugging
    console.log('Environment variables in orders endpoint:', {
      SHOPIFY_API_KEY: process.env.SHOPIFY_API_KEY,
      HOST: process.env.HOST,
      SCOPES: process.env.SCOPES
    });

    const session = await shopify.session.getCurrentId({
      isOnline: true,
      rawRequest: req,
      rawResponse: res,
    });

    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const client = new shopify.clients.Rest({
      session: session,
      apiVersion: LATEST_API_VERSION,
    });

    const response = await client.get({
      path: 'orders',
      query: { status: 'any', limit: 50 }
    });

    res.json(response.body);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ 
      error: 'Failed to fetch orders',
      message: error.message,
      details: {
        apiKey: process.env.SHOPIFY_API_KEY ? 'Set' : 'Not set',
        host: process.env.HOST
      }
    });
  }
});

// API endpoint to create a new order based on previous order
app.post('/api/reorder', async (req, res) => {
  try {
    const { orderId } = req.body;
    
    const session = await shopify.session.getCurrentId({
      isOnline: true,
      rawRequest: req,
      rawResponse: res,
    });

    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const client = new shopify.clients.Rest({
      session: session,
      apiVersion: LATEST_API_VERSION,
    });

    // Get the original order
    const originalOrder = await client.get({
      path: `orders/${orderId}`,
    });

    // Create new order with the same line items
    const newOrder = {
      line_items: originalOrder.body.order.line_items.map(item => ({
        variant_id: item.variant_id,
        quantity: item.quantity
      }))
    };

    // Create the reorder
    const response = await client.post({
      path: 'orders',
      data: newOrder
    });

    res.json(response.body);
  } catch (error) {
    console.error('Error creating reorder:', error);
    res.status(500).json({ 
      error: 'Failed to create reorder',
      message: error.message,
      details: {
        apiKey: process.env.SHOPIFY_API_KEY ? 'Set' : 'Not set',
        host: process.env.HOST
      }
    });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
