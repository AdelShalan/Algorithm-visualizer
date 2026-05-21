import { useParams, Link } from 'react-router-dom';
import { useEffect, useState, useRef, useCallback, useMemo, Suspense, lazy } from 'react';
import { useAlgorithm } from '../contexts/AlgorithmContext';
import { useAlgorithm as useAlgoApi, useAlgorithmData } from '../hooks/useAlgorithmData';
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

// Lazy-loaded visualizers — created once at module scope
const LazyVisualizers = {};
for (const [key, importer] of Object.entries(visualizerImports)) {
  LazyVisualizers[key] = lazy(importer);
}

const LazyVisualizer = ({ algorithm }) => {
  const Component = LazyVisualizers[algorithm];
  if (!Component) return <div className="text-muted text-center py-8">Visualizer not found</div>;
  return (
    <Suspense fallback={<div className="text-muted text-center py-8">Loading visualizer...</div>}>
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
  const { data: allAlgos } = useAlgorithmData();

  const algorithmLookup = useMemo(() => {
    const map = {};
    if (!allAlgos?.categories) return map;
    for (const cat of allAlgos.categories) {
      for (const algo of cat.algorithms) {
        map[algo.name.toLowerCase()] = { id: algo.id, category: cat.id };
      }
    }
    return map;
  }, [allAlgos]);
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
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-center text-muted">
          <div className="font-heading text-xl font-bold text-ink mb-2">Loading...</div>
        </div>
      </div>
    );
  }

  if (error || !algoInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-center">
          <div className="font-heading text-xl font-bold text-ink mb-2">Algorithm not found</div>
          <Link to="/algorithms" className="text-purple text-sm">← Back to algorithms</Link>
        </div>
      </div>
    );
  }

  const relatedAlgos = algoInfo.related?.slice(0, 3) || [];

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-bg">
      <Nav breadcrumb={[{ label: algoInfo.category }, { label: algoInfo.name }]} />

      <div className="bg-white border-b border-border px-8 py-5 flex items-start justify-between gap-6 flex-shrink-0">
        <div className="flex-1">
          <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
            <span className="font-mono text-[10px] bg-purple-light text-purple px-2.5 py-0.5 rounded font-medium">{algoInfo.category}</span>
          </div>
          <div className="font-heading font-extrabold text-2xl tracking-tight text-ink mb-1">
            {algoInfo.name}
          </div>
          <div className="text-sm text-muted max-w-[500px] leading-relaxed">
            {algoInfo.description}
          </div>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <ComplexityBox label="Time" value={algoInfo.complexity.worst} quality={algoInfo.complexity.worst.includes('n²') || algoInfo.complexity.worst.includes('2ⁿ') ? 'warn' : 'good'} />
          {algoInfo.stability !== '—' && (
            <ComplexityBox label="Stable" value={algoInfo.stability} quality={algoInfo.stability === 'Stable' ? 'good' : 'warn'} />
          )}
        </div>
      </div>

      <div className="h-[3px] bg-border flex-shrink-0">
        <div className="h-full bg-purple transition-all duration-300 rounded-sm" style={{ width: `${progress}%` }} />
      </div>

      <div className="flex-1 grid grid-cols-[1fr_320px] overflow-hidden">
        <div className="flex flex-col overflow-hidden border-r border-border">
          <div className="bg-white border-b border-border px-6 py-3 flex items-center gap-3 flex-wrap flex-shrink-0">
            <div className="flex items-center gap-1">
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

            <div className="w-px h-[22px] bg-border mx-1" />

            <div className="flex items-center gap-2 ml-auto">
              <span className="font-mono text-[10px] text-muted">Speed</span>
              <div className="flex gap-0.5">
                {speedLabels.map((label, i) => (
                  <button
                    key={i}
                    onClick={() => handleSpeed(i)}
                    className={`px-2 py-1 font-mono text-[10px] rounded border border-border cursor-pointer transition-all duration-150 ${speedIdx === i ? 'bg-purple text-white border-purple' : 'bg-transparent text-muted'}`}
                  >{label}</button>
                ))}
              </div>
              {steps.length > 0 && (
                <span className="font-mono text-[11px] text-muted ml-2 whitespace-nowrap">
                  Step {currentStep + 1} / {steps.length}
                  {isComplete && <span className="text-green ml-2">✓ Done</span>}
                </span>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-auto bg-surface p-6">
            <LazyVisualizer algorithm={algorithm} />
          </div>
        </div>

        <div className="flex flex-col overflow-hidden bg-white">
          <div className="flex border-b border-border flex-shrink-0">
            {['info', 'code', 'complexity'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2.5 px-2 text-xs font-medium capitalize transition-colors duration-150 font-body text-center bg-transparent border-0 border-b-2 cursor-pointer ${activeTab === tab ? 'text-purple border-b-purple' : 'text-muted border-b-transparent'}`}
              >{tab}</button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-5">
            {activeTab === 'info' && <InfoTab algoInfo={algoInfo} steps={steps} currentStep={currentStep} relatedAlgos={relatedAlgos} category={category} algorithmLookup={algorithmLookup} />}
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
      className={`w-[34px] h-[34px] rounded-[7px] flex items-center justify-center text-[14px] transition-all duration-150 ${
        primary
          ? 'border-none bg-purple text-white'
          : `border border-border ${hovered ? 'bg-bg text-purple border-purple' : 'bg-white text-ink2'}`
      } ${disabled ? 'cursor-not-allowed opacity-35' : 'cursor-pointer'}`}
    >{children}</button>
  );
}

function ComplexityBox({ label, value, quality }) {
  return (
    <div className="flex flex-col items-center bg-surface border border-border rounded-lg px-3.5 py-2 min-w-[72px]">
      <span className="font-mono text-[9px] text-muted mb-0.75 uppercase tracking-wider">{label}</span>
      <span className={`font-mono text-sm font-medium ${quality === 'good' ? 'text-green-600' : quality === 'warn' ? 'text-orange-700' : 'text-ink'}`}>{value}</span>
    </div>
  );
}

function InfoTab({ algoInfo, steps, currentStep, relatedAlgos, category, algorithmLookup }) {
  return (
    <div>
      {algoInfo.overview && (
        <Section title="How it works">
          <p className="text-[13px] text-ink2 leading-relaxed">{algoInfo.overview}</p>
        </Section>
      )}

      {algoInfo.steps?.length > 0 && (
        <Section title="Step by step">
          <div className="flex flex-col gap-2">
            {algoInfo.steps.map((step, i) => (
              <div key={i} className="flex gap-2.5 items-start">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-purple-light text-purple font-mono text-[10px] font-semibold flex items-center justify-center mt-0.5">{i + 1}</span>
                <p className="text-xs text-ink2 leading-snug m-0">{step}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {steps.length > 0 && (
        <Section title="Progress">
          <div className="bg-bg rounded-lg p-3.5">
            <div className="flex justify-between mb-2">
              <span className="text-xs text-muted">Steps completed</span>
              <span className="font-mono text-xs text-purple">{currentStep + 1} / {steps.length}</span>
            </div>
            <div className="h-[5px] bg-border rounded-sm overflow-hidden">
              <div className="h-full bg-purple rounded-sm transition-all duration-300" style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }} />
            </div>
          </div>
        </Section>
      )}

      {relatedAlgos.length > 0 && (
        <Section title="Related algorithms">
          <div className="flex flex-col gap-[5px]">
            {relatedAlgos.map((algo, i) => {
              const found = algorithmLookup[algo.name.toLowerCase()];
              const linkTo = found ? `/${found.category}/${found.id}` : `/${category}/${algo.name.toLowerCase().replace(/\s+/g, '-')}`;
              return (
                <Link
                  key={i}
                  to={linkTo}
                  className="flex justify-between items-center px-2.5 py-2 border border-border rounded-[7px] cursor-pointer no-underline hover:border-purple transition-colors duration-150"
                >
                  <span className="text-[13px] text-ink2">{algo.name}</span>
                  <span className="font-mono text-[10px] text-muted">→</span>
                </Link>
              );
            })}
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
      if (e.cancelable) e.preventDefault();
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
            className="bg-[#111110] rounded-lg p-4 font-mono text-[11px] leading-[1.8] text-[#9a9891] overflow-x-auto whitespace-pre"
          >
            {algoInfo.code}
          </div>
        ) : (
          <div className="bg-[#111110] rounded-lg p-4 font-mono text-[11px] leading-[1.8] text-gray-500">
            <div className="text-[#9a9891]">// Code examples for {algoInfo.name}</div>
            <div className="text-[#9a9891] mt-2">// Coming soon — implementations in</div>
            <div className="text-[#9a9891]">// JavaScript, Python, and Java.</div>
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
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr>
              {['Case', 'Complexity'].map(h => (
                <th key={h} className="text-left font-mono text-[9px] text-muted py-1.5 px-2 border-b border-border font-normal uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2 px-2 border-b border-border font-mono text-ink2">Time</td>
              <td className="py-2 px-2 border-b border-border font-mono text-ink font-medium">{algoInfo.complexity.worst}</td>
            </tr>
            {algoInfo.stability !== '—' && (
              <tr>
                <td className="py-2 px-2 border-b border-border font-mono text-ink2">Stability</td>
                <td className={`py-2 px-2 border-b border-border font-mono font-medium ${algoInfo.stability === 'Stable' ? 'text-green-600' : 'text-orange-700'}`}>{algoInfo.stability}</td>
              </tr>
            )}
          </tbody>
        </table>
      </Section>

      <Section title="What this means">
        <div className="bg-purple-light border-l-[3px] border-purple rounded-r-lg px-3.5 py-2.5">
          <p className="text-xs text-[#3c2a8a] leading-relaxed">
            <strong>Time complexity {algoInfo.complexity.worst}</strong> describes how the running time grows as the input size increases. Use the visualizer to see this in action.
          </p>
        </div>
      </Section>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="mb-6">
      <div className="font-heading font-bold text-sm text-ink mb-2">{title}</div>
      {children}
    </div>
  );
}
