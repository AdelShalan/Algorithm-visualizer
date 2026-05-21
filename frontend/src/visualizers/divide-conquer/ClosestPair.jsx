import { useState, useCallback, useEffect, useRef } from 'react';
import { useAlgorithm } from '../../contexts/AlgorithmContext';
import { generateSteps } from '../../algorithms/divide-conquer/closest-pair.js';

const CANVAS_SIZE = 500;
const NUM_POINTS = 20;

function generatePoints() {
  return Array.from({ length: NUM_POINTS }, () => ({
    x: Math.random() * CANVAS_SIZE,
    y: Math.random() * CANVAS_SIZE,
  }));
}

export default function ClosestPair() {
  const { startAnimation, setGenerator } = useAlgorithm();
  const [points, setPoints] = useState(generatePoints);

  const handleRun = useCallback(() => { startAnimation(generateSteps(points)); }, [points, startAnimation]);
  useEffect(() => { setGenerator(handleRun); }, [handleRun, setGenerator]);

  const handleShuffle = useCallback(() => { setPoints(generatePoints()); }, []);

  const { currentStep, steps } = useAlgorithm();
  const currentData = steps?.[currentStep] || { type: 'idle', points, log: [] };
  const logRef = useRef(null);
  useEffect(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, [currentData.log]);

  return (
    <div className="flex h-full flex-col gap-5">
      <div className="rounded-[10px] border border-border bg-white p-5">
        <div className="mb-3 font-mono text-[.5625rem] uppercase tracking-[.08em] text-muted">Points</div>
        <button onClick={handleShuffle} className="cursor-pointer border border-border bg-transparent px-3 py-[.3rem] text-[.6875rem] font-body text-ink2">New Points</button>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-[1fr_280px] gap-5">
        <div className="flex flex-col gap-3 rounded-[10px] border border-border bg-white p-5">
          <div className="flex flex-1 items-center justify-center">
            <svg viewBox={`0 0 ${CANVAS_SIZE} ${CANVAS_SIZE}`} className="h-full w-full max-w-[500px] max-h-[500px]">
              {currentData.type === 'split' && (
                <line x1={currentData.midPoint.x} y1={0} x2={currentData.midPoint.x} y2={CANVAS_SIZE} stroke="var(--amber)" strokeWidth={2} strokeDasharray="4 4" />
              )}
              {currentData.pair && (
                <line x1={currentData.pair[0].x} y1={currentData.pair[0].y} x2={currentData.pair[1].x} y2={currentData.pair[1].y} stroke={currentData.type === 'complete' ? '#86efac' : 'var(--purple)'} strokeWidth={3} />
              )}
              {currentData.points.map((p, i) => {
                const isPair = currentData.pair && (currentData.pair[0] === p || currentData.pair[1] === p);
                const isChecking = (currentData.a === p || currentData.b === p) && currentData.type !== 'complete';
                return <circle key={i} cx={p.x} cy={p.y} r={isPair ? 8 : 5} fill={isPair ? '#86efac' : isChecking ? 'var(--amber)' : 'var(--purple)'} />;
              })}
            </svg>
          </div>
          {currentData.dist !== undefined && currentData.dist !== Infinity && (
            <div className="rounded-lg bg-bg px-4 py-2 text-center">
              <span className="font-body text-[.75rem] text-muted">Closest distance: </span>
              <span className="font-mono text-[1rem] font-bold text-purple">{currentData.dist.toFixed(2)}</span>
            </div>
          )}
        </div>

        {currentData.log && (
          <div className="flex flex-col overflow-hidden rounded-[10px] border border-border bg-white px-5 py-4">
            <div className="mb-2 shrink-0 font-mono text-[.5625rem] uppercase tracking-[.08em] text-muted">Execution trace</div>
            <div ref={logRef} className="flex flex-1 flex-col gap-[3px] overflow-y-auto">
              {currentData.log.map((entry, i) => {
                const isLast = i === currentData.log.length - 1;
                return (
                  <div key={i} className="rounded px-2 py-[.3rem] font-mono text-[.625rem]" style={{ color: isLast ? 'var(--purple)' : 'var(--muted)', background: isLast ? 'var(--purple-light)' : 'transparent', fontWeight: isLast ? 500 : 400 }}>{entry}</div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
