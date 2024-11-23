export default function handler(req, res) {
  const shop = req.query.shop;
  const host = req.query.host;

  if (!shop || !host) {
    res.status(400).send('Missing shop or host parameter');
    return;
  }

  // Render a page that will automatically redirect to the app
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <script src="https://unpkg.com/@shopify/app-bridge-utils"></script>
        <script>
          document.addEventListener('DOMContentLoaded', function() {
            if (window.top === window.self) {
              // If the current window is the 'parent', change the URL to the app's root
              window.location.href = '/?shop=${shop}&host=${host}';
            } else {
              const AppBridge = window['app-bridge-utils'];
              const redirect = AppBridge.Redirect.create(window.app);
              redirect.dispatch(AppBridge.Redirect.Action.REMOTE, '/?shop=${shop}&host=${host}');
            }
          });
        </script>
      </head>
      <body>
        <p>Redirecting to app...</p>
      </body>
    </html>
  `);
}
