import '@shopify/shopify-api/adapters/node';
import { shopifyApi, LATEST_API_VERSION } from '@shopify/shopify-api';

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
    // Log all environment variables for debugging
    console.log('Environment variables:', {
      SHOPIFY_API_KEY: process.env.SHOPIFY_API_KEY,
      HOST: process.env.HOST,
      SCOPES: process.env.SCOPES,
      NODE_ENV: process.env.NODE_ENV,
      VERCEL_ENV: process.env.VERCEL_ENV
    });

    // Initialize the Shopify context
    const shopify = shopifyApi({
      apiKey: process.env.SHOPIFY_API_KEY,
      apiSecretKey: process.env.SHOPIFY_API_SECRET,
      scopes: process.env.SCOPES?.split(',') || ['read_orders', 'write_orders'],
      hostName: process.env.HOST?.replace(/https?:\/\//, '') || 'shopify-reorder-app.vercel.app',
      hostScheme: 'https',
      isEmbeddedApp: true,
      apiVersion: LATEST_API_VERSION,
    });

    // Initialize auth
    const authPath = await shopify.auth.begin({
      shop: shop,
      callbackPath: '/api/auth/callback',
      isOnline: false,
      rawRequest: req,
      rawResponse: res,
    });

    console.log('Auth URL generated:', authPath);

    // Redirect to auth
    return res.redirect(authPath);
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(500).json({ 
      error: 'Authentication failed',
      message: error.message,
      details: {
        apiKey: process.env.SHOPIFY_API_KEY ? 'Set' : 'Not set',
        shop: shop,
        host: process.env.HOST
      }
    });
  }
}
