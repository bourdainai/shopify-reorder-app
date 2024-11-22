// @ts-check
import { withApiAuthRequired } from '@shopify/shopify-auth';

// This endpoint does not require authentication
export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  try {
    // Only show first few characters of sensitive values
    const debugInfo = {
      SHOPIFY_API_KEY: process.env.SHOPIFY_API_KEY ? (process.env.SHOPIFY_API_KEY.substring(0, 6) + '...') : 'not set',
      HOST: process.env.HOST || 'not set',
      SCOPES: process.env.SCOPES || 'not set',
      NODE_ENV: process.env.NODE_ENV || 'not set',
      VERCEL_ENV: process.env.VERCEL_ENV || 'not set',
      REQUEST_URL: req.url || 'not set',
      HEADERS: {
        host: req.headers.host || 'not set',
        'user-agent': req.headers['user-agent'] || 'not set'
      }
    };

    console.log('Debug info:', JSON.stringify(debugInfo, null, 2));
    res.status(200).json(debugInfo);
  } catch (error) {
    console.error('Debug endpoint error:', error);
    res.status(500).json({ 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
