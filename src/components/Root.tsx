import { useState, useEffect, useRef } from 'react'
import { Link, Outlet, useLocation } from 'react-router'
import logoImg from '@/imports/logo.jpeg'
import { useCart } from '@/CartContext'

const NAV_LINKS = [
  { label: 'Shop',      to: '/shop' },
  { label: 'Customize', to: '/customize' },
  { label: 'Our Story', to: '/story' },
  { label: 'Wholesale', to: '/wholesale' },
  { label: 'Join Us',   to: '/join' },
]

export default function Root() {
  const [scrolled, setScrolled] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [inverted, setInverted] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'

  const dotRef    = useRef<HTMLDivElement>(null)
  const squareRef = useRef<HTMLDivElement>(null)
  const mouse     = useRef({ x: -200, y: -200 })
  const lag       = useRef({ x: -200, y: -200 })
  const rafId     = useRef<number>(0)

  useEffect(() => {
    const isDark = (el: Element | null): boolean => {
      while (el && el !== document.body) {
        const bg = getComputedStyle(el).backgroundColor
        const m = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
        if (m) {
          const [r, g, b] = [+m[1], +m[2], +m[3]]
          if (r + g + b < 10) { el = el.parentElement; continue } // transparent/zero → skip
          // Perceived luminance — invert when dark or red-dominant
          const lum = 0.299 * r + 0.587 * g + 0.114 * b
          if (lum < 100) return true
        }
        el = el.parentElement
      }
      return false
    }

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px,${e.clientY}px)`
      }
      const t = e.target as Element
      setHovering(!!(t?.closest('a,button,[role="button"]')))
      setInverted(isDark(t))
    }
    const tick = () => {
      lag.current.x += (mouse.current.x - lag.current.x) * 0.1
      lag.current.y += (mouse.current.y - lag.current.y) * 0.1
      if (squareRef.current) {
        squareRef.current.style.transform = `translate(${lag.current.x}px,${lag.current.y}px)`
      }
      rafId.current = requestAnimationFrame(tick)
    }
    document.addEventListener('mousemove', onMove)
    rafId.current = requestAnimationFrame(tick)
    return () => {
      document.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafId.current)
    }
  }, [])

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 48)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  const { count } = useCart()
  const opaque = scrolled || !isHome
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Close mobile menu on route change
  useEffect(() => { setMobileMenuOpen(false) }, [location.pathname])

  return (
    <div className="site-root">
      {/* Cursor: snap dot + lagging square */}
      <div ref={dotRef}    className={`cursor-dot${hovering ? ' cursor-dot--hover' : ''}${inverted ? ' cursor-dot--invert' : ''}`} />
      <div ref={squareRef} className={`cursor-square${hovering ? ' cursor-square--hover' : ''}${inverted ? ' cursor-square--invert' : ''}`} />

      <div role="banner" className={`site-header${opaque ? ' site-header--opaque' : ''}`}>
        <Link to="/" className="site-logo">
          <img src={logoImg} alt="Panchajanya" className="site-logo__img" />
          <span className="site-logo__text">Panchajanya</span>
        </Link>

        {/* Desktop nav */}
        <div role="navigation" className="site-nav">
          {NAV_LINKS.map(({ label, to }) => (
            <Link key={to} to={to} className={`site-nav__link${location.pathname === to ? ' site-nav__link--active' : ''}`}>{label}</Link>
          ))}
          <Link to="/cart" className="site-nav__cart" aria-label={`Cart (${count} items)`}>
            <span className="site-nav__cart-icon">🛍</span>
            {count > 0 && <span className="site-nav__cart-badge">{count}</span>}
          </Link>
          <Link to="/shop" className="site-nav__cta">Shop Now</Link>
        </div>

        {/* Mobile right — cart + hamburger */}
        <div className="site-nav-mobile-right">
          <Link to="/cart" className="site-nav__cart" aria-label={`Cart (${count} items)`}>
            <span className="site-nav__cart-icon">🛍</span>
            {count > 0 && <span className="site-nav__cart-badge">{count}</span>}
          </Link>
          <button className="site-hamburger" aria-label="Menu" onClick={() => setMobileMenuOpen(v => !v)}>
            <span className={`site-hamburger__bar${mobileMenuOpen ? ' open' : ''}`} />
            <span className={`site-hamburger__bar${mobileMenuOpen ? ' open' : ''}`} />
            <span className={`site-hamburger__bar${mobileMenuOpen ? ' open' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-drawer__panel" onClick={e => e.stopPropagation()}>
            <div className="mobile-drawer__top">
              <span className="mobile-drawer__brand">Panchajanya</span>
              <button className="mobile-drawer__close" onClick={() => setMobileMenuOpen(false)}>✕</button>
            </div>
            <nav className="mobile-drawer__nav">
              {NAV_LINKS.map(({ label, to }) => (
                <Link key={to} to={to} className="mobile-drawer__link">{label}</Link>
              ))}
            </nav>
            <Link to="/shop" className="mobile-drawer__cta" onClick={() => setMobileMenuOpen(false)}>Shop the Collection →</Link>
          </div>
        </div>
      )}

      <Outlet />

      <div role="contentinfo" className="site-footer">
        <div className="site-footer__grid">
          <div className="site-footer__brand">
            <div className="site-footer__brand-row">
              <img src={logoImg} alt="Panchajanya" className="site-footer__logo" />
              <span className="site-footer__brand-name">Panchajanya</span>
            </div>
            <p className="site-footer__tagline">
              Canvas bags, kaftans, and home decor — all handmade by women artisans at our free training facility in Sonarpur, Kolkata.
            </p>
          </div>
          {[
            { heading: 'Shop',     links: [['Canvas Bags', '/shop?category=canvas-bags'], ['Kaftans & Jackets', '/shop?category=kaftans'], ['Home Decor', '/shop?category=home-decor'], ['Coin Purses', '/shop?category=canvas-bags']] },
            { heading: 'Buy More', links: [['Bundle Deals', '/shop'], ['Wholesale Pricing', '/wholesale'], ['Art Student Supply', '/wholesale'], ['Corporate Gifting', '/wholesale']] },
            { heading: 'Company',  links: [['Our Story', '/story'], ['Join Us', '/join'], ['Artisan Training', '/join'], ['Delivery Partner', '/join']] },
          ].map(({ heading, links }) => (
            <div key={heading} className="site-footer__col">
              <p className="site-footer__col-heading">{heading}</p>
              <ul className="site-footer__col-list">
                {links.map(([label, href]) => (
                  <li key={label}>
                    <Link to={href} className="site-footer__col-link">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="site-footer__col">
            <p className="site-footer__col-heading">Connect</p>
            <ul className="site-footer__col-list">
              <li>
                <a
                  href="https://www.instagram.com/panchajanya.5/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="site-footer__col-link"
                  style={{ textDecoration: 'none', display: 'inline-block' }}
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="site-footer__col-link"
                  style={{ textDecoration: 'none', display: 'inline-block' }}
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/919088970848"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="site-footer__col-link"
                  style={{ textDecoration: 'none', display: 'inline-block' }}
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href="mailto:panchajanyaco05@gmail.com"
                  className="site-footer__col-link"
                  style={{ textDecoration: 'none', display: 'inline-block' }}
                >
                  panchajanyaco05@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="site-footer__bottom">
          <p>© 2026 Panchajanya. All rights reserved.</p>
          <p>Made by women · Powered by community</p>
        </div>
      </div>
    </div>
  )
}
