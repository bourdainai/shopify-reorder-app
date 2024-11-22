export async function getServerSideProps() {
  // Get environment variables during server-side rendering
  const envInfo = {
    SHOPIFY_API_KEY: process.env.SHOPIFY_API_KEY ? `${process.env.SHOPIFY_API_KEY.substring(0, 6)}...` : 'not set',
    HOST: process.env.HOST || 'not set',
    SCOPES: process.env.SCOPES || 'not set',
    NODE_ENV: process.env.NODE_ENV || 'not set',
    VERCEL_ENV: process.env.VERCEL_ENV || 'not set'
  };

  return {
    props: {
      envInfo
    }
  };
}

export default function CheckPage({ envInfo }) {
  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Environment Variables</h1>
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
