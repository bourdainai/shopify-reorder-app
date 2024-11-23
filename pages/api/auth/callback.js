import '@shopify/shopify-api/adapters/node';
import { shopifyApi, LATEST_API_VERSION } from '@shopify/shopify-api';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  try {
    console.log('Callback received with query params:', req.query);
    
    const shopify = shopifyApi({
      apiKey: process.env.SHOPIFY_API_KEY,
      apiSecretKey: process.env.SHOPIFY_API_SECRET,
      scopes: process.env.SCOPES?.split(',') || ['read_orders', 'write_orders'],
      hostName: process.env.HOST?.replace(/https?:\/\//, '') || 'shopify-reorder-app.vercel.app',
      hostScheme: 'https',
      isEmbeddedApp: true,
      apiVersion: LATEST_API_VERSION,
    });

    // Handle the callback and create a session
    const callbackResponse = await shopify.auth.callback({
      rawRequest: req,
      rawResponse: res,
    });

    // Log successful authentication
    console.log('Auth successful, session created:', {
      shop: callbackResponse.session.shop,
      accessToken: callbackResponse.session.accessToken ? 'Present' : 'Missing',
      scope: callbackResponse.session.scope,
    });

    // Store the session token securely here if needed
    // You might want to implement your own session storage solution

    // Redirect to app home with shop parameter
    const redirectUrl = `/api/auth/toplevel?shop=${callbackResponse.session.shop}&host=${req.query.host}`;
    return res.redirect(redirectUrl);
  } catch (error) {
    console.error('Auth callback error:', error);
    return res.status(500).json({ 
      message: 'Error during auth callback',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
