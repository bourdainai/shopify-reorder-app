import '@shopify/shopify-api/adapters/node';
import { shopifyApi, LATEST_API_VERSION } from '@shopify/shopify-api';

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get('code');
    const shop = url.searchParams.get('shop');
    const host = url.searchParams.get('host');
    const state = url.searchParams.get('state');

    if (!code || !shop) {
      return new Response(JSON.stringify({ error: 'Missing required parameters' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Exchange the authorization code for an access token
    const accessTokenResponse = await fetch(`https://${shop}/admin/oauth/access_token`, {
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

    if (!accessTokenResponse.ok) {
      throw new Error('Failed to get access token');
    }

    const { access_token } = await accessTokenResponse.json();

    // Store the access token securely (implement your storage solution here)
    // For now, we'll just redirect to the app
    return Response.redirect(`/api/auth/toplevel?shop=${shop}&host=${host}`, 302);
  } catch (error) {
    console.error('Auth callback error:', error);
    return new Response(JSON.stringify({ 
      error: 'Authentication failed',
      details: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
