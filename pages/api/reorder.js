import { Shopify } from '@shopify/shopify-api';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { orderId } = req.body;
    const session = await Shopify.Utils.loadCurrentSession(req, res);
    const client = new Shopify.Clients.Rest(session.shop, session.accessToken);

    // Get the original order
    const originalOrder = await client.get({
      path: `orders/${orderId}`,
    });

    // Create new order with the same line items
    const newOrder = {
      line_items: originalOrder.body.order.line_items.map(item => ({
        variant_id: item.variant_id,
        quantity: item.quantity
      })),
      customer: originalOrder.body.order.customer,
      shipping_address: originalOrder.body.order.shipping_address,
      billing_address: originalOrder.body.order.billing_address,
    };

    const response = await client.post({
      path: 'orders',
      data: { order: newOrder }
    });

    res.status(200).json(response.body);
  } catch (error) {
    console.error('Error creating reorder:', error);
    res.status(500).json({ error: 'Failed to create reorder' });
  }
}
