CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT,
  difficulty TEXT
);

CREATE TABLE IF NOT EXISTS algorithms (
  id TEXT PRIMARY KEY,
  category_id TEXT NOT NULL REFERENCES categories(id),
  name TEXT NOT NULL,
  description TEXT,
  complexity TEXT,
  stability TEXT,
  insight TEXT,
  overview TEXT,
  steps TEXT,
  code TEXT,
  related TEXT
);

CREATE TABLE IF NOT EXISTS docs (
  id TEXT PRIMARY KEY,
  tag TEXT,
  title TEXT NOT NULL,
  description TEXT,
  read_time TEXT,
  difficulty TEXT,
  updated TEXT,
  views TEXT
);

CREATE TABLE IF NOT EXISTS doc_sections (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  doc_id TEXT NOT NULL REFERENCES docs(id),
  section_id TEXT NOT NULL,
  title TEXT,
  type TEXT,
  content TEXT
);
