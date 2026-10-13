// Shared components & helpers for Ramaro Men landing
const { useState, useEffect, useRef, useCallback, createContext, useContext } = React;

// --- Reveal: now a passthrough (animation removed — preview iframe pauses anims) ---
function Reveal({ children, delay = 0, as: Tag = "div", className = "", style: extra = {}, ...rest }) {
  return <Tag className={className} style={extra} {...rest}>{children}</Tag>;
}

function SectionReveal({ children, className = "", style: extra = {} }) {
  return <div className={className} style={extra}>{children}</div>;
}

// --- Icons (inline SVG) ---
const Icon = {
  Scissors: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/>
      <line x1="20" y1="4" x2="8.12" y2="15.88"/>
      <line x1="14.47" y1="14.48" x2="20" y2="20"/>
      <line x1="8.12" y1="8.12" x2="12" y2="12"/>
    </svg>
  ),
  ArrowRight: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="13 6 19 12 13 18"/>
    </svg>
  ),
  ArrowDown: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <line x1="12" y1="5" x2="12" y2="19"/><polyline points="18 13 12 19 6 13"/>
    </svg>
  ),
  Chevron: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  ),
  Clock: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 14"/>
    </svg>
  ),
  Pin: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  Instagram: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.6" fill="currentColor"/>
    </svg>
  ),
  Facebook: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  ),
  Whats: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M3 21l1.7-5A8 8 0 1 1 8 19.5L3 21"/><path d="M9 9c0 4 3 7 7 7l1.5-1.5-2-1-1 1c-1 0-3-2-3-3l1-1-1-2L10.5 7C10.5 7 9 7.5 9 9z"/>
    </svg>
  ),
  Play: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <polygon points="6 4 20 12 6 20"/>
    </svg>
  ),
  Star: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21 12 17.77 5.82 21 7 14.14 2 9.27 8.91 8.26"/>
    </svg>
  ),
  Menu: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" {...p}>
      <line x1="4" y1="8" x2="20" y2="8"/><line x1="4" y1="16" x2="20" y2="16"/>
    </svg>
  ),
  Close: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" {...p}>
      <line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/>
    </svg>
  ),
  LogoMark: (p) => (
    // Angular "R" lettermark — built from the brand symbol geometry
    <svg viewBox="0 0 131 135" fill="currentColor" {...p}>
      <path d="M51.5 9.55H92.45C113.2 9.55 128.85 25.95 128.85 50.9C128.85 65.6 125.45 78.15 119.75 86.9L51.5 9.55Z"/>
      <path d="M10.55 9.55C12.25 9.55 13.85 10.22 15.05 11.42L127.05 123.42C128.55 124.92 127.48 127.5 125.36 127.5H98.1C94.85 127.5 91.72 126.2 89.42 123.9L13.72 48.2C11.7 46.18 10.55 43.45 10.55 40.6V9.55Z"/>
      <path d="M10.55 86.9L51.5 127.5H25.55C21.58 127.5 17.78 125.92 14.98 123.12C12.15 120.29 10.55 116.46 10.55 112.45V86.9Z"/>
    </svg>
  ),
};

// --- Floating gallery (mouse-parallax) ---
const FloatingContext = createContext(null);

function Floating({ children, sensitivity = 1, easing = 0.06, className = "" }) {
  const containerRef = useRef(null);
  const elementsRef = useRef(new Map());
  const mouseRef = useRef({ x: 0, y: 0 });

  const register = useCallback((id, el, depth) => {
    elementsRef.current.set(id, { el, depth, x: 0, y: 0 });
  }, []);
  const unregister = useCallback((id) => {
    elementsRef.current.delete(id);
  }, []);

  useEffect(() => {
    function onMove(e) {
      if (!containerRef.current) return;
      const r = containerRef.current.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      mouseRef.current.x = (e.clientX - cx);
      mouseRef.current.y = (e.clientY - cy);
    }
    window.addEventListener('mousemove', onMove);
    let raf;
    function tick() {
      elementsRef.current.forEach((d) => {
        const strength = (d.depth * sensitivity) / 22;
        const tx = mouseRef.current.x * strength;
        const ty = mouseRef.current.y * strength;
        d.x += (tx - d.x) * easing;
        d.y += (ty - d.y) * easing;
        d.el.style.transform = `translate3d(${d.x}px, ${d.y}px, 0)`;
      });
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf); };
  }, [sensitivity, easing]);

  return (
    <FloatingContext.Provider value={{ register, unregister }}>
      <div ref={containerRef} className={"floating-stage " + className} style={{ position: 'absolute', inset: 0 }}>
        {children}
      </div>
    </FloatingContext.Provider>
  );
}

function FloatingElement({ children, depth = 1, className = "", style = {} }) {
  const ref = useRef(null);
  const idRef = useRef(Math.random().toString(36).slice(2));
  const ctx = useContext(FloatingContext);
  useEffect(() => {
    if (!ref.current || !ctx) return;
    ctx.register(idRef.current, ref.current, depth);
    return () => ctx.unregister(idRef.current);
  }, [depth]);
  return (
    <div ref={ref} className={className} style={{ position: 'absolute', willChange: 'transform', ...style }}>
      {children}
    </div>
  );
}

// --- Blob shapes ---
function Blob({ color, opacity = 0.18, style, variant = 1 }) {
  const paths = {
    1: "M55,5 C75,5 95,25 95,50 C95,75 75,95 55,95 C35,95 5,80 5,55 C5,30 35,5 55,5 Z",
    2: "M30,8 C60,2 92,18 96,48 C100,78 78,98 48,96 C18,94 2,72 6,42 C9,22 12,12 30,8 Z",
    3: "M20,10 C50,0 88,8 94,40 C98,68 80,92 50,95 C20,98 4,80 4,52 C4,30 4,18 20,10 Z",
  };
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="blob" style={style} aria-hidden="true">
      <path d={paths[variant]} fill={color} opacity={opacity} />
    </svg>
  );
}

// expose
Object.assign(window, { Reveal, SectionReveal, Icon, Floating, FloatingElement, Blob });
