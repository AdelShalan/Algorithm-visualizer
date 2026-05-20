import { getDb, saveDb } from './client.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = await getDb();

// Read and execute schema
const schemaPath = path.join(__dirname, 'schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf-8');
db.run(schema);
console.log('Schema created.');

// Import data from frontend — use file:// URLs for ESM on Windows
const dataDir = pathToFileURL(path.join(__dirname, '../../../frontend/src/data')).href;
const { categories } = await import(`${dataDir}/algorithms.js`);
const { algorithmDetails } = await import(`${dataDir}/algorithmDetails.js`);
const { docsContent } = await import(`${dataDir}/docsContent.js`);

// Seed categories
const insertCategory = db.prepare('INSERT OR REPLACE INTO categories (id, name, icon, difficulty) VALUES (?, ?, ?, ?)');
for (const c of categories) {
  insertCategory.run([c.id, c.name, c.icon, c.difficulty]);
}

// Flatten algorithms
const allAlgorithms = [];
for (const cat of categories) {
  for (const algo of cat.algorithms) {
    const details = algorithmDetails[algo.id] || {};
    allAlgorithms.push({
      id: algo.id,
      categoryId: cat.id,
      name: algo.name,
      description: algo.description,
      complexity: JSON.stringify(algo.complexity),
      stability: algo.stability,
      insight: algo.insight || '',
      overview: details.overview || '',
      steps: JSON.stringify(details.steps || []),
      code: algo.code || '',
      related: JSON.stringify(algo.related || []),
    });
  }
}

const insertAlgorithm = db.prepare(
  'INSERT OR REPLACE INTO algorithms (id, category_id, name, description, complexity, stability, insight, overview, steps, code, related) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
);
for (const a of allAlgorithms) {
  insertAlgorithm.run([a.id, a.categoryId, a.name, a.description, a.complexity, a.stability, a.insight, a.overview, a.steps, a.code, a.related]);
}

console.log(`Seeded ${categories.length} categories and ${allAlgorithms.length} algorithms.`);

// Seed docs
const insertDoc = db.prepare('INSERT OR REPLACE INTO docs (id, tag, title, description, read_time, difficulty, updated, views) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
const insertDocSection = db.prepare('INSERT OR REPLACE INTO doc_sections (doc_id, section_id, title, type, content) VALUES (?, ?, ?, ?, ?)');

const allDocs = Object.entries(docsContent).map(([id, doc]) => ({ id, ...doc }));
for (const d of allDocs) {
  insertDoc.run([d.id, d.tag, d.title, d.desc, d.readTime, d.difficulty, d.updated, d.views]);
  for (const section of d.sections) {
    insertDocSection.run([d.id, section.id, section.title, section.type, JSON.stringify(section)]);
  }
}

console.log(`Seeded ${allDocs.length} docs.`);

// Verify counts
const catCount = db.exec('SELECT COUNT(*) as count FROM categories')[0];
const algoCount = db.exec('SELECT COUNT(*) as count FROM algorithms')[0];
const docCount = db.exec('SELECT COUNT(*) as count FROM docs')[0];

console.log('\nVerification:');
console.log(`  Categories: ${catCount.values[0][0]} (expected: ${categories.length})`);
console.log(`  Algorithms: ${algoCount.values[0][0]} (expected: ${allAlgorithms.length})`);
console.log(`  Docs: ${docCount.values[0][0]} (expected: ${allDocs.length})`);

if (catCount.values[0][0] !== categories.length) throw new Error('Category count mismatch!');
if (algoCount.values[0][0] !== allAlgorithms.length) throw new Error('Algorithm count mismatch!');
if (docCount.values[0][0] !== allDocs.length) throw new Error('Doc count mismatch!');

// Save to disk
saveDb();
console.log('\nSeed complete — database saved.');
