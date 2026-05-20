import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Nav from './Nav';
import { useAlgorithmData } from '../hooks/useAlgorithmData';

const featuredCategories = [
  {
    id: 'sorting', name: 'Sorting', chip: 'Junior · Interview',
    desc: 'Bubble, merge, quick, heap — complexity intuition starts here.',
    chipBg: 'var(--purple-light)', chipColor: 'var(--purple)',
    borderColor: 'var(--purple)',
  },
  {
    id: 'graph', name: 'Graph Algorithms', chip: 'Senior · Interview',
    desc: 'Dijkstra, A*, BFS, Prim — edge relaxation made visible.',
    chipBg: '#f0fdfa', chipColor: '#0f766e',
    borderColor: 'var(--teal)',
  },
  {
    id: 'dp', name: 'Dynamic Programming', chip: 'Mid · Senior',
    desc: 'Watch the DP table fill. See the recurrence become intuition.',
    chipBg: '#fffbeb', chipColor: '#92400e',
    borderColor: 'var(--amber)',
  },
  {
    id: 'string', name: 'String Algorithms', chip: 'Senior',
    desc: 'KMP, Rabin-Karp, Z-algorithm — skipped often, critical for systems.',
    chipBg: '#fff1f2', chipColor: '#be123c',
    borderColor: '#e11d48',
  },
];

export default function Landing() {
  const { data, loading } = useAlgorithmData();
  const categories = data?.categories || [];
  const totalAlgorithms = categories.reduce((s, c) => s + c.algorithms.length, 0);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <div style={{ textAlign: 'center', color: 'var(--muted)' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      <Nav />

      {/* Main content (pushes footer down) */}
      <div style={{ flex: 1 }}>
      {/* Hero */}
      <div style={{
        padding: '5rem 2.5rem 4rem', background: 'var(--white)',
        borderBottom: '1px solid var(--border)', position: 'relative', overflow: 'hidden',
      }}>
        {/* Dot grid background */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
          backgroundSize: '32px 32px', opacity: 0.4, pointerEvents: 'none',
        }} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: '3rem', alignItems: 'center', maxWidth: '1100px', position: 'relative' }}>
          <div>
            {/* Badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
              background: 'var(--purple-light)', color: 'var(--purple)',
              fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.6875rem', fontWeight: 500,
              padding: '0.3125rem 0.875rem', borderRadius: '999px', marginBottom: '1.5rem',
              letterSpacing: '0.02em',
            }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--purple)', display: 'inline-block' }} />
              Interactive algorithm learning
            </div>

            <h1 style={{
              fontFamily: 'Syne, sans-serif', fontWeight: 800,
              fontSize: 'clamp(2.5rem, 4vw, 3.625rem)', lineHeight: 1.05,
              letterSpacing: '-0.03em', color: 'var(--ink)', marginBottom: '1.25rem',
            }}>
              Algorithms click<br />
              <span style={{ color: 'var(--purple)' }}>when you see them.</span>
            </h1>

            <p style={{ color: 'var(--ink2)', fontSize: '1rem', lineHeight: 1.7, maxWidth: '480px', marginBottom: '2.25rem' }}>
              Step through sorting, graphs, DP, and more — frame by frame. Watch the call stack, memo table, and data structures update in real time.
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <Link to="/algorithms" style={{
                background: 'var(--purple)', color: '#fff', fontSize: '0.9375rem',
                fontWeight: 500, padding: '0.75rem 2rem', borderRadius: '8px',
                border: 'none', cursor: 'pointer', fontFamily: 'Instrument Sans, sans-serif',
                textDecoration: 'none', display: 'inline-block',
              }}>
                Explore algorithms →
              </Link>
              <Link to={`/sorting/bubble-sort`} style={{
                background: 'transparent', color: 'var(--ink)', fontSize: '0.9375rem',
                fontWeight: 500, padding: '0.75rem 1.5rem', borderRadius: '8px',
                border: '1px solid var(--border)', cursor: 'pointer',
                fontFamily: 'Instrument Sans, sans-serif', textDecoration: 'none', display: 'inline-block',
              }}>
                Watch a demo
              </Link>
            </div>

            <div style={{
              display: 'flex', gap: '2rem', marginTop: '3rem',
              paddingTop: '2rem', borderTop: '1px solid var(--border)',
            }}>
              {[
                { val: totalAlgorithms + '+', label: 'algorithms' },
                { val: categories.length, label: 'categories' },
                { val: 'Free', label: 'to start' },
              ].map(s => (
                <div key={s.label}>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1.375rem', color: 'var(--ink)', marginBottom: '0.125rem' }}>{s.val}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Demo vis card */}
          <DemoCard />
        </div>
      </div>

      {/* Category cards */}
      <div style={{ padding: '3rem 2.5rem' }}>
        <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.6875rem', color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
          Browse by category
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          {featuredCategories.map(cat => {
            const catData = categories.find(c => c.id === cat.id);
            return (
              <Link
                key={cat.id}
                to={`/algorithms?category=${cat.id}`}
                style={{ textDecoration: 'none', display: 'block' }}
              >
                <CategoryCard cat={cat} count={catData?.algorithms.length || 0} borderColor={cat.borderColor} />
              </Link>
            );
          })}
        </div>
      </div>
      </div>

      {/* How it works */}
      <div style={{
        background: 'var(--ink)', display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
      }}>
        {[
          { num: '01', title: 'Pick an algorithm', desc: 'Choose from ' + categories.length + ' categories — organized by concept and complexity.' },
          { num: '02', title: 'Step through it', desc: 'Frame-by-frame control. See data structures update live at each step.' },
          { num: '03', title: 'Change the input', desc: 'Adjust size, values, or mode — watch complexity change in real time.' },
        ].map((item, i) => (
          <div key={i} style={{ padding: '2rem', borderRight: i < 2 ? '1px solid #2a2a28' : 'none' }}>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.6875rem', color: '#5a5955', marginBottom: '1.25rem' }}>{item.num}</div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1.125rem', color: '#f7f5f0', marginBottom: '0.5rem' }}>{item.title}</div>
            <div style={{ fontSize: '0.8125rem', color: '#6b6965', lineHeight: 1.65 }}>{item.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CategoryCard({ cat, count, borderColor }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'var(--white)', border: hovered ? `1px solid ${borderColor}` : '1px solid var(--border)',
        borderRadius: '12px', padding: '1.25rem', cursor: 'pointer',
        transform: hovered ? 'translateY(-2px)' : 'none',
        transition: 'all 0.2s', position: 'relative', overflow: 'hidden',
      }}
    >
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
        borderRadius: '12px 12px 0 0', background: borderColor,
        opacity: hovered ? 1 : 0, transition: 'opacity 0.2s',
      }} />
      <div style={{
        display: 'inline-block', fontFamily: 'IBM Plex Mono, monospace',
        fontSize: '0.625rem', padding: '0.2rem 0.6rem', borderRadius: '4px',
        marginBottom: '0.875rem', fontWeight: 500,
        background: cat.chipBg, color: cat.chipColor,
      }}>{cat.chip}</div>
      <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1rem', color: 'var(--ink)', marginBottom: '0.25rem' }}>{cat.name}</div>
      <div style={{ fontSize: '0.75rem', color: 'var(--muted)', lineHeight: 1.5 }}>{cat.desc}</div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.875rem', paddingTop: '0.875rem', borderTop: '1px solid var(--border)' }}>
        <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.625rem', color: 'var(--muted)' }}>{count} algorithms</span>
        <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>→</span>
      </div>
    </div>
  );
}

