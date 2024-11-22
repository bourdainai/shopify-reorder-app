import { useEffect, useState } from 'react';

export default function DebugPage() {
  const [debugInfo, setDebugInfo] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/debug')
      .then(async res => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch debug info');
        return data;
      })
      .then(data => {
        setDebugInfo(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Loading Environment Debug Info...</h1>
    </div>
  );

  if (error) return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Error Loading Debug Info</h1>
      <pre style={{ color: 'red' }}>{error}</pre>
    </div>
  );

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Environment Debug Info</h1>
      <pre style={{ 
        background: '#f5f5f5', 
        padding: '15px', 
        borderRadius: '5px',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word'
      }}>
        {JSON.stringify(debugInfo, null, 2)}
      </pre>
    </div>
  );
}
