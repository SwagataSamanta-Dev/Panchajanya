import { useState } from 'react'
import { Link } from 'react-router'
import { C, D, B, BUNDLES } from '@/data'
import { useCart, type Size } from '@/CartContext'
import { useSaved } from '@/SavedContext'
import { useProducts, resolveProductImageUrl } from '@/ProductContext'
import type { Product } from '@/types'

function isBag(p: Product): boolean {
  if (p.category_id === 1) return true
  const cat = (p.category_name || p.category || '').toLowerCase()
  return cat.includes('bag') || cat.includes('sling') || cat.includes('tote') || cat.includes('saddle') || p.id <= 14
}

function isApparel(p: Product): boolean {
  if (p.category_id === 2) return true
  const cat = (p.category_name || p.category || '').toLowerCase()
  return cat.includes('kaftan') || cat.includes('apparel') || cat.includes('shrug') || cat.includes('jacket') || (p.id >= 15 && p.id <= 22)
}

function isDecor(p: Product): boolean {
  if (p.category_id === 3) return true
  const cat = (p.category_name || p.category || '').toLowerCase()
  return cat.includes('decor') || cat.includes('cushion') || cat.includes('runner') || cat.includes('home') || p.id >= 23
}

function isLifestyleImg(url: string | null | undefined): boolean {
  if (!url) return false
  const lower = url.toLowerCase()
  return lower.includes('lifestyle') || lower.includes('owner') || lower.includes('duo')
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? C.maroon : 'none'} stroke={C.maroon} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', transition: 'transform 0.18s', transform: filled ? 'scale(1.15)' : 'scale(1)' }}>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  )
}

function ShopCard({ product, tall }: {
  product: Product; tall?: boolean
}) {
  const { add, items } = useCart()
  const { isSaved, toggle } = useSaved()
  const [size, setSize] = useState<Size>('M')
  const [added, setAdded] = useState(false)
  const saved = isSaved(product.id)
  const inCart = items.some(i => i.product.id === product.id && i.size === size)
  const onAdd = () => { add(product, size); setAdded(true); setTimeout(() => setAdded(false), 1200) }

  const frontImg = resolveProductImageUrl(product.front_image || product.front)
  const backImg = (product.back_image || product.back) ? resolveProductImageUrl(product.back_image || product.back) : null
  const isLifestyle = isLifestyleImg(backImg)

  return (
    <article style={{ display: 'flex', flexDirection: 'column', backgroundColor: product.accent || '#751828' }}>
      <div className="flip-wrap" style={{ position: 'relative', height: tall ? '520px' : '400px', overflow: 'hidden', flexShrink: 0, cursor: 'pointer' }}>
        <div className="flip-inner" style={{ width: '100%', height: '100%', position: 'relative' }}>
          <div className="flip-face">
            <img
              src={frontImg}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => {
                const target = e.currentTarget
                if (!target.dataset.fallbackTried) {
                  target.dataset.fallbackTried = '1'
                  const filename = frontImg.split('/').pop() || '1bag.png'
                  target.src = resolveProductImageUrl(filename)
                } else if (target.dataset.fallbackTried === '1') {
                  target.dataset.fallbackTried = '2'
                  target.src = resolveProductImageUrl('1bag.png')
                }
              }}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block', zIndex: 1 }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 45%)', pointerEvents: 'none', zIndex: 2 }} />
            {backImg && (
              <span style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', fontFamily: B, fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(242,232,208,0.92)', background: 'rgba(0,0,0,0.45)', padding: '3px 7px', borderRadius: '2px', backdropFilter: 'blur(2px)', zIndex: 3 }}>
                {isLifestyle ? '✦ Lifestyle View' : '↻ Detail View'}
              </span>
            )}
          </div>
          {backImg && (
            <div className="flip-face flip-back">
              <img
                src={backImg}
                alt={`${product.name} back`}
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => {
                  const target = e.currentTarget
                  if (!target.dataset.fallbackTried) {
                    target.dataset.fallbackTried = '1'
                    const filename = backImg.split('/').pop() || '1bag.png'
                    target.src = resolveProductImageUrl(filename)
                  } else if (target.dataset.fallbackTried === '1') {
                    target.dataset.fallbackTried = '2'
                    target.src = frontImg
                  }
                }}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block', zIndex: 1 }}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)', pointerEvents: 'none', zIndex: 2 }} />
              <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', right: '1rem', zIndex: 3 }}>
                <p style={{ fontFamily: D, fontStyle: 'italic', fontSize: '0.95rem', color: C.parchment, opacity: 0.95, margin: 0 }}>
                  {isLifestyle ? 'Owner & Artisan Lifestyle View' : 'Back view · handcrafted detailing'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Metadata */}
      <div style={{ padding: '1.25rem 1.5rem 1.5rem', backgroundColor: C.parchment, flex: 1, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          {product.tag && (
            <span style={{ fontFamily: B, fontSize: '0.6rem', letterSpacing: '0.14em', textTransform: 'uppercase', backgroundColor: C.maroon, color: C.parchment, padding: '0.2rem 0.5rem' }}>{product.tag}</span>
          )}
          <span style={{ fontFamily: D, fontStyle: 'italic', fontSize: '1.1rem', color: C.maroon, fontWeight: 400, marginLeft: 'auto' }}>{product.price}</span>
        </div>
        <h3 style={{ fontFamily: D, fontStyle: 'italic', fontSize: '1.2rem', fontWeight: 400, color: C.maroonDeep, margin: 0 }}>{product.name}</h3>
        <p style={{ fontFamily: B, fontSize: '0.78rem', lineHeight: 1.6, opacity: 0.55, fontWeight: 300, margin: 0 }}>{product.desc || product.description}</p>

        {/* Size + save row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
          <span style={{ fontFamily: B, fontSize: '0.62rem', letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.4, color: C.maroonDeep }}>Size</span>
          {(['M', 'L'] as Size[]).map(s => (
            <button key={s} onClick={() => setSize(s)}
              style={{ width: '30px', height: '26px', fontFamily: B, fontSize: '0.72rem', fontWeight: 600, border: `1.5px solid ${size === s ? C.maroon : 'rgba(117,24,40,0.2)'}`, backgroundColor: size === s ? C.maroon : 'transparent', color: size === s ? C.parchment : C.maroonDeep, cursor: 'pointer', transition: 'all 0.12s' }}>
              {s}
            </button>
          ))}
          <div style={{ flex: 1 }} />
          <button onClick={() => toggle(product.id)} title={saved ? 'Saved' : 'Save'}
            style={{ width: '30px', height: '30px', border: `1px solid rgba(117,24,40,0.25)`, backgroundColor: saved ? 'rgba(117,24,40,0.06)' : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.18s', flexShrink: 0 }}>
            <HeartIcon filled={saved} />
          </button>
        </div>

        {/* Add to bag */}
        <button onClick={onAdd} style={{ marginTop: '0.75rem', fontFamily: B, fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', border: `1px solid rgba(117,24,40,0.3)`, background: added ? C.maroon : 'transparent', color: added ? C.parchment : C.maroon, padding: '0.7rem 1rem', cursor: 'pointer', width: '100%', transition: 'all 0.2s' }}>
          {added ? '✓ Added' : inCart ? '+ Add Again' : 'Add to Bag'}
        </button>
      </div>
    </article>
  )
}

function ShopSkeleton() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '1.5rem' }}>
      {[1, 2, 3, 4, 5, 6].map(n => (
        <div key={n} style={{ backgroundColor: '#e9dfc6', height: '480px', borderRadius: '2px', opacity: 0.7, animation: 'pulse 1.5s infinite' }} />
      ))}
    </div>
  )
}

