import { useState } from 'react';

export function Controls({ onRun, onReset, isPlaying, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
      <RunBtn onRun={onRun} isPlaying={isPlaying} />
      {onReset && <ResetBtn onReset={onReset} />}
      {children}
    </div>
  );
}

function RunBtn({ onRun, isPlaying }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={() => onRun()}
      disabled={isPlaying}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: '0.375rem',
        padding: '0.4rem 0.875rem', background: isPlaying ? 'var(--border)' : hovered ? '#5a38e8' : 'var(--purple)',
        color: isPlaying ? 'var(--muted)' : '#fff', border: 'none', borderRadius: '6px',
        fontSize: '0.75rem', fontWeight: 500, fontFamily: 'Instrument Sans, sans-serif',
        cursor: isPlaying ? 'not-allowed' : 'pointer', transition: 'all 0.15s',
      }}
    >
      ▶ Run
    </button>
  );
}

function ResetBtn({ onReset }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onReset}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: '0.375rem',
        padding: '0.4rem 0.875rem',
        background: 'transparent', color: 'var(--ink2)',
        border: `1px solid ${hovered ? 'var(--ink2)' : 'var(--border)'}`,
        borderRadius: '6px', fontSize: '0.75rem', fontWeight: 500,
        fontFamily: 'Instrument Sans, sans-serif', cursor: 'pointer', transition: 'all 0.15s',
      }}
    >
      ↺ Reset
    </button>
  );
}
