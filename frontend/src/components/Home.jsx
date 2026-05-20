import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Nav from './Nav';
import { useAlgorithmData } from '../hooks/useAlgorithmData';

const categoryConfig = {
  sorting:         { label: '[]',    dot: '#6c47ff', bg: '#ede9ff',  text: '#6c47ff',  cardTop: '#6c47ff' },
  searching:       { label: '→',     dot: '#0d9488', bg: '#f0fdfa',  text: '#0f766e',  cardTop: '#0d9488' },
  graph:           { label: 'G(V)',  dot: '#f59e0b', bg: '#fffbeb',  text: '#92400e',  cardTop: '#f59e0b' },
  dp:              { label: 'dp[]',  dot: '#d97706', bg: '#fffbeb',  text: '#92400e',  cardTop: '#d97706' },
  tree:            { label: '<T>',   dot: '#16a34a', bg: '#f0fdf4',  text: '#15803d',  cardTop: '#16a34a' },
  hashing:         { label: '#k',    dot: '#e11d48', bg: '#fff1f2',  text: '#be123c',  cardTop: '#e11d48' },
  backtracking:    { label: '↩',     dot: '#7c3aed', bg: '#f5f3ff',  text: '#6d28d9',  cardTop: '#7c3aed' },
  'divide-conquer':{ label: 'D/C',   dot: '#2563eb', bg: '#eff6ff',  text: '#1d4ed8',  cardTop: '#2563eb' },
  string:          { label: '"s"',   dot: '#c2410c', bg: '#fff7ed',  text: '#c2410c',  cardTop: '#c2410c' },
  'sliding-window':{ label: '[↔]',   dot: '#0f766e', bg: '#f0fdfa',  text: '#0f766e',  cardTop: '#0f766e' },
  'constraint-propagation': { label: 'CP', dot: '#7c3aed', bg: '#f5f3ff', text: '#6d28d9', cardTop: '#7c3aed' },
};

