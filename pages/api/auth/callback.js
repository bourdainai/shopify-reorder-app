import '@shopify/shopify-api/adapters/node';
import { shopifyApi, LATEST_API_VERSION } from '@shopify/shopify-api';

export const config = {
  runtime: 'edge',
  regions: ['lhr1'], // London region for lower latency
};

export default async function handler(req) {
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

    // Handle the callback
    const callbackResponse = await shopify.auth.callback({
      rawRequest: req,
    });

    // Log successful authentication
    console.log('Auth successful, session created:', {
      shop: callbackResponse.session.shop,
      accessToken: callbackResponse.session.accessToken ? 'Present' : 'Missing',
      scope: callbackResponse.session.scope,
    });

    const url = new URL(req.url);
    const host = url.searchParams.get('host');

    // Redirect to app with shop parameter
    const redirectUrl = `/api/auth/toplevel?shop=${callbackResponse.session.shop}&host=${host}`;
    return Response.redirect(redirectUrl, 302);
  } catch (error) {
    console.error('Auth callback error:', error);
    return new Response(JSON.stringify({ 
      message: 'Error during auth callback',
      error: error.message,
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
