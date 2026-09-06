import { useState, useEffect } from 'react'

import { Link, useNavigate } from 'react-router'
import { Button } from '@figma/astraui'
import logoImg from '@/imports/logo.jpeg'
import artisanImg from '@/imports/WhatsApp_Image_2026-08-29_at_4.42.29_PM.jpeg'
import kalamkariSling from '@/imports/1bag.png'
import heroImg from '@/imports/annotation-reference.jpeg'
import cat0Img from '@/imports/8th_bag-1.png?url'
import cat1Img from '@/imports/WhatsApp_Image_2026-09-04_at_5.47.56_PM-1.jpeg'
import homeDecorImg from '@/imports/WhatsApp_Image_2026-09-04_at_5.38.21_PM.jpeg'
import { C, D, B, PILLARS, CATEGORIES, BUNDLES } from '@/data'
import { ProdOverlay, ProdFlipCard } from '@/components/ProdCards'
import { useProducts, resolveProductImageUrl } from '@/ProductContext'

export default function Home() {
  const { products } = useProducts()
  const [slide, setSlide] = useState(0)
  const [paused, setPaused] = useState(false)
  const navigate = useNavigate()
  const SLIDES_PER_VIEW = 4
  const totalSlides = Math.max(1, Math.ceil(products.length / SLIDES_PER_VIEW))
  const prevSlide = () => setSlide(s => (s - 1 + totalSlides) % totalSlides)
  const nextSlide = () => setSlide(s => (s + 1) % totalSlides)

  useEffect(() => {
    if (paused) return
    const t = setInterval(nextSlide, 3500)
    return () => clearInterval(t)
  }, [paused, totalSlides])

  return (
    <>
      {/* ── HERO ── */}
      <div role="region" className="hero-grid">
        <div className="hero-left">
          <span className="hero-rotated-label">Women Artisans · Sonarpur · Kolkata</span>
          <div className="h1 hero-badge">
            <span className="hero-badge__dot" />
            <span className="hero-badge__text">Handmade by women artisans · 35+ varieties</span>
          </div>
          <h1 className="h2 hero-h1-line1">Crafted with care,</h1>
          <h1 className="h3 hero-h1-line2">carried with pride.</h1>
          <p className="h4 hero-desc">
            Canvas bags, kaftans, and home decor — all handmade by trained women artisans at our free facility in Sonarpur, South Kolkata.
          </p>
          <div className="h4 hero-offers">
            <div className="offer-card offer-card--maroon" onClick={() => navigate('/shop')}>
              <span className="offer-card__badge offer-card__badge--sand">Popular</span>
              <span className="offer-card__icon">🎁</span>
              <span className="offer-card__label">Bundle &amp; Save</span>
              <span className="offer-card__sub">Free delivery on 3+ items</span>
            </div>
            <div className="offer-card offer-card--fog" onClick={() => navigate('/shop')}>
              <span className="offer-card__badge offer-card__badge--maroon">Best value</span>
              <span className="offer-card__icon">🎒</span>
              <span className="offer-card__label offer-card__label--dark">₹450 onwards</span>
              <span className="offer-card__sub offer-card__sub--dark">Slings start here</span>
            </div>
            <div className="offer-card offer-card--deep" onClick={() => navigate('/shop')}>
              <span className="offer-card__badge offer-card__badge--sand">5 min qty</span>
              <span className="offer-card__icon">🎨</span>
              <span className="offer-card__label">Art students</span>
              <span className="offer-card__sub">5 bags — no min spend</span>
            </div>
          </div>
          <div className="h5 hero-ctas">
            <Button variant="primary" onClick={() => navigate('/shop')}>Browse Catalogue</Button>
            <Button variant="neutral" onClick={() => navigate('/story')}>Our Impact</Button>
          </div>
          <div className="hero-scroll-hint">
            <div className="hero-scroll-hint__line" />
            <span className="hero-scroll-hint__label">Scroll</span>
          </div>
        </div>
        <div className="hero-img-wrap">
          <img src={heroImg} alt="Panchajanya artisans wearing handmade kaftans and carrying canvas bag" loading="lazy" width={900} height={1100} className="hero-img" />
        </div>

        {/* ── MANIFESTO + STATS strip inside hero ── */}
        <div style={{ gridColumn: '1 / -1', backgroundColor: C.fog, borderTop: `1px solid rgba(117,24,40,0.1)`, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'stretch' }}>
          <div style={{ position: 'absolute', right: '3rem', top: '50%', transform: 'translateY(-50%)', width: '140px', height: '140px', borderRadius: '50%', overflow: 'hidden', opacity: 0.06, pointerEvents: 'none' }}>
            <img src={logoImg} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ flex: 1, padding: '2.25rem 5.5rem', borderRight: `1px solid rgba(117,24,40,0.1)`, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ width: '2rem', height: '1px', backgroundColor: C.maroon, marginBottom: '1.25rem', opacity: 0.4 }} />
            <p style={{ fontFamily: D, fontStyle: 'italic', fontSize: 'clamp(1.1rem, 1.8vw, 1.7rem)', fontWeight: 300, lineHeight: 1.15, color: C.maroon, letterSpacing: '-0.03em', margin: '0 0 0.75rem', maxWidth: '24ch' }}>
              "Every purchase trains a woman artisan."
            </p>
            <p style={{ fontFamily: B, fontSize: '0.78rem', letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.4, margin: 0 }}>
              Panchajanya · Social Impact Promise
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'stretch' }}>
            {[['14', 'Bag designs'], ['100%', 'Women-made'], ['Free', 'Training'], ['35+', 'Products']].map(([val, lbl], i) => (
              <div key={val} style={{ padding: '2.25rem 2rem', borderLeft: `1px solid rgba(117,24,40,0.08)`, display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: '110px' }}>
                <span style={{ fontFamily: D, fontStyle: 'italic', fontSize: '1.4rem', color: C.maroon, lineHeight: 1 }}>{val}</span>
                <span style={{ fontFamily: B, fontSize: '0.78rem', opacity: 0.5, marginTop: '0.2rem', letterSpacing: '0.04em' }}>{lbl}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── PRODUCT CAROUSEL ── */}
      <div role="region" className="carousel-wrap" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
        <div className="carousel-header">
          <div>
            <p className="carousel-eyebrow">Our Collection</p>
            <h2 className="carousel-heading">Handmade, one at a time.</h2>
          </div>
          <div className="carousel-controls">
            <button className="carousel-btn" onClick={prevSlide} aria-label="Previous">&#8592;</button>
            <div className="carousel-dots">
              {Array.from({ length: totalSlides }).map((_, i) => (
                <button key={i} className={`carousel-dot${slide === i ? ' carousel-dot--active' : ''}`} onClick={() => setSlide(i)} aria-label={`Go to slide ${i + 1}`} />
              ))}
            </div>
            <button className="carousel-btn" onClick={nextSlide} aria-label="Next">&#8594;</button>
          </div>
        </div>
        <div className="carousel-track-outer">
          <div className="carousel-track" style={{ transform: `translateX(-${slide * 100}%)` }}>
            {Array.from({ length: totalSlides }).map((_, si) => (
              <div key={si} className="carousel-page">
                {products.slice(si * SLIDES_PER_VIEW, si * SLIDES_PER_VIEW + SLIDES_PER_VIEW).map(p => (
                  <div key={p.id} className="carousel-card" onClick={() => navigate('/shop')}>
                    <div className="carousel-card__img-wrap" style={{ position: 'relative', overflow: 'hidden', height: '340px', backgroundColor: p.accent || '#751828' }}>
                      <img
                        src={resolveProductImageUrl(p.front_image || p.front)}
                        alt={p.name}
                        loading="lazy"
                        width={320}
                        height={400}
                        className="carousel-card__img absolute inset-0 w-full h-full object-cover"
                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1 }}
                        onError={(e) => {
                          const target = e.currentTarget
                          if (!target.dataset.fallbackTried) {
                            target.dataset.fallbackTried = '1'
                            const frontSrc = p.front_image || p.front || '1bag.png'
                            const filename = frontSrc.split('/').pop() || '1bag.png'
                            target.src = resolveProductImageUrl(filename)
                          } else if (target.dataset.fallbackTried === '1') {
                            target.dataset.fallbackTried = '2'
                            target.src = resolveProductImageUrl('1bag.png')
                          }
                        }}
                      />
                      {p.tag && <span className="carousel-card__tag" style={{ zIndex: 2 }}>{p.tag}</span>}
                    </div>
                    <div className="carousel-card__info">
                      <p className="carousel-card__name">{p.name}</p>
                      <p className="carousel-card__price">{p.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="carousel-progress">
          <div className="carousel-progress__bar" style={{ width: `${((slide + 1) / totalSlides) * 100}%`, transition: paused ? 'none' : 'width 3.5s linear' }} />
        </div>
      </div>

      {/* ── MARQUEE ── */}
      <div style={{ backgroundColor: C.maroon, color: C.parchment, padding: '0.85rem 0', overflow: 'hidden', whiteSpace: 'nowrap' }}>
        <div style={{ display: 'inline-flex', animation: 'marquee 30s linear infinite', willChange: 'transform' }}>
          {[0, 1].map(i => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center' }}>
              {['Handmade by Women', 'Free Artisan Training · Sonarpur', '14 Bag Designs', 'Canvas · Kaftans · Decor', 'Bulk Pricing Available', 'Art Student Supplier', 'No Middle-men', 'Kolkata Made'].map(t => (
                <span key={t} style={{ display: 'inline-flex', alignItems: 'center', padding: '0 2rem' }}>
                  <span style={{ fontFamily: D, fontSize: '0.85rem', fontStyle: 'italic', letterSpacing: '0.02em' }}>{t}</span>
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: C.sand, display: 'inline-block', marginLeft: '2rem', flexShrink: 0 }} />
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ── BENEFITS BAR ── */}
      <div role="region" className="benefits-bar">
        {[
          { icon: '🚚', title: 'Free Delivery', sub: 'On all bundles & orders above ₹900' },
          { icon: '🌿', title: 'Zero Waste', sub: 'Recycled kraft packaging, no plastic' },
          { icon: '↩', title: 'Easy Returns', sub: '7-day no-questions return policy' },
        ].map(({ icon, title, sub }, i) => (
          <div key={title} className={`benefits-bar__item${i < 2 ? ' benefits-bar__item--border' : ''}`}>
            <span className="benefits-bar__icon">{icon}</span>
            <div>
              <p className="benefits-bar__title">{title}</p>
              <p className="benefits-bar__sub">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── PILLARS ── */}
      <div role="region" className="mob-section-lg" style={{ padding: '7rem 5rem', backgroundColor: C.parchment }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'end', marginBottom: '3rem' }}>
          <div>
            <p style={{ fontFamily: B, fontSize: '0.8rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: C.maroonMid, marginBottom: '1rem' }}>Why Panchajanya</p>
            <h2 style={{ fontFamily: D, fontStyle: 'italic', fontSize: 'clamp(1.5rem, 2.5vw, 2.5rem)', fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.03em', margin: 0, color: C.maroon }}>
              More than a bag —<br />a livelihood.
            </h2>
          </div>
          <p style={{ fontFamily: B, fontSize: '1rem', lineHeight: 1.75, opacity: 0.62, maxWidth: '44ch', fontWeight: 300, alignSelf: 'end', paddingBottom: '0.25rem' }}>
            We run a free artisan training facility in Sonarpur for unemployed young women. When you buy from us, you fund that training directly.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0' }}>
          {PILLARS.map((p, i) => (
            <div key={p.num} style={{ position: 'relative', overflow: 'hidden', borderLeft: i > 0 ? `1px solid rgba(117,24,40,0.12)` : 'none', padding: '2.5rem 2rem 2rem' }}>
              <span style={{ position: 'absolute', top: '-1.5rem', left: '-0.75rem', fontFamily: D, fontSize: '13rem', fontWeight: 500, color: C.maroon, opacity: 0.04, lineHeight: 1, userSelect: 'none', pointerEvents: 'none' }}>{p.num}</span>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <span style={{ fontFamily: B, fontSize: '0.78rem', letterSpacing: '0.18em', color: C.maroonMid, textTransform: 'uppercase' }}>{p.num}</span>
                <h3 style={{ fontFamily: D, fontStyle: 'italic', fontSize: '1.3rem', fontWeight: 400, margin: '0.75rem 0 1rem', color: C.maroon }}>{p.title}</h3>
                <p style={{ fontFamily: B, fontSize: '0.9rem', lineHeight: 1.7, opacity: 0.65, fontWeight: 300 }}>{p.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── SOCIAL IMPACT SPLIT ── */}
      <div role="region" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '560px' }}>
        <div style={{ overflow: 'hidden', backgroundColor: C.sand }}>
          <img src={artisanImg} alt="Woman artisan at a sewing machine making canvas bags" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        </div>
        <div style={{ backgroundColor: C.maroonDeep, color: C.parchment, padding: '4rem 4.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <p style={{ fontFamily: B, fontSize: '1.25rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: C.sand, fontWeight: 700, marginBottom: '1.5rem', opacity: 1, lineHeight: 1.4 }}><strong>Our Impact · Sonarpur, South Kolkata</strong></p>
          <h2 style={{ fontFamily: D, fontStyle: 'italic', fontSize: 'clamp(1.5rem, 2.5vw, 2.5rem)', fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: '1.5rem' }}>
            A free training facility<br /><span style={{ color: C.sand }}>for women who make it.</span>
          </h2>
          <p style={{ fontFamily: B, fontSize: '0.95rem', lineHeight: 1.8, opacity: 0.68, fontWeight: 300, marginBottom: '2rem', maxWidth: '42ch' }}>
            Every woman who joins our programme starts with no prior craft experience. Within weeks, she is producing sellable goods. Training, tools, and workspace are all free.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0', borderTop: '1px solid rgba(242,232,208,0.12)', paddingTop: '1.75rem', marginBottom: '2rem' }}>
            {[['35+', 'Products'], ['100%', 'Women-made']].map(([stat, label], i) => (
              <div key={stat} style={{ borderLeft: i > 0 ? '1px solid rgba(242,232,208,0.1)' : 'none', paddingLeft: i > 0 ? '1.25rem' : 0 }}>
                <span style={{ fontFamily: D, fontStyle: 'italic', fontSize: '1.5rem', color: C.sand, display: 'block', lineHeight: 1 }}>{stat}</span>
                <span style={{ fontFamily: B, fontSize: '0.8rem', opacity: 0.55, marginTop: '0.25rem', display: 'block' }}>{label}</span>
              </div>
            ))}
          </div>
          <Link to="/story" style={{ display: 'inline-block', fontFamily: B, fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: C.sand, textDecoration: 'none', borderBottom: `1px solid rgba(212,187,138,0.4)`, paddingBottom: '2px', alignSelf: 'flex-start' }}>
            Read Our Full Story →
          </Link>
        </div>
      </div>

      {/* ── MODEL EDITORIAL ── */}
      <div role="region" style={{ display: 'grid', gridTemplateColumns: '50% 50%', minHeight: '680px', backgroundColor: C.parchment }}>
        <div style={{ position: 'relative', overflow: 'hidden', backgroundColor: C.sand }}>
          <img
            src={kalamkariSling}
            alt="Kalamkari Sling bag — hand block-printed kalamkari paisley flap on black canvas"
            loading="lazy"
            width={900}
            height={640}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          <div style={{ position: 'absolute', bottom: '2.5rem', left: '2.5rem', backgroundColor: C.parchment, padding: '1rem 1.5rem', maxWidth: '220px' }}>
            <p style={{ fontFamily: B, fontSize: '0.78rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: C.maroonMid, marginBottom: '0.35rem' }}>Featured · Slings</p>
            <p style={{ fontFamily: D, fontStyle: 'italic', fontSize: '1.15rem', color: C.maroon, margin: '0 0 0.25rem', fontWeight: 400 }}>Kalamkari Sling</p>
            <p style={{ fontFamily: B, fontSize: '0.88rem', fontWeight: 600, color: C.maroonDeep }}>₹550</p>
          </div>
        </div>
        <div style={{ backgroundColor: C.maroonDeep, color: C.parchment, padding: '4.5rem 4rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <p style={{ fontFamily: B, fontSize: '0.8rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: C.sand, opacity: 0.75, marginBottom: '1.5rem' }}>Carry with intention</p>
          <h2 style={{ fontFamily: D, fontStyle: 'italic', fontSize: 'clamp(1.5rem, 2.5vw, 2.5rem)', fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: '1.5rem' }}>
            A bag made by hand<br /><span style={{ color: C.sand }}>carries more than things.</span>
          </h2>
          <p style={{ fontFamily: B, fontSize: '0.95rem', lineHeight: 1.8, opacity: 0.62, fontWeight: 300, maxWidth: '38ch', marginBottom: '2.5rem' }}>
            Every sling, tote, and saddle bag leaves our Sonarpur workshop with a name behind it — a woman who trained, made, and takes pride in what she creates.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', backgroundColor: 'rgba(242,232,208,0.1)', marginBottom: '2.5rem' }}>
            {[
              ['12 oz', 'Natural canvas'],
              ['Brass', 'Hardware fittings'],
              ['Hand-stitched', 'Every seam'],
              ['100%', 'Women-made'],
            ].map(([val, lbl]) => (
              <div key={val} style={{ backgroundColor: C.maroonDeep, padding: '1rem 1.25rem' }}>
                <span style={{ fontFamily: D, fontStyle: 'italic', fontSize: '1.15rem', color: C.sand, display: 'block', lineHeight: 1 }}>{val}</span>
                <span style={{ fontFamily: B, fontSize: '0.8rem', opacity: 0.55, marginTop: '0.2rem', display: 'block' }}>{lbl}</span>
              </div>
            ))}
          </div>
          <button
            className="site-nav__cta"
            onClick={() => navigate('/shop')}
            style={{ alignSelf: 'flex-start', fontFamily: B, fontSize: '0.78rem', letterSpacing: '0.1em', textTransform: 'uppercase', backgroundColor: C.parchment, color: C.maroonDeep, padding: '0.85rem 2rem', border: 'none', cursor: 'pointer' }}
          >
            Shop Sling Bags →
          </button>
        </div>
      </div>

      {/* ── CATEGORIES ── */}
      <div role="region" className="dot-grid mob-section-lg" style={{ padding: '7rem 5rem', backgroundColor: C.fog, position: 'relative' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <p style={{ fontFamily: B, fontSize: '0.8rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: C.maroonMid, marginBottom: '0.75rem' }}>Our Collections</p>
          <h2 style={{ fontFamily: D, fontStyle: 'italic', fontSize: 'clamp(1.5rem, 2.5vw, 2.5rem)', fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.03em', color: C.maroon, margin: 0 }}>
            Canvas bags, kaftans,<br />and things for the home.
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: 'auto auto', gap: '1.25rem' }}>
          {[CATEGORIES[0], CATEGORIES[1]].map((cat, ci) => (
            <article key={cat.title} style={{ backgroundColor: C.parchment, overflow: 'hidden', display: 'flex', flexDirection: 'column', borderTop: `3px solid ${cat.tone}` }}>
              <div style={{ overflow: 'hidden', backgroundColor: C.sand }}>
                <img src={ci === 0 ? cat0Img : cat1Img} alt={cat.title} loading="lazy" width={700} height={220} className="img-zoom" style={{ width: '100%', height: '220px', objectFit: 'cover', objectPosition: 'center top', display: 'block', backgroundColor: C.sand }} />
              </div>
              <div style={{ padding: '1.5rem' }}>
                <h3 style={{ fontFamily: D, fontStyle: 'italic', fontSize: '1.75rem', fontWeight: 400, color: cat.tone, margin: '0 0 0.75rem' }}>{cat.title}</h3>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, fontFamily: B, fontSize: '0.82rem', display: 'flex', flexWrap: 'wrap', gap: '0.35rem 1.1rem', opacity: 0.6 }}>
                  {cat.items.map(item => <li key={item}>— {item}</li>)}
                </ul>
              </div>
            </article>
          ))}
          <article style={{ gridColumn: '1 / -1', backgroundColor: C.parchment, overflow: 'hidden', borderTop: `3px solid ${CATEGORIES[2].tone}`, display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
            <div style={{ overflow: 'hidden', backgroundColor: C.sand }}>
              <img src={homeDecorImg} alt="Home decor" loading="lazy" width={700} height={190} className="img-zoom" style={{ width: '100%', height: '190px', objectFit: 'cover', objectPosition: 'center top', display: 'block' }} />
            </div>
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <h3 style={{ fontFamily: D, fontStyle: 'italic', fontSize: '1.75rem', fontWeight: 400, color: CATEGORIES[2].tone, margin: '0 0 0.75rem' }}>{CATEGORIES[2].title}</h3>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, fontFamily: B, fontSize: '0.82rem', display: 'flex', flexWrap: 'wrap', gap: '0.35rem 1.1rem', opacity: 0.6 }}>
                {CATEGORIES[2].items.map(item => <li key={item}>— {item}</li>)}
              </ul>
            </div>
          </article>
        </div>
      </div>

      {/* ── SHOP BENTO ── */}
      <div role="region" className="mob-section-lg" style={{ padding: '7rem 5rem', backgroundColor: C.parchment }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
          <div>
            <p style={{ fontFamily: B, fontSize: '0.8rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: C.maroonMid, marginBottom: '0.5rem' }}>Hover to preview · click for details</p>
            <h2 style={{ fontFamily: D, fontStyle: 'italic', fontSize: 'clamp(1.5rem, 2.5vw, 2.5rem)', fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.03em', color: C.maroon, margin: 0 }}>
              Every piece, a small act of intention.
            </h2>
          </div>
          <Link to="/shop" style={{ fontFamily: B, fontSize: '0.78rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: C.maroon, textDecoration: 'none', borderBottom: `1px solid ${C.maroon}`, paddingBottom: '2px', opacity: 0.6, flexShrink: 0 }}>
            All {products.length > 0 ? products.length : '14'} designs →
          </Link>
        </div>
        <div className="shop-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: '460px 460px', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <ProdFlipCard product={products[4] || products[0]} style={{ gridArea: '1 / 1 / 3 / 3' }} />
          <ProdFlipCard product={products[0]} style={{ gridArea: '1 / 3 / 2 / 4' }} />
          <ProdFlipCard product={products[14] || products[1]} style={{ gridArea: '2 / 3 / 3 / 4' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '1.5rem' }}>
          {[products[2], products[15], products[21], products[22]].filter(Boolean).map(product => (
            <ProdFlipCard key={product.id} product={product} style={{ height: '380px' }} />
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
          {[products[3], products[9], products[5]].filter(Boolean).map(product => (
            <ProdFlipCard key={product.id} product={product} style={{ height: '340px' }} />
          ))}
        </div>
      </div>

      {/* ── BUNDLE & SAVE ── */}
      <div role="region" className="mob-section-lg" style={{ padding: '7rem 5rem', backgroundColor: C.maroon, color: C.parchment, position: 'relative', overflow: 'hidden' }}>
        <span style={{ position: 'absolute', right: '-2rem', bottom: '-3rem', fontFamily: D, fontSize: '18rem', fontStyle: 'italic', fontWeight: 500, color: C.parchment, opacity: 0.04, lineHeight: 1, userSelect: 'none', pointerEvents: 'none', whiteSpace: 'nowrap' }}>Bundle</span>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'end', marginBottom: '2.5rem' }}>
            <div>
              <p style={{ fontFamily: B, fontSize: '0.8rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: C.sand, opacity: 0.85, marginBottom: '1rem' }}>Beat the Delivery Cost</p>
              <h2 style={{ fontFamily: D, fontStyle: 'italic', fontSize: 'clamp(1.5rem, 2.5vw, 2.5rem)', fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.03em', margin: 0 }}>
                Bundle and save —<br /><span style={{ color: C.sand }}>free delivery included.</span>
              </h2>
            </div>
            <p style={{ fontFamily: B, fontSize: '0.925rem', lineHeight: 1.75, opacity: 0.65, fontWeight: 300, maxWidth: '42ch', alignSelf: 'end' }}>
              Single-item delivery can exceed the product price. Our bundles solve that — better value, more artisan impact.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', backgroundColor: 'rgba(242,232,208,0.1)' }}>
            {BUNDLES.map((bundle, i) => (
              <div key={bundle.name} className="bundle-card" style={{ backgroundColor: C.maroon, padding: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', cursor: 'pointer' }}>
                <span style={{ fontFamily: B, fontSize: '0.78rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: C.sand, opacity: 0.75 }}>Bundle 0{i + 1}</span>
                <h3 style={{ fontFamily: D, fontStyle: 'italic', fontSize: '1.3rem', fontWeight: 400, margin: 0 }}>{bundle.name}</h3>
                <p style={{ fontFamily: B, fontSize: '0.9rem', opacity: 0.65, fontWeight: 300 }}>{bundle.items}</p>
                <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid rgba(242,232,208,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontFamily: D, fontStyle: 'italic', fontSize: '1.5rem', color: C.sand }}>{bundle.price}</span>
                  <span style={{ fontFamily: B, fontSize: '0.8rem', color: C.sand, opacity: 0.75 }}>{bundle.saving}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── TESTIMONIALS ── */}
      <div role="region" className="mob-section-lg" style={{ padding: '7rem 5rem', backgroundColor: C.fog }}>
        <p style={{ fontFamily: B, fontSize: '0.8rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: C.maroonMid, marginBottom: '3rem' }}>From Our Customers</p>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '2.5rem', alignItems: 'start' }}>
          <div style={{ borderTop: `3px solid ${C.maroon}`, paddingTop: '2rem' }}>
            <p style={{ fontFamily: D, fontStyle: 'italic', fontSize: 'clamp(1rem, 1.6vw, 1.35rem)', lineHeight: 1.55, color: C.maroon, letterSpacing: '-0.01em', marginBottom: '1.5rem' }}>
              "I ordered a tote from their Instagram story and it arrived in two days. The quality shocked me — and knowing it was made by women in Sonarpur made it feel worth every rupee."
            </p>
            <p style={{ fontFamily: B, fontSize: '0.82rem', fontWeight: 600, color: C.maroonDeep }}>Priya D.</p>
            <p style={{ fontFamily: B, fontSize: '0.78rem', opacity: 0.45 }}>New Town, Kolkata</p>
          </div>
          {[
            { quote: "Ordered the bundle for my office team. The packaging was beautiful, the price was fair. Already placing a second order.", name: 'Rohan M.', loc: 'Salt Lake · Corporate Order' },
            { quote: "Bought 10 unprinted totes for a college project. Canvas quality is excellent and the turnaround was faster than expected.", name: 'Anusha S.', loc: 'Jadavpur · Art Student' },
          ].map((t, i) => (
            <div key={i} style={{ borderTop: `2px solid rgba(117,24,40,0.25)`, paddingTop: '2rem' }}>
              <p style={{ fontFamily: D, fontStyle: 'italic', fontSize: '1rem', lineHeight: 1.65, color: C.maroonDeep, marginBottom: '1.25rem', opacity: 0.85 }}>"{t.quote}"</p>
              <p style={{ fontFamily: B, fontSize: '0.88rem', fontWeight: 500 }}>{t.name}</p>
              <p style={{ fontFamily: B, fontSize: '0.8rem', opacity: 0.5 }}>{t.loc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA ── */}
      <div role="region" style={{ position: 'relative', overflow: 'hidden', clipPath: 'polygon(0 48px, 100% 0, 100% 100%, 0 100%)', backgroundColor: C.maroonMid, minHeight: '420px', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <img src="https://images.unsplash.com/photo-1663573690125-d326a87a2535?w=1400&h=420&fit=crop&auto=format" alt="Handmade canvas bag" loading="lazy" width={1400} height={420} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.18 }} />
        <div style={{ position: 'relative', zIndex: 1, padding: '6rem 2rem 5rem' }}>
          <p style={{ fontFamily: B, fontSize: '0.8rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(242,232,208,0.5)', marginBottom: '1.25rem' }}>Shop · Bundle · Share the story</p>
          <h2 style={{ fontFamily: D, fontStyle: 'italic', fontSize: 'clamp(1.75rem, 3.2vw, 3rem)', fontWeight: 400, color: C.parchment, lineHeight: 1.0, letterSpacing: '-0.03em', marginBottom: '2.5rem' }}>
            Every purchase<br />trains a woman.
          </h2>
          <Link to="/shop" style={{ fontFamily: B, fontSize: '0.8rem', letterSpacing: '0.12em', textTransform: 'uppercase', backgroundColor: C.parchment, color: C.maroon, padding: '1rem 2.75rem', textDecoration: 'none', display: 'inline-block' }}>
            Shop the Collection
          </Link>
        </div>
      </div>
    </>
  )
}
