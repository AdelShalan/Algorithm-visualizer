import { useState, useMemo, useCallback, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Nav from './Nav';
import { useDocs, useDoc } from '../hooks/useAlgorithmData';

// Build sidebar structure from API data
function buildSidebar(docs) {
  if (!docs) return [];
  const grouped = {};
  for (const doc of docs) {
    const tag = doc.tag || 'Other';
    if (!grouped[tag]) grouped[tag] = [];
    grouped[tag].push({ id: doc.id, label: doc.title });
  }
  return Object.entries(grouped).map(([label, links]) => ({ label, links }));
}

export default function Docs() {
  const location = useLocation();
  const navigate = useNavigate();
  const { data: docsList, loading: docsLoading } = useDocs();
  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const urlDoc = searchParams.get('doc');

  const sidebar = useMemo(() => buildSidebar(docsList?.docs), [docsList]);

  // Default to first doc if none selected
  const firstDoc = docsList?.docs?.[0]?.id;
  const activeDoc = (urlDoc && docsList?.docs?.find(d => d.id === urlDoc)) ? urlDoc : (firstDoc || '');

  const { data: currentDoc, loading: docLoading } = useDoc(activeDoc);

  const [search, setSearch] = useState('');
  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
    setActiveSection('overview');
  }, [activeDoc]);

  const navigateToDoc = useCallback((docId) => {
    setActiveSection('overview');
    navigate(`/docs?doc=${docId}`, { replace: true });
  }, [navigate]);

  const sections = currentDoc?.sections || [];

  const filteredSections = sections.filter(s => {
    if (!search) return true;
    const q = search.toLowerCase();
    if (s.title?.toLowerCase().includes(q)) return true;
    if (s.content?.toLowerCase().includes(q)) return true;
    if (s.steps?.some(st => st.title.toLowerCase().includes(q) || st.text.toLowerCase().includes(q))) return true;
    return false;
  });

  const scrollToSection = useCallback((id) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  if (docsLoading || docLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-center text-muted">Loading docs...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <Nav />

      <div className="flex-1 flex overflow-hidden">
        {/* Left sidebar — fixed, never scrolls */}
        <aside className="fixed left-0 top-[73px] bottom-0 w-[260px] bg-white border-r border-border overflow-y-auto flex-shrink-0">
          <div className="p-5">
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search docs..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full py-2 px-3 border border-border rounded-lg text-sm font-body bg-surface outline-none"
              />
            </div>

            {sidebar.map(section => (
              <div key={section.label} className="mb-5">
                <div className="font-heading font-bold text-sm text-muted uppercase tracking-wider mb-2">
                  {section.label}
                </div>
                <ul className="list-none p-0">
                  {section.links.map(link => {
                    const isActive = activeDoc === link.id;
                    return (
                      <li key={link.id} className="mb-0.5">
                        <button
                          onClick={() => navigateToDoc(link.id)}
                          className={`block w-full text-left py-1.5 px-2.5 text-sm font-body rounded transition-all duration-120 border-none cursor-pointer ${isActive ? 'text-purple font-semibold bg-purple-light' : 'text-ink2 font-normal bg-transparent'}`}
                        >
                          {link.label}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto py-8 px-12 ml-[260px] mr-[200px]">
          {currentDoc ? (
            <article>
              {/* Header */}
              <header className="mb-8">
                <div className="flex items-center gap-2.5 mb-3">
                  <span className="font-mono text-[10px] bg-purple-light text-purple px-2.5 py-0.5 rounded font-medium">
                    {currentDoc.tag}
                  </span>
                </div>
                <h1 className="font-heading font-extrabold text-3xl tracking-tight text-ink mb-2">
                  {currentDoc.title}
                </h1>
                <p className="text-base text-ink2 leading-relaxed max-w-[640px] mb-4">
                  {currentDoc.description}
                </p>
                <div className="flex gap-5 text-xs text-muted font-mono">
                  <span>{currentDoc.readTime}</span>
                  <span>{currentDoc.difficulty}</span>
                  <span>Updated {currentDoc.updated}</span>
                  <span>{currentDoc.views} views</span>
                </div>
              </header>

              {/* TOC */}
              <div className="bg-white border border-border rounded-lg px-5 py-4 mb-8">
                <div className="font-heading font-bold text-sm text-ink mb-2.5">
                  On this page
                </div>
                <div className="flex flex-wrap gap-2">
                  {sections.map(section => (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`py-1 px-2.5 text-xs font-mono rounded border cursor-pointer transition-all duration-120 ${activeSection === section.id ? 'text-purple bg-purple-light border-purple' : 'text-muted bg-transparent border-border'}`}
                    >
                      {section.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sections */}
              {filteredSections.map(section => (
                <section
                  key={section.id}
                  id={section.id}
                  className="mb-10 scroll-mt-20"
                >
                  <h2 className="font-heading font-bold text-xl text-ink mb-4 pb-2 border-b border-border">
                    {section.title}
                  </h2>

                  {section.type === 'text' && (
                    <>
                      {section.content && (
                        <div className="text-sm text-ink2 leading-relaxed mb-4 whitespace-pre-line" dangerouslySetInnerHTML={{ __html: section.content }} />
                      )}

                      {section.steps && (
                        <div className="flex flex-col gap-3 mb-4">
                          {section.steps.map((step, i) => (
                            <div key={i} className="flex gap-3 items-start p-3 bg-surface rounded-lg border border-border">
                              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple text-white font-mono text-xs font-bold flex items-center justify-center">
                                {i + 1}
                              </span>
                              <div>
                                <div className="font-heading font-semibold text-sm text-ink mb-1">
                                  {step.title}
                                </div>
                                <div className="text-xs text-ink2 leading-normal">
                                  {step.text}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {section.table && (
                        <div className="overflow-x-auto mb-4 border border-border rounded-lg">
                          <table className="w-full border-collapse text-sm">
                            <thead>
                              <tr className="bg-surface">
                                {section.table.headers.map((h, i) => (
                                  <th key={i} className="text-left font-mono text-[10px] text-muted py-2.5 px-3 font-medium uppercase tracking-wider border-b border-border">
                                    {h}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {section.table.rows.map((row, i) => (
                                <tr key={i}>
                                  {row.cells.map((cell, j) => {
                                    const classes = row.classes || [];
                                    return (
                                      <td key={j} className="py-2.5 px-3" style={{
                                        borderBottom: i < section.table.rows.length - 1 ? '1px solid var(--border)' : 'none',
                                        fontFamily: classes.includes('mono') ? 'IBM Plex Mono, monospace' : 'Instrument Sans, sans-serif',
                                        color: classes.includes('good') ? '#15803d' : classes.includes('bad') ? '#c2410c' : classes.includes('ok') ? '#0d9488' : 'var(--ink)',
                                        fontWeight: classes.includes('mono') ? 500 : 400,
                                      }}>
                                        {cell}
                                      </td>
                                    );
                                  })}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {section.callout && (
                        <div className="rounded-r-lg py-3.5 px-4 mb-4" style={{
                          borderLeft: `3px solid ${section.callout.type === 'warning' ? '#f59e0b' : section.callout.type === 'success' ? '#16a34a' : 'var(--purple)'}`,
                          background: section.callout.type === 'warning' ? '#fffbeb' : section.callout.type === 'success' ? '#f0fdf4' : 'var(--purple-light)',
                        }}>
                          <div className="font-heading font-bold text-sm mb-1.5" style={{
                            color: section.callout.type === 'warning' ? '#92400e' : section.callout.type === 'success' ? '#166534' : '#3c2a8a',
                          }}>
                            {section.callout.title}
                          </div>
                          <div
                            className="text-xs leading-relaxed"
                            style={{
                              color: section.callout.type === 'warning' ? '#78350f' : section.callout.type === 'success' ? '#14532d' : '#3c2a8a',
                            }}
                            dangerouslySetInnerHTML={{ __html: section.callout.body }}
                          />
                        </div>
                      )}

                      {section.tags && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {section.tags.map((tag, i) => (
                            <span key={i} className="font-mono text-[10px] bg-purple-light text-purple px-2 py-0.5 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {section.listItems && (
                        <ul className="pl-5 mb-4">
                          {section.listItems.map((item, i) => (
                            <li key={i} className="text-sm text-ink2 leading-relaxed mb-1.5" dangerouslySetInnerHTML={{ __html: item }} />
                          ))}
                        </ul>
                      )}
                    </>
                  )}

                  {section.type === 'code' && section.languages && (
                    <CodeBlock languages={section.languages} />
                  )}

                  {section.type === 'related' && section.cards && (
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-3">
                      {section.cards.map((card, i) => {
                        const docMatch = docsList?.docs?.find(d => d.title.toLowerCase() === card.name.toLowerCase());
                        const docLink = docMatch ? `/docs?doc=${docMatch.id}` : `/docs?doc=${card.name.toLowerCase().replace(/\s+/g, '-').replace(/'/g, '')}`;
                        return (
                        <Link
                          key={i}
                          to={docLink}
                          className="block p-4 bg-white border border-border rounded-lg no-underline transition-colors duration-150 hover:border-purple"
                        >
                          <div className="font-heading font-bold text-sm text-ink mb-1.5">
                            {card.name}
                          </div>
                          <div className="font-mono text-[10px] text-muted mb-2.5">
                            {card.cx}
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {card.tags.map((tag, j) => (
                              <span key={j} className="font-mono text-[9px] px-1.5 py-0.5 rounded-sm" style={{ background: tag.bg, color: tag.color }}>
                                {tag.text}
                              </span>
                            ))}
                          </div>
                        </Link>
                      );
                    })}
                    </div>
                  )}

                  {section.compareGrid && (
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4 mb-4">
                      {section.compareGrid.map((item, i) => (
                        <div key={i} className="p-4 bg-white border border-border rounded-lg">
                          <div className="flex items-center gap-2 mb-2.5">
                            <span className="font-heading font-bold text-sm text-ink">
                              {item.title}
                            </span>
                            {item.tag && (
                              <span className="font-mono text-[9px] px-1.5 py-0.5 rounded-sm" style={{ background: item.tagColor, color: item.tagTextColor }}>
                                {item.tag}
                              </span>
                            )}
                          </div>
                          <ul className="pl-4 m-0">
                            {item.pros.map((pro, j) => (
                              <li key={j} className="text-xs text-ink2 leading-normal mb-1">
                                {pro}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              ))}
            </article>
          ) : (
            <div className="text-center py-16 px-8">
              <div className="font-heading font-bold text-xl text-ink mb-2">
                Select an algorithm
              </div>
              <div className="text-sm text-muted">
                Choose a topic from the sidebar to get started.
              </div>
            </div>
          )}
        </main>

        {/* Right TOC — fixed, always visible */}
        {currentDoc && (
          <aside className="fixed right-0 top-[73px] bottom-0 w-[200px] border-l border-border bg-white overflow-y-auto py-6 px-4">
            <div className="font-heading font-bold text-xs text-muted uppercase tracking-wider mb-3">
              Contents
            </div>
            <nav>
              {sections.map(section => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  onClick={e => {
                    e.preventDefault();
                    scrollToSection(section.id);
                  }}
                  className={`block py-1 text-sm font-body no-underline mb-1.5 transition-all duration-120 ${activeSection === section.id ? 'text-purple border-l-2 border-purple pl-2.5' : 'text-muted border-l-2 border-transparent pl-3'}`}
                >
                  {section.title}
                </a>
              ))}
            </nav>
          </aside>
        )}
      </div>
    </div>
  );
}

function CodeBlock({ languages }) {
  const [activeLang, setActiveLang] = useState(0);
  const [copied, setCopied] = useState(false);

  const lang = languages[activeLang];

  const handleCopy = () => {
    navigator.clipboard.writeText(lang.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[var(--code-bg)] rounded-lg overflow-hidden mb-4">
      {/* Header */}
      <div className="flex items-center justify-between py-2.5 px-4 border-b border-[#2a2a28]">
        <div className="flex gap-1.5">
          {languages.map((l, i) => (
            <button
              key={i}
              onClick={() => setActiveLang(i)}
              className={`py-1 px-2.5 text-xs font-mono rounded border-none cursor-pointer transition-all duration-120 ${activeLang === i ? 'text-white bg-[var(--code-hl)]' : 'text-gray-500 bg-transparent'}`}
            >
              {l.lang}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-[10px] text-gray-500">
            {lang.filename}
          </span>
          <button
            onClick={handleCopy}
            className={`py-0.5 px-2 text-[10px] font-mono border border-[#2a2a28] rounded cursor-pointer bg-transparent ${copied ? 'text-green-600' : 'text-gray-500'}`}
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Code */}
      <pre className="p-4 m-0 font-mono text-xs leading-relaxed text-[#9a9891] overflow-x-auto">
        <code>{lang.code}</code>
      </pre>
    </div>
  );
}
