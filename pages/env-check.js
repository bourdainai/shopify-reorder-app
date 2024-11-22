export default function EnvCheckPage() {
  return (
    <html>
      <head>
        <title>Environment Check</title>
      </head>
      <body style={{ margin: 0, padding: 20, fontFamily: 'monospace' }}>
        <h1>Environment Variables Check</h1>
        <div id="env-info">Loading environment information...</div>
        
        <script dangerouslySetInnerHTML={{ __html: `
          fetch('/api/env-check')
            .then(response => response.json())
            .then(data => {
              document.getElementById('env-info').innerHTML = 
                '<pre style="background:#f5f5f5;padding:15px;border-radius:5px">' +
                JSON.stringify(data, null, 2) +
                '</pre>';
            })
            .catch(error => {
              document.getElementById('env-info').innerHTML = 
                '<pre style="color:red">Error: ' + error.message + '</pre>';
            });
        `}} />
      </body>
    </html>
  );
}
