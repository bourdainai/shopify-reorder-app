export default function handler(req, res) {
  try {
    // Only show first few characters of sensitive values
    const debugInfo = {
      SHOPIFY_API_KEY: process.env.SHOPIFY_API_KEY ? (process.env.SHOPIFY_API_KEY.substring(0, 6) + '...') : 'not set',
      HOST: process.env.HOST || 'not set',
      SCOPES: process.env.SCOPES || 'not set',
      NODE_ENV: process.env.NODE_ENV || 'not set',
      VERCEL_ENV: process.env.VERCEL_ENV || 'not set'
    };

    console.log('Debug info:', debugInfo);
    res.status(200).json(debugInfo);
  } catch (error) {
    console.error('Debug endpoint error:', error);
    res.status(500).json({ 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
