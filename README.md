# Shopify Reorder App

This Shopify app allows customers to easily repeat their previous orders with a single click. The app provides a simple interface for customers to view their order history and reorder items.

## Features
- View previous orders
- One-click reorder functionality
- Secure authentication with Shopify
- Order history display

## Setup
1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with your Shopify API credentials:
```
SHOPIFY_API_KEY=your_api_key
SHOPIFY_API_SECRET=your_api_secret
SCOPES=read_orders,write_orders
HOST=your_app_host
```

3. Start the development server:
```bash
npm run dev
```

## Tech Stack
- Node.js
- React
- Shopify App Bridge
- Shopify Polaris
- Express.js
