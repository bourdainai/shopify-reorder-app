import '@shopify/shopify-api/adapters/node';
import { shopifyApi, LATEST_API_VERSION } from '@shopify/shopify-api';

// Initialize Shopify client outside the handler
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
  try {
    // Set a timeout for the callback process
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Callback timeout')), 9000)
    );

    const callbackPromise = shopify.auth.callback({
      rawRequest: req,
      rawResponse: res,
    });

    // Race between callback and timeout
    const callbackResponse = await Promise.race([callbackPromise, timeoutPromise]);

    // Log successful authentication
    console.log('Auth successful, session created:', {
      shop: callbackResponse.session.shop,
      accessToken: callbackResponse.session.accessToken ? 'Present' : 'Missing',
      scope: callbackResponse.session.scope,
    });

    // Redirect to app with shop parameter
    const redirectUrl = `/api/auth/toplevel?shop=${callbackResponse.session.shop}&host=${req.query.host}`;
    return res.redirect(redirectUrl);
  } catch (error) {
    console.error('Auth callback error:', error);
    
    if (error.message === 'Callback timeout') {
      return res.status(504).json({ 
        message: 'Authentication callback timed out',
        error: error.message 
      });
    }
    
    return res.status(500).json({ 
      message: 'Error during auth callback',
      error: error.message,
    });
  }
}
