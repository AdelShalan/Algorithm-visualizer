import { useParams, Link } from 'react-router-dom';
import { useEffect, useState, useRef, useCallback, Suspense, lazy } from 'react';
import { useAlgorithm } from '../contexts/AlgorithmContext';
import { useAlgorithm as useAlgoApi } from '../hooks/useAlgorithmData';
import Nav from './Nav';

// Lazy-loaded visualizers
const visualizerImports = {
  'bubble-sort': () => import('../visualizers/sorting/BubbleSort'),
  'selection-sort': () => import('../visualizers/sorting/SelectionSort'),
  'insertion-sort': () => import('../visualizers/sorting/InsertionSort'),
  'merge-sort': () => import('../visualizers/sorting/MergeSort'),
  'quick-sort': () => import('../visualizers/sorting/QuickSort'),
  'heap-sort': () => import('../visualizers/sorting/HeapSort'),
  'linear-search': () => import('../visualizers/searching/LinearSearch'),
  'binary-search': () => import('../visualizers/searching/BinarySearch'),
  'bfs': () => import('../visualizers/searching/BFS'),
  'dfs': () => import('../visualizers/searching/DFS'),
  'dijkstra': () => import('../visualizers/graph/Dijkstra'),
  'astar': () => import('../visualizers/graph/AStar'),
  'bellman-ford': () => import('../visualizers/graph/BellmanFord'),
  'floyd-warshall': () => import('../visualizers/graph/FloydWarshall'),
  'kruskal': () => import('../visualizers/graph/Kruskal'),
  'prim': () => import('../visualizers/graph/Prim'),
  'fibonacci': () => import('../visualizers/dp/Fibonacci'),
  'knapsack': () => import('../visualizers/dp/Knapsack'),
  'lcs': () => import('../visualizers/dp/LCS'),
  'edit-distance': () => import('../visualizers/dp/EditDistance'),
  'bst': () => import('../visualizers/tree/BST'),
  'avl': () => import('../visualizers/tree/AVL'),
  'red-black': () => import('../visualizers/tree/RedBlack'),
  'trie': () => import('../visualizers/tree/Trie'),
  'hash-chaining': () => import('../visualizers/hashing/HashChaining'),
  'hash-open-addressing': () => import('../visualizers/hashing/HashOpenAddressing'),
  'hash-load-factor': () => import('../visualizers/hashing/HashLoadFactor'),
  'n-queens': () => import('../visualizers/backtracking/NQueens'),
  'sudoku': () => import('../visualizers/backtracking/Sudoku'),
  'sudoku-cp': () => import('../visualizers/constraint-propagation/SudokuConstraintPropagation'),
  'permutations': () => import('../visualizers/backtracking/Permutations'),
  'dc-merge-sort': () => import('../visualizers/divide-conquer/DCMergeSort'),
  'karatsuba': () => import('../visualizers/divide-conquer/Karatsuba'),
  'closest-pair': () => import('../visualizers/divide-conquer/ClosestPair'),
  'kmp': () => import('../visualizers/string/KMP'),
  'rabin-karp': () => import('../visualizers/string/RabinKarp'),
  'z-algorithm': () => import('../visualizers/string/ZAlgorithm'),
  'max-sum-subarray': () => import('../visualizers/sliding-window/MaxSumSubarray'),
  'longest-unique-substring': () => import('../visualizers/sliding-window/LongestUniqueSubstring'),
  'two-sum-sorted': () => import('../visualizers/sliding-window/TwoSumSorted'),
};

const LazyVisualizer = ({ algorithm }) => {
  const importer = visualizerImports[algorithm];
  if (!importer) return <div style={{ color: 'var(--muted)', textAlign: 'center', padding: '2rem' }}>Visualizer not found</div>;
  const Component = lazy(importer);
  return (
    <Suspense fallback={<div style={{ color: 'var(--muted)', textAlign: 'center', padding: '2rem' }}>Loading visualizer...</div>}>
      <Component />
    </Suspense>
  );
};

const speedLabels = ['0.5×', '1×', '2×', '4×'];
const speedValues = [25, 50, 80, 100];

