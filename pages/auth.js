import { useEffect } from 'react';

export default function Auth() {
  useEffect(() => {
    // Get URL parameters
    const params = new URLSearchParams(window.location.search);
    const shop = params.get('shop');
    const host = params.get('host');

    if (!shop) {
      console.error('No shop provided');
      return;
    }

    // Construct OAuth URL directly
    const scopes = process.env.NEXT_PUBLIC_SCOPES || 'read_orders,write_orders';
    const redirectUri = `${process.env.NEXT_PUBLIC_HOST}/api/auth/callback`;
    const nonce = Math.random().toString(36).substring(2);
    
    const authUrl = `https://${shop}/admin/oauth/authorize?` + 
      `client_id=${process.env.NEXT_PUBLIC_SHOPIFY_API_KEY}` +
      `&scope=${scopes}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&state=${nonce}`;

    // Redirect to Shopify OAuth
    window.location.href = authUrl;
  }, []);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1>Authenticating...</h1>
        <p>You will be redirected to Shopify shortly.</p>
      </div>
    </div>
  );
}
