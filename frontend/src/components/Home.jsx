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
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-center text-muted">Loading algorithms...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-center">
          <div className="font-heading text-xl font-bold text-ink mb-2">Failed to load</div>
          <p className="text-muted">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <Nav />

      <div className="bg-white border-b border-border pt-10 px-10 pb-0">
        <div className="flex items-center gap-2 font-mono text-xs text-muted mb-5">
          <Link to="/" className="text-muted no-underline">Home</Link>
          <span>/</span>
          <span>Algorithms</span>
        </div>
        <h1 className="font-heading font-extrabold text-4xl tracking-tight mb-2 text-ink">
          All algorithms
        </h1>
        <p className="text-ink2 text-sm max-w-[540px] leading-relaxed mb-8">
          {totalAlgorithms} interactive visualizations, organized by category. Step through any algorithm frame by frame.
        </p>

        <div className="flex gap-0 overflow-x-auto">
          <TabBtn label={`All (${totalAlgorithms})`} active={!activeCategory} onClick={() => setActiveCategory(null)} />
          {categories.map(c => (
            <TabBtn key={c.id} label={c.name} active={activeCategory === c.id} onClick={() => setActiveCategory(c.id === activeCategory ? null : c.id)} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-[240px_1fr] min-h-[calc(100vh-240px)]">
        <div className="bg-white border-r border-border p-6 sticky top-[61px] h-[calc(100vh-61px)] overflow-y-auto">
          <div className="relative mb-7">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted text-sm">⌕</span>
            <input
              type="text"
              placeholder="Search algorithms…"
              className="w-full py-2 px-3 pl-8 border border-border rounded-lg text-sm font-body bg-bg text-ink outline-none"
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

          <div className="mb-7">
            <div className="font-mono text-[10px] tracking-widest uppercase text-muted mb-3">Category</div>
            <div className="flex flex-col gap-0.5">
              {categories.map(cat => {
                const cfg = categoryConfig[cat.id] || {};
                const isActive = activeCategory === cat.id;
                return (
                  <div
                    key={cat.id}
                    onClick={() => setActiveCategory(isActive ? null : cat.id)}
                    className={`flex items-center justify-between px-2 py-1 rounded-md cursor-pointer transition-colors duration-150 ${isActive ? 'bg-purple-light' : 'bg-transparent hover:bg-bg'}`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: cfg.dot || '#999' }} />
                      <span className={`text-sm ${isActive ? 'text-purple font-medium' : 'text-ink2 font-normal'}`}>{cat.name}</span>
                    </div>
                    <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${isActive ? 'bg-white text-muted' : 'bg-bg text-muted'}`}>{cat.algorithms.length}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="px-8 py-6">
          <div className="flex items-center justify-between mb-5">
            <span className="font-mono text-xs text-muted">
              Showing {visibleCategories.reduce((s, c) => s + c.algorithms.length, 0)} algorithms
            </span>
          </div>

          {visibleCategories.map(category => {
            const cfg = categoryConfig[category.id] || {};
            return (
              <div key={category.id} className="mb-10">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-border">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center font-mono text-sm font-medium flex-shrink-0" style={{ background: cfg.bg || '#f5f5f5', color: cfg.text || '#333' }}>{cfg.label || '?'}</div>
                  <span className="font-heading font-bold text-base text-ink">{category.name}</span>
                  <span className="font-mono text-xs text-muted ml-auto">{category.algorithms.length} algorithms</span>
                </div>

                <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-2.5">
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
      className={`px-5 py-3 text-sm font-medium font-body whitespace-nowrap transition-colors duration-150 border-0 bg-transparent cursor-pointer border-b-2 ${active ? 'text-purple border-b-purple' : 'text-muted border-b-transparent hover:text-ink2'}`}
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
      className="no-underline block"
      data-algo-card
      data-algo-name={algo.name}
      data-algo-desc={algo.description}
    >
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="bg-white rounded-[10px] p-4 cursor-pointer relative overflow-hidden transition-all duration-[180ms]"
        style={{
          border: hovered ? `1px solid ${cfg.cardTop}` : '1px solid var(--border)',
          transform: hovered ? 'translateY(-1px)' : 'none',
        }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-[2.5px] rounded-t-[10px] transition-opacity duration-[180ms]"
          style={{ background: cfg.cardTop, opacity: hovered ? 1 : 0 }}
        />
        <div className="flex items-start justify-between mb-2.5">
          <div className="font-heading font-bold text-sm text-ink leading-tight">
            {algo.name}
          </div>
            <span className="font-mono text-[10px] px-2 py-0.5 rounded whitespace-nowrap flex-shrink-0 ml-2 mt-0.5" style={{ background: cfg.bg, color: cfg.text }}>{algo.complexity.worst}</span>
        </div>
        <div className="text-xs text-muted leading-normal mb-3">
          {algo.description}
        </div>
        <div className="flex items-center justify-between">
          {algo.stability !== '—' && (
            <span className="text-xs font-medium px-2.5 py-0.5 rounded" style={{
              background: algo.stability === 'Stable' ? '#f0fdf4' : '#eff6ff',
              color: algo.stability === 'Stable' ? '#15803d' : '#1d4ed8',
            }}>{algo.stability}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
