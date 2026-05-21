import { Hono } from 'hono';
import { getDb } from '../db/client.js';

const content = new Hono();

// GET /api/algorithms — return categories with nested algorithms
content.get('/algorithms', async (c) => {
  const db = await getDb();
  const cats = db.exec('SELECT * FROM categories ORDER BY id');
  const algos = db.exec('SELECT * FROM algorithms ORDER BY id');

  const catRows = cats[0]?.columns && cats[0]?.values
    ? cats[0].values.map((row) => {
        const obj: Record<string, unknown> = {};
        cats[0].columns.forEach((col, i) => { obj[col] = row[i]; });
        return obj;
      })
    : [];

  const algoRows = algos[0]?.columns && algos[0]?.values
    ? algos[0].values.map((row) => {
        const obj: Record<string, unknown> = {};
        algos[0].columns.forEach((col, i) => { obj[col] = row[i]; });
        return obj;
      })
    : [];

  const result = catRows.map((cat) => ({
    id: cat.id,
    name: cat.name,
    icon: cat.icon,
    difficulty: cat.difficulty,
    algorithms: algoRows
      .filter((a) => a.category_id === cat.id)
      .map((a) => ({
        id: a.id,
        name: a.name,
        description: a.description,
        complexity: JSON.parse(a.complexity as string),
        stability: a.stability,
      })),
  }));

  return c.json({ categories: result });
});

// GET /api/algorithms/:category/:id — return single algorithm detail
content.get('/algorithms/:category/:id', async (c) => {
  const db = await getDb();
  const id = c.req.param('id');
  const result = db.exec(`SELECT * FROM algorithms WHERE id = '${id.replace(/'/g, "''")}'`);

  if (!result.length || !result[0].values.length) {
    return c.json({ error: { code: 'NOT_FOUND', message: 'Algorithm not found' } }, 404);
  }

  const cols = result[0].columns;
  const row = result[0].values[0];
  const algo: Record<string, unknown> = {};
  cols.forEach((col, i) => { algo[col] = row[i]; });

  return c.json({
    id: algo.id,
    name: algo.name,
    category: algo.category_id,
    description: algo.description,
    complexity: JSON.parse(algo.complexity as string),
    stability: algo.stability,
    insight: algo.insight,
    overview: algo.overview,
    steps: JSON.parse(algo.steps as string),
    code: algo.code,
    related: JSON.parse(algo.related as string),
  });
});

// GET /api/docs — return all docs metadata
content.get('/docs', async (c) => {
  const db = await getDb();
  const result = db.exec('SELECT * FROM docs ORDER BY id');

  const docs = result[0]?.columns && result[0]?.values
    ? result[0].values.map((row) => {
        const obj: Record<string, unknown> = {};
        result[0].columns.forEach((col, i) => { obj[col] = row[i]; });
        return obj;
      })
    : [];

  return c.json({ docs });
});

// GET /api/docs/:id — return single doc with sections
content.get('/docs/:id', async (c) => {
  const db = await getDb();
  const id = c.req.param('id');
  const safeId = id.replace(/'/g, "''");

  const docResult = db.exec(`SELECT * FROM docs WHERE id = '${safeId}'`);
  if (!docResult.length || !docResult[0].values.length) {
    return c.json({ error: { code: 'NOT_FOUND', message: 'Doc not found' } }, 404);
  }

  const docCols = docResult[0].columns;
  const docRow = docResult[0].values[0];
  const doc: Record<string, unknown> = {};
  docCols.forEach((col, i) => { doc[col] = docRow[i]; });

  const sectionResult = db.exec(`SELECT * FROM doc_sections WHERE doc_id = '${safeId}' ORDER BY id`);
  const sections = sectionResult[0]?.columns && sectionResult[0]?.values
    ? sectionResult[0].values.map((row) => {
        const obj: Record<string, unknown> = {};
        sectionResult[0].columns.forEach((col, i) => { obj[col] = row[i]; });
        const parsed = JSON.parse(obj.content as string);
        return {
          id: obj.section_id,
          title: obj.title,
          type: obj.type,
          content: parsed.content || '',
          steps: parsed.steps || [],
          languages: parsed.languages || [],
          callout: parsed.callout || null,
          listItems: parsed.listItems || [],
          table: parsed.table || null,
          cards: parsed.cards || [],
        };
      })
    : [];

  // Filter out sections with empty content and no other data
  const filteredSections = sections.filter(s => 
    s.content || s.steps?.length || s.languages?.length || s.listItems?.length || s.cards?.length || s.callout || s.table
  );

  return c.json({ ...doc, sections: filteredSections });
});

export default content;
