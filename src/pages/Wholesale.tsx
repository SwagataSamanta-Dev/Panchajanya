import { Link } from 'react-router'
import { C, D, B } from '@/data'
import logoImg from '@/imports/logo.jpeg'

const TIERS = [
  { tier: 'Art Students',   qty: '5–19 units',    disc: 'No minimum spend', note: 'Unprinted canvas only',         highlight: false },
  { tier: 'Retail Buyers',  qty: '20–99 units',   disc: '5% off MRP',       note: 'Full product range',            highlight: false },
  { tier: 'Merchants',      qty: '100–499 units', disc: '10% off MRP',      note: 'Custom labelling available',    highlight: true  },
  { tier: 'Corporate Gift', qty: '500+ units',    disc: 'Negotiable',       note: 'Branding + packaging included', highlight: false },
]

export default function Wholesale() {
  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      <img src={logoImg} alt="" aria-hidden="true" style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '600px', objectFit: 'contain', opacity: 0.05, pointerEvents: 'none', userSelect: 'none', zIndex: 0 }} />
      {/* HEADER */}
      <div className="wholesale-hero mob-section-lg" style={{ paddingTop: '68px', backgroundColor: C.maroon, color: C.parchment, padding: '9rem 5rem 5rem', position: 'relative', overflow: 'hidden' }}>
        <span style={{ position: 'absolute', right: '-2rem', bottom: '-4rem', fontFamily: D, fontSize: '16rem', fontStyle: 'italic', color: C.parchment, opacity: 0.04, lineHeight: 1, userSelect: 'none', whiteSpace: 'nowrap' }}>Bulk</span>
        <p style={{ fontFamily: B, fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: C.sand, opacity: 0.6, marginBottom: '1rem' }}>
          <Link to="/" style={{ color: C.sand, textDecoration: 'none', opacity: 0.5 }}>Home</Link>
          <span style={{ opacity: 0.3, margin: '0 0.5rem' }}>→</span> Wholesale
        </p>
        <h1 style={{ fontFamily: D, fontStyle: 'italic', fontSize: 'clamp(3rem, 6vw, 5.5rem)', fontWeight: 400, lineHeight: 0.95, letterSpacing: '-0.03em', margin: '0 0 1.5rem', position: 'relative', zIndex: 1 }}>
          For merchants,<br />corporates, and<br />art colleges.
        </h1>
        <p style={{ fontFamily: B, fontSize: '1rem', lineHeight: 1.75, opacity: 0.6, maxWidth: '46ch', fontWeight: 300, position: 'relative', zIndex: 1 }}>
          We supply unprinted canvas bags to art students and institutions, and provide bulk pricing for merchants and corporate gifting. Minimum 5 units, no upper limit.
        </p>
      </div>

      {/* PRICING TABLE */}
      <div role="region" className="mob-section-lg" style={{ padding: '8rem 5rem', backgroundColor: C.parchment }}>
        <div className="mob-1col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6rem', alignItems: 'start' }}>
          <div>
            <p style={{ fontFamily: B, fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: C.maroonMid, marginBottom: '1rem' }}>Pricing Tiers</p>
            <h2 style={{ fontFamily: D, fontStyle: 'italic', fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.03em', color: C.maroon, marginBottom: '1.5rem' }}>
              Honest prices<br />at every scale.
            </h2>
            <p style={{ fontFamily: B, fontSize: '0.925rem', lineHeight: 1.75, opacity: 0.62, fontWeight: 300, maxWidth: '40ch', marginBottom: '2rem' }}>
              All prices are based on MRP. Discounts apply to the full product range unless noted. Custom labelling, branding, and packaging available for 100+ unit orders.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <a
                href="mailto:panchajanyaco05@gmail.com?subject=Wholesale%20Enquiry"
                style={{ display: 'inline-block', fontFamily: B, fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', backgroundColor: C.maroon, color: C.parchment, padding: '0.9rem 2rem', textDecoration: 'none', textAlign: 'center' }}
              >
                Send Wholesale Enquiry
              </a>
              <a
                href="https://wa.me/919088970848"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'inline-block', fontFamily: B, fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', border: `1px solid rgba(117,24,40,0.3)`, color: C.maroon, padding: '0.9rem 2rem', backgroundColor: 'transparent', textDecoration: 'none', textAlign: 'center' }}
              >
                WhatsApp Us Directly
              </a>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', backgroundColor: 'rgba(117,24,40,0.1)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1.5fr', gap: '1.5rem', padding: '0.75rem 1.5rem', backgroundColor: C.maroonDeep }}>
              {['Tier', 'Quantity', 'Discount', 'Notes'].map(h => (
                <span key={h} style={{ fontFamily: B, fontSize: '0.62rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: C.parchment, opacity: 0.4 }}>{h}</span>
              ))}
            </div>
            {TIERS.map(row => (
              <div key={row.tier} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1.5fr', gap: '1.5rem', padding: '1.25rem 1.5rem', alignItems: 'center', backgroundColor: row.highlight ? C.maroon : C.parchment, color: row.highlight ? C.parchment : C.maroonDeep }}>
                <span style={{ fontFamily: D, fontStyle: 'italic', fontSize: '1.1rem', fontWeight: 400 }}>{row.tier}</span>
                <span style={{ fontFamily: B, fontSize: '0.8rem', opacity: row.highlight ? 0.75 : 0.55 }}>{row.qty}</span>
                <span style={{ fontFamily: B, fontSize: '0.85rem', fontWeight: 600, color: row.highlight ? C.sand : C.maroon }}>{row.disc}</span>
                <span style={{ fontFamily: B, fontSize: '0.78rem', opacity: row.highlight ? 0.65 : 0.5 }}>{row.note}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ART STUDENT SPECIAL */}
      <div role="region" className="dot-grid mob-section-lg" style={{ backgroundColor: C.fog, padding: '6rem 5rem' }}>
        <div className="mob-1col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6rem', alignItems: 'center' }}>
          <div>
            <p style={{ fontFamily: B, fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: C.maroonMid, marginBottom: '1rem' }}>Art Students</p>
            <h2 style={{ fontFamily: D, fontStyle: 'italic', fontSize: 'clamp(1.75rem, 3vw, 2.75rem)', fontWeight: 400, lineHeight: 1.1, letterSpacing: '-0.02em', color: C.maroon, marginBottom: '1.5rem' }}>
              Unprinted canvas bags<br />for your next series.
            </h2>
            <p style={{ fontFamily: B, fontSize: '0.925rem', lineHeight: 1.75, opacity: 0.65, fontWeight: 300, marginBottom: '1.5rem' }}>
              Natural 12 oz canvas, no print, no branding — a blank surface ready for your work. Minimum 5 bags. Used by students at Rabindra Bharati, Jadavpur, and other Kolkata colleges.
            </p>
            <p style={{ fontFamily: B, fontSize: '0.925rem', lineHeight: 1.75, opacity: 0.65, fontWeight: 300 }}>
              Available in: Market Tote, Drawstring Pouch, Coin Purse. Custom sizes on request for orders of 25+.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {[
              { product: 'Market Tote (Unprinted)',    size: '38×42 cm', price: '₹195 each (5–19 units)' },
              { product: 'Drawstring Pouch (Unprinted)', size: '30×35 cm', price: '₹120 each (5–19 units)' },
              { product: 'Coin Purse (Unprinted)',     size: '14×12 cm', price: '₹80 each (5–19 units)' },
            ].map(item => (
              <div key={item.product} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', alignItems: 'center', padding: '1.25rem 1.5rem', backgroundColor: C.parchment, borderTop: `2px solid ${C.maroon}` }}>
                <div>
                  <p style={{ fontFamily: D, fontStyle: 'italic', fontSize: '1.1rem', color: C.maroon, margin: '0 0 0.25rem', fontWeight: 400 }}>{item.product}</p>
                  <p style={{ fontFamily: B, fontSize: '0.78rem', opacity: 0.5 }}>{item.size}</p>
                </div>
                <p style={{ fontFamily: B, fontSize: '0.82rem', fontWeight: 600, color: C.maroon, textAlign: 'right', whiteSpace: 'nowrap' }}>{item.price}</p>
              </div>
            ))}
            <button onClick={() => window.open('mailto:panchajanyaco05@gmail.com?subject=Art%20Student%20Canvas%20Order')} style={{ display: 'block', width: '100%', textAlign: 'center', fontFamily: B, fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', backgroundColor: C.maroon, color: C.parchment, padding: '0.85rem 1.5rem', border: 'none', cursor: 'pointer' }}>
              Order for My College
            </button>
          </div>
        </div>
      </div>

      {/* CORPORATE */}
      <div role="region" className="mob-section-lg" style={{ backgroundColor: C.maroonDeep, color: C.parchment, padding: '6rem 5rem' }}>
        <div className="mob-1col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6rem', alignItems: 'center' }}>
          <div>
            <p style={{ fontFamily: B, fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: C.sand, opacity: 0.7, marginBottom: '1rem' }}>Corporate Gifting</p>
            <h2 style={{ fontFamily: D, fontStyle: 'italic', fontSize: 'clamp(1.75rem, 3vw, 2.75rem)', fontWeight: 400, lineHeight: 1.1, letterSpacing: '-0.02em', color: C.parchment, marginBottom: '1.5rem' }}>
              Gifts that tell<br />a real story.
            </h2>
            <p style={{ fontFamily: B, fontSize: '0.925rem', lineHeight: 1.75, opacity: 0.6, fontWeight: 300 }}>
              Every corporate gift from Panchajanya comes with a card telling your recipients exactly who made it and where. For 500+ orders, we offer full branding and custom packaging at negotiated rates.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {['Custom embroidery or tag', 'Kraft box + tissue packaging', 'Insert card — maker\'s story', 'Bulk delivery across India', 'Invoice with GST', '10–15 day turnaround'].map(feature => (
              <div key={feature} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 0', borderBottom: '1px solid rgba(242,232,208,0.08)' }}>
                <span style={{ color: C.sand, fontSize: '1rem', flexShrink: 0 }}>✓</span>
                <span style={{ fontFamily: B, fontSize: '0.9rem', opacity: 0.65 }}>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div role="region" style={{ padding: '5rem', backgroundColor: C.fog, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ fontFamily: B, fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: C.maroonMid, marginBottom: '0.5rem' }}>Ready to order?</p>
          <h3 style={{ fontFamily: D, fontStyle: 'italic', fontSize: '2rem', fontWeight: 400, color: C.maroon, margin: 0 }}>We respond within 24 hours.</h3>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={() => window.open('mailto:panchajanyaco05@gmail.com?subject=Wholesale%20Enquiry')} style={{ fontFamily: B, fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', backgroundColor: C.maroon, color: C.parchment, padding: '0.9rem 2rem', border: 'none', cursor: 'pointer' }}>
            Email Us
          </button>
          <Link to="/shop" style={{ fontFamily: B, fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', border: `1px solid rgba(117,24,40,0.3)`, color: C.maroon, padding: '0.9rem 2rem', textDecoration: 'none' }}>
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  )
}