export default function Home() {
  const { data, loading, error } = useAlgorithmData();
  const [searchParams] = useSearchParams();
  const categories = data?.categories || [];

  const initialCategory = useMemo(() => {
    const cat = searchParams.get('category');
    return cat && categories.find(c => c.id === cat) ? cat : null;
  }, [searchParams, categories]);

  const [activeCategory, setActiveCategory] = useState(initialCategory);

  const visibleCategories = activeCategory
    ? categories.filter(c => c.id === activeCategory)
    : categories;

  const totalAlgorithms = categories.reduce((s, c) => s + c.algorithms.length, 0);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <div style={{ textAlign: 'center', color: 'var(--muted)' }}>Loading algorithms...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.25rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '0.5rem' }}>Failed to load</div>
          <p style={{ color: 'var(--muted)' }}>{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Nav />

      <div style={{ background: 'var(--white)', borderBottom: '1px solid var(--border)', padding: '2.5rem 2.5rem 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.6875rem', color: 'var(--muted)', marginBottom: '1.25rem' }}>
          <Link to="/" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Home</Link>
          <span>/</span>
          <span>Algorithms</span>
        </div>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '2.25rem', letterSpacing: '-0.03em', marginBottom: '0.5rem', color: 'var(--ink)' }}>
          All algorithms
        </h1>
        <p style={{ color: 'var(--ink2)', fontSize: '0.9375rem', maxWidth: '540px', lineHeight: 1.6, marginBottom: '2rem' }}>
          {totalAlgorithms} interactive visualizations, organized by category. Step through any algorithm frame by frame.
        </p>

        <div style={{ display: 'flex', gap: 0, overflowX: 'auto' }}>
          <TabBtn label={`All (${totalAlgorithms})`} active={!activeCategory} onClick={() => setActiveCategory(null)} />
          {categories.map(c => (
            <TabBtn key={c.id} label={c.name} active={activeCategory === c.id} onClick={() => setActiveCategory(c.id === activeCategory ? null : c.id)} />
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', minHeight: 'calc(100vh - 240px)' }}>
        <div style={{
          background: 'var(--white)', borderRight: '1px solid var(--border)',
          padding: '1.5rem', position: 'sticky', top: '61px',
          height: 'calc(100vh - 61px)', overflowY: 'auto',
        }}>
          <div style={{ position: 'relative', marginBottom: '1.75rem' }}>
            <span style={{ position: 'absolute', left: '0.625rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', fontSize: '14px' }}>⌕</span>
            <input
              type="text"
              placeholder="Search algorithms…"
              style={{
                width: '100%', padding: '0.5rem 0.75rem 0.5rem 2rem',
                border: '1px solid var(--border)', borderRadius: '8px',
                fontSize: '0.8125rem', fontFamily: 'Instrument Sans, sans-serif',
                background: 'var(--bg)', color: 'var(--ink)', outline: 'none',
              }}
              onChange={e => {
                const q = e.target.value.toLowerCase();
                document.querySelectorAll('[data-algo-card]').forEach(card => {
                  const name = card.dataset.algoName?.toLowerCase() || '';
                  const desc = card.dataset.algoDesc?.toLowerCase() || '';
                  card.style.display = (!q || name.includes(q) || desc.includes(q)) ? '' : 'none';
                });
              }}
            />
          </div>

          <div style={{ marginBottom: '1.75rem' }}>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.625rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '0.75rem' }}>Category</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {categories.map(cat => {
                const cfg = categoryConfig[cat.id] || {};
                const isActive = activeCategory === cat.id;
                return (
                  <div
                    key={cat.id}
                    onClick={() => setActiveCategory(isActive ? null : cat.id)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '0.4rem 0.5rem', borderRadius: '6px', cursor: 'pointer',
                      background: isActive ? 'var(--purple-light)' : 'transparent',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--bg)'; }}
                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: cfg.dot || '#999', flexShrink: 0 }} />
                      <span style={{ fontSize: '0.8125rem', color: isActive ? 'var(--purple)' : 'var(--ink2)', fontWeight: isActive ? 500 : 400 }}>{cat.name}</span>
                    </div>
                    <span style={{
                      fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.625rem',
                      color: 'var(--muted)', background: isActive ? 'var(--white)' : 'var(--bg)',
                      padding: '1px 6px', borderRadius: '4px',
                    }}>{cat.algorithms.length}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div style={{ padding: '1.5rem 2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.6875rem', color: 'var(--muted)' }}>
              Showing {visibleCategories.reduce((s, c) => s + c.algorithms.length, 0)} algorithms
            </span>
          </div>

          {visibleCategories.map(category => {
            const cfg = categoryConfig[category.id] || {};
            return (
              <div key={category.id} style={{ marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)' }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '8px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.75rem', fontWeight: 500,
                    background: cfg.bg || '#f5f5f5', color: cfg.text || '#333', flexShrink: 0,
                  }}>{cfg.label || '?'}</div>
                  <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1rem', color: 'var(--ink)' }}>{category.name}</span>
                  <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.6875rem', color: 'var(--muted)', marginLeft: 'auto' }}>{category.algorithms.length} algorithms</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
                  {category.algorithms.map(algo => (
                    <AlgoCard key={algo.id} category={category} algo={algo} cfg={cfg} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function TabBtn({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '0.75rem 1.25rem', fontSize: '0.875rem', fontWeight: 500,
        color: active ? 'var(--purple)' : 'var(--muted)',
        borderBottom: active ? '2px solid var(--purple)' : '2px solid transparent',
        borderTop: 'none', borderLeft: 'none', borderRight: 'none',
        background: 'transparent',
        cursor: 'pointer', fontFamily: 'Instrument Sans, sans-serif', whiteSpace: 'nowrap',
        transition: 'color 0.15s',
      }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.color = 'var(--ink2)'; }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.color = 'var(--muted)'; }}
    >
      {label}
    </button>
  );
}

function AlgoCard({ category, algo, cfg }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      to={`/${category.id}/${algo.id}`}
      style={{ textDecoration: 'none', display: 'block' }}
      data-algo-card
      data-algo-name={algo.name}
      data-algo-desc={algo.description}
    >
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: 'var(--white)', border: hovered ? `1px solid ${cfg.cardTop}` : '1px solid var(--border)',
          borderRadius: '10px', padding: '1rem', cursor: 'pointer',
          transform: hovered ? 'translateY(-1px)' : 'none',
          transition: 'all 0.18s', position: 'relative', overflow: 'hidden',
        }}
      >
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '2.5px',
          background: cfg.cardTop, opacity: hovered ? 1 : 0, transition: 'opacity 0.18s',
          borderRadius: '10px 10px 0 0',
        }} />
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.625rem' }}>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.9375rem', color: 'var(--ink)', lineHeight: 1.2 }}>
            {algo.name}
          </div>
            <span style={{
              fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.625rem',
              padding: '0.2rem 0.5rem', borderRadius: '4px', whiteSpace: 'nowrap',
              flexShrink: 0, marginLeft: '0.5rem', marginTop: '1px',
              background: cfg.bg, color: cfg.text,
            }}>{algo.complexity.worst}</span>
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--muted)', lineHeight: 1.5, marginBottom: '0.75rem' }}>
          {algo.description}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {algo.stability !== '—' && (
            <span style={{
              fontSize: '0.6875rem', fontWeight: 500, padding: '0.2rem 0.6rem', borderRadius: '4px',
              background: algo.stability === 'Stable' ? '#f0fdf4' : '#eff6ff',
              color: algo.stability === 'Stable' ? '#15803d' : '#1d4ed8',
            }}>{algo.stability}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
