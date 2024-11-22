export default function StaticCheck() {
  // Get environment variables at build time
  const envInfo = {
    API_KEY_SET: process.env.SHOPIFY_API_KEY ? 'yes' : 'no',
    HOST_SET: process.env.HOST ? 'yes' : 'no',
    SCOPES_SET: process.env.SCOPES ? 'yes' : 'no',
    NODE_ENV: process.env.NODE_ENV || 'not set',
    VERCEL_ENV: process.env.VERCEL_ENV || 'not set'
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Static Environment Check</h1>
      <p>This page shows environment variables available at build time.</p>
      <pre style={{ 
        background: '#f5f5f5',
        padding: '15px',
        borderRadius: '5px',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word'
      }}>
        {JSON.stringify(envInfo, null, 2)}
      </pre>
    </div>
  );
}
