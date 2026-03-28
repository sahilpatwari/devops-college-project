/**
 * server.test.js — API endpoint tests
 *
 * These tests are executed automatically in the Jenkins pipeline
 * during the "Test" stage. They verify that:
 *   1. The health-check endpoint returns 200 OK
 *   2. The response contains the expected JSON structure
 *   3. The static file server returns the index page
 */

const request = require('supertest');
const app = require('../server');

describe('API Endpoints', () => {

  // ── Health Check ────────────────────────────────────────────
  describe('GET /api/health', () => {
    it('should return 200 status', async () => {
      const res = await request(app).get('/api/health');
      expect(res.statusCode).toBe(200);
    });

    it('should return JSON with status "ok"', async () => {
      const res = await request(app).get('/api/health');
      expect(res.body).toHaveProperty('status', 'ok');
    });

    it('should include uptime and timestamp', async () => {
      const res = await request(app).get('/api/health');
      expect(res.body).toHaveProperty('uptime');
      expect(res.body).toHaveProperty('timestamp');
      expect(typeof res.body.uptime).toBe('number');
    });

    it('should include version string', async () => {
      const res = await request(app).get('/api/health');
      expect(res.body).toHaveProperty('version');
    });
  });

  // ── Static Files ────────────────────────────────────────────
  describe('GET / (static files)', () => {
    it('should serve index.html with 200 status', async () => {
      const res = await request(app).get('/');
      expect(res.statusCode).toBe(200);
      expect(res.text).toContain('Resume');
    });

    it('should serve CSS file', async () => {
      const res = await request(app).get('/css/style.css');
      expect(res.statusCode).toBe(200);
      expect(res.headers['content-type']).toMatch(/css/);
    });

    it('should serve JS file', async () => {
      const res = await request(app).get('/js/app.js');
      expect(res.statusCode).toBe(200);
      expect(res.headers['content-type']).toMatch(/javascript/);
    });
  });
});
