export default async function handler(req, res) {
  console.log('Starting env-check endpoint');
  
  try {
    // Basic environment check without any processing
    const envInfo = {
      API_KEY_SET: process.env.SHOPIFY_API_KEY ? 'yes' : 'no',
      HOST_SET: process.env.HOST ? 'yes' : 'no',
      SCOPES_SET: process.env.SCOPES ? 'yes' : 'no',
      NODE_ENV: process.env.NODE_ENV || 'not set',
      VERCEL_ENV: process.env.VERCEL_ENV || 'not set'
    };

    console.log('Environment info:', envInfo);
    
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    
    return res.status(200).json(envInfo);
  } catch (error) {
    console.error('Error in env-check endpoint:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
