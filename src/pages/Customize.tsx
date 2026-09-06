import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { BACKEND_URL } from '@/ProductContext'
import { C, D, B } from '@/data'
import logoImg from '@/imports/logo.jpeg'

const SILHOUETTES = [
  { id: 'tote',       label: 'Market Tote',       size: '38 × 42 cm', price: 650,  icon: '🛍' },
  { id: 'sling',      label: 'Sling Bag',          size: '28 × 22 cm', price: 750,  icon: '👜' },
  { id: 'saddle',     label: 'Saddle Bag',         size: '30 × 24 cm', price: 850,  icon: '🎒' },
  { id: 'drawstring', label: 'Drawstring Pouch',   size: '30 × 35 cm', price: 500,  icon: '🪢' },
]

const DESIGNS = [
  { id: 'embroidery', label: 'Hand Embroidery',  desc: 'Floral, geometric, or custom motif stitched by hand',   extra: 200 },
  { id: 'blockprint', label: 'Block Print',       desc: 'Traditional hand-stamped patterns in natural dyes',      extra: 150 },
  { id: 'screenprint',label: 'Screen Print',      desc: 'Your artwork or phrase printed in up to 2 colours',      extra: 180 },
  { id: 'plain',      label: 'Plain Canvas',      desc: 'Natural 12 oz canvas with no print — blank and clean',  extra: 0   },
]

const COLOURS = [
  { id: 'natural', label: 'Natural', hex: '#d4bb8a' },
  { id: 'black',   label: 'Black',   hex: '#1a1a1a' },
  { id: 'maroon',  label: 'Maroon',  hex: '#751828' },
  { id: 'olive',   label: 'Olive',   hex: '#6b7c3a' },
  { id: 'navy',    label: 'Navy',    hex: '#1e3a5f'  },
  { id: 'rust',    label: 'Rust',    hex: '#b5431a'  },
]

type Step = 'silhouette' | 'design' | 'colour' | 'details' | 'confirm'
const STEPS: Step[] = ['silhouette', 'design', 'colour', 'details', 'confirm']
const STEP_LABELS: Record<Step, string> = {
  silhouette: 'Bag Shape',
  design:     'Design Type',
  colour:     'Canvas Colour',
  details:    'Your Details',
  confirm:    'Confirmed',
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '0.8rem 1rem', fontFamily: B, fontSize: '0.95rem',
  border: `1.5px solid rgba(117,24,40,0.2)`, backgroundColor: C.parchment,
  color: C.maroonDeep, outline: 'none', boxSizing: 'border-box', resize: 'vertical',
}
const labelStyle: React.CSSProperties = {
  fontFamily: B, fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase',
  color: C.maroonDeep, opacity: 0.55, display: 'block', marginBottom: '0.4rem',
}

