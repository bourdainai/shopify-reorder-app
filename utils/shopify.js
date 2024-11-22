import { Shopify } from '@shopify/shopify-api';

const isDevelopment = process.env.NODE_ENV === 'development';

// Initialize Shopify context
Shopify.Context.initialize({
  API_KEY: process.env.SHOPIFY_API_KEY,
  API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
  SCOPES: process.env.SCOPES.split(','),
  HOST_NAME: process.env.HOST.replace(/https?:\/\//, ''),
  HOST_SCHEME: 'https',
  IS_EMBEDDED_APP: true,
  API_VERSION: '2023-07' // Use the latest stable API version
});

export { Shopify };
