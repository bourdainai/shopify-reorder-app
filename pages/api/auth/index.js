import '@shopify/shopify-api/adapters/node';
import { shopifyApi, LATEST_API_VERSION } from '@shopify/shopify-api';

export const config = {
  runtime: 'edge',
  regions: ['lhr1'], // London region for lower latency
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

export default async function handler(req) {
  // Add CORS headers
  const headers = new Headers();
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers,
    });
  }

  if (req.method !== 'GET') {
    return new Response(JSON.stringify({ message: 'Method not allowed' }), {
      status: 405,
      headers: { ...headers, 'Content-Type': 'application/json' }
    });
  }

  const url = new URL(req.url);
  const shop = url.searchParams.get('shop');

  if (!shop) {
    return new Response(JSON.stringify({ message: 'Missing shop parameter' }), {
      status: 400,
      headers: { ...headers, 'Content-Type': 'application/json' }
    });
  }

  try {
    const shopify = shopifyApi({
      apiKey: process.env.SHOPIFY_API_KEY,
      apiSecretKey: process.env.SHOPIFY_API_SECRET,
      scopes: process.env.SCOPES?.split(',') || ['read_orders', 'write_orders'],
      hostName: process.env.HOST?.replace(/https?:\/\//, '') || 'shopify-reorder-app.vercel.app',
      hostScheme: 'https',
      isEmbeddedApp: true,
      apiVersion: LATEST_API_VERSION,
    });

    // Generate auth URL
    const authUrl = await shopify.auth.begin({
      shop,
      callbackPath: '/api/auth/callback',
      isOnline: false,
    });

    // Redirect to Shopify auth
    return Response.redirect(authUrl, 302, headers);
  } catch (error) {
    console.error('Auth error:', error);
    return new Response(JSON.stringify({ 
      message: 'Error during auth',
      error: error.message 
    }), {
      status: 500,
      headers: { ...headers, 'Content-Type': 'application/json' }
    });
  }
}
