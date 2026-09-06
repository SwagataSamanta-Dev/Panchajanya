import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Button } from '@figma/astraui'
import { C, D, B } from '@/data'
import { useCart } from '@/CartContext'
import { resolveProductImageUrl } from '@/ProductContext'
import type { Product } from '@/types'

function ProductModal({ product, onClose }: {
  product: Product
  onClose: () => void
}) {
  const { add, items } = useCart()
  const [activeTab, setActiveTab] = useState<'front' | 'back'>('front')
  if (!product) return null

  const inCart = items.some(i => i.product.id === product.id)
  const [added, setAdded] = useState(false)
  const onAdd = () => { add(product); setAdded(true); setTimeout(() => setAdded(false), 1200) }

  const frontImg = resolveProductImageUrl(product.front_image || product.front)
  const backImg = (product.back_image || product.back) ? resolveProductImageUrl(product.back_image || product.back) : null
  const currentImg = (activeTab === 'back' && backImg) ? backImg : frontImg
  const isLifestyle = backImg && (backImg.includes('lifestyle') || backImg.includes('owner') || backImg.includes('duo'))

  return createPortal(
    <div className="prod-modal-backdrop" onClick={onClose}>
      <div className="prod-modal" onClick={e => e.stopPropagation()}>
        <button className="prod-modal__close" onClick={onClose} aria-label="Close">✕</button>
        <div className="prod-modal__img-col" style={{ position: 'relative' }}>
          <img
            src={currentImg}
            alt={product.name}
            className="prod-modal__img"
            onError={(e) => {
              const target = e.currentTarget
              if (!target.dataset.fallbackTried) {
                target.dataset.fallbackTried = '1'
                const filename = currentImg.split('/').pop() || '1bag.png'
                target.src = resolveProductImageUrl(filename)
              } else if (target.dataset.fallbackTried === '1') {
                target.dataset.fallbackTried = '2'
                target.src = resolveProductImageUrl('1bag.png')
              }
            }}
          />
          {backImg && (
            <div style={{ position: 'absolute', bottom: '1rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '0.4rem', background: 'rgba(0,0,0,0.65)', padding: '4px 8px', borderRadius: '20px', zIndex: 2 }}>
              <button
                onClick={() => setActiveTab('front')}
                style={{ background: activeTab === 'front' ? C.parchment : 'transparent', color: activeTab === 'front' ? C.maroonDeep : C.parchment, border: 'none', borderRadius: '12px', padding: '4px 10px', fontSize: '0.68rem', fontFamily: B, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
              >
                Studio View
              </button>
              <button
                onClick={() => setActiveTab('back')}
                style={{ background: activeTab === 'back' ? C.sand : 'transparent', color: activeTab === 'back' ? C.maroonDeep : C.parchment, border: 'none', borderRadius: '12px', padding: '4px 10px', fontSize: '0.68rem', fontFamily: B, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
              >
                {isLifestyle ? '✦ Lifestyle View' : 'Detail View'}
              </button>
            </div>
          )}
        </div>
        <div className="prod-modal__info-col">
          {product.tag && <span className="prod-modal__tag">{product.tag}</span>}
          <h2 className="prod-modal__name">{product.name}</h2>
          <p className="prod-modal__price">{product.price}</p>
          <div className="prod-modal__divider" />
          <p className="prod-modal__desc">{product.desc || product.description}</p>
          <div className="prod-modal__specs">
            {[
              ['Category', product.category_name || product.category || 'Handmade'],
              ['Craft', 'Hand block-print & Kantha folk stitch'],
              ['Origin', 'Artisan Studio, Sonarpur, Kolkata'],
              ['Fulfillment', 'Shiprocket Express · 24-48h dispatch'],
            ].map(([label, val]) => (
              <div key={label} className="prod-modal__spec">
                <p className="prod-modal__spec-label">{label}</p>
                <p className="prod-modal__spec-val">{val}</p>
              </div>
            ))}
          </div>
          <div className="prod-modal__actions">
            <Button variant={added ? 'neutral' : 'primary'} onClick={onAdd}>
              {added ? '✓ Added to Bag' : inCart ? 'Add Again' : 'Add to Bag'}
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

export function ProdOverlay({ product }: { product?: Product | null }) {
  const [open, setOpen] = useState(false)
  if (!product) return null

  return (
    <>
      {product.tag && (
        <span style={{ position: 'absolute', top: '1rem', left: '1rem', fontFamily: B, fontSize: '0.62rem', letterSpacing: '0.12em', textTransform: 'uppercase', backgroundColor: C.parchment, color: C.maroon, padding: '0.25rem 0.6rem' }}>
          {product.tag}
        </span>
      )}
      <div className="flip-info-overlay">
        <p className="flip-info-overlay__desc">{product.desc || product.description}</p>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <span style={{ fontFamily: D, fontStyle: 'italic', fontSize: '1.3rem', color: C.sand }}>{product.price}</span>
        </div>
        <button className="flip-info-overlay__cta" onClick={e => { e.stopPropagation(); setOpen(true) }}>
          View Details →
        </button>
      </div>
      {open && <ProductModal product={product} onClose={() => setOpen(false)} />}
    </>
  )
}

export function ProdFlipCard({ product, style }: {
  product?: Product | null
  style?: React.CSSProperties
}) {
  const [open, setOpen] = useState(false)
  if (!product) {
    return (
      <div style={{ ...style, backgroundColor: '#ece5d4', borderRadius: '2px', opacity: 0.6 }} />
    )
  }

  const bgAccent = product.accent || '#751828'
  const frontImg = resolveProductImageUrl(product.front_image || product.front)
  const backImg = (product.back_image || product.back) ? resolveProductImageUrl(product.back_image || product.back) : null
  const isLifestyle = backImg && (backImg.includes('lifestyle') || backImg.includes('owner') || backImg.includes('duo'))

  return (
    <>
      <div
        className="flip-wrap"
        style={{ ...style, cursor: 'pointer', position: 'relative', overflow: 'hidden', backgroundColor: bgAccent }}
      >
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
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(61,12,23,0.55) 0%, transparent 55%)', pointerEvents: 'none', zIndex: 2 }} />
            {product.tag && (
              <span style={{ position: 'absolute', top: '1rem', left: '1rem', fontFamily: B, fontSize: '0.62rem', letterSpacing: '0.12em', textTransform: 'uppercase', backgroundColor: C.parchment, color: C.maroon, padding: '0.25rem 0.6rem', zIndex: 3 }}>
                {product.tag}
              </span>
            )}
            {backImg && (
              <span style={{ position: 'absolute', top: '1rem', right: '1rem', fontFamily: B, fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(242,232,208,0.9)', background: 'rgba(0,0,0,0.4)', padding: '2px 6px', borderRadius: '2px', zIndex: 3 }}>
                {isLifestyle ? '✦ Lifestyle View' : '↻ Detail View'}
              </span>
            )}
            <div className="flip-info-overlay" style={{ zIndex: 4 }}>
              <p className="flip-info-overlay__desc">{product.desc || product.description}</p>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ fontFamily: D, fontStyle: 'italic', fontSize: '1.3rem', color: C.sand }}>{product.price}</span>
              </div>
              <button className="flip-info-overlay__cta" onClick={e => { e.stopPropagation(); setOpen(true) }}>
                View Details →
              </button>
            </div>
          </div>
          {backImg && (
            <div className="flip-face flip-back">
              <img
                src={backImg}
                alt={`${product.name} detail`}
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
                <p style={{ fontFamily: D, fontStyle: 'italic', fontSize: '0.95rem', color: C.parchment, opacity: 0.9 }}>
                  {isLifestyle ? 'Lifestyle view · handcrafted styling' : 'Back view · handcrafted detailing'}
                </p>
                <button className="flip-info-overlay__cta" style={{ marginTop: '0.5rem' }} onClick={e => { e.stopPropagation(); setOpen(true) }}>
                  View Details →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {open && <ProductModal product={product} onClose={() => setOpen(false)} />}
    </>
  )
}

export const ProductCard = ProdFlipCard
export default ProdFlipCard
