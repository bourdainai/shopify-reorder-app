import { useEffect, useState } from 'react';

export default function DebugPage() {
  const [debugInfo, setDebugInfo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/debug')
      .then(res => res.json())
      .then(data => setDebugInfo(data))
      .catch(err => setError(err.message));
  }, []);

  if (error) return <div>Error: {error}</div>;
  if (!debugInfo) return <div>Loading...</div>;

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Environment Debug Info</h1>
      <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
    </div>
  );
}
