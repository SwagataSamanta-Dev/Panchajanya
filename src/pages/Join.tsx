import { Link } from 'react-router'
import logoImg from '@/imports/logo.jpeg'
import { C, D, B } from '@/data'

export default function Join() {
  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      <img src={logoImg} alt="" aria-hidden="true" style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '600px', objectFit: 'contain', opacity: 0.05, pointerEvents: 'none', userSelect: 'none', zIndex: 0 }} />
      {/* HEADER */}
      <div className="px-5 pt-28 pb-12 sm:px-8 sm:pt-32 sm:pb-16 md:px-20 md:pt-36 md:pb-20 relative overflow-hidden" style={{ backgroundColor: C.fog }}>
        <div className="hidden sm:block" style={{ position: 'absolute', right: '3rem', top: '50%', transform: 'translateY(-50%)', width: '280px', height: '280px', borderRadius: '50%', overflow: 'hidden', opacity: 0.07, pointerEvents: 'none' }}>
          <img src={logoImg} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <p style={{ fontFamily: B, fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: C.maroonMid, marginBottom: '1rem' }}>
          <Link to="/" style={{ color: C.maroonMid, textDecoration: 'none', opacity: 0.5 }}>Home</Link>
          <span style={{ opacity: 0.3, margin: '0 0.5rem' }}>→</span> Join Us
        </p>
        <h1 style={{ fontFamily: D, fontStyle: 'italic', fontSize: 'clamp(2.5rem, 5.5vw, 5.5rem)', fontWeight: 400, lineHeight: 0.95, letterSpacing: '-0.03em', color: C.maroon, margin: '0 0 1.5rem', position: 'relative', zIndex: 1 }}>
          Two ways to be<br />part of this.
        </h1>
        <p style={{ fontFamily: B, fontSize: '1rem', lineHeight: 1.75, opacity: 0.65, maxWidth: '46ch', fontWeight: 300, position: 'relative', zIndex: 1 }}>
          Whether you want to learn a craft or earn as you study — there is a place for you at Panchajanya.
        </p>
      </div>

      {/* TWO PATHWAYS */}
      <div role="region" className="join-panels grid grid-cols-1 lg:grid-cols-2 min-h-[500px]">
        {/* Artisan Training */}
        <div className="join-panel-left p-6 sm:p-10 lg:p-16 flex flex-col justify-between text-[#f2e8d0]" style={{ backgroundColor: C.maroonDeep }}>
          <div>
            <span style={{ fontFamily: B, fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: C.sand, opacity: 0.65, display: 'block', marginBottom: '1.25rem' }}>Pathway 01</span>
            <h2 style={{ fontFamily: D, fontStyle: 'italic', fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.03em', color: C.parchment, marginBottom: '1.75rem' }}>
              Artisan<br />Training
            </h2>
            <p style={{ fontFamily: B, fontSize: '0.925rem', lineHeight: 1.85, opacity: 0.62, fontWeight: 300, maxWidth: '38ch', marginBottom: '2rem' }}>
              Free craft training for women in Sonarpur and nearby areas. No prior experience needed. We provide tools, materials, workspace, and a guaranteed market for your work from day one.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2.5rem' }}>
              {['Free of charge — no fees, ever', '4–6 week structured programme', 'Earn from Week 3 onwards', 'Flexible hours, women-only space', 'Training in Sonarpur, South Kolkata'].map(point => (
                <div key={point} style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                  <span style={{ color: C.sand, flexShrink: 0 }}>→</span>
                  <span style={{ fontFamily: B, fontSize: '0.875rem', opacity: 0.68 }}>{point}</span>
                </div>
              ))}
            </div>
          </div>
          <button onClick={() => window.open('mailto:panchajanyaco05@gmail.com?subject=Artisan%20Training%20Application')} style={{ display: 'inline-block', fontFamily: B, fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', backgroundColor: C.parchment, color: C.maroon, padding: '1rem 1.5rem', border: 'none', cursor: 'pointer', textAlign: 'center' }}>
            Apply for Artisan Training →
          </button>
        </div>

        {/* Delivery Partner */}
        <div className="join-panel-right p-6 sm:p-10 lg:p-16 flex flex-col justify-between text-[#f2e8d0]" style={{ backgroundColor: C.maroon }}>
          <div>
            <span style={{ fontFamily: B, fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: C.sand, opacity: 0.65, display: 'block', marginBottom: '1.25rem' }}>Pathway 02</span>
            <h2 style={{ fontFamily: D, fontStyle: 'italic', fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.03em', color: C.parchment, marginBottom: '1.75rem' }}>
              Student Delivery<br />Partner
            </h2>
            <p style={{ fontFamily: B, fontSize: '0.925rem', lineHeight: 1.85, opacity: 0.62, fontWeight: 300, maxWidth: '38ch', marginBottom: '2rem' }}>
              College students across Kolkata can earn by delivering Panchajanya orders in their area. OTP-verified handoffs, transparent per-delivery earnings, flexible to your class schedule.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2.5rem' }}>
              {['Flexible — work around your classes', 'OTP-tracked delivery system', 'Paid per delivery, weekly settlement', 'Priority for Kolkata college areas', 'Join the WhatsApp partner group'].map(point => (
                <div key={point} style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                  <span style={{ color: C.sand, flexShrink: 0 }}>→</span>
                  <span style={{ fontFamily: B, fontSize: '0.875rem', opacity: 0.68 }}>{point}</span>
                </div>
              ))}
            </div>
          </div>
          <button onClick={() => window.open('mailto:panchajanyaco05@gmail.com?subject=Delivery%20Partner%20Application')} style={{ display: 'inline-block', fontFamily: B, fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', border: '1px solid rgba(242,232,208,0.4)', color: C.parchment, padding: '1rem 1.5rem', backgroundColor: 'transparent', cursor: 'pointer', textAlign: 'center' }}>
            Become a Delivery Partner →
          </button>
        </div>
      </div>

      {/* FAQ */}
      <div role="region" className="px-5 py-12 sm:px-8 sm:py-16 md:px-20 md:py-28" style={{ backgroundColor: C.parchment }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-24">
          <div>
            <p style={{ fontFamily: B, fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: C.maroonMid, marginBottom: '1rem' }}>Common Questions</p>
            <h2 style={{ fontFamily: D, fontStyle: 'italic', fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.03em', color: C.maroon }}>
              What people<br />ask us first.
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {[
              ['Do I need experience to join the artisan programme?', 'No. We train from zero. All you need is commitment and attendance. We have helped women with no prior craft knowledge become full-time artisans.'],
              ['How much can a delivery partner earn?', 'It depends on order volume in your area. During peak periods, Kolkata students earn ₹300–₹600 per day doing part-time deliveries after class.'],
              ['Is the training really free?', 'Yes, completely. No fees, no deposit, no "registration charge". Materials and workspace are also provided by us.'],
              ['Who can apply for artisan training?', 'Any woman living in or near Sonarpur, South 24 Parganas. We welcome all ages and backgrounds.'],
            ].map(([q, a], i) => (
              <details key={i} style={{ borderTop: `1px solid rgba(117,24,40,0.12)`, padding: '1.25rem 0' }}>
                <summary style={{ fontFamily: D, fontStyle: 'italic', fontSize: '1.1rem', color: C.maroon, cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {q}
                  <span style={{ fontFamily: B, fontSize: '1.25rem', opacity: 0.4, flexShrink: 0, marginLeft: '1rem' }}>+</span>
                </summary>
                <p style={{ fontFamily: B, fontSize: '0.9rem', lineHeight: 1.75, opacity: 0.62, fontWeight: 300, marginTop: '0.75rem', paddingRight: '1rem' }}>{a}</p>
              </details>
            ))}
            <div style={{ borderTop: `1px solid rgba(117,24,40,0.12)` }} />
          </div>
        </div>
      </div>

      {/* FINAL CTA */}
      <div role="region" className="px-5 py-12 sm:px-8 sm:py-16 md:px-20 md:py-24 text-center text-[#f2e8d0]" style={{ backgroundColor: C.maroonDeep }}>
        <div className="stamp-ring" style={{ width: '80px', height: '80px', margin: '0 auto 2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src={logoImg} alt="Panchajanya" style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'contain' }} />
        </div>
        <h2 style={{ fontFamily: D, fontStyle: 'italic', fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 400, lineHeight: 1.1, letterSpacing: '-0.02em', color: C.parchment, marginBottom: '1rem' }}>
          Still have questions?
        </h2>
        <p style={{ fontFamily: B, fontSize: '0.9rem', opacity: 0.55, marginBottom: '2rem', fontWeight: 300, maxWidth: '50ch', margin: '0 auto 2rem' }}>
          Write to us at panchajanyaco05@gmail.com or message on WhatsApp. We reply within a day.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center w-full sm:w-auto">
          <button onClick={() => window.open('mailto:panchajanyaco05@gmail.com')} style={{ fontFamily: B, fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', backgroundColor: C.parchment, color: C.maroon, padding: '0.9rem 2rem', border: 'none', cursor: 'pointer', textAlign: 'center' }}>
            Email Us
          </button>
          <Link to="/story" style={{ fontFamily: B, fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', border: '1px solid rgba(242,232,208,0.25)', color: C.parchment, padding: '0.9rem 2rem', textDecoration: 'none', textAlign: 'center' }}>
            Our Story
          </Link>
        </div>
      </div>
    </div>
  )
}
