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

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      <Nav />

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left sidebar — fixed, never scrolls */}
        <aside style={{
          position: 'fixed',
          left: 0,
          top: '57px',
          bottom: 0,
          width: '260px',
          background: 'var(--white)',
          borderRight: '1px solid var(--border)',
          overflowY: 'auto',
          flexShrink: 0,
        }}>
          <div style={{ padding: '1.25rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <input
                type="text"
                placeholder="Search docs..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                  fontSize: '0.8125rem',
                  fontFamily: 'Instrument Sans, sans-serif',
                  background: 'var(--surface)',
                  outline: 'none',
                }}
              />
            </div>

            {sidebar.map(section => (
              <div key={section.label} style={{ marginBottom: '1.25rem' }}>
                <div style={{
                  fontFamily: 'Syne, sans-serif',
                  fontWeight: 700,
                  fontSize: '0.6875rem',
                  color: 'var(--muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '0.5rem',
                }}>
                  {section.label}
                </div>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {section.links.map(link => {
                    const isActive = activeDoc === link.id;
                    return (
                      <li key={link.id} style={{ marginBottom: '2px' }}>
                        <button
                          onClick={() => navigateToDoc(link.id)}
                          style={{
                            display: 'block',
                            width: '100%',
                            textAlign: 'left',
                            padding: '0.375rem 0.625rem',
                            fontSize: '0.8125rem',
                            fontFamily: 'Instrument Sans, sans-serif',
                            color: isActive ? 'var(--purple)' : 'var(--ink2)',
                            background: isActive ? 'var(--purple-light)' : 'transparent',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: isActive ? 600 : 400,
                            transition: 'all 0.12s',
                          }}
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
        <main style={{ flex: 1, overflowY: 'auto', padding: '2rem 3rem', marginLeft: '260px', marginRight: '200px' }}>
          {currentDoc ? (
            <article>
              {/* Header */}
              <header style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.75rem' }}>
                  <span style={{
                    fontFamily: 'IBM Plex Mono, monospace',
                    fontSize: '0.625rem',
                    background: 'var(--purple-light)',
                    color: 'var(--purple)',
                    padding: '0.2rem 0.625rem',
                    borderRadius: '4px',
                    fontWeight: 500,
                  }}>
                    {currentDoc.tag}
                  </span>
                </div>
                <h1 style={{
                  fontFamily: 'Syne, sans-serif',
                  fontWeight: 800,
                  fontSize: '2rem',
                  letterSpacing: '-0.03em',
                  color: 'var(--ink)',
                  marginBottom: '0.5rem',
                }}>
                  {currentDoc.title}
                </h1>
                <p style={{
                  fontSize: '1rem',
                  color: 'var(--ink2)',
                  lineHeight: 1.6,
                  maxWidth: '640px',
                  marginBottom: '1rem',
                }}>
                  {currentDoc.description}
                </p>
                <div style={{
                  display: 'flex',
                  gap: '1.25rem',
                  fontSize: '0.75rem',
                  color: 'var(--muted)',
                  fontFamily: 'IBM Plex Mono, monospace',
                }}>
                  <span>{currentDoc.readTime}</span>
                  <span>{currentDoc.difficulty}</span>
                  <span>Updated {currentDoc.updated}</span>
                  <span>{currentDoc.views} views</span>
                </div>
              </header>

              {/* TOC */}
              <div style={{
                background: 'var(--white)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '1rem 1.25rem',
                marginBottom: '2rem',
              }}>
                <div style={{
                  fontFamily: 'Syne, sans-serif',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  color: 'var(--ink)',
                  marginBottom: '0.625rem',
                }}>
                  On this page
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {sections.map(section => (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      style={{
                        padding: '0.25rem 0.625rem',
                        fontSize: '0.6875rem',
                        fontFamily: 'IBM Plex Mono, monospace',
                        color: activeSection === section.id ? 'var(--purple)' : 'var(--muted)',
                        background: activeSection === section.id ? 'var(--purple-light)' : 'transparent',
                        border: '1px solid',
                        borderColor: activeSection === section.id ? 'var(--purple)' : 'var(--border)',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        transition: 'all 0.12s',
                      }}
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
                  style={{
                    marginBottom: '2.5rem',
                    scrollMarginTop: '80px',
                  }}
                >
                  <h2 style={{
                    fontFamily: 'Syne, sans-serif',
                    fontWeight: 700,
                    fontSize: '1.25rem',
                    color: 'var(--ink)',
                    marginBottom: '1rem',
                    paddingBottom: '0.5rem',
                    borderBottom: '1px solid var(--border)',
                  }}>
                    {section.title}
                  </h2>

                  {section.type === 'text' && (
                    <>
                      {section.content && (
                        <div style={{
                          fontSize: '0.875rem',
                          color: 'var(--ink2)',
                          lineHeight: 1.7,
                          marginBottom: '1rem',
                          whiteSpace: 'pre-line',
                        }} dangerouslySetInnerHTML={{ __html: section.content }} />
                      )}

                      {section.steps && (
                        <div style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.75rem',
                          marginBottom: '1rem',
                        }}>
                          {section.steps.map((step, i) => (
                            <div key={i} style={{
                              display: 'flex',
                              gap: '0.75rem',
                              alignItems: 'flex-start',
                              padding: '0.75rem',
                              background: 'var(--surface)',
                              borderRadius: '6px',
                              border: '1px solid var(--border)',
                            }}>
                              <span style={{
                                flexShrink: 0,
                                width: 24,
                                height: 24,
                                borderRadius: '50%',
                                background: 'var(--purple)',
                                color: '#fff',
                                fontFamily: 'IBM Plex Mono, monospace',
                                fontSize: '0.6875rem',
                                fontWeight: 600,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}>
                                {i + 1}
                              </span>
                              <div>
                                <div style={{
                                  fontFamily: 'Syne, sans-serif',
                                  fontWeight: 600,
                                  fontSize: '0.8125rem',
                                  color: 'var(--ink)',
                                  marginBottom: '0.25rem',
                                }}>
                                  {step.title}
                                </div>
                                <div style={{
                                  fontSize: '0.75rem',
                                  color: 'var(--ink2)',
                                  lineHeight: 1.55,
                                }}>
                                  {step.text}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {section.table && (
                        <div style={{
                          overflowX: 'auto',
                          marginBottom: '1rem',
                          border: '1px solid var(--border)',
                          borderRadius: '8px',
                        }}>
                          <table style={{
                            width: '100%',
                            borderCollapse: 'collapse',
                            fontSize: '0.8125rem',
                          }}>
                            <thead>
                              <tr style={{ background: 'var(--surface)' }}>
                                {section.table.headers.map((h, i) => (
                                  <th key={i} style={{
                                    textAlign: 'left',
                                    fontFamily: 'IBM Plex Mono, monospace',
                                    fontSize: '0.625rem',
                                    color: 'var(--muted)',
                                    padding: '0.625rem 0.75rem',
                                    fontWeight: 500,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.04em',
                                    borderBottom: '1px solid var(--border)',
                                  }}>
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
  if (docsLoading || docLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <div style={{ textAlign: 'center', color: 'var(--muted)' }}>Loading docs...</div>
      </div>
    );
  }

  return (
                                      <td key={j} style={{
                                        padding: '0.625rem 0.75rem',
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
                        <div style={{
                          borderLeft: `3px solid ${section.callout.type === 'warning' ? '#f59e0b' : section.callout.type === 'success' ? '#16a34a' : 'var(--purple)'}`,
                          background: section.callout.type === 'warning' ? '#fffbeb' : section.callout.type === 'success' ? '#f0fdf4' : 'var(--purple-light)',
                          borderRadius: '0 6px 6px 0',
                          padding: '0.875rem 1rem',
                          marginBottom: '1rem',
                        }}>
                          <div style={{
                            fontFamily: 'Syne, sans-serif',
                            fontWeight: 700,
                            fontSize: '0.8125rem',
                            color: section.callout.type === 'warning' ? '#92400e' : section.callout.type === 'success' ? '#166534' : '#3c2a8a',
                            marginBottom: '0.375rem',
                          }}>
                            {section.callout.title}
                          </div>
                          <div
                            style={{
                              fontSize: '0.75rem',
                              color: section.callout.type === 'warning' ? '#78350f' : section.callout.type === 'success' ? '#14532d' : '#3c2a8a',
                              lineHeight: 1.6,
                            }}
                            dangerouslySetInnerHTML={{ __html: section.callout.body }}
                          />
                        </div>
                      )}

                      {section.tags && (
                        <div style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '0.375rem',
                          marginBottom: '1rem',
                        }}>
                          {section.tags.map((tag, i) => (
                            <span key={i} style={{
                              fontFamily: 'IBM Plex Mono, monospace',
                              fontSize: '0.625rem',
                              background: 'var(--purple-light)',
                              color: 'var(--purple)',
                              padding: '0.2rem 0.5rem',
                              borderRadius: '4px',
                            }}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {section.listItems && (
                        <ul style={{
                          paddingLeft: '1.25rem',
                          marginBottom: '1rem',
                        }}>
                          {section.listItems.map((item, i) => (
                            <li key={i} style={{
                              fontSize: '0.8125rem',
                              color: 'var(--ink2)',
                              lineHeight: 1.6,
                              marginBottom: '0.375rem',
                            }} dangerouslySetInnerHTML={{ __html: item }} />
                          ))}
                        </ul>
                      )}
                    </>
                  )}

                  {section.type === 'code' && section.languages && (
                    <CodeBlock languages={section.languages} />
                  )}

                  {section.type === 'related' && section.cards && (
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                      gap: '0.75rem',
                    }}>
                      {section.cards.map((card, i) => (
                        <Link
                          key={i}
                          to={`/docs?doc=${card.name.toLowerCase().replace(/\s+/g, '-').replace(/'/g, '')}`}
                          style={{
                            display: 'block',
                            padding: '1rem',
                            background: 'var(--white)',
                            border: '1px solid var(--border)',
                            borderRadius: '8px',
                            textDecoration: 'none',
                            transition: 'border-color 0.15s',
                          }}
                          onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--purple)'}
                          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                        >
                          <div style={{
                            fontFamily: 'Syne, sans-serif',
                            fontWeight: 700,
                            fontSize: '0.875rem',
                            color: 'var(--ink)',
                            marginBottom: '0.375rem',
                          }}>
                            {card.name}
                          </div>
                          <div style={{
                            fontFamily: 'IBM Plex Mono, monospace',
                            fontSize: '0.625rem',
                            color: 'var(--muted)',
                            marginBottom: '0.625rem',
                          }}>
                            {card.cx}
                          </div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                            {card.tags.map((tag, j) => (
                              <span key={j} style={{
                                fontFamily: 'IBM Plex Mono, monospace',
                                fontSize: '0.5625rem',
                                padding: '0.15rem 0.4rem',
                                borderRadius: '3px',
                                background: tag.bg,
                                color: tag.color,
                              }}>
                                {tag.text}
                              </span>
                            ))}
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}

                  {section.compareGrid && (
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                      gap: '1rem',
                      marginBottom: '1rem',
                    }}>
                      {section.compareGrid.map((item, i) => (
                        <div key={i} style={{
                          padding: '1rem',
                          background: 'var(--white)',
                          border: '1px solid var(--border)',
                          borderRadius: '8px',
                        }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            marginBottom: '0.625rem',
                          }}>
                            <span style={{
                              fontFamily: 'Syne, sans-serif',
                              fontWeight: 700,
                              fontSize: '0.875rem',
                              color: 'var(--ink)',
                            }}>
                              {item.title}
                            </span>
                            {item.tag && (
                              <span style={{
                                fontFamily: 'IBM Plex Mono, monospace',
                                fontSize: '0.5625rem',
                                padding: '0.15rem 0.4rem',
                                borderRadius: '3px',
                                background: item.tagColor,
                                color: item.tagTextColor,
                              }}>
                                {item.tag}
                              </span>
                            )}
                          </div>
                          <ul style={{ paddingLeft: '1rem', margin: 0 }}>
                            {item.pros.map((pro, j) => (
                              <li key={j} style={{
                                fontSize: '0.75rem',
                                color: 'var(--ink2)',
                                lineHeight: 1.55,
                                marginBottom: '0.25rem',
                              }}>
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
            <div style={{
              textAlign: 'center',
              padding: '4rem 2rem',
            }}>
              <div style={{
                fontFamily: 'Syne, sans-serif',
                fontWeight: 700,
                fontSize: '1.25rem',
                color: 'var(--ink)',
                marginBottom: '0.5rem',
              }}>
                Select an algorithm
              </div>
              <div style={{
                fontSize: '0.875rem',
                color: 'var(--muted)',
              }}>
                Choose a topic from the sidebar to get started.
              </div>
            </div>
          )}
        </main>

        {/* Right TOC — fixed, always visible */}
        {currentDoc && (
          <aside style={{
            position: 'fixed',
            right: 0,
            top: '57px',
            bottom: 0,
            width: '200px',
            borderLeft: '1px solid var(--border)',
            background: 'var(--white)',
            overflowY: 'auto',
            padding: '1.5rem 1rem',
          }}>
            <div style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 700,
              fontSize: '0.6875rem',
              color: 'var(--muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '0.75rem',
            }}>
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
                  style={{
                    display: 'block',
                    padding: '0.25rem 0',
                    fontSize: '0.75rem',
                    fontFamily: 'Instrument Sans, sans-serif',
                    color: activeSection === section.id ? 'var(--purple)' : 'var(--muted)',
                    textDecoration: 'none',
                    borderLeft: activeSection === section.id ? '2px solid var(--purple)' : '2px solid transparent',
                    paddingLeft: activeSection === section.id ? '0.625rem' : '0.75rem',
                    marginBottom: '0.375rem',
                    transition: 'all 0.12s',
                  }}
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
    <div style={{
      background: 'var(--code-bg)',
      borderRadius: '8px',
      overflow: 'hidden',
      marginBottom: '1rem',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.625rem 1rem',
        borderBottom: '1px solid #2a2a28',
      }}>
        <div style={{ display: 'flex', gap: '0.375rem' }}>
          {languages.map((l, i) => (
            <button
              key={i}
              onClick={() => setActiveLang(i)}
              style={{
                padding: '0.25rem 0.625rem',
                fontSize: '0.6875rem',
                fontFamily: 'IBM Plex Mono, monospace',
                color: activeLang === i ? '#fff' : '#6b7280',
                background: activeLang === i ? 'var(--code-hl)' : 'transparent',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'all 0.12s',
              }}
            >
              {l.lang}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <span style={{
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: '0.625rem',
            color: '#6b7280',
          }}>
            {lang.filename}
          </span>
          <button
            onClick={handleCopy}
            style={{
              padding: '0.2rem 0.5rem',
              fontSize: '0.625rem',
              fontFamily: 'IBM Plex Mono, monospace',
              color: copied ? '#16a34a' : '#6b7280',
              background: 'transparent',
              border: '1px solid #2a2a28',
              borderRadius: '3px',
              cursor: 'pointer',
            }}
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Code */}
      <pre style={{
        padding: '1rem',
        margin: 0,
        fontFamily: 'IBM Plex Mono, monospace',
        fontSize: '0.75rem',
        lineHeight: 1.7,
        color: '#9a9891',
        overflowX: 'auto',
      }}>
        <code>{lang.code}</code>
      </pre>
    </div>
  );
}
