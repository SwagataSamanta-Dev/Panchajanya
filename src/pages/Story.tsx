import { Link } from 'react-router'
import { useState, useEffect } from 'react'
import logoImg from '@/imports/logo.jpeg'
import { C, D, B, PILLARS } from '@/data'
import slide1 from '@/imports/WhatsApp_Image_2026-08-29_at_4.42.30_PM.jpeg'
import slide2 from '@/imports/WhatsApp_Image_2026-08-29_at_4.42.02_PM__1_.jpeg'
import slide3 from '@/imports/WhatsApp_Image_2026-08-29_at_4.42.03_PM.jpeg'
import slide4 from '@/imports/WhatsApp_Image_2026-08-29_at_4.42.03_PM__1_.jpeg'
import slide5 from '@/imports/WhatsApp_Image_2026-08-29_at_4.42.03_PM__2_.jpeg'

const SLIDES = [slide1, slide2, slide3, slide4, slide5]

export default function Story() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setActive(i => (i + 1) % SLIDES.length), 3000)
    return () => clearInterval(t)
  }, [])

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      <img src={logoImg} alt="" aria-hidden="true" style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '600px', objectFit: 'contain', opacity: 0.05, pointerEvents: 'none', userSelect: 'none', zIndex: 0 }} />
      {/* HEADER */}
      <div style={{ backgroundColor: C.fog, paddingTop: '68px', position: 'relative', overflow: 'hidden' }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-0 lg:min-h-[580px] items-stretch">
          {/* Left: text */}
          <div className="p-6 sm:p-10 md:p-16 lg:p-20 flex flex-col justify-center relative z-10">
            <p style={{ fontFamily: B, fontSize: '0.78rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: C.maroonMid, marginBottom: '1.25rem' }}>
              <Link to="/" style={{ color: C.maroonMid, textDecoration: 'none', opacity: 0.5 }}>Home</Link>
              <span style={{ opacity: 0.3, margin: '0 0.5rem' }}>→</span> Our Story
            </p>
            <h1 style={{ fontFamily: D, fontStyle: 'italic', fontSize: 'clamp(2.2rem, 4vw, 4rem)', fontWeight: 400, lineHeight: 1.0, letterSpacing: '-0.03em', color: C.maroon, margin: '0 0 1.75rem' }}>
              A village, a skill,<br />and a market.
            </h1>
            <p style={{ fontFamily: B, fontSize: '0.95rem', lineHeight: 1.8, opacity: 0.65, maxWidth: '44ch', fontWeight: 300 }}>
              Panchajanya started in Sonarpur, a suburb in South 24 Parganas, Kolkata. The idea was simple: train unemployed young women in craft, give them a workspace, and connect the work to a real market.
            </p>
            {/* dots */}
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '2.5rem' }}>
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  style={{ width: i === active ? '22px' : '8px', height: '8px', borderRadius: '4px', border: 'none', backgroundColor: i === active ? C.maroon : 'rgba(117,24,40,0.25)', padding: 0, cursor: 'pointer', transition: 'all 0.3s ease' }}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Right: auto slider */}
          <div className="relative overflow-hidden h-[300px] sm:h-[400px] lg:h-full min-h-[300px]" style={{ backgroundColor: C.sand }}>
            {SLIDES.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`Artisan photo ${i + 1}`}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  opacity: i === active ? 1 : 0,
                  transition: 'opacity 0.7s ease',
                }}
              />
            ))}
            {/* slide counter */}
            <div style={{ position: 'absolute', bottom: '1.25rem', right: '1.5rem', fontFamily: B, fontSize: '0.75rem', color: 'rgba(242,232,208,0.7)', letterSpacing: '0.1em', zIndex: 2 }}>
              {String(active + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
            </div>
          </div>
        </div>
      </div>

      {/* MANIFESTO */}
      <div role="region" className="mob-section-lg px-5 py-12 sm:px-8 sm:py-16 md:px-20 md:py-24 text-center" style={{ backgroundColor: C.maroon, color: C.parchment }}>
        <div style={{ width: '3rem', height: '1px', backgroundColor: C.sand, margin: '0 auto 2.5rem', opacity: 0.5 }} />
        <p style={{ fontFamily: D, fontStyle: 'italic', fontSize: 'clamp(1.75rem, 4vw, 3.5rem)', fontWeight: 300, lineHeight: 1.1, color: C.parchment, letterSpacing: '-0.03em', maxWidth: '22ch', margin: '0 auto' }}>
          "We didn't want charity. We wanted commerce. A dignified wage for dignified work."
        </p>
        <div style={{ width: '3rem', height: '1px', backgroundColor: C.sand, margin: '2.5rem auto', opacity: 0.5 }} />
        <p style={{ fontFamily: B, fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', opacity: 0.45 }}>
          Founder · Panchajanya
        </p>
      </div>

      {/* ORIGIN STORY */}
      <div role="region" className="grid grid-cols-1 lg:grid-cols-2 min-h-0 lg:min-h-[400px]">
        <div className="overflow-hidden h-[260px] sm:h-[360px] lg:h-full" style={{ backgroundColor: C.sand }}>
          <img src={slide1} alt="Artisan at work — Sonarpur" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        </div>
        <div className="p-6 sm:p-10 lg:p-16 flex flex-col justify-center" style={{ backgroundColor: C.parchment }}>
          <p style={{ fontFamily: B, fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: C.maroonMid, marginBottom: '1.25rem' }}>The Beginning</p>
          <h2 style={{ fontFamily: D, fontStyle: 'italic', fontSize: 'clamp(1.75rem, 3vw, 2.75rem)', fontWeight: 400, lineHeight: 1.1, letterSpacing: '-0.02em', color: C.maroon, marginBottom: '1.5rem' }}>
            Sonarpur, 2022.<br />No funding. No plan B.
          </h2>
          <p style={{ fontFamily: B, fontSize: '0.925rem', lineHeight: 1.85, opacity: 0.65, fontWeight: 300, marginBottom: '1.5rem' }}>
            The programme began in a single room with six women and a roll of 12 oz canvas. No grant, no angel investor — just a product that people wanted, and women who were determined to make it.
          </p>
          <p style={{ fontFamily: B, fontSize: '0.925rem', lineHeight: 1.85, opacity: 0.65, fontWeight: 300 }}>
            Within the first month, every piece sold. Today the range covers 35+ products across bags, kaftans, jackets, and home decor. The training facility is free and open to any woman in the area who wants to join.
          </p>
        </div>
      </div>

      {/* IMPACT STATS */}
      <div role="region" className="dot-grid mob-section-lg px-5 py-12 sm:px-8 sm:py-16 md:px-20 md:py-24" style={{ backgroundColor: C.maroonDeep, color: C.parchment }}>
        <p style={{ fontFamily: B, fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: C.sand, opacity: 0.7, marginBottom: '2.5rem', textAlign: 'center' }}>Impact in Numbers</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 border-t border-b border-[rgba(242,232,208,0.1)]">
          {[
            ['₹80k',  'Revenue in 25 days'],
            ['35+',   'Product varieties'],
            ['100%',  'Women-made, always'],
            ['Free',  'Training & workspace'],
          ].map(([stat, label], i) => (
            <div key={stat} className="py-6 px-3 sm:p-8 lg:p-10 border-l border-[rgba(242,232,208,0.1)] first:border-l-0 text-center">
              <span style={{ fontFamily: D, fontStyle: 'italic', fontSize: 'clamp(2.25rem, 4.5vw, 3.5rem)', color: C.sand, display: 'block', lineHeight: 1, marginBottom: '0.75rem' }}>{stat}</span>
              <span style={{ fontFamily: B, fontSize: '0.82rem', opacity: 0.5 }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* PILLARS */}
      <div role="region" className="mob-section-lg px-5 py-12 sm:px-8 sm:py-16 md:px-20 md:py-28" style={{ backgroundColor: C.parchment }}>
        <div style={{ marginBottom: '3rem' }}>
          <p style={{ fontFamily: B, fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: C.maroonMid, marginBottom: '0.75rem' }}>What We Stand For</p>
          <h2 style={{ fontFamily: D, fontStyle: 'italic', fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.03em', color: C.maroon, margin: 0 }}>
            Four principles,<br />one community.
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0">
          {PILLARS.map((p, i) => (
            <div key={p.num} className={`relative overflow-hidden p-6 sm:p-8 border-[rgba(117,24,40,0.12)] ${i > 0 ? 'border-t sm:border-t-0 lg:border-l' : ''} ${i === 1 ? 'sm:border-l' : ''} ${i >= 2 ? 'sm:border-t lg:sm:border-t-0' : ''}`}>
              <span style={{ position: 'absolute', top: '-1.5rem', left: '-0.75rem', fontFamily: D, fontSize: '13rem', fontWeight: 500, color: C.maroon, opacity: 0.04, lineHeight: 1, userSelect: 'none', pointerEvents: 'none' }}>{p.num}</span>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <span style={{ fontFamily: B, fontSize: '0.65rem', letterSpacing: '0.18em', color: C.maroonMid, textTransform: 'uppercase' }}>{p.num}</span>
                <h3 style={{ fontFamily: D, fontStyle: 'italic', fontSize: '1.5rem', fontWeight: 400, margin: '0.75rem 0 1rem', color: C.maroon }}>{p.title}</h3>
                <p style={{ fontFamily: B, fontSize: '0.88rem', lineHeight: 1.7, opacity: 0.65, fontWeight: 300 }}>{p.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PROCESS */}
      <div role="region" className="dot-grid mob-section-lg px-5 py-12 sm:px-8 sm:py-16 md:px-20 md:py-28 relative overflow-hidden" style={{ backgroundColor: C.maroonDeep, color: C.parchment }}>
        <div style={{ marginBottom: '4rem' }}>
          <p style={{ fontFamily: B, fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: C.sand, opacity: 0.8, marginBottom: '0.75rem' }}>How It Gets Made</p>
          <h2 style={{ fontFamily: D, fontStyle: 'italic', fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.03em', margin: 0 }}>
            From raw canvas<br /><span style={{ color: C.sand }}>to finished piece.</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 relative">
          <div className="hidden lg:block" style={{ position: 'absolute', top: '2.25rem', left: '12.5%', right: '12.5%', height: '1px', backgroundColor: 'rgba(212,187,138,0.2)' }} />
          {[
            ['Sourcing',  'Organic cotton canvas sourced from weaver cooperatives in Bengal. Each roll is inspected by hand.'],
            ['Training',  'New artisans complete a free programme at our Sonarpur facility before any product leaves the studio.'],
            ['Making',    'Every bag, kaftan, and decor piece is hand-cut and hand-sewn. No machines, no shortcuts.'],
            ['Dispatch',  'Orders are packed in recycled kraft. Bundles ship free. Single items ship via our student delivery network.'],
          ].map(([title, body], i) => (
            <div key={title} className="lg:pr-8 relative z-10">
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', border: `1px solid rgba(212,187,138,0.4)`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', backgroundColor: C.maroonDeep }}>
                <span style={{ fontFamily: D, fontSize: '0.9rem', fontStyle: 'italic', color: C.sand }}>0{i + 1}</span>
              </div>
              <h4 style={{ fontFamily: D, fontStyle: 'italic', fontSize: '1.375rem', fontWeight: 400, color: C.parchment, marginBottom: '0.75rem' }}>{title}</h4>
              <p style={{ fontFamily: B, fontSize: '0.875rem', lineHeight: 1.7, color: 'rgba(242,232,208,0.52)', fontWeight: 300 }}>{body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div role="region" className="mob-section-lg px-5 py-12 sm:px-8 sm:py-16 md:px-20 md:py-24 flex flex-col items-center text-center gap-6" style={{ backgroundColor: C.fog }}>
        <div style={{ width: '3rem', height: '1px', backgroundColor: C.maroon, opacity: 0.3 }} />
        <p style={{ fontFamily: D, fontStyle: 'italic', fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', color: C.maroon, maxWidth: '26ch', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
          Every bag you buy funds free training for a woman in Sonarpur.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
          <Link to="/shop" style={{ fontFamily: B, fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', backgroundColor: C.maroon, color: C.parchment, padding: '0.9rem 2rem', textDecoration: 'none', textAlign: 'center' }}>Shop Now</Link>
          <Link to="/join" style={{ fontFamily: B, fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', border: `1px solid rgba(117,24,40,0.3)`, color: C.maroon, padding: '0.9rem 2rem', textDecoration: 'none', textAlign: 'center' }}>Join the Programme</Link>
        </div>
      </div>
    </div>
  )
}
