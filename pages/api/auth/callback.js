import { Shopify } from '@shopify/shopify-api';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  try {
    // Validate callback
    const session = await Shopify.Auth.validateAuthCallback(
      req,
      res,
      req.query
    );

    // Store session token or handle session management here
    console.log('Auth successful, session created:', session.id);

    // Redirect to app home with shop parameter
    const redirectUrl = `/?shop=${session.shop}&host=${req.query.host}`;
    return res.redirect(redirectUrl);
  } catch (error) {
    console.error('Auth callback error:', error);
    return res.status(500).json({ 
      message: 'Error during auth callback',
      error: error.message 
    });
  }
}
