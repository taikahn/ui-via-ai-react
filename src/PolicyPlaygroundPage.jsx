import { useEffect, useState, useRef } from 'react';

export default function PolicyPlaygroundPage() {
  const [navOpen, setNavOpen] = useState(false);
  const orgRef = useRef(null);
  const [orgOpen, setOrgOpen] = useState(false);
  const [orgName, setOrgName] = useState('Enterprise Inc.');
  const [orgRole, setOrgRole] = useState('OWNER');
  const flagRef = useRef(null);
  const [flagOpen, setFlagOpen] = useState(false);
  const [country, setCountry] = useState('United States');
  const avatarRef = useRef(null);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const helpRef = useRef(null);
  const [helpOpen, setHelpOpen] = useState(false);

  const toggleNav = () => {
    setNavOpen((open) => !open);
  };

  const [copied, setCopied] = useState(false);
  const [highlight, setHighlight] = useState(false);
  const codeValue = `{
  "hello": true,
  "world": true
}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(codeValue).then(() => {
      setCopied(true);
      setHighlight(true);
      setTimeout(() => setCopied(false), 2000);
      setTimeout(() => setHighlight(false), 600);
    });
  };

  const handleNavItemClick = () => {
    if (window.innerWidth < 768) {
      setNavOpen(false);
    }
  };

  useEffect(() => {
    if (!orgOpen) return;
    const onDocClick = (e) => {
      if (orgRef.current && !orgRef.current.contains(e.target)) {
        setOrgOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [orgOpen]);

  useEffect(() => {
    if (!flagOpen) return;
    const onDocClick = (e) => {
      if (flagRef.current && !flagRef.current.contains(e.target)) {
        setFlagOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [flagOpen]);

  useEffect(() => {
    if (!avatarOpen) return;
    const onDocClick = (e) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target)) {
        setAvatarOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [avatarOpen]);

  useEffect(() => {
    if (!helpOpen) return;
    const onDocClick = (e) => {
      if (helpRef.current && !helpRef.current.contains(e.target)) {
        setHelpOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [helpOpen]);

  // Sidebar resize: allow dragging right only, keep current width as minimum
  const sidebarRef = useRef(null);
  const [sidebarWidth, setSidebarWidth] = useState(null);
  const sidebarMinRef = useRef(260);
  const prevSidebarWidthRef = useRef(null);
  const [collapsed, setCollapsed] = useState(false);
  const ICON_ONLY_WIDTH = 72;
  const draggingRef = useRef(false);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);
  const startCollapsedRef = useRef(false);
  const DRAG_TOGGLE_THRESHOLD = 12; // pixels of horizontal drag to trigger toggle
  // While dragging right from a collapsed state, suppress the .collapsed class for a
  // live preview of the expanded sidebar before the collapsed state actually flips.
  const [dragExpanding, setDragExpanding] = useState(false);
  // Track the desktop breakpoint as state so style changes during viewport resizes
  // re-render the sidebar (instead of relying on a window read in render).
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== 'undefined' ? window.innerWidth >= 768 : true
  );

  useEffect(() => {
    const el = sidebarRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    sidebarMinRef.current = rect.width;
    setSidebarWidth(rect.width);
  }, []);

  useEffect(() => {
    const onResize = () => {
      const desktop = window.innerWidth >= 768;
      setIsDesktop((prev) => {
        if (prev === desktop) return prev;
        // Crossing the breakpoint: clear or re-apply inline layout styles on the
        // sidebar/topbar/content/footer so the desktop offset doesn't leak into
        // mobile (and vice versa). Suspend transitions across the swap so the
        // adjustment doesn't animate.
        const topbar = document.querySelector('.topbar');
        const content = document.querySelector('.content');
        const footer = document.querySelector('.footer');
        const sb = sidebarRef.current;
        if (sb) {
          sb.style.transition = 'none';
          // Force reflow so the transition reset is picked up before we re-enable.
          sb.offsetHeight;
        }
        if (!desktop) {
          if (sb) sb.style.width = '';
          if (topbar) topbar.style.left = '';
          if (content) content.style.marginLeft = '';
          if (footer) footer.style.marginLeft = '';
        } else {
          const w = collapsed
            ? ICON_ONLY_WIDTH
            : prevSidebarWidthRef.current || sidebarWidth || sidebarMinRef.current;
          setSidebarWidth(w);
          if (sb) sb.style.width = `${w}px`;
          if (topbar) topbar.style.left = `${w}px`;
          if (content) content.style.marginLeft = `${w}px`;
          if (footer) footer.style.marginLeft = `${w}px`;
        }
        if (sb) {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              sb.style.transition = '';
            });
          });
        }
        return desktop;
      });
      if (window.innerWidth >= 768 && navOpen) {
        setNavOpen(false);
      }
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [navOpen, collapsed, sidebarWidth]);

  const toggleCollapse = () => {
    if (collapsed) {
      // expand: restore previous width
      const restore = prevSidebarWidthRef.current || sidebarMinRef.current;
      setSidebarWidth(restore);
      if (sidebarRef.current) sidebarRef.current.style.width = `${restore}px`;
      if (window.innerWidth >= 768) {
        const topbar = document.querySelector('.topbar');
        const content = document.querySelector('.content');
        const footer = document.querySelector('.footer');
        if (topbar) topbar.style.left = `${restore}px`;
        if (content) content.style.marginLeft = `${restore}px`;
        if (footer) footer.style.marginLeft = `${restore}px`;
      }
      setCollapsed(false);
    } else {
      // collapse: save current width and set to icon-only
      prevSidebarWidthRef.current = sidebarWidth || sidebarMinRef.current;
      setSidebarWidth(ICON_ONLY_WIDTH);
      if (sidebarRef.current) sidebarRef.current.style.width = `${ICON_ONLY_WIDTH}px`;
      if (window.innerWidth >= 768) {
        const topbar = document.querySelector('.topbar');
        const content = document.querySelector('.content');
        const footer = document.querySelector('.footer');
        if (topbar) topbar.style.left = `${ICON_ONLY_WIDTH}px`;
        if (content) content.style.marginLeft = `${ICON_ONLY_WIDTH}px`;
        if (footer) footer.style.marginLeft = `${ICON_ONLY_WIDTH}px`;
      }
      setCollapsed(true);
    }
  };

  return (
    <div className="app">
      {/* Sidebar */}
      <nav ref={sidebarRef} style={sidebarWidth && isDesktop ? { width: `${sidebarWidth}px` } : undefined} className={`sidebar ${navOpen ? 'open' : ''} ${collapsed && !dragExpanding ? 'collapsed' : ''}`}>
        <div className="sidebar-section" data-label="Dashboard" onClick={handleNavItemClick}>
          <span className="sidebar-icon">
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
              <rect x="1" y="1" width="4" height="4" fill="#38bdf8" />
              <rect x="7" y="1" width="4" height="4" fill="#6366f1" />
              <rect x="1" y="7" width="4" height="4" fill="#22c55e" />
              <rect x="7" y="7" width="4" height="4" fill="#f97316" />
            </svg>
          </span>
          <span>Dashboard</span>
        </div>
        <div className="sidebar-section" data-label="Discovery" onClick={handleNavItemClick}>
          <span className="sidebar-icon">
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
              <circle cx="6" cy="6" r="5" stroke="#38bdf8" strokeWidth="1.2" fill="none" />
              <path d="M6 3.5v3" stroke="#38bdf8" strokeWidth="1" strokeLinecap="round" />
              <circle cx="6" cy="7.8" r="0.6" fill="#38bdf8" />
            </svg>
          </span>
          <span>Discovery</span>
        </div>
        <div className="sidebar-section" data-label="Policies" onClick={handleNavItemClick}>
          <span className="sidebar-icon">
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
              <path d="M2 3h8v6H2z" fill="#60a5fa" />
              <rect x="3" y="4" width="6" height="1" fill="#fff" />
            </svg>
          </span>
          <span>Policies</span>
        </div>
        <div className="sidebar-section active" data-label="Fabric" onClick={handleNavItemClick}>
          <span className="sidebar-icon">
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
              <circle cx="6" cy="6" r="4" fill="#34d399" />
              <path d="M6 4v2l1 1" stroke="#083344" strokeWidth="0.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span>Fabric</span>
        </div>
        <div className="sidebar-section" data-label="Security/Management" onClick={handleNavItemClick}>
          <span className="sidebar-icon">
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
              <circle cx="6" cy="6" r="3" fill="#f97316" />
              <path d="M6 2.2V1" stroke="#f97316" strokeWidth="0.9" strokeLinecap="round" />
              <path d="M6 11v-1.2" stroke="#f97316" strokeWidth="0.9" strokeLinecap="round" />
              <path d="M2.2 6H1" stroke="#f97316" strokeWidth="0.9" strokeLinecap="round" />
              <path d="M11 6H9.8" stroke="#f97316" strokeWidth="0.9" strokeLinecap="round" />
            </svg>
          </span>
          <span>Security/Management</span>
        </div>
        <div className="sidebar-section" data-label="Downloads" onClick={handleNavItemClick}>
          <span className="sidebar-icon">
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
              <path
                d="M3 2.2h6l-0.8 5.8H3.8L3 2.2z"
                fill="#e5e7eb"
                stroke="#64748b"
                strokeWidth="0.8"
              />
              <rect x="4.1" y="3.4" width="1.2" height="3.6" fill="#0ea5e9" />
              <rect x="6.1" y="3.4" width="1.2" height="2.4" fill="#22c55e" />
            </svg>
          </span>
          <span>Downloads</span>
        </div>
        {/* Resizer bar: small hit target that toggles collapse when dragged */}
        <div
          className="sidebar-resizer"
          onMouseDown={(e) => {
            e.preventDefault();
            draggingRef.current = true;
            startXRef.current = e.clientX;
            startWidthRef.current = sidebarRef.current ? sidebarRef.current.getBoundingClientRect().width : sidebarMinRef.current;
            startCollapsedRef.current = collapsed;
            document.body.style.cursor = 'ew-resize';

            const onMouseMove = (mv) => {
              if (!draggingRef.current) return;
              const dx = mv.clientX - startXRef.current;
              // If the drag started while collapsed, only allow dragging to the right (dx >= 0).
              // If the drag started while expanded, only allow dragging to the left (dx <= 0).
              if (startCollapsedRef.current && dx < 0) return;
              if (!startCollapsedRef.current && dx > 0) return;
              // Live preview: while dragging right from collapsed, suppress the
              // .collapsed class so the user sees the expanded styling immediately.
              if (startCollapsedRef.current && dx > 0) setDragExpanding(true);
              // Calculate target width and enforce bounds:
              // - never go below the icon-only width
              // - when dragging from collapsed, never exceed the original mounted width (sidebarMinRef)
              let target = startWidthRef.current + dx;
              if (startCollapsedRef.current) {
                target = Math.min(target, sidebarMinRef.current);
              }
              const newWidth = Math.max(ICON_ONLY_WIDTH, target);
              setSidebarWidth(newWidth);
              if (sidebarRef.current) sidebarRef.current.style.width = `${newWidth}px`;
              if (window.innerWidth >= 768) {
                const topbar = document.querySelector('.topbar');
                const content = document.querySelector('.content');
                const footer = document.querySelector('.footer');
                if (topbar) topbar.style.left = `${newWidth}px`;
                if (content) content.style.marginLeft = `${newWidth}px`;
                if (footer) footer.style.marginLeft = `${newWidth}px`;
              }
            };

            const onMouseUp = (ev) => {
              if (!draggingRef.current) return;
              draggingRef.current = false;
              document.body.style.cursor = '';
              document.removeEventListener('mousemove', onMouseMove);
              document.removeEventListener('mouseup', onMouseUp);
              setDragExpanding(false);
              const dx = ev.clientX - startXRef.current;
              // Only trigger a toggle if dragged in the allowed direction and past threshold
              if (startCollapsedRef.current) {
                if (dx >= DRAG_TOGGLE_THRESHOLD) toggleCollapse();
              } else {
                if (dx <= -DRAG_TOGGLE_THRESHOLD) toggleCollapse();
              }
            };

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
          }}
          aria-hidden="true"
        />

        {/* Collapse/expand widget centered at the bottom of the sidebar */}
        <div
          className="sidebar-toggle-widget"
          role="button"
          tabIndex={0}
          aria-pressed={collapsed}
          aria-label={collapsed ? 'Expand navigation' : 'Collapse navigation'}
          onClick={toggleCollapse}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
              e.preventDefault();
              toggleCollapse();
            }
          }}
        >
          <span className="sidebar-icon toggle-icon" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
              <path d="M9.6 3.2 6 7l3.6 3.8" fill="none" stroke="#34d399" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M6.4 3.2 3 7l3.4 3.8" fill="none" stroke="#34d399" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" opacity="0.85" />
              <path d="M6 4.2v5.6" stroke="#083344" strokeWidth="0.5" strokeLinecap="round" opacity="0.12" />
            </svg>
          </span>
        </div>
      </nav>

      <button
        className={`nav-backdrop ${navOpen ? 'open' : ''}`}
        type="button"
        aria-hidden="true"
        onClick={() => setNavOpen(false)}
      />

      {/* Main column */}
      <div className="main-column">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="icon-button burger-label"
              type="button"
              aria-label="Toggle navigation"
              onClick={toggleNav}
            >
              ☰
            </button>
            <div className="logo">
              <span className="logo-mark" aria-hidden="true" />
              <span className="logo-text">LOREM</span>
            </div>
          </div>

          <div className="topbar-center">
            <div ref={orgRef} className="org-container">
              <button
                className="org-pill"
                type="button"
                aria-haspopup="menu"
                aria-expanded={orgOpen}
                onClick={() => setOrgOpen((o) => !o)}
              >
                <span className="company-icon" aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" fill="#0ea5e9" />
                    <rect x="8.2" y="9" width="1.6" height="4.6" rx="0.3" fill="#fff" />
                    <rect x="11" y="7.8" width="1.6" height="6.8" rx="0.3" fill="#fff" />
                    <rect x="13.8" y="10.4" width="1.6" height="4.2" rx="0.3" fill="#fff" />
                  </svg>
                </span>
                <span className="org-name">{orgName}</span>
                <span className="role">{orgRole}</span>
                <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true" className="chevron-icon">
                  <path
                    d="M2 4l3 3 3-3"
                    fill="none"
                    stroke="#00c4b3"
                    strokeWidth="1.1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {orgOpen && (
                <div className="org-menu" role="menu">
                  <button
                    type="button"
                    className="org-menu-item"
                    role="menuitem"
                    onClick={() => { setOrgName('Enterprise Inc.'); setOrgRole('OWNER'); setOrgOpen(false); }}
                  >
                    <span className="company-icon" aria-hidden="true">
                      <svg width="14" height="14" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" fill="#0ea5e9" />
                        <rect x="8.2" y="9" width="1.6" height="4.6" rx="0.3" fill="#fff" />
                        <rect x="11" y="7.8" width="1.6" height="6.8" rx="0.3" fill="#fff" />
                        <rect x="13.8" y="10.4" width="1.6" height="4.2" rx="0.3" fill="#fff" />
                      </svg>
                    </span>
                    <span>Enterprise Inc.</span>
                    <span className="org-menu-role">· OWNER</span>
                  </button>
                  <button
                    type="button"
                    className="org-menu-item"
                    role="menuitem"
                    onClick={() => { setOrgName('Lorem Ipsum, Inc.'); setOrgRole('ADMIN'); setOrgOpen(false); }}
                  >
                    <span className="company-icon" aria-hidden="true">
                      <svg width="14" height="14" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" fill="#0ea5e9" />
                        <rect x="8.2" y="9" width="1.6" height="4.6" rx="0.3" fill="#fff" />
                        <rect x="11" y="7.8" width="1.6" height="6.8" rx="0.3" fill="#fff" />
                        <rect x="13.8" y="10.4" width="1.6" height="4.2" rx="0.3" fill="#fff" />
                      </svg>
                    </span>
                    <span>Lorem Ipsum, Inc.</span>
                    <span className="org-menu-role">· ADMIN</span>
                  </button>
                  <button
                    type="button"
                    className="org-menu-item"
                    role="menuitem"
                    onClick={() => { setOrgName('My Company'); setOrgRole('USER'); setOrgOpen(false); }}
                  >
                    <span className="company-icon" aria-hidden="true">
                      <svg width="14" height="14" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" fill="#0ea5e9" />
                        <rect x="8.2" y="9" width="1.6" height="4.6" rx="0.3" fill="#fff" />
                        <rect x="11" y="7.8" width="1.6" height="6.8" rx="0.3" fill="#fff" />
                        <rect x="13.8" y="10.4" width="1.6" height="4.2" rx="0.3" fill="#fff" />
                      </svg>
                    </span>
                    <span>My Company</span>
                    <span className="org-menu-role">· USER</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="topbar-right">
<div ref={flagRef} style={{ position: 'relative' }}>
              <button
                className="flag"
                type="button"
                aria-haspopup="menu"
                aria-expanded={flagOpen}
                onClick={() => setFlagOpen((f) => !f)}
                title={country}
              >
                {country === 'United States' && (
                  <svg width="22" height="14" viewBox="0 0 22 14" aria-hidden="true">
                    <rect width="22" height="14" fill="#fff" />
                    {/* red stripes */}
                    <rect y="0" width="22" height="2" fill="#b91c1c" />
                    <rect y="2" width="22" height="2" fill="#fff" />
                    <rect y="4" width="22" height="2" fill="#b91c1c" />
                    <rect y="6" width="22" height="2" fill="#fff" />
                    <rect y="8" width="22" height="2" fill="#b91c1c" />
                    <rect y="10" width="22" height="2" fill="#fff" />
                    <rect y="12" width="22" height="2" fill="#b91c1c" />
                    {/* blue canton */}
                    <rect width="9.5" height="7.5" fill="#1d4ed8" />
                  </svg>
                )}
                {country === 'Canada' && (
                  <svg width="22" height="14" viewBox="0 0 22 14" aria-hidden="true">
                    <rect width="22" height="14" fill="#fff" />
                    <rect width="6" height="14" fill="#b91c1c" />
                    <rect x="16" width="6" height="14" fill="#b91c1c" />
                    <path d="M11 3.2l0.5 1.1 1.2 0.1-0.9 0.9 0.25 1.2L11 6.1 9.95 6.5 10.2 5.3 9.3 4.4l1.2-0.1L11 3.2z" fill="#b91c1c" />
                  </svg>
                )}
                {country === 'Japan' && (
                  <svg width="22" height="14" viewBox="0 0 22 14" aria-hidden="true">
                    <rect width="22" height="14" fill="#fff" />
                    <circle cx="11" cy="7" r="3" fill="#dc2626" />
                  </svg>
                )}
                {country === 'EU' && (
                  <svg width="22" height="14" viewBox="0 0 22 14" aria-hidden="true">
                    <rect width="22" height="14" fill="#1e40af" />
                    <g fill="#fbbf24">
                      <circle cx="11" cy="2.6" r="0.6" />
                      <circle cx="13.1" cy="3.8" r="0.6" />
                      <circle cx="14.7" cy="6.6" r="0.6" />
                      <circle cx="13.1" cy="9.4" r="0.6" />
                      <circle cx="11" cy="10.6" r="0.6" />
                      <circle cx="6.9" cy="9.4" r="0.6" />
                      <circle cx="5.3" cy="6.6" r="0.6" />
                      <circle cx="6.9" cy="3.8" r="0.6" />
                    </g>
                  </svg>
                )}
              </button>

              {flagOpen && (
                <div className="flag-menu" role="menu">
                  {/* Alphabetical: Canada, EU, Japan, United States */}
                  <button
                    type="button"
                    className="flag-menu-item"
                    onClick={() => { setCountry('Canada'); setFlagOpen(false); }}
                  >
                    <span className="country-icon" aria-hidden="true">
                      <svg width="20" height="12" viewBox="0 0 20 12" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <rect width="20" height="12" fill="#fff" />
                        <rect width="4" height="12" fill="#b91c1c" />
                        <rect x="16" width="4" height="12" fill="#b91c1c" />
                        <path d="M10 3.2l0.5 1.1 1.2 0.1-0.9 0.9 0.25 1.2L10 6.1 8.95 6.5 9.2 5.3 8.3 4.4l1.2-0.1L10 3.2z" fill="#b91c1c" />
                      </svg>
                    </span>
                    Canada
                  </button>
                  <button
                    type="button"
                    className="flag-menu-item"
                    onClick={() => { setCountry('EU'); setFlagOpen(false); }}
                  >
                    <span className="country-icon" aria-hidden="true">
                      <svg width="20" height="12" viewBox="0 0 20 12" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <rect width="20" height="12" fill="#1e40af" />
                        <g fill="#fbbf24">
                          <circle cx="10" cy="2.6" r="0.6" />
                          <circle cx="13.1" cy="3.8" r="0.6" />
                          <circle cx="14.7" cy="6.6" r="0.6" />
                          <circle cx="13.1" cy="9.4" r="0.6" />
                          <circle cx="10" cy="10.6" r="0.6" />
                          <circle cx="6.9" cy="9.4" r="0.6" />
                          <circle cx="5.3" cy="6.6" r="0.6" />
                          <circle cx="6.9" cy="3.8" r="0.6" />
                        </g>
                      </svg>
                    </span>
                    EU
                  </button>
                  <button
                    type="button"
                    className="flag-menu-item"
                    onClick={() => { setCountry('Japan'); setFlagOpen(false); }}
                  >
                    <span className="country-icon" aria-hidden="true">
                      <svg width="20" height="12" viewBox="0 0 20 12" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <rect width="20" height="12" fill="#fff" />
                        <circle cx="10" cy="6" r="2.4" fill="#dc2626" />
                      </svg>
                    </span>
                    Japan
                  </button>
                  <button
                    type="button"
                    className="flag-menu-item"
                    onClick={() => { setCountry('United States'); setFlagOpen(false); }}
                  >
                    <span className="country-icon" aria-hidden="true">
                      <svg width="20" height="12" viewBox="0 0 20 12" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <rect width="20" height="12" fill="#fff" />
                        <rect y="0" width="20" height="2" fill="#b91c1c" />
                        <rect y="2" width="20" height="2" fill="#fff" />
                        <rect y="4" width="20" height="2" fill="#b91c1c" />
                        <rect y="6" width="20" height="2" fill="#fff" />
                        <rect y="8" width="20" height="2" fill="#b91c1c" />
                        <rect y="10" width="20" height="2" fill="#fff" />
                        <rect x="0" y="0" width="8" height="6" fill="#1d4ed8" />
                      </svg>
                    </span>
                    United States
                  </button>
                </div>
              )}
            </div>
            <div ref={avatarRef} style={{ position: 'relative' }}>
              <button
                className="avatar"
                type="button"
                aria-haspopup="menu"
                aria-expanded={avatarOpen}
                onClick={() => setAvatarOpen((a) => !a)}
              >
                JD
              </button>

              {avatarOpen && (
                <div className="avatar-menu" role="menu">
                  <button
                    type="button"
                    className="avatar-menu-item"
                    onClick={() => { setAvatarOpen(false); }}
                  >
                        User Settings
                  </button>
                  <button
                    type="button"
                    className="avatar-menu-item"
                    onClick={() => { setAvatarOpen(false); }}
                  >
                        Account Settings
                  </button>
                  <button
                    type="button"
                    className="avatar-menu-item danger"
                    onClick={() => { setAvatarOpen(false); }}
                  >
                        Logout
                  </button>
                </div>
              )}
            </div>

            
          </div>
        </header>

        <main className="content">
          <div className="breadcrumb">
            <span className="breadcrumb-link">User Flows</span> / <span className="breadcrumb-link">Detail</span>
          </div>

          <section className="card">
            <header className="card-header">
              <div className="card-header-row">
                <div className="idql-logo" aria-hidden="true" />
                <div>
                  <h1>IDQL Playground</h1>
                  <div className="breadcrumb" style={{ margin: 0, fontSize: '0.7rem' }}>
                    Policy Fabric
                  </div>
                </div>
              </div>
            </header>

            <section className="card-section">
              <div className="section-title-row">
                <h2>Policy Details</h2>
                <button className="outline-button" type="button">
                  Edit
                </button>
              </div>

              <dl className="details-grid">
                <div>
                  <dt>Policy</dt>
                  <dd>Example</dd>
                </div>
                <div>
                  <dt>Name</dt>
                  <dd>Hello-World</dd>
                </div>
                <div>
                  <dt>Resource Type</dt>
                  <dd>Human/Subject</dd>
                </div>
                <div>
                  <dt>Actions</dt>
                  <dd>Authorization</dd>
                </div>
              </dl>
            </section>

            <section className="card-section">
              <div className="section-title-row">
                <h2>Policy</h2>
                <button className="primary-button" type="button">
                  Add to Policy Fabric
                </button>
              </div>

              <div className="pill" style={{ cursor: 'pointer' }}>
                <span className="policy-icon" aria-hidden="true" />
                <span>Hello-World.v07.22.2025</span>
              </div>

              <div 
                className={`code-container ${highlight ? 'highlight-active' : ''}`}
                onClick={handleCopy}
                style={{ cursor: 'pointer' }}
                title={copied ? 'Copied!' : 'Click to copy'}
              >
                <div className={`copy-icon-wrapper ${copied ? 'copied' : ''}`}>
                  {copied ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="8" y="4" width="12" height="12" rx="1.5" />
                      <path d="M16 4V3.5A1.5 1.5 0 0 0 14.5 2h-11A1.5 1.5 0 0 0 2 3.5v11A1.5 1.5 0 0 0 3.5 16H4" />
                    </svg>
                  )}
                </div>
                <pre className="code-editor">
                  {codeValue}
                </pre>
              </div>
            </section>
          </section>
        </main>

        <footer className="footer">
          <span>© 2026 Lorem Ipsum, Inc.</span>
          <span>
            <span className="footer-link">Privacy Policy</span> · <span className="footer-link">Terms of Service</span>
          </span>
        </footer>
      </div>

      <div className="help-fab-container" ref={helpRef}>
        {helpOpen && (
          <div className="help-menu" role="menu">
            <button
              type="button"
              className="help-menu-item"
              onClick={() => setHelpOpen(false)}
            >
              Support
            </button>
            <button
              type="button"
              className="help-menu-item"
              onClick={() => setHelpOpen(false)}
            >
              Documentation
            </button>
          </div>
        )}
        <button 
          className="help-fab" 
          type="button" 
          onClick={() => setHelpOpen(!helpOpen)}
          aria-haspopup="menu"
          aria-expanded={helpOpen}
          aria-label="Help"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 16 16"
            aria-hidden="true"
          >
            <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.2" />
            <path
              d="M6.5 6a1.75 1.75 0 013 1.06c0 .93-.8 1.42-1.26 1.77-.36.28-.49.5-.49 1.17"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            <circle cx="8" cy="11.8" r="0.7" fill="currentColor" />
          </svg>
        </button>
      </div>
    </div>
  );
}

