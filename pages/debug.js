import { useEffect, useState } from 'react';

export default function DebugPage() {
  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Environment Debug Info</h1>
      <div id="debug-content">Loading...</div>
      <script dangerouslySetInnerHTML={{ __html: `
        fetch('/api/debug')
          .then(res => res.json())
          .then(data => {
            document.getElementById('debug-content').innerHTML = 
              '<pre style="background:#f5f5f5;padding:15px;border-radius:5px;white-space:pre-wrap;word-break:break-word">' + 
              JSON.stringify(data, null, 2) + 
              '</pre>';
          })
          .catch(err => {
            document.getElementById('debug-content').innerHTML = 
              '<pre style="color:red">' + err.message + '</pre>';
          });
      `}} />
    </div>
  );
}
