import { describe, it, expect, beforeAll } from 'vitest';
import app from '../index.js';

describe('Content API', () => {
  describe('GET /api/algorithms', () => {
    it('returns categories with nested algorithms', async () => {
      const res = await app.request('/api/algorithms');
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.categories).toBeDefined();
      expect(Array.isArray(data.categories)).toBe(true);
      expect(data.categories.length).toBeGreaterThan(0);
    });

    it('each category has id, name, icon, difficulty, algorithms', async () => {
      const res = await app.request('/api/algorithms');
      const data = await res.json();
      const cat = data.categories[0];
      expect(cat.id).toBeDefined();
      expect(cat.name).toBeDefined();
      expect(cat.icon).toBeDefined();
      expect(cat.difficulty).toBeDefined();
      expect(Array.isArray(cat.algorithms)).toBe(true);
    });

    it('each algorithm has id, name, description, complexity, stability', async () => {
      const res = await app.request('/api/algorithms');
      const data = await res.json();
      const algo = data.categories[0].algorithms[0];
      expect(algo.id).toBeDefined();
      expect(algo.name).toBeDefined();
      expect(algo.description).toBeDefined();
      expect(algo.complexity).toBeDefined();
      expect(algo.stability).toBeDefined();
    });
  });

  describe('GET /api/algorithms/:category/:id', () => {
    it('returns a single algorithm with full details', async () => {
      const res = await app.request('/api/algorithms/sorting/bubble-sort');
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.id).toBe('bubble-sort');
      expect(data.name).toBeDefined();
      expect(data.category).toBeDefined();
      expect(data.description).toBeDefined();
      expect(data.complexity).toBeDefined();
      expect(data.stability).toBeDefined();
      expect(data.insight).toBeDefined();
      expect(data.overview).toBeDefined();
      expect(Array.isArray(data.steps)).toBe(true);
      expect(data.code).toBeDefined();
      expect(Array.isArray(data.related)).toBe(true);
    });

    it('returns 404 for non-existent algorithm', async () => {
      const res = await app.request('/api/algorithms/sorting/nonexistent');
      expect(res.status).toBe(404);
      const data = await res.json();
      expect(data.error.code).toBe('NOT_FOUND');
    });
  });

  describe('GET /api/docs', () => {
    it('returns all docs', async () => {
      const res = await app.request('/api/docs');
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.docs).toBeDefined();
      expect(Array.isArray(data.docs)).toBe(true);
      expect(data.docs.length).toBeGreaterThan(0);
    });

    it('each doc has id, title, description', async () => {
      const res = await app.request('/api/docs');
      const data = await res.json();
      const doc = data.docs[0];
      expect(doc.id).toBeDefined();
      expect(doc.title).toBeDefined();
      expect(doc.description).toBeDefined();
    });
  });

  describe('GET /api/docs/:id', () => {
    it('returns a single doc with sections', async () => {
      const res = await app.request('/api/docs/quickstart');
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.id).toBe('quickstart');
      expect(data.title).toBeDefined();
      expect(Array.isArray(data.sections)).toBe(true);
    });

    it('each section has id, title, type, content', async () => {
      const res = await app.request('/api/docs/quickstart');
      const data = await res.json();
      if (data.sections.length > 0) {
        const section = data.sections[0];
        expect(section.id).toBeDefined();
        expect(section.title).toBeDefined();
        expect(section.type).toBeDefined();
        expect(section.content).toBeDefined();
      }
    });

    it('returns 404 for non-existent doc', async () => {
      const res = await app.request('/api/docs/nonexistent');
      expect(res.status).toBe(404);
      const data = await res.json();
      expect(data.error.code).toBe('NOT_FOUND');
    });
  });
});