export default function AlgorithmPage() {
  const { category, algorithm } = useParams();
  const { isPlaying, speed, setSpeed, currentStep, steps, isComplete, play, pause, stepForward, stepBackward, resetAnimation, runGenerator } = useAlgorithm();
  const { data: algoInfo, loading, error } = useAlgoApi(category, algorithm);
  const [activeTab, setActiveTab] = useState('info');
  const [speedIdx, setSpeedIdx] = useState(() => speedValues.indexOf(speed) !== -1 ? speedValues.indexOf(speed) : 1);

  useEffect(() => { resetAnimation(); }, [algorithm]);

  const handleSpeed = (i) => {
    setSpeedIdx(i);
    setSpeed(speedValues[i]);
  };

  const progress = steps.length > 0 ? ((currentStep + 1) / steps.length) * 100 : 0;

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <div style={{ textAlign: 'center', color: 'var(--muted)' }}>
          <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.25rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '0.5rem' }}>Loading...</div>
        </div>
      </div>
    );
  }

  if (error || !algoInfo) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.25rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '0.5rem' }}>Algorithm not found</div>
          <Link to="/algorithms" style={{ color: 'var(--purple)', fontSize: '0.875rem' }}>← Back to algorithms</Link>
        </div>
      </div>
    );
  }

  const relatedAlgos = algoInfo.related?.slice(0, 3) || [];

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--bg)' }}>
      <Nav breadcrumb={[{ label: algoInfo.category }, { label: algoInfo.name }]} />

      <div style={{
        background: 'var(--white)', borderBottom: '1px solid var(--border)',
        padding: '1.25rem 2rem', display: 'flex', alignItems: 'flex-start',
        justifyContent: 'space-between', gap: '1.5rem', flexShrink: 0,
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.375rem', flexWrap: 'wrap' }}>
            <span style={{
              fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.625rem',
              background: 'var(--purple-light)', color: 'var(--purple)',
              padding: '0.2rem 0.625rem', borderRadius: '4px', fontWeight: 500,
            }}>{algoInfo.category}</span>
          </div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.5rem', letterSpacing: '-0.025em', color: 'var(--ink)', marginBottom: '0.25rem' }}>
            {algoInfo.name}
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--muted)', maxWidth: '500px', lineHeight: 1.5 }}>
            {algoInfo.description}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
          <ComplexityBox label="Time" value={algoInfo.complexity.worst} quality={algoInfo.complexity.worst.includes('n²') || algoInfo.complexity.worst.includes('2ⁿ') ? 'warn' : 'good'} />
          {algoInfo.stability !== '—' && (
            <ComplexityBox label="Stable" value={algoInfo.stability} quality={algoInfo.stability === 'Stable' ? 'good' : 'warn'} />
          )}
        </div>
      </div>

      <div style={{ height: '3px', background: 'var(--border)', flexShrink: 0 }}>
        <div style={{ height: '100%', background: 'var(--purple)', width: `${progress}%`, transition: 'width 0.3s ease', borderRadius: '2px' }} />
      </div>

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 320px', overflow: 'hidden' }}>
        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRight: '1px solid var(--border)' }}>
          <div style={{
            background: 'var(--white)', borderBottom: '1px solid var(--border)',
            padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center',
            gap: '0.75rem', flexWrap: 'wrap', flexShrink: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CtrlBtn onClick={resetAnimation} title="Reset">↺</CtrlBtn>
              <CtrlBtn onClick={stepBackward} disabled={currentStep === 0} title="Step back">⏮</CtrlBtn>
              <CtrlBtn
                onClick={steps.length === 0 ? runGenerator : isPlaying ? pause : play}
                primary
                title={steps.length === 0 ? 'Run' : isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? '⏸' : '▶'}
              </CtrlBtn>
              <CtrlBtn onClick={stepForward} disabled={currentStep >= steps.length - 1} title="Step forward">⏭</CtrlBtn>
            </div>

            <div style={{ width: 1, height: 22, background: 'var(--border)', margin: '0 4px' }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: 'auto' }}>
              <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.625rem', color: 'var(--muted)' }}>Speed</span>
              <div style={{ display: 'flex', gap: '2px' }}>
                {speedLabels.map((label, i) => (
                  <button
                    key={i}
                    onClick={() => handleSpeed(i)}
                    style={{
                      padding: '0.25rem 0.5rem', fontFamily: 'IBM Plex Mono, monospace',
                      fontSize: '0.625rem', borderRadius: '4px',
                      border: '1px solid var(--border)', cursor: 'pointer',
                      background: speedIdx === i ? 'var(--purple)' : 'transparent',
                      color: speedIdx === i ? '#fff' : 'var(--muted)',
                      borderColor: speedIdx === i ? 'var(--purple)' : 'var(--border)',
                      transition: 'all 0.12s',
                    }}
                  >{label}</button>
                ))}
              </div>
              {steps.length > 0 && (
                <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.6875rem', color: 'var(--muted)', marginLeft: '0.5rem', whiteSpace: 'nowrap' }}>
                  Step {currentStep + 1} / {steps.length}
                  {isComplete && <span style={{ color: 'var(--green)', marginLeft: '0.5rem' }}>✓ Done</span>}
                </span>
              )}
            </div>
          </div>

          <div style={{ flex: 1, overflow: 'auto', background: 'var(--surface)', padding: '1.5rem' }}>
            <LazyVisualizer algorithm={algorithm} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--white)' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
            {['info', 'code', 'complexity'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  flex: 1, padding: '0.625rem 0.5rem', fontSize: '0.75rem',
                  fontWeight: 500, color: activeTab === tab ? 'var(--purple)' : 'var(--muted)',
                  borderBottom: activeTab === tab ? '2px solid var(--purple)' : '2px solid transparent',
                  background: 'transparent', borderTop: 'none', borderLeft: 'none', borderRight: 'none',
                  cursor: 'pointer', fontFamily: 'Instrument Sans, sans-serif',
                  textAlign: 'center', textTransform: 'capitalize', transition: 'color 0.15s',
                }}
              >{tab}</button>
            ))}
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem' }}>
            {activeTab === 'info' && <InfoTab algoInfo={algoInfo} steps={steps} currentStep={currentStep} relatedAlgos={relatedAlgos} category={category} />}
            {activeTab === 'code' && <CodeTab algoInfo={algoInfo} />}
            {activeTab === 'complexity' && <ComplexityTab algoInfo={algoInfo} />}
          </div>
        </div>
      </div>
    </div>
  );
}

