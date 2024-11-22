import { shopify } from '../../utils/shopify';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Get the shop from query parameters
    const { shop } = req.query;
    if (!shop) {
      return res.status(400).json({ error: 'Shop parameter is required' });
    }

    // Load the current session
    const session = await shopify.session.getCurrentId({
      isOnline: true,
      rawRequest: req,
      rawResponse: res,
    });

    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Create a new client
    const client = new shopify.clients.Rest({
      session: session,
      apiVersion: '2023-10',
    });

    const response = await client.get({
      path: 'orders',
      query: { status: 'any', limit: 50 }
    });

    res.status(200).json(response.body);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ 
      error: 'Failed to fetch orders',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