function DemoCard() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive(prev => (prev + 1) % 3);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const handleDotClick = (i) => {
    setActive(i);
  };

  const cards = [
    {
      id: 0,
      label: 'bubble-sort — step 4',
      category: 'sorting',
      algo: 'bubble-sort',
      type: 'bars',
      bars: [
        { h: 35, state: 'sorted' }, { h: 55, state: 'sorted' }, { h: 45, state: 'active' },
        { h: 80, state: 'active' }, { h: 60, state: 'default' }, { h: 95, state: 'default' },
        { h: 70, state: 'default' }, { h: 40, state: 'default' },
      ],
      log: <>Comparing <span style={{ color: 'var(--purple)', fontWeight: 500 }}>arr[2]=45</span> and <span style={{ color: 'var(--purple)', fontWeight: 500 }}>arr[3]=80</span> — no swap needed.</>,
      stats: { step: '4', comparisons: '3', swaps: '1' },
      statLabels: ['step', 'comparisons', 'swaps'],
    },
    {
      id: 1,
      label: 'binary-search — step 3',
      category: 'searching',
      algo: 'binary-search',
      type: 'bars',
      bars: [
        { h: 20, state: 'eliminated' }, { h: 35, state: 'eliminated' },
        { h: 50, state: 'eliminated' }, { h: 65, state: 'active' },
        { h: 80, state: 'default' }, { h: 95, state: 'default' },
        { h: 105, state: 'default' }, { h: 120, state: 'default' },
      ],
      log: 'Mid index = 5, value = 42. Target 37 is smaller — search left half.',
      stats: { step: '3', range: '0–4', probes: '3' },
      statLabels: ['step', 'range', 'probes'],
    },
    {
      id: 2,
      label: 'dijkstra — step 7',
      category: 'graph',
      algo: 'dijkstra',
      type: 'graph',
      nodes: [
        { id: 'A', x: 50, y: 30, dist: 0, visited: true },
        { id: 'B', x: 140, y: 20, dist: 4, visited: true },
        { id: 'C', x: 250, y: 50, dist: 7, visited: true },
        { id: 'D', x: 160, y: 100, dist: 11, visited: true },
        { id: 'E', x: 340, y: 40, dist: 14, active: true },
        { id: 'F', x: 300, y: 110, dist: Infinity, default: true },
      ],
      edges: [
        { from: 'A', to: 'B', w: 4, relaxed: true },
        { from: 'A', to: 'C', w: 7, relaxed: true },
        { from: 'B', to: 'C', w: 3, relaxed: true },
        { from: 'B', to: 'D', w: 7, relaxed: true },
        { from: 'C', to: 'E', w: 7, relaxing: true },
        { from: 'C', to: 'F', w: 5, default: true },
        { from: 'D', to: 'E', w: 3, default: true },
        { from: 'D', to: 'F', w: 2, default: true },
      ],
      log: 'Relaxing edge C→E: dist[C] + 7 = 14 < ∞ — update dist[E] to 14.',
      stats: { step: '7', visited: '4', relaxed: '6' },
      statLabels: ['step', 'visited', 'relaxed'],
    },
  ];

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden' }}>
      <div style={{ padding: '0.875rem 1rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.6875rem', color: 'var(--muted)' }}>{cards[active].label}</span>
        <div style={{ display: 'flex', gap: '6px' }}>
          {cards.map((c, i) => (
            <button
              key={i}
              onClick={() => handleDotClick(i)}
              style={{
                width: 7, height: 7, borderRadius: '50%',
                background: i === active ? 'var(--purple)' : '#e2dfd8',
                opacity: i === active ? 0.8 : 1,
                border: 'none', padding: 0, cursor: 'pointer',
                transition: 'all 0.3s',
              }}
            />
          ))}
        </div>
      </div>

      {/* Slider viewport */}
      <div style={{ overflow: 'hidden' }}>
        <div style={{
          display: 'flex',
          width: `${cards.length * 100}%`,
          transform: `translateX(-${active * (100 / cards.length)}%)`,
          transition: 'transform 0.5s ease',
        }}>
          {cards.map((card) => (
            <div key={card.id} style={{ width: `${100 / cards.length}%`, flexShrink: 0 }}>
              <div style={{ padding: '1.5rem 1rem' }}>
                {card.type === 'bars' ? (
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '5px', height: '120px', paddingBottom: '4px', marginBottom: '1rem' }}>
                    {card.bars.map((bar, i) => (
                      <div key={i} style={{
                        flex: 1, borderRadius: '3px 3px 0 0',
                        height: `${bar.h}px`,
                        background: bar.state === 'sorted' ? '#86efac'
                          : bar.state === 'active' ? 'var(--purple)'
                          : bar.state === 'eliminated' ? '#e2e8f0'
                          : 'var(--border)',
                      }} />
                    ))}
                  </div>
                ) : (
                  <div style={{ height: '120px', marginBottom: '1rem', position: 'relative' }}>
                    <svg width="100%" height="100%" viewBox="0 0 400 130" style={{ overflow: 'visible' }}>
                      {card.edges.map((edge, i) => {
                        const fromNode = card.nodes.find(n => n.id === edge.from);
                        const toNode = card.nodes.find(n => n.id === edge.to);
                        if (!fromNode || !toNode) return null;
                        return (
                          <g key={i}>
                            <line
                              x1={fromNode.x} y1={fromNode.y}
                              x2={toNode.x} y2={toNode.y}
                              stroke={edge.relaxing ? 'var(--purple)' : edge.relaxed ? '#86efac' : '#d4d4d0'}
                              strokeWidth={edge.relaxing ? 2.5 : 1.5}
                            />
                            <text
                              x={(fromNode.x + toNode.x) / 2}
                              y={(fromNode.y + toNode.y) / 2 - 6}
                              textAnchor="middle"
                              style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.55rem', fill: edge.relaxing ? 'var(--purple)' : 'var(--muted)', fontWeight: edge.relaxing ? 600 : 400 }}
                            >{edge.w}</text>
                          </g>
                        );
                      })}
                      {card.nodes.map((node, i) => (
                        <g key={i}>
                          <circle
                            cx={node.x} cy={node.y} r={14}
                            fill={node.visited ? '#86efac' : node.active ? 'var(--purple)' : 'var(--white)'}
                            stroke={node.active ? 'var(--purple)' : node.visited ? '#86efac' : 'var(--border)'}
                            strokeWidth={node.active ? 2 : 1.5}
                          />
                          <text
                            x={node.x} y={node.y + 1}
                            textAnchor="middle" dominantBaseline="central"
                            style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.625rem', fontWeight: 600, fill: node.default ? 'var(--ink2)' : '#fff' }}
                          >{node.id}</text>
                          {node.dist !== Infinity && (
                            <text
                              x={node.x} y={node.y + 22}
                              textAnchor="middle"
                              style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.5rem', fill: node.visited ? '#15803d' : node.active ? 'var(--purple)' : 'var(--muted)' }}
                            >{node.dist === 0 ? '0' : node.dist}</text>
                          )}
                        </g>
                      ))}
                    </svg>
                  </div>
                )}
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
                  <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.5625rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.375rem' }}>Step log</div>
                  <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.6875rem', color: 'var(--ink2)', lineHeight: 1.5 }}>
                    {card.log}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '0.625rem 1rem', borderTop: '1px solid var(--border)', background: 'var(--white)', display: 'flex', gap: '0.75rem', fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.625rem', color: 'var(--muted)' }}>
        {cards[active].statLabels.map((label, i) => (
          <span key={i}>{label}: <span style={{ color: 'var(--purple)' }}>{Object.values(cards[active].stats)[i]}</span></span>
        ))}
      </div>
    </div>
  );
}
