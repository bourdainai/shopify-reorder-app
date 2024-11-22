import '@shopify/shopify-api/adapters/node';
import { shopifyApi, LATEST_API_VERSION } from '@shopify/shopify-api';

// Initialize Shopify context
const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET,
  scopes: process.env.SCOPES?.split(',') || ['read_orders', 'write_orders'],
  hostName: process.env.HOST?.replace(/https?:\/\//, '') || 'shopify-reorder-app.vercel.app',
  hostScheme: 'https',
  isEmbeddedApp: true,
  apiVersion: LATEST_API_VERSION,
});

export { shopify };
