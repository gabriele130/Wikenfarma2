// Minimal standalone API server on port 8080
// COPY THIS FILE to your server and run: node simple-api-server.js

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 8080;

// Middleware
app.use(cors({ 
  origin: "https://wikenship.it", 
  credentials: true 
}));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'WikenFarma API Server Port 8080',
    timestamp: new Date().toISOString() 
  });
});

// Proxy all API calls to main server on wikenship.it:3100
app.use('/api/*', async (req, res) => {
  try {
    const url = `https://wikenship.it:3100${req.originalUrl}`;
    console.log(`🔄 Proxying ${req.method} ${req.originalUrl} → wikenship.it:3100`);
    
    const response = await fetch(url, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': req.headers.authorization || '',
        'Host': 'wikenship.it'
      },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined
    });

    const data = await response.text();
    
    // Try to parse as JSON, fallback to text
    let jsonData;
    try {
      jsonData = JSON.parse(data);
    } catch {
      jsonData = { data, raw: true };
    }

    res.status(response.status).json(jsonData);
    console.log(`✅ Response ${response.status} for ${req.originalUrl}`);
    
  } catch (error) {
    console.error(`❌ Proxy error for ${req.originalUrl}:`, error.message);
    res.status(500).json({ 
      error: 'Proxy failed', 
      message: error.message,
      url: req.originalUrl 
    });
  }
});

// Fallback for everything else
app.get('*', (req, res) => {
  res.status(404).json({ 
    error: 'Not found', 
    message: `${req.path} not available on API server`,
    hint: 'This server only handles /api/* routes' 
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 WikenFarma API Server running on port ${PORT}`);
  console.log(`📡 Proxying /api/* calls to wikenship.it:3100`);
  console.log(`🎯 Configure nginx: proxy_pass http://localhost:${PORT}/api/;`);
  console.log(`✅ Test: curl https://wikenship.it:${PORT}/health`);
});