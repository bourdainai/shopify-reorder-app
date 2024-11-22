import { Shopify } from '@shopify/shopify-api';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const session = await Shopify.Utils.loadCurrentSession(req, res);
    const client = new Shopify.Clients.Rest(session.shop, session.accessToken);

    const response = await client.get({
      path: 'orders',
      query: { status: 'any', limit: 50 }
    });

    res.status(200).json(response.body);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
}
