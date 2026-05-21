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
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-center text-muted">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <Nav />

      {/* Main content (pushes footer down) */}
      <div className="flex-1">
      {/* Hero */}
      <div className="px-[2.5rem] pt-[5rem] pb-[4rem] bg-white border-b border-border relative overflow-hidden">
        {/* Dot grid background */}
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        <div className="grid grid-cols-[1fr_420px] gap-12 items-center max-w-[1100px] relative">
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 bg-purple-light text-purple font-mono text-[0.6875rem] font-medium px-[0.875rem] py-[0.3125rem] rounded-full mb-6 tracking-[0.02em]">
              <span className="w-[5px] h-[5px] rounded-full bg-purple inline-block" />
              Interactive algorithm learning
            </div>

            <h1 className="font-heading font-extrabold text-[clamp(2.5rem,4vw,3.625rem)] leading-[1.05] tracking-[-0.03em] text-ink mb-5">
              Algorithms click<br />
              <span className="text-purple">when you see them.</span>
            </h1>

            <p className="text-ink2 text-[1rem] leading-[1.7] max-w-[480px] mb-[2.25rem]">
              Step through sorting, graphs, DP, and more — frame by frame. Watch the call stack, memo table, and data structures update in real time.
            </p>

            <div className="flex gap-3 items-center flex-wrap">
              <Link to="/algorithms" className="bg-purple text-white text-[0.9375rem] font-medium px-8 py-3 rounded-lg border-none cursor-pointer font-body no-underline inline-block">
                Explore algorithms →
              </Link>
              <Link to={`/sorting/bubble-sort`} className="bg-transparent text-ink text-[0.9375rem] font-medium px-6 py-3 rounded-lg border border-border cursor-pointer font-body no-underline inline-block">
                Watch a demo
              </Link>
            </div>

            <div className="flex gap-8 mt-12 pt-8 border-t border-border">
              {[
                { val: totalAlgorithms + '+', label: 'algorithms' },
                { val: categories.length, label: 'categories' },
                { val: 'Free', label: 'to start' },
              ].map(s => (
                <div key={s.label}>
                  <div className="font-heading font-bold text-[1.375rem] text-ink mb-0.5">{s.val}</div>
                  <div className="text-[0.75rem] text-muted">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Demo vis card */}
          <DemoCard />
        </div>
      </div>

      {/* Category cards */}
      <div className="px-[2.5rem] py-12">
        <div className="font-mono text-[0.6875rem] text-muted tracking-[0.08em] uppercase mb-5">
          Browse by category
        </div>
        <div className="grid grid-cols-4 gap-3">
          {featuredCategories.map(cat => {
            const catData = categories.find(c => c.id === cat.id);
            return (
              <Link
                key={cat.id}
                to={`/algorithms?category=${cat.id}`}
                className="no-underline block"
              >
                <CategoryCard cat={cat} count={catData?.algorithms.length || 0} borderColor={cat.borderColor} />
              </Link>
            );
          })}
        </div>
      </div>
      </div>

      {/* How it works */}
      <div className="bg-ink grid grid-cols-3 px-10 py-12">
        {[
          { num: '01', title: 'Pick an algorithm', desc: 'Choose from ' + categories.length + ' categories — organized by concept and complexity.' },
          { num: '02', title: 'Step through it', desc: 'Frame-by-frame control. See data structures update live at each step.' },
          { num: '03', title: 'Change the input', desc: 'Adjust size, values, or mode — watch complexity change in real time.' },
        ].map((item, i) => (
          <div key={i} className="p-8" style={{ borderRight: i < 2 ? '1px solid #2a2a28' : 'none' }}>
            <div className="font-mono text-[0.6875rem] text-[#5a5955] mb-5">{item.num}</div>
            <div className="font-heading font-bold text-[1.125rem] text-[#f7f5f0] mb-2">{item.title}</div>
            <div className="text-[0.8125rem] text-[#6b6965] leading-[1.65]">{item.desc}</div>
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
      className="bg-white rounded-xl p-5 cursor-pointer relative overflow-hidden transition-all duration-200"
      style={{
        border: hovered ? `1px solid ${borderColor}` : '1px solid var(--border)',
        transform: hovered ? 'translateY(-2px)' : 'none',
      }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-[3px] rounded-t-xl transition-opacity duration-200"
        style={{ background: borderColor, opacity: hovered ? 1 : 0 }}
      />
      <div
        className="inline-block font-mono text-[0.625rem] px-[0.6rem] py-[0.2rem] rounded mb-[0.875rem] font-medium"
        style={{ background: cat.chipBg, color: cat.chipColor }}
      >{cat.chip}</div>
      <div className="font-heading font-bold text-[1rem] text-ink mb-1">{cat.name}</div>
      <div className="text-[0.75rem] text-muted leading-[1.5]">{cat.desc}</div>
      <div className="flex items-center justify-between mt-[0.875rem] pt-[0.875rem] border-t border-border">
        <span className="font-mono text-[0.625rem] text-muted">{count} algorithms</span>
        <span className="text-[0.75rem] text-muted">→</span>
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
      log: <>Comparing <span className="text-purple font-medium">arr[2]=45</span> and <span className="text-purple font-medium">arr[3]=80</span> — no swap needed.</>,
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
    <div className="bg-surface border border-border rounded-2xl overflow-hidden">
      <div className="px-4 py-[0.875rem] border-b border-border flex items-center justify-between">
        <span className="font-mono text-[0.6875rem] text-muted">{cards[active].label}</span>
        <div className="flex gap-[6px]">
          {cards.map((c, i) => (
            <button
              key={i}
              onClick={() => handleDotClick(i)}
              className="w-[7px] h-[7px] rounded-full border-none p-0 cursor-pointer transition-all duration-300"
              style={{
                background: i === active ? 'var(--purple)' : '#e2dfd8',
                opacity: i === active ? 0.8 : 1,
              }}
            />
          ))}
        </div>
      </div>

      {/* Slider viewport */}
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease"
          style={{
            width: `${cards.length * 100}%`,
            transform: `translateX(-${active * (100 / cards.length)}%)`,
          }}
        >
          {cards.map((card) => (
            <div key={card.id} style={{ width: `${100 / cards.length}%`, flexShrink: 0 }}>
              <div className="px-4 pt-6 pb-4">
                {card.type === 'bars' ? (
                  <div className="flex items-end gap-[5px] h-[120px] pb-1 mb-4">
                    {card.bars.map((bar, i) => (
                      <div key={i} className="flex-1 rounded-t-[3px]" style={{
                        height: `${bar.h}px`,
                        background: bar.state === 'sorted' ? '#86efac'
                          : bar.state === 'active' ? 'var(--purple)'
                          : bar.state === 'eliminated' ? '#e2e8f0'
                          : 'var(--border)',
                      }} />
                    ))}
                  </div>
                ) : (
                  <div className="h-[120px] mb-4 relative">
                    <svg width="100%" height="100%" viewBox="0 0 400 130" className="overflow-visible">
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
                              className="font-mono text-[0.55rem]"
                              style={{ fill: edge.relaxing ? 'var(--purple)' : 'var(--muted)', fontWeight: edge.relaxing ? 600 : 400 }}
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
                            className="font-mono text-[0.625rem] font-semibold"
                            style={{ fill: node.default ? 'var(--ink2)' : '#fff' }}
                          >{node.id}</text>
                          {node.dist !== Infinity && (
                            <text
                              x={node.x} y={node.y + 22}
                              textAnchor="middle"
                              className="font-mono text-[0.5rem]"
                              style={{ fill: node.visited ? '#15803d' : node.active ? 'var(--purple)' : 'var(--muted)' }}
                            >{node.dist === 0 ? '0' : node.dist}</text>
                          )}
                        </g>
                      ))}
                    </svg>
                  </div>
                )}
                <div className="border-t border-border pt-3">
                  <div className="font-mono text-[0.5625rem] text-muted uppercase tracking-[0.08em] mb-1.5">Step log</div>
                  <div className="font-mono text-[0.6875rem] text-ink2 leading-[1.5]">
                    {card.log}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 py-[0.625rem] border-t border-border bg-white flex gap-3 font-mono text-[0.625rem] text-muted">
        {cards[active].statLabels.map((label, i) => (
          <span key={i}>{label}: <span className="text-purple">{Object.values(cards[active].stats)[i]}</span></span>
        ))}
      </div>
    </div>
  );
}
