export default function handler(req, res) {
  // Only show first few characters of sensitive values
  const debugInfo = {
    SHOPIFY_API_KEY: process.env.SHOPIFY_API_KEY?.substring(0, 6) + '...',
    HOST: process.env.HOST,
    SCOPES: process.env.SCOPES,
    NODE_ENV: process.env.NODE_ENV,
    VERCEL_ENV: process.env.VERCEL_ENV,
  };

  res.status(200).json(debugInfo);
}
