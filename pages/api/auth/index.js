import { Shopify } from '@shopify/shopify-api';

export default async function handler(req, res) {
  if (!req.query.shop) {
    res.status(400).send("Missing shop parameter");
    return;
  }

  try {
    const authRoute = await Shopify.Auth.beginAuth(
      req,
      res,
      req.query.shop,
      '/api/auth/callback',
      false
    );

    res.redirect(authRoute);
  } catch (error) {
    console.error('Error during auth:', error);
    res.status(500).send('Error during auth');
  }
}
