// Simple proxy server for port 8080 to route /api/* to port 3100
// Run this on your server: node proxy-server.js

const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = 8080;

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'WikenFarma Proxy Server',
    target: 'port 3100',
    timestamp: new Date().toISOString() 
  });
});

// Proxy /api/* to main server on wikenship.it:3100
app.use('/api', createProxyMiddleware({
  target: 'https://wikenship.it:3100',
  changeOrigin: true,
  secure: false,
  logLevel: 'info',
  onError: (err, req, res) => {
    console.error('Proxy error:', err.message);
    res.status(500).json({ error: 'Proxy error', message: err.message });
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`✅ Proxied ${req.method} ${req.path} → ${proxyRes.statusCode}`);
  }
}));

// Serve static files for everything else (fallback to main server)
app.use('*', createProxyMiddleware({
  target: 'https://wikenship.it:3100',
  changeOrigin: true,
  secure: false,
  logLevel: 'warn'
}));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🔄 WikenFarma Proxy Server running on port ${PORT}`);
  console.log(`🎯 Routes /api/* to wikenship.it:3100`);
  console.log(`📡 Now configure nginx: proxy_pass http://localhost:${PORT}/api/;`);
});