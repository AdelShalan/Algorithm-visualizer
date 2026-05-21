import { Link, useLocation } from 'react-router-dom';

export default function Nav({ breadcrumb }) {
  const location = useLocation();

  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-white border-b border-border sticky top-0 z-[100]">
      <Link to="/" className="font-heading font-extrabold text-[1.125rem] tracking-[-0.02em] text-ink no-underline">
        Algo<span className="text-purple">Vis</span>
      </Link>

      {breadcrumb ? (
        <div className="flex items-center gap-1.5 font-mono text-[0.6875rem] text-muted">
          <Link to="/algorithms" className="text-muted no-underline hover:text-purple transition-colors">
            Algorithms
          </Link>
          {breadcrumb.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1.5">
              <span>/</span>
              {crumb.href ? (
                <Link to={crumb.href} className="text-muted no-underline hover:text-purple transition-colors">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-ink">{crumb.label}</span>
              )}
            </span>
          ))}
        </div>
      ) : (
        <ul className="flex gap-8 list-none">
          {['Home', 'Algorithms', 'Playground', 'Docs'].map(link => {
            const path = link === 'Home' ? '/' : link === 'Algorithms' ? '/algorithms' : link === 'Docs' ? '/docs' : '#';
            const isActive = link === 'Home' ? location.pathname === '/' : location.pathname.startsWith(path);
            return (
              <li key={link} className="flex items-center gap-1.5 relative">
                <Link
                  to={path}
                  className={`no-underline text-[0.875rem] transition-colors duration-150 ${isActive ? 'text-ink font-bold' : 'text-muted font-normal hover:text-ink'}`}
                >
                  {link}
                </Link>
                {link === 'Playground' && (
                  <span className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 font-mono text-[0.45rem] font-semibold px-[0.3rem] py-[0.05rem] rounded-[3px] bg-purple text-white tracking-[0.04em] whitespace-nowrap">Coming soon</span>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <div className="flex items-center gap-2.5">
        {breadcrumb ? (
          <Link to="/algorithms" className="bg-transparent text-ink2 text-[0.75rem] font-medium px-[0.875rem] py-[0.4rem] rounded-md border border-border cursor-pointer no-underline font-body flex items-center gap-1.5">
            ← Back
          </Link>
        ) : (
          <>
            <button className="bg-transparent text-ink text-[0.8125rem] font-medium px-[1.125rem] py-[0.5rem] rounded-full border border-border cursor-pointer font-body">Sign in</button>
            <button className="bg-purple text-white text-[0.8125rem] font-medium px-[1.25rem] py-[0.5rem] rounded-full border-none cursor-pointer font-body">Get started</button>
          </>
        )}
      </div>
    </nav>
  );
}
