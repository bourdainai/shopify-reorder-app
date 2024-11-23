import '@shopify/shopify-api/adapters/node';
import { shopifyApi, LATEST_API_VERSION } from '@shopify/shopify-api';

// Initialize Shopify client outside the handler for better performance
const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET,
  scopes: process.env.SCOPES?.split(',') || ['read_orders', 'write_orders'],
  hostName: process.env.HOST?.replace(/https?:\/\//, '') || 'shopify-reorder-app.vercel.app',
  hostScheme: 'https',
  isEmbeddedApp: true,
  apiVersion: LATEST_API_VERSION,
});

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const shop = req.query.shop;
  if (!shop) {
    return res.status(400).json({ message: 'Missing shop parameter' });
  }

  try {
    // Set a timeout for the auth process
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Auth timeout')), 9000)
    );

    const authPromise = shopify.auth.begin({
      shop: shop,
      callbackPath: '/api/auth/callback',
      isOnline: false,
      rawRequest: req,
      rawResponse: res,
    });

    // Race between auth and timeout
    const authPath = await Promise.race([authPromise, timeoutPromise]);
    
    console.log('Auth URL generated:', authPath);
    return res.redirect(authPath);
  } catch (error) {
    console.error('Auth error:', error);
    if (error.message === 'Auth timeout') {
      return res.status(504).json({ 
        message: 'Authentication timed out',
        error: error.message 
      });
    }
    return res.status(500).json({ 
      message: 'Error during auth',
      error: error.message 
    });
  }
}
