import { Hono } from 'hono';
import { basicAuth } from 'hono/basic-auth';
import { getDb, saveDb } from '../db/client.js';

const admin = new Hono();

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'changeme';

admin.use('/*', basicAuth({ username: 'admin', password: ADMIN_PASSWORD }));

// POST /api/admin/algorithms/:id
admin.post('/algorithms/:id', async (c) => {
  const db = await getDb();
  const id = c.req.param('id');
  const body = await c.req.json();

  const check = db.exec(`SELECT id FROM algorithms WHERE id = '${id.replace(/'/g, "''")}'`);
  if (!check.length || !check[0].values.length) {
    return c.json({ error: { code: 'NOT_FOUND', message: 'Algorithm not found' } }, 404);
  }

  const fields: string[] = [];
  const values: string[] = [];

  if (body.name !== undefined) { fields.push('name = ?'); values.push(body.name); }
  if (body.description !== undefined) { fields.push('description = ?'); values.push(body.description); }
  if (body.insight !== undefined) { fields.push('insight = ?'); values.push(body.insight); }
  if (body.overview !== undefined) { fields.push('overview = ?'); values.push(body.overview); }
  if (body.steps !== undefined) { fields.push('steps = ?'); values.push(JSON.stringify(body.steps)); }
  if (body.code !== undefined) { fields.push('code = ?'); values.push(body.code); }

  if (fields.length === 0) {
    return c.json({ error: { code: 'BAD_REQUEST', message: 'No fields to update' } }, 400);
  }

  const safeId = id.replace(/'/g, "''");
  let query = `UPDATE algorithms SET `;
  query += fields.map((f, i) => f.replace('?', `'${values[i].replace(/'/g, "''")}'`)).join(', ');
  query += ` WHERE id = '${safeId}'`;
  db.run(query);
  saveDb();

  return c.json({ success: true, updated: id });
});

// POST /api/admin/docs/:id
admin.post('/docs/:id', async (c) => {
  const db = await getDb();
  const id = c.req.param('id');
  const body = await c.req.json();

  const check = db.exec(`SELECT id FROM docs WHERE id = '${id.replace(/'/g, "''")}'`);
  if (!check.length || !check[0].values.length) {
    return c.json({ error: { code: 'NOT_FOUND', message: 'Doc not found' } }, 404);
  }

  const fields: string[] = [];
  const values: string[] = [];

  if (body.title !== undefined) { fields.push('title = ?'); values.push(body.title); }
  if (body.description !== undefined) { fields.push('description = ?'); values.push(body.description); }
  if (body.tag !== undefined) { fields.push('tag = ?'); values.push(body.tag); }

  if (fields.length === 0) {
    return c.json({ error: { code: 'BAD_REQUEST', message: 'No fields to update' } }, 400);
  }

  const safeId = id.replace(/'/g, "''");
  let query = `UPDATE docs SET `;
  query += fields.map((f, i) => f.replace('?', `'${values[i].replace(/'/g, "''")}'`)).join(', ');
  query += ` WHERE id = '${safeId}'`;
  db.run(query);
  saveDb();

  return c.json({ success: true, updated: id });
});

export default admin;
