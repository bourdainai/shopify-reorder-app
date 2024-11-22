import { Shopify } from '@shopify/shopify-api';

// Initialize Shopify context
Shopify.Context.initialize({
  API_KEY: process.env.SHOPIFY_API_KEY,
  API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
  SCOPES: process.env.SCOPES?.split(',') || ['read_orders', 'write_orders'],
  HOST_NAME: process.env.HOST?.replace(/https?:\/\//, '') || 'shopify-reorder-app.vercel.app',
  HOST_SCHEME: 'https',
  IS_EMBEDDED_APP: true,
  API_VERSION: '2023-07',
  SESSION_STORAGE: new Shopify.Session.MemorySessionStorage(),
});

export { Shopify };
