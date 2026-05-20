import { Link, useLocation } from 'react-router-dom';

export default function Nav({ breadcrumb }) {
  const location = useLocation();

  return (
    <nav style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '1rem 2rem', background: 'var(--white)',
      borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 100,
    }}>
      <Link to="/" style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.125rem', letterSpacing: '-0.02em', color: 'var(--ink)', textDecoration: 'none' }}>
        Algo<span style={{ color: 'var(--purple)' }}>Vis</span>
      </Link>

      {breadcrumb ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.6875rem', color: 'var(--muted)' }}>
          <Link to="/algorithms" style={{ color: 'var(--muted)', textDecoration: 'none' }}
            onMouseEnter={e => e.target.style.color = 'var(--purple)'}
            onMouseLeave={e => e.target.style.color = 'var(--muted)'}>
            Algorithms
          </Link>
          {breadcrumb.map((crumb, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <span>/</span>
              {crumb.href ? (
                <Link to={crumb.href} style={{ color: 'var(--muted)', textDecoration: 'none' }}
                  onMouseEnter={e => e.target.style.color = 'var(--purple)'}
                  onMouseLeave={e => e.target.style.color = 'var(--muted)'}>
                  {crumb.label}
                </Link>
              ) : (
                <span style={{ color: 'var(--ink)' }}>{crumb.label}</span>
              )}
            </span>
          ))}
        </div>
      ) : (
        <ul style={{ display: 'flex', gap: '2rem', listStyle: 'none' }}>
          {['Home', 'Algorithms', 'Playground', 'Docs'].map(link => {
            const path = link === 'Home' ? '/' : link === 'Algorithms' ? '/algorithms' : link === 'Docs' ? '/docs' : '#';
            const isActive = link === 'Home' ? location.pathname === '/' : location.pathname.startsWith(path);
            return (
              <li key={link} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', position: 'relative' }}>
                <Link
                  to={path}
                  style={{
                    color: isActive ? 'var(--ink)' : 'var(--muted)',
                    fontWeight: isActive ? 700 : 400,
                    textDecoration: 'none', fontSize: '0.875rem', transition: 'color .15s',
                  }}
                  onMouseEnter={e => { if (!isActive) e.target.style.color = 'var(--ink)'; }}
                  onMouseLeave={e => { if (!isActive) e.target.style.color = 'var(--muted)'; }}
                >
                  {link}
                </Link>
                {link === 'Playground' && (
                  <span style={{
                    position: 'absolute', bottom: '-10px', left: '50%', transform: 'translateX(-50%)',
                    fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.45rem', fontWeight: 600,
                    padding: '0.05rem 0.3rem', borderRadius: '3px',
                    background: 'var(--purple)', color: '#fff', letterSpacing: '0.04em', whiteSpace: 'nowrap',
                  }}>Coming soon</span>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
        {breadcrumb ? (
          <Link to="/algorithms" style={{
            background: 'transparent', color: 'var(--ink2)', fontSize: '0.75rem',
            fontWeight: 500, padding: '0.4rem 0.875rem', borderRadius: '6px',
            border: '1px solid var(--border)', cursor: 'pointer', textDecoration: 'none',
            fontFamily: 'Instrument Sans, sans-serif', display: 'flex', alignItems: 'center', gap: '0.375rem',
          }}>
            ← Back
          </Link>
        ) : (
          <>
            <button style={{
              background: 'transparent', color: 'var(--ink)', fontSize: '0.8125rem',
              fontWeight: 500, padding: '0.5rem 1.125rem', borderRadius: '999px',
              border: '1px solid var(--border)', cursor: 'pointer', fontFamily: 'Instrument Sans, sans-serif',
            }}>Sign in</button>
            <button style={{
              background: 'var(--purple)', color: '#fff', fontSize: '0.8125rem',
              fontWeight: 500, padding: '0.5rem 1.25rem', borderRadius: '999px',
              border: 'none', cursor: 'pointer', fontFamily: 'Instrument Sans, sans-serif',
            }}>Get started</button>
          </>
        )}
      </div>
    </nav>
  );
}
