require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

// Auth endpoint
app.get('/auth', (req, res) => {
  const shop = req.query.shop;
  if (!shop) {
    return res.status(400).json({ error: 'Missing shop parameter' });
  }

  const scopes = process.env.SCOPES || 'read_orders,write_orders';
  const redirectUri = `${process.env.HOST}/auth/callback`;
  const nonce = Date.now();

  // Construct the authorization URL
  const authUrl = `https://${shop}/admin/oauth/authorize?` +
    `client_id=${process.env.SHOPIFY_API_KEY}` +
    `&scope=${scopes}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&state=${nonce}`;

  res.redirect(authUrl);
});

// Auth callback endpoint
app.get('/auth/callback', async (req, res) => {
  const { shop, code } = req.query;

  if (!shop || !code) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  try {
    // Exchange the authorization code for an access token
    const response = await fetch(`https://${shop}/admin/oauth/access_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.SHOPIFY_API_KEY,
        client_secret: process.env.SHOPIFY_API_SECRET,
        code,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get access token');
    }

    const data = await response.json();
    
    // Store the access token securely (implement your storage solution)
    console.log('Access token received:', data.access_token);

    // Redirect back to the app
    res.redirect(`/?shop=${shop}`);
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
