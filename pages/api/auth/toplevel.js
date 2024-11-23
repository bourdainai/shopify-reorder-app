export const config = {
  runtime: 'edge',
  regions: ['lhr1'], // London region for lower latency
};

export default async function handler(req) {
  const url = new URL(req.url);
  const shop = url.searchParams.get('shop');
  const host = url.searchParams.get('host');

  if (!shop || !host) {
    return new Response('Missing shop or host parameter', { status: 400 });
  }

  // Return an HTML page that will handle the redirect
  return new Response(
    `<!DOCTYPE html>
    <html>
      <head>
        <script src="https://unpkg.com/@shopify/app-bridge-utils@3.7.9/umd/index.js"></script>
        <script>
          document.addEventListener('DOMContentLoaded', function() {
            const targetUrl = '/?shop=${shop}&host=${host}';
            if (window.top === window.self) {
              // If the current window is the 'parent', change the URL by setting location.href
              window.location.href = targetUrl;
            } else {
              // If the current window is the 'child', use AppBridge to redirect
              const AppBridge = window['app-bridge-utils'];
              const app = AppBridge.createApp({
                apiKey: '${process.env.SHOPIFY_API_KEY}',
                host: '${host}',
                forceRedirect: true
              });
              const redirect = AppBridge.Redirect.create(app);
              redirect.dispatch(AppBridge.Redirect.Action.REMOTE, targetUrl);
            }
          });
        </script>
      </head>
      <body>
        <p>Redirecting to app...</p>
      </body>
    </html>`,
    {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
      },
    }
  );
}