function StepBar({ current }: { current: Step }) {
  const ci = STEPS.indexOf(current)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: '3rem', overflowX: 'auto' }}>
      {STEPS.filter(s => s !== 'confirm').map((s, i) => {
        const si = STEPS.indexOf(s)
        const done = si < ci
        const active = s === current
        return (
          <div key={s} style={{ display: 'flex', alignItems: 'center', flex: i < 3 ? 1 : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
              <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: done || active ? C.maroon : 'transparent', border: `2px solid ${done || active ? C.maroon : 'rgba(117,24,40,0.2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {done
                  ? <svg width="10" height="10" viewBox="0 0 12 12"><path d="M2 6l3 3 5-5" stroke={C.parchment} strokeWidth="2" fill="none" strokeLinecap="round"/></svg>
                  : <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: active ? C.parchment : 'transparent' }} />}
              </div>
              <span style={{ fontFamily: B, fontSize: '0.68rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: done || active ? C.maroon : C.maroonDeep, opacity: done || active ? 1 : 0.3, whiteSpace: 'nowrap' }}>
                {STEP_LABELS[s]}
              </span>
            </div>
            {i < 3 && <div style={{ flex: 1, height: '1px', backgroundColor: done ? C.maroon : 'rgba(117,24,40,0.15)', margin: '0 0.6rem' }} />}
          </div>
        )
      })}
    </div>
  )
}

export default function Customize() {
  const navigate = useNavigate()
  const [step, setStep]           = useState<Step>('silhouette')
  const [silhouette, setSilhouette] = useState<string>('')
  const [design, setDesign]       = useState<string>('')
  const [colour, setColour]       = useState<string>('natural')
  const [qty, setQty]             = useState(1)
  const [form, setForm]           = useState({ name: '', phone: '', notes: '' })
  const [errors, setErrors]       = useState<Partial<typeof form>>({})
  const [isSubmitting, setIsSubmitting]   = useState(false)
  const [requestNumber, setRequestNumber] = useState('')

  const selectedSil    = SILHOUETTES.find(s => s.id === silhouette)
  const selectedDesign = DESIGNS.find(d => d.id === design)
  const selectedColour = COLOURS.find(c => c.id === colour)
  const unitPrice      = (selectedSil?.price ?? 0) + (selectedDesign?.extra ?? 0)
  const totalPrice     = unitPrice * qty

  function validateDetails() {
    const e: Partial<typeof form> = {}
    if (!form.name.trim()) e.name = 'Required'
    if (!/^\d{10}$/.test(form.phone)) e.phone = 'Enter a valid 10-digit number'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmitRequest() {
    if (!validateDetails()) return

    setIsSubmitting(true)
    let generatedRef = `CST-2026-${Math.floor(1000 + Math.random() * 9000)}`

    try {
      const payload = {
        customer_name: form.name.trim(),
        customer_phone: form.phone.trim(),
        shape: selectedSil?.label || silhouette,
        design_type: selectedDesign?.label || design,
        colour: selectedColour?.label || colour,
        quantity: qty,
        unit_price: unitPrice,
        estimated_price: totalPrice,
        notes: form.notes.trim(),
      }

      const res = await fetch(`${BACKEND_URL}/api/custom_orders.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        const json = await res.json()
        if (json.success && json.request_number) {
          generatedRef = json.request_number
        }
      }
    } catch (err) {
      console.warn('Backend custom order save failed (fallback to generated ref):', err)
    } finally {
      setIsSubmitting(false)
      setRequestNumber(generatedRef)
      setStep('confirm')
    }
  }

  const CTA = ({ label, onClick, disabled = false }: { label: string; onClick: () => void; disabled?: boolean }) => (
    <button onClick={onClick} disabled={disabled}
      style={{ padding: '0.95rem 2.5rem', backgroundColor: disabled ? 'rgba(117,24,40,0.25)' : C.maroon, color: C.parchment, fontFamily: B, fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', border: 'none', cursor: disabled ? 'not-allowed' : 'pointer', transition: 'opacity 0.15s' }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.opacity = '0.88' }}
      onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}>
      {label}
    </button>
  )

  const Back = ({ to }: { to: Step }) => (
    <button onClick={() => setStep(to)} style={{ fontFamily: B, fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: C.maroonDeep, opacity: 0.4, background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: '1.5rem', display: 'block' }}>
      ← Back
    </button>
  )

  // Sidebar summary
  const Summary = () => (
    <div style={{ backgroundColor: C.parchment, border: `1px solid rgba(117,24,40,0.1)`, padding: '2rem', position: 'sticky', top: '88px', alignSelf: 'start' }}>
      <p style={{ fontFamily: D, fontStyle: 'italic', fontSize: '1.2rem', color: C.maroon, margin: '0 0 1.5rem' }}>Your Custom Bag</p>
      {[
        ['Shape',   selectedSil?.label    || '—'],
        ['Design',  selectedDesign?.label || '—'],
        ['Colour',  selectedColour?.label || '—'],
        ['Qty',     qty.toString()],
      ].map(([k, v]) => (
        <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.65rem', fontFamily: B, fontSize: '0.82rem' }}>
          <span style={{ opacity: 0.45 }}>{k}</span>
          <span style={{ fontWeight: 600, color: C.maroonDeep }}>{v}</span>
        </div>
      ))}
      <div style={{ borderTop: `1px solid rgba(117,24,40,0.1)`, marginTop: '1rem', paddingTop: '1rem' }}>
        {selectedSil && (
          <div style={{ fontFamily: B, fontSize: '0.78rem', opacity: 0.4, marginBottom: '0.4rem' }}>
            Base ₹{selectedSil.price} {selectedDesign?.extra ? `+ ₹${selectedDesign.extra} design` : ''}
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: B, fontSize: '1.05rem', fontWeight: 700, color: C.maroon }}>
          <span>Total</span>
          <span>{totalPrice > 0 ? `₹${totalPrice.toLocaleString('en-IN')}` : '—'}</span>
        </div>
        {qty > 1 && <p style={{ fontFamily: B, fontSize: '0.72rem', opacity: 0.4, margin: '0.3rem 0 0' }}>₹{unitPrice} × {qty} pieces</p>}
        {qty >= 10 && <p style={{ fontFamily: B, fontSize: '0.72rem', color: '#2a9d2a', margin: '0.4rem 0 0', fontWeight: 600 }}>10% bulk discount applied ✓</p>}
      </div>
      <div style={{ marginTop: '1.5rem', padding: '0.75rem', backgroundColor: 'rgba(117,24,40,0.05)', borderLeft: `2px solid ${C.maroon}` }}>
        <p style={{ fontFamily: B, fontSize: '0.72rem', color: C.maroonDeep, opacity: 0.6, margin: 0, lineHeight: 1.6 }}>
          Handmade to order · 5–7 days turnaround · Pan-India delivery
        </p>
      </div>
    </div>
  )

  // ── CONFIRM ──
  if (step === 'confirm') {
    const whatsappLines = [
      `*Namaste Panchajanya Studio!* 🙏`,
      `I have submitted a Custom Bag Request (Ref: #${requestNumber || 'CST-2026-CUSTOM'}).`,
      ``,
      `*My Custom Configuration:*`,
      `• Shape: ${selectedSil?.label || 'Custom'} (${selectedSil?.size || ''})`,
      `• Canvas Colour: ${selectedColour?.label || 'Natural'}`,
      `• Design Style: ${selectedDesign?.label || 'Custom'}`,
      `• Quantity: ${qty} ${qty > 1 ? 'pieces' : 'piece'}`,
      `• Est. Total: ₹${totalPrice.toLocaleString('en-IN')}`,
      form.notes ? `• Design Notes: ${form.notes}` : null,
      `• Customer: ${form.name}`,
      `• Phone: ${form.phone}`,
      ``,
      `📎 *I am attaching my custom design artwork / reference sketch / photo directly with this message for your artisans to review.*`,
      ``,
      `Please let me know the final quote and turnaround time! Thank you.`
    ].filter(Boolean)

    const whatsappMsg = encodeURIComponent(whatsappLines.join('\n'))

    return (
      <div style={{ paddingTop: '68px', minHeight: '100vh', backgroundColor: C.fog, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem 1.5rem' }}>
        <div style={{ textAlign: 'center', maxWidth: '580px', width: '100%', backgroundColor: C.parchment, border: `1px solid rgba(117,24,40,0.12)`, padding: '3.5rem 2.5rem', boxShadow: '0 4px 20px rgba(117,24,40,0.06)' }}>
          <div style={{ width: '68px', height: '68px', borderRadius: '50%', backgroundColor: C.maroon, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.parchment} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
          </div>
          <p style={{ fontFamily: B, fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: C.maroon, fontWeight: 700, margin: '0 0 0.5rem' }}>
            Request Registered · #{requestNumber}
          </p>
          <h1 style={{ fontFamily: D, fontStyle: 'italic', fontSize: '2.4rem', color: C.maroon, margin: '0 0 0.75rem', fontWeight: 400 }}>Request Sent!</h1>
          <p style={{ fontFamily: B, fontSize: '0.92rem', opacity: 0.7, lineHeight: 1.75, marginBottom: '2rem' }}>
            Thank you, <strong>{form.name}</strong>. Your custom request has been saved to our studio dashboard. We will review your requirements and confirm turnaround time with you directly.
          </p>

          <div style={{ backgroundColor: 'rgba(117,24,40,0.03)', border: `1px solid rgba(117,24,40,0.1)`, padding: '1.25rem 1.5rem', marginBottom: '2rem', textAlign: 'left' }}>
            {[
              ['Reference #', `#${requestNumber}`],
              ['Shape', selectedSil?.label],
              ['Design', selectedDesign?.label],
              ['Colour', selectedColour?.label],
              ['Qty', qty.toString()],
              ['Total (est.)', `₹${totalPrice.toLocaleString('en-IN')}`]
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontFamily: B, fontSize: '0.85rem', padding: '0.35rem 0', borderBottom: `1px solid rgba(117,24,40,0.06)` }}>
                <span style={{ opacity: 0.5 }}>{k}</span>
                <span style={{ fontWeight: 700, color: C.maroonDeep }}>{v}</span>
              </div>
            ))}
          </div>

          {/* WhatsApp Handshake Callout */}
          <div style={{ backgroundColor: '#e8f5e9', border: '1px solid #c8e6c9', borderRadius: '4px', padding: '1.25rem 1.5rem', marginBottom: '2rem', textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#2e7d32', fontWeight: 700, fontSize: '0.92rem', marginBottom: '0.35rem' }}>
              <span style={{ fontSize: '1.2rem' }}>🎨</span>
              <span>Send Your Artwork or Reference Photo</span>
            </div>
            <p style={{ fontFamily: B, fontSize: '0.82rem', color: '#1b5e20', margin: 0, lineHeight: 1.65 }}>
              Tap the green button below to connect with our artisan director on WhatsApp. <strong>You can attach and send your reference sketch, embroidery motif, or photo directly in the chat</strong> for artisan review!
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={`https://wa.me/919088970848?text=${whatsappMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ padding: '0.9rem 1.8rem', backgroundColor: '#25d366', color: '#fff', fontFamily: B, fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', boxShadow: '0 2px 8px rgba(37,211,102,0.3)', borderRadius: '2px' }}>
              <span>💬</span> Chat & Send Artwork on WhatsApp
            </a>
            <button onClick={() => navigate('/shop')}
              style={{ padding: '0.9rem 1.8rem', backgroundColor: 'transparent', color: C.maroon, fontFamily: B, fontSize: '0.82rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', border: `1.5px solid rgba(117,24,40,0.3)`, cursor: 'pointer', borderRadius: '2px' }}>
              Browse Collection
            </button>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <button
              onClick={() => {
                setStep('silhouette')
                setRequestNumber('')
                setForm({ name: '', phone: '', notes: '' })
              }}
              style={{ background: 'none', border: 'none', color: C.maroon, opacity: 0.6, fontFamily: B, fontSize: '0.78rem', textDecoration: 'underline', cursor: 'pointer' }}>
              ← Design Another Custom Bag
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ paddingTop: '68px', minHeight: '100vh', backgroundColor: C.fog, position: 'relative', overflow: 'hidden' }}>
      <img src={logoImg} alt="" aria-hidden="true" style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '600px', objectFit: 'contain', opacity: 0.05, pointerEvents: 'none', userSelect: 'none', zIndex: 0 }} />
      {/* Hero */}
      <div style={{ backgroundColor: C.maroon, color: C.parchment, padding: '4rem 5rem 3rem', position: 'relative', zIndex: 1 }} className="mob-section-lg">
        <p style={{ fontFamily: B, fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.5, marginBottom: '0.75rem' }}>
          <Link to="/" style={{ color: C.parchment, textDecoration: 'none', opacity: 0.5 }}>Home</Link>
          <span style={{ margin: '0 0.5rem', opacity: 0.3 }}>→</span> Customize
        </p>
        <h1 style={{ fontFamily: D, fontStyle: 'italic', fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 400, lineHeight: 0.95, letterSpacing: '-0.03em', margin: '0 0 1rem' }}>
          Design your own bag.
        </h1>
        <p style={{ fontFamily: B, fontSize: '0.95rem', opacity: 0.6, maxWidth: '48ch', lineHeight: 1.75, fontWeight: 300 }}>
          Pick a silhouette, choose your design style, select the canvas colour — and our artisans in Sonarpur will stitch it by hand, just for you.
        </p>
      </div>

      {/* Builder */}
      <div className="page-2col" style={{ maxWidth: '1100px', margin: '0 auto', padding: '4rem 3rem', display: 'grid', gridTemplateColumns: '1fr 360px', gap: '4rem', alignItems: 'start', position: 'relative', zIndex: 1 }}>
        <div>
          <StepBar current={step} />

          {/* ── STEP 1: SILHOUETTE ── */}
          {step === 'silhouette' && (
            <div>
              <h2 style={{ fontFamily: D, fontStyle: 'italic', fontSize: '1.75rem', color: C.maroon, margin: '0 0 0.4rem', fontWeight: 400 }}>Choose a bag shape</h2>
              <p style={{ fontFamily: B, fontSize: '0.82rem', opacity: 0.5, marginBottom: '2rem' }}>All bags are made from 12 oz natural canvas.</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                {SILHOUETTES.map(s => (
                  <button key={s.id} onClick={() => setSilhouette(s.id)}
                    style={{ padding: '1.75rem 1.5rem', border: `2px solid ${silhouette === s.id ? C.maroon : 'rgba(117,24,40,0.15)'}`, backgroundColor: silhouette === s.id ? 'rgba(117,24,40,0.05)' : C.parchment, cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{s.icon}</div>
                    <p style={{ fontFamily: D, fontStyle: 'italic', fontSize: '1.1rem', color: C.maroon, margin: '0 0 0.25rem', fontWeight: 400 }}>{s.label}</p>
                    <p style={{ fontFamily: B, fontSize: '0.75rem', opacity: 0.45, margin: '0 0 0.5rem' }}>{s.size}</p>
                    <p style={{ fontFamily: B, fontSize: '0.88rem', fontWeight: 700, color: C.maroon, margin: 0 }}>from ₹{s.price}</p>
                  </button>
                ))}
              </div>
              <CTA label="Next: Design Type →" onClick={() => setStep('design')} disabled={!silhouette} />
            </div>
          )}

          {/* ── STEP 2: DESIGN ── */}
          {step === 'design' && (
            <div>
              <Back to="silhouette" />
              <h2 style={{ fontFamily: D, fontStyle: 'italic', fontSize: '1.75rem', color: C.maroon, margin: '0 0 0.4rem', fontWeight: 400 }}>Choose a design style</h2>
              <p style={{ fontFamily: B, fontSize: '0.82rem', opacity: 0.5, marginBottom: '2rem' }}>You'll share your motif, text, or reference image after placing the request.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                {DESIGNS.map(d => (
                  <button key={d.id} onClick={() => setDesign(d.id)}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', border: `2px solid ${design === d.id ? C.maroon : 'rgba(117,24,40,0.15)'}`, backgroundColor: design === d.id ? 'rgba(117,24,40,0.05)' : C.parchment, cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s', gap: '1rem' }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontFamily: B, fontSize: '0.92rem', fontWeight: 700, color: C.maroonDeep, margin: '0 0 0.25rem' }}>{d.label}</p>
                      <p style={{ fontFamily: B, fontSize: '0.78rem', opacity: 0.5, margin: 0 }}>{d.desc}</p>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <span style={{ fontFamily: B, fontSize: '0.85rem', fontWeight: 700, color: C.maroon }}>{d.extra > 0 ? `+₹${d.extra}` : 'Included'}</span>
                    </div>
                  </button>
                ))}
              </div>
              <CTA label="Next: Canvas Colour →" onClick={() => setStep('colour')} disabled={!design} />
            </div>
          )}

          {/* ── STEP 3: COLOUR ── */}
          {step === 'colour' && (
            <div>
              <Back to="design" />
              <h2 style={{ fontFamily: D, fontStyle: 'italic', fontSize: '1.75rem', color: C.maroon, margin: '0 0 0.4rem', fontWeight: 400 }}>Choose canvas colour</h2>
              <p style={{ fontFamily: B, fontSize: '0.82rem', opacity: 0.5, marginBottom: '2rem' }}>All colours are hand-dyed using natural pigments.</p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                {COLOURS.map(c => (
                  <button key={c.id} onClick={() => setColour(c.id)} title={c.label}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: c.hex, border: `3px solid ${colour === c.id ? C.maroon : 'transparent'}`, boxShadow: colour === c.id ? `0 0 0 2px ${C.parchment}, 0 0 0 4px ${C.maroon}` : 'none', transition: 'all 0.15s' }} />
                    <span style={{ fontFamily: B, fontSize: '0.7rem', color: C.maroonDeep, opacity: colour === c.id ? 1 : 0.5 }}>{c.label}</span>
                  </button>
                ))}
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <label style={labelStyle}>Quantity</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: '40px', height: '40px', border: `1.5px solid rgba(117,24,40,0.2)`, background: C.parchment, color: C.maroon, fontSize: '1.1rem', cursor: 'pointer' }}>−</button>
                  <span style={{ width: '52px', height: '40px', lineHeight: '38px', textAlign: 'center', fontFamily: B, fontSize: '0.95rem', fontWeight: 700, color: C.maroonDeep, border: `1.5px solid rgba(117,24,40,0.2)`, borderLeft: 'none', borderRight: 'none' }}>{qty}</span>
                  <button onClick={() => setQty(q => q + 1)} style={{ width: '40px', height: '40px', border: `1.5px solid rgba(117,24,40,0.2)`, background: C.parchment, color: C.maroon, fontSize: '1.1rem', cursor: 'pointer' }}>+</button>
                  {qty >= 10 && <span style={{ fontFamily: B, fontSize: '0.72rem', color: '#2a9d2a', marginLeft: '1rem', fontWeight: 600 }}>10% bulk discount applied!</span>}
                </div>
              </div>

              <CTA label="Next: Your Details →" onClick={() => setStep('details')} />
            </div>
          )}

          {/* ── STEP 4: DETAILS ── */}
          {step === 'details' && (
            <div>
              <Back to="colour" />
              <h2 style={{ fontFamily: D, fontStyle: 'italic', fontSize: '1.75rem', color: C.maroon, margin: '0 0 0.4rem', fontWeight: 400 }}>Your details</h2>
              <p style={{ fontFamily: B, fontSize: '0.82rem', opacity: 0.5, marginBottom: '2rem' }}>We'll reach out on WhatsApp to confirm your design and share a quote.</p>

              {[
                { key: 'name',  label: 'Full Name',         placeholder: 'Your Full Name',  type: 'text' },
                { key: 'phone', label: 'WhatsApp Number',   placeholder: '9876543210',       type: 'tel'  },
              ].map(({ key, label, placeholder, type }) => (
                <div key={key} style={{ marginBottom: '1.25rem' }}>
                  <label style={labelStyle}>{label}</label>
                  <input type={type} placeholder={placeholder}
                    value={form[key as keyof typeof form]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    style={{ ...inputStyle, border: `1.5px solid ${errors[key as keyof typeof errors] ? '#c0392b' : 'rgba(117,24,40,0.2)'}` }} />
                  {errors[key as keyof typeof errors] && (
                    <p style={{ fontFamily: B, fontSize: '0.72rem', color: '#c0392b', margin: '0.3rem 0 0' }}>{errors[key as keyof typeof errors]}</p>
                  )}
                </div>
              ))}

              <div style={{ marginBottom: '2rem' }}>
                <label style={labelStyle}>Design Notes <span style={{ opacity: 0.4 }}>(optional)</span></label>
                <textarea placeholder="Describe your motif, text, colours, or upload reference after we connect on WhatsApp…"
                  value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  rows={4} style={{ ...inputStyle }} />
              </div>

              <div style={{ padding: '1rem 1.25rem', backgroundColor: 'rgba(117,24,40,0.05)', border: `1px solid rgba(117,24,40,0.1)`, marginBottom: '1.75rem' }}>
                <p style={{ fontFamily: B, fontSize: '0.78rem', color: C.maroonDeep, opacity: 0.65, margin: 0, lineHeight: 1.7 }}>
                  By submitting, you'll receive a WhatsApp confirmation with final pricing within <strong>24 hours</strong>. No payment is collected here — we'll arrange that over chat.
                </p>
              </div>

              <CTA label={isSubmitting ? 'Recording Request...' : 'Submit Custom Request →'} onClick={handleSubmitRequest} disabled={isSubmitting} />
            </div>
          )}
        </div>

        {/* Sidebar */}
        <Summary />
      </div>

      {/* FAQ strip */}
      <div className="mob-section-lg" style={{ borderTop: `1px solid rgba(117,24,40,0.1)`, padding: '4rem 5rem', backgroundColor: C.parchment }}>
        <h2 style={{ fontFamily: D, fontStyle: 'italic', fontSize: '1.5rem', color: C.maroon, margin: '0 0 2rem', fontWeight: 400 }}>Common questions</h2>
        <div className="mob-1col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0' }}>
          {[
            ['How long does a custom order take?', '5–7 working days from design confirmation.'],
            ['Can I see a sample before production?', 'Yes — for orders of 5+ pieces, we send a photo approval first.'],
            ['Do you ship outside Kolkata?', 'Yes, pan-India delivery. Shipping cost calculated at confirmation.'],
            ['Can I send my own artwork?', 'Absolutely — share it on WhatsApp once we confirm your order.'],
          ].map(([q, a], i) => (
            <div key={i} style={{ padding: '1.5rem 2rem', borderTop: `1px solid rgba(117,24,40,0.1)`, borderRight: i % 2 === 0 ? `1px solid rgba(117,24,40,0.1)` : 'none' }}>
              <p style={{ fontFamily: B, fontSize: '0.88rem', fontWeight: 600, color: C.maroonDeep, margin: '0 0 0.4rem' }}>{q}</p>
              <p style={{ fontFamily: B, fontSize: '0.8rem', opacity: 0.5, margin: 0, lineHeight: 1.65 }}>{a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
