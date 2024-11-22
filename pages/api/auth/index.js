import { Shopify } from '@shopify/shopify-api';

// Initialize Shopify context
Shopify.Context.initialize({
  API_KEY: process.env.SHOPIFY_API_KEY,
  API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
  SCOPES: process.env.SCOPES?.split(',') || ['read_orders', 'write_orders'],
  HOST_NAME: process.env.HOST?.replace(/https?:\/\//, '') || 'shopify-reorder-app.vercel.app',
  HOST_SCHEME: 'https',
  IS_EMBEDDED_APP: true,
  API_VERSION: '2023-07',
  SESSION_STORAGE: new Shopify.Session.MemorySessionStorage(),
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const shop = req.query.shop;
  if (!shop) {
    return res.status(400).json({ message: 'Missing shop parameter' });
  }

  try {
    console.log('Auth initialization with:', {
      apiKey: process.env.SHOPIFY_API_KEY,
      shop: shop,
      host: process.env.HOST
    });

    // Initialize the auth URL
    const authUrl = await Shopify.Auth.beginAuth(
      req,
      res,
      shop,
      '/api/auth/callback',
      false
    );

    // Redirect to auth
    return res.redirect(authUrl);
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(500).json({ 
      message: 'Error initiating auth', 
      error: error.message,
      env: {
        apiKey: process.env.SHOPIFY_API_KEY,
        host: process.env.HOST,
        scopes: process.env.SCOPES
      }
    });
  }
}