function CtrlBtn({ onClick, disabled, primary, title, children }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 34, height: 34, borderRadius: '7px',
        border: primary ? 'none' : '1px solid var(--border)',
        background: primary ? 'var(--purple)' : hovered ? 'var(--bg)' : 'var(--white)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: primary ? '#fff' : hovered ? 'var(--purple)' : 'var(--ink2)',
        fontSize: '14px', opacity: disabled ? 0.35 : 1,
        transition: 'all 0.15s',
        borderColor: hovered && !primary ? 'var(--purple)' : 'var(--border)',
      }}
    >{children}</button>
  );
}

function ComplexityBox({ label, value, quality }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: '8px', padding: '0.5rem 0.875rem', minWidth: '72px',
    }}>
      <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.5625rem', color: 'var(--muted)', marginBottom: '0.1875rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</span>
      <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.875rem', fontWeight: 500, color: quality === 'good' ? '#15803d' : quality === 'warn' ? '#c2410c' : 'var(--ink)' }}>{value}</span>
    </div>
  );
}

function InfoTab({ algoInfo, steps, currentStep, relatedAlgos, category }) {
  return (
    <div>
      {algoInfo.overview && (
        <Section title="How it works">
          <p style={{ fontSize: '0.8125rem', color: 'var(--ink2)', lineHeight: 1.65 }}>{algoInfo.overview}</p>
        </Section>
      )}

      {algoInfo.steps?.length > 0 && (
        <Section title="Step by step">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {algoInfo.steps.map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.625rem', alignItems: 'flex-start' }}>
                <span style={{
                  flexShrink: 0, width: 20, height: 20, borderRadius: '50%',
                  background: 'var(--purple-light)', color: 'var(--purple)',
                  fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.625rem',
                  fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 1,
                }}>{i + 1}</span>
                <p style={{ fontSize: '0.75rem', color: 'var(--ink2)', lineHeight: 1.55, margin: 0 }}>{step}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {steps.length > 0 && (
        <Section title="Progress">
          <div style={{ background: 'var(--bg)', borderRadius: '8px', padding: '0.875rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Steps completed</span>
              <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.75rem', color: 'var(--purple)' }}>{currentStep + 1} / {steps.length}</span>
            </div>
            <div style={{ height: '5px', background: 'var(--border)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${((currentStep + 1) / steps.length) * 100}%`, background: 'var(--purple)', borderRadius: '3px', transition: 'width 0.3s' }} />
            </div>
          </div>
        </Section>
      )}

      {relatedAlgos.length > 0 && (
        <Section title="Related algorithms">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {relatedAlgos.map((algo, i) => (
              <Link
                key={i}
                to={`/${category}/${algo.id || algo.name.toLowerCase().replace(/\s+/g, '-')}`}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '0.5rem 0.625rem', border: '1px solid var(--border)', borderRadius: '7px',
                  cursor: 'pointer', textDecoration: 'none',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--purple)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                <span style={{ fontSize: '0.8125rem', color: 'var(--ink2)' }}>{algo.name}</span>
                <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.625rem', color: 'var(--muted)' }}>→</span>
              </Link>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}

function CodeTab({ algoInfo }) {
  const codeRef = useRef(null);

  const handleWheel = useCallback((e) => {
    if (codeRef.current && Math.abs(e.deltaX) < Math.abs(e.deltaY)) {
      e.preventDefault();
      codeRef.current.scrollBy({ left: e.deltaY * 0.17, behavior: 'smooth' });
    }
  }, []);

  return (
    <div>
      <Section title="Implementation">
        {algoInfo.code ? (
          <div
            ref={codeRef}
            onWheel={handleWheel}
            style={{ background: '#111110', borderRadius: '8px', padding: '1rem', fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.6875rem', lineHeight: 1.8, color: '#9a9891', overflowX: 'auto', whiteSpace: 'pre' }}
          >
            {algoInfo.code}
          </div>
        ) : (
          <div style={{ background: '#111110', borderRadius: '8px', padding: '1rem', fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.6875rem', lineHeight: 1.8, color: '#6b7280' }}>
            <div style={{ color: '#9a9891' }}>// Code examples for {algoInfo.name}</div>
            <div style={{ color: '#9a9891', marginTop: '0.5rem' }}>// Coming soon — implementations in</div>
            <div style={{ color: '#9a9891' }}>// JavaScript, Python, and Java.</div>
          </div>
        )}
      </Section>
    </div>
  );
}

function ComplexityTab({ algoInfo }) {
  return (
    <div>
      <Section title="Complexity analysis">
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
          <thead>
            <tr>
              {['Case', 'Complexity'].map(h => (
                <th key={h} style={{ textAlign: 'left', fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.5625rem', color: 'var(--muted)', padding: '0.375rem 0.5rem', borderBottom: '1px solid var(--border)', fontWeight: 400, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '0.5rem', borderBottom: '1px solid var(--border)', fontFamily: 'IBM Plex Mono, monospace', color: 'var(--ink2)' }}>Time</td>
              <td style={{ padding: '0.5rem', borderBottom: '1px solid var(--border)', fontFamily: 'IBM Plex Mono, monospace', color: 'var(--ink)', fontWeight: 500 }}>{algoInfo.complexity.worst}</td>
            </tr>
            {algoInfo.stability !== '—' && (
              <tr>
                <td style={{ padding: '0.5rem', borderBottom: '1px solid var(--border)', fontFamily: 'IBM Plex Mono, monospace', color: 'var(--ink2)' }}>Stability</td>
                <td style={{ padding: '0.5rem', borderBottom: '1px solid var(--border)', fontFamily: 'IBM Plex Mono, monospace', fontWeight: 500, color: algoInfo.stability === 'Stable' ? '#15803d' : '#c2410c' }}>{algoInfo.stability}</td>
              </tr>
            )}
          </tbody>
        </table>
      </Section>

      <Section title="What this means">
        <div style={{ background: 'var(--purple-light)', borderLeft: '3px solid var(--purple)', borderRadius: '0 6px 6px 0', padding: '0.625rem 0.875rem' }}>
          <p style={{ fontSize: '0.75rem', color: '#3c2a8a', lineHeight: 1.6 }}>
            <strong>Time complexity {algoInfo.complexity.worst}</strong> describes how the running time grows as the input size increases. Use the visualizer to see this in action.
          </p>
        </div>
      </Section>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.875rem', color: 'var(--ink)', marginBottom: '0.5rem' }}>{title}</div>
      {children}
    </div>
  );
}