export default function Shop() {
  const { products: allProducts, loading, error, refresh } = useProducts()
  const [filter, setFilter] = useState<'all' | 'bags' | 'apparel' | 'decor'>('all')

  const bagsList = allProducts.filter(isBag)
  const apparelList = allProducts.filter(isApparel)
  const decorList = allProducts.filter(isDecor)

  const products = filter === 'bags'
    ? bagsList
    : filter === 'apparel'
      ? apparelList
      : filter === 'decor'
        ? decorList
        : allProducts

  const tabs = [
    { key: 'all' as const,     label: 'All Collections',     count: allProducts.length },
    { key: 'bags' as const,    label: 'Canvas Bags',         count: bagsList.length },
    { key: 'apparel' as const, label: 'Kaftans & Apparel',   count: apparelList.length },
    { key: 'decor' as const,   label: 'Home Decor & Cushions', count: decorList.length },
  ]

  const newProducts = allProducts.filter(p => p.tag === 'New')

  return (
    <>
      {/* PAGE HEADER */}
      <div style={{ paddingTop: '68px', backgroundColor: C.maroonDeep, color: C.parchment, position: 'relative', overflow: 'hidden' }}>
        <div style={{ padding: '4rem 5rem 0', position: 'relative', zIndex: 1 }}>
          <p style={{ fontFamily: B, fontSize: '0.7rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: C.sand, opacity: 0.6, marginBottom: '0.75rem' }}>
            <Link to="/" style={{ color: C.sand, textDecoration: 'none', opacity: 0.5 }}>Home</Link>
            <span style={{ opacity: 0.3, margin: '0 0.5rem' }}>→</span> Shop
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'end', paddingBottom: '3rem' }}>
            <div>
              <h1 style={{ fontFamily: D, fontStyle: 'italic', fontSize: 'clamp(2.75rem, 5vw, 4.5rem)', fontWeight: 400, lineHeight: 0.95, letterSpacing: '-0.03em', margin: '0 0 1.25rem' }}>
                The Full<br />Catalogue
              </h1>
              <p style={{ fontFamily: B, fontSize: '0.925rem', lineHeight: 1.75, opacity: 0.55, maxWidth: '42ch', fontWeight: 300 }}>
                {allProducts.length > 0 ? `${allProducts.length} pieces, all handmade.` : 'Handcrafted pieces from our Sonarpur studio.'} Hover any card to flip and preview owner lifestyle &amp; detail shots. Free delivery on orders above ₹900.
              </p>
            </div>
            {/* Inline stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0', borderLeft: '1px solid rgba(242,232,208,0.08)' }}>
              {[[allProducts.length > 0 ? `${allProducts.length}` : '24', 'Artisan Designs'], ['₹420', 'Starting from'], ['100%', 'Women-made']].map(([val, lbl], i) => (
                <div key={val} style={{ padding: '1.5rem 2rem', borderLeft: i > 0 ? '1px solid rgba(242,232,208,0.08)' : 'none', textAlign: 'center' }}>
                  <span style={{ fontFamily: D, fontStyle: 'italic', fontSize: '2rem', color: C.sand, display: 'block', lineHeight: 1 }}>{val}</span>
                  <span style={{ fontFamily: B, fontSize: '0.7rem', opacity: 0.4, display: 'block', marginTop: '0.3rem' }}>{lbl}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FILTER TABS */}
        <div className="shop-filter-bar" style={{ padding: '0 5rem', borderTop: '1px solid rgba(242,232,208,0.08)', display: 'flex', gap: '0', alignItems: 'stretch' }}>
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setFilter(tab.key)}
              style={{ fontFamily: B, fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '1rem 2rem', background: 'none', border: 'none', cursor: 'pointer', color: filter === tab.key ? C.sand : C.parchment, borderBottom: filter === tab.key ? `2px solid ${C.sand}` : '2px solid transparent', opacity: filter === tab.key ? 1 : 0.4, transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              {tab.label}
              <span style={{ fontFamily: B, fontSize: '0.6rem', backgroundColor: filter === tab.key ? C.sand : 'rgba(242,232,208,0.15)', color: filter === tab.key ? C.maroonDeep : C.parchment, padding: '0.15rem 0.4rem', borderRadius: '2px' }}>{tab.count}</span>
            </button>
          ))}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', paddingRight: '0.5rem' }}>
            <span style={{ fontFamily: B, fontSize: '0.68rem', opacity: 0.35, color: C.parchment }}>{products.length} items</span>
          </div>
        </div>
      </div>

      {/* FEATURED NEW ARRIVALS — top newest as banner if available */}
      {newProducts.length > 0 && (
        <div style={{ backgroundColor: C.fog, padding: '1.25rem 5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', borderBottom: `1px solid rgba(117,24,40,0.1)` }}>
          <span style={{ fontFamily: B, fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase', backgroundColor: C.maroon, color: C.parchment, padding: '0.3rem 0.6rem', flexShrink: 0 }}>New In</span>
          <div style={{ display: 'flex', gap: '2.5rem', overflow: 'hidden' }}>
            {newProducts.map(p => (
              <span key={p.id} style={{ fontFamily: D, fontStyle: 'italic', fontSize: '0.95rem', color: C.maroon, whiteSpace: 'nowrap', opacity: 0.8 }}>
                {p.name} <span style={{ fontFamily: B, fontStyle: 'normal', fontSize: '0.78rem', color: C.maroonMid }}>{p.price}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* PRODUCT GRID / STATES */}
      <div role="region" style={{ backgroundColor: C.parchment, padding: '4rem 5rem 7rem' }}>
        {/* Error Alert */}
        {error && (
          <div style={{ backgroundColor: '#fff2f2', border: '1px solid #e5a4a4', padding: '1.5rem 2rem', marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontFamily: B, fontSize: '0.88rem', fontWeight: 600, color: '#851b1b', margin: '0 0 0.25rem' }}>Notice: Connecting to live catalog</p>
              <p style={{ fontFamily: B, fontSize: '0.8rem', color: '#682020', margin: 0 }}>{error}</p>
            </div>
            <button onClick={() => refresh()} style={{ padding: '0.5rem 1.25rem', backgroundColor: C.maroon, color: C.parchment, border: 'none', cursor: 'pointer', fontFamily: B, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Retry
            </button>
          </div>
        )}

        {/* Loading Skeleton */}
        {loading && allProducts.length === 0 ? (
          <ShopSkeleton />
        ) : (
          <>
            {/* Featured pair — first 2 items large */}
            {filter === 'all' && products.length >= 2 && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                {products.slice(0, 2).map(p => (
                  <ShopCard key={p.id} product={p} tall />
                ))}
              </div>
            )}

            {/* Remaining in 3-col grid */}
            <div className="shop-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '1.5rem' }}>
              {(filter === 'all' && products.length >= 2 ? products.slice(2) : products).map((p) => (
                <ShopCard key={p.id} product={p} />
              ))}
            </div>

            {products.length === 0 && !loading && (
              <div style={{ textAlign: 'center', padding: '5rem 0' }}>
                <p style={{ fontFamily: D, fontStyle: 'italic', fontSize: '1.5rem', color: C.maroon, opacity: 0.6 }}>No products currently found in this category.</p>
              </div>
            )}
          </>
        )}

        {/* Editorial interjection */}
        <div style={{ backgroundColor: C.maroon, padding: '3rem 4rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center', marginTop: '2.5rem' }}>
          <p style={{ fontFamily: D, fontStyle: 'italic', fontSize: 'clamp(1.5rem, 2.5vw, 2.25rem)', color: C.parchment, lineHeight: 1.1, letterSpacing: '-0.02em', margin: 0 }}>
            "Every stitch is placed by a woman who learned it for free at our Sonarpur studio."
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ fontFamily: B, fontSize: '0.875rem', lineHeight: 1.75, opacity: 0.62, fontWeight: 300, color: C.parchment }}>
              We run a free craft training facility in Sonarpur, South 24 Parganas. Every piece you buy directly funds the next round of training.
            </p>
            <Link to="/story" style={{ display: 'inline-block', fontFamily: B, fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: C.sand, textDecoration: 'none', borderBottom: `1px solid rgba(212,187,138,0.4)`, paddingBottom: '2px', alignSelf: 'flex-start' }}>
              Read the full story →
            </Link>
          </div>
        </div>
      </div>

      {/* BUNDLE UPSELL — 3 col tight */}
      <div role="region" style={{ padding: '6rem 5rem', backgroundColor: C.maroonDeep, color: C.parchment }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
          <div>
            <p style={{ fontFamily: B, fontSize: '0.7rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: C.sand, opacity: 0.7, marginBottom: '0.5rem' }}>Save on shipping</p>
            <h2 style={{ fontFamily: D, fontStyle: 'italic', fontSize: 'clamp(1.75rem, 3vw, 2.75rem)', fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.03em', margin: 0 }}>Bundle deals with free delivery</h2>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', backgroundColor: 'rgba(242,232,208,0.08)' }}>
          {BUNDLES.map((bundle, i) => (
            <div key={bundle.name} style={{ backgroundColor: C.maroonDeep, padding: '2rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', transition: 'background 0.2s', cursor: 'pointer' }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.backgroundColor = C.maroon)}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.backgroundColor = C.maroonDeep)}>
              <span style={{ fontFamily: B, fontSize: '0.58rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: C.sand, opacity: 0.55 }}>Bundle 0{i + 1}</span>
              <h3 style={{ fontFamily: D, fontStyle: 'italic', fontSize: '1.4rem', fontWeight: 400, margin: 0 }}>{bundle.name}</h3>
              <p style={{ fontFamily: B, fontSize: '0.82rem', opacity: 0.5, fontWeight: 300, marginBottom: 'auto' }}>{bundle.items}</p>
              <div style={{ paddingTop: '1rem', borderTop: '1px solid rgba(242,232,208,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: D, fontStyle: 'italic', fontSize: '1.6rem', color: C.sand }}>{bundle.price}</span>
                <span style={{ fontFamily: B, fontSize: '0.68rem', color: C.sand, opacity: 0.55 }}>{bundle.saving}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* WHOLESALE CTA */}
      <div role="region" style={{ padding: '5rem 5rem', backgroundColor: C.fog, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `1px solid rgba(117,24,40,0.08)` }}>
        <div>
          <p style={{ fontFamily: B, fontSize: '0.7rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: C.maroonMid, marginBottom: '0.4rem' }}>Buying in bulk?</p>
          <h3 style={{ fontFamily: D, fontStyle: 'italic', fontSize: '1.75rem', fontWeight: 400, color: C.maroon, margin: 0 }}>Wholesale & B2B pricing available from 5 units.</h3>
        </div>
        <Link to="/wholesale" style={{ fontFamily: B, fontSize: '0.78rem', letterSpacing: '0.1em', textTransform: 'uppercase', backgroundColor: C.maroon, color: C.parchment, padding: '0.85rem 2rem', textDecoration: 'none', flexShrink: 0 }}>
          View Wholesale Pricing
        </Link>
      </div>
    </>
  )
}
