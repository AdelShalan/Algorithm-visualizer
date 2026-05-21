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
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1rem 1.25rem' }}>
        <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '.5625rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '.75rem' }}>Points</div>
        <button onClick={handleShuffle} style={{ padding: '.3rem .75rem', fontSize: '.6875rem', borderRadius: '5px', border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer', color: 'var(--ink2)', fontFamily: 'Instrument Sans, sans-serif' }}>New Points</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '1.25rem', flex: 1, minHeight: 0 }}>
        <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox={`0 0 ${CANVAS_SIZE} ${CANVAS_SIZE}`} style={{ width: '100%', height: '100%', maxWidth: 500, maxHeight: 500 }}>
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
            <div style={{ textAlign: 'center', padding: '.5rem', background: 'var(--bg)', borderRadius: '8px' }}>
              <span style={{ fontFamily: 'Instrument Sans, sans-serif', fontSize: '.75rem', color: 'var(--muted)' }}>Closest distance: </span>
              <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontWeight: 700, fontSize: '1rem', color: 'var(--purple)' }}>{currentData.dist.toFixed(2)}</span>
            </div>
          )}
        </div>

        {currentData.log && (
          <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '.5625rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '.5rem', flexShrink: 0 }}>Execution trace</div>
            <div ref={logRef} style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '3px' }}>
              {currentData.log.map((entry, i) => {
                const isLast = i === currentData.log.length - 1;
                return (
                  <div key={i} style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '.625rem', padding: '.3rem .5rem', borderRadius: '4px', color: isLast ? 'var(--purple)' : 'var(--muted)', background: isLast ? 'var(--purple-light)' : 'transparent', fontWeight: isLast ? 500 : 400 }}>{entry}</div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
