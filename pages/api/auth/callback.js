import { Shopify } from '@shopify/shopify-api';

export default async function handler(req, res) {
  try {
    const session = await Shopify.Auth.validateAuthCallback(
      req,
      res,
      req.query
    );

    // Session is now persisted
    res.redirect(`/`); // Redirect to the app home page
  } catch (error) {
    console.error('Error during auth callback:', error);
    res.status(500).send('Error during auth callback');
  }
}
