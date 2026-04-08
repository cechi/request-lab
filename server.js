const express = require('express');
const multer = require('multer');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

const AUTH_TOKEN = process.env.AUTH_TOKEN;

// Auth middleware
function authMiddleware(req, res, next) {
  // Skip auth for health check
  if (req.path === '/health') return next();
  
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing Authorization header' });
  }
  
  const token = authHeader.slice(7);
  if (token !== AUTH_TOKEN) {
    return res.status(403).json({ error: 'Invalid token' });
  }
  
  next();
}

app.use(authMiddleware);

// Health check (no auth)
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// List endpoints
app.get('/', (req, res) => {
  res.json({
    endpoints: [
      { method: 'GET', path: '/', description: 'List available endpoints' },
      { method: 'GET', path: '/health', description: 'Health check (no auth)' },
      { method: 'POST', path: '/upload', description: 'Upload a file (multipart/form-data). Returns filename, size, mime-type, SHA256 hash' },
      { method: 'GET', path: '/headers', description: 'Return all request headers' },
      { method: 'GET', path: '/echo', description: 'Echo back query params and body' }
    ]
  });
});

// File upload
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  const hash = crypto.createHash('sha256').update(req.file.buffer).digest('hex');
  
  res.json({
    filename: req.file.originalname,
    size: req.file.size,
    mimetype: req.file.mimetype,
    sha256: hash
  });
});

// Return headers
app.get('/headers', (req, res) => {
  res.json(req.headers);
});

// Echo endpoint
app.get('/echo', (req, res) => {
  res.json({
    query: req.query,
    headers: req.headers
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
