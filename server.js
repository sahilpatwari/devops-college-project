const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ---------- Middleware ----------
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ---------- API Routes ----------

/**
 * Health-check endpoint.
 * Used by the Jenkins pipeline and Docker health-checks to verify
 * the application is running correctly.
 */
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
  });
});

// ---------- Catch-all: serve index.html ----------
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ---------- Start Server ----------
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`✅  Resume Editor running at http://localhost:${PORT}`);
  });
}

// Export for testing (supertest)
module.exports = app;
