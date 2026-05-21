import { describe, it, expect } from 'vitest';
import app from '../index.js';

const authHeader = `Basic ${btoa('admin:changeme')}`;

describe('Admin API', () => {
  describe('Authentication', () => {
    it('returns 401 without auth header', async () => {
      const res = await app.request('/api/admin/algorithms/bubble-sort', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'test' }),
      });
      expect(res.status).toBe(401);
    });

    it('returns 401 with wrong credentials', async () => {
      const res = await app.request('/api/admin/algorithms/bubble-sort', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${btoa('admin:wrong')}`,
        },
        body: JSON.stringify({ name: 'test' }),
      });
      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/admin/algorithms/:id', () => {
    it('returns 404 for non-existent algorithm', async () => {
      const res = await app.request('/api/admin/algorithms/nonexistent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authHeader,
        },
        body: JSON.stringify({ name: 'test' }),
      });
      expect(res.status).toBe(404);
    });

    it('returns 400 when no fields provided', async () => {
      const res = await app.request('/api/admin/algorithms/bubble-sort', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authHeader,
        },
        body: JSON.stringify({}),
      });
      expect(res.status).toBe(400);
    });

    it('updates an algorithm successfully', async () => {
      const res = await app.request('/api/admin/algorithms/bubble-sort', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authHeader,
        },
        body: JSON.stringify({ description: 'Updated description for testing' }),
      });
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.updated).toBe('bubble-sort');
    });
  });

  describe('POST /api/admin/docs/:id', () => {
    it('returns 404 for non-existent doc', async () => {
      const res = await app.request('/api/admin/docs/nonexistent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authHeader,
        },
        body: JSON.stringify({ title: 'test' }),
      });
      expect(res.status).toBe(404);
    });

    it('returns 400 when no fields provided', async () => {
      const res = await app.request('/api/admin/docs/quickstart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authHeader,
        },
        body: JSON.stringify({}),
      });
      expect(res.status).toBe(400);
    });

    it('updates a doc successfully', async () => {
      const res = await app.request('/api/admin/docs/quickstart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authHeader,
        },
        body: JSON.stringify({ description: 'Updated doc description for testing' }),
      });
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.updated).toBe('quickstart');
    });
  });
});
