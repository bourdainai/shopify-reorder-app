import { Shopify } from '@shopify/shopify-api';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const shop = req.query.shop;
  if (!shop) {
    return res.status(400).json({ message: 'Missing shop parameter' });
  }

  try {
    // Initialize the auth URL
    const authUrl = await Shopify.Auth.beginAuth(
      req,
      res,
      shop,
      '/api/auth/callback',
      false
    );

    // Redirect to auth
    return res.redirect(authUrl);
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(500).json({ message: 'Error initiating auth', error: error.message });
  }
}
