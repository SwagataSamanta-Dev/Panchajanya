import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { Button } from '@figma/astraui'
import { useCart, FreeGiftTier } from '@/CartContext'
import { resolveProductImageUrl, BACKEND_URL } from '@/ProductContext'
import { C, D, B } from '@/data'
import logoImg from '@/imports/logo.jpeg'

type Step = 'cart' | 'details' | 'payment' | 'confirm'
type PayMethod = 'razorpay' | 'cod'

type ConfirmedOrder = {
  id: string
  date: string
  items: Array<{
    product: {
      id: number
      name: string
      price: string
      front: string
      front_image?: string
      tag: string
      desc: string
    }
    qty: number
    size: string
  }>
  freeGift?: FreeGiftTier | null
  subtotal: number
  delivery: number
  grandTotal: number
  paymentMethod: PayMethod
  paymentId?: string
  address: string
  city: string
  pincode: string
  customerName: string
  phone: string
  notes?: string
  whatsappUrl: string
}

const STEP_LABELS: Record<Step, string> = {
  cart: 'Bag',
  details: 'Delivery',
  payment: 'Payment',
  confirm: 'Confirmed',
}
const STEP_ORDER: Step[] = ['cart', 'details', 'payment', 'confirm']

function StepBar({ current }: { current: Step }) {
  const ci = STEP_ORDER.indexOf(current)
  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2.5rem' }}>
      {STEP_ORDER.filter(s => s !== 'cart').map((s, i) => {
        const si = STEP_ORDER.indexOf(s)
        const done = si < ci
        const active = s === current
        return (
          <div key={s} style={{ display: 'flex', alignItems: 'center', flex: i < 2 ? 1 : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: done || active ? C.maroon : 'transparent', border: `2px solid ${done || active ? C.maroon : 'rgba(117,24,40,0.2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {done
                  ? <svg width="10" height="10" viewBox="0 0 12 12"><path d="M2 6l3 3 5-5" stroke={C.parchment} strokeWidth="2" fill="none" strokeLinecap="round"/></svg>
                  : <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: active ? C.parchment : 'transparent' }} />
                }
              </div>
              <span style={{ fontFamily: B, fontSize: '0.75rem', fontWeight: active ? 700 : 400, letterSpacing: '0.08em', textTransform: 'uppercase', color: done || active ? C.maroon : C.maroonDeep, opacity: done || active ? 1 : 0.35 }}>
                {STEP_LABELS[s]}
              </span>
            </div>
            {i < 2 && <div style={{ flex: 1, height: '1px', backgroundColor: done ? C.maroon : 'rgba(117,24,40,0.15)', margin: '0 0.75rem' }} />}
          </div>
        )
      })}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '0.85rem 1rem', fontFamily: B, fontSize: '0.92rem',
  border: `1.5px solid rgba(117,24,40,0.2)`, backgroundColor: C.parchment,
  color: C.maroonDeep, outline: 'none', boxSizing: 'border-box',
}
const labelStyle: React.CSSProperties = {
  fontFamily: B, fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase',
  color: C.maroonDeep, opacity: 0.6, display: 'block', marginBottom: '0.4rem', fontWeight: 600,
}

export default function Cart() {
  const { items, remove, setQty, clear, total, count, activeFreeGift, nextTier, freeGiftTiers } = useCart()
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>('cart')

  // Guest Details Form State
  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    pincode: '',
    city: '',
    notes: ''
  })
  const [errors, setErrors] = useState<Partial<typeof form>>({})

  // Payment State
  const [payMethod, setPayMethod] = useState<PayMethod>('razorpay')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isRazorpayModalOpen, setIsRazorpayModalOpen] = useState(false)
  const [razorpayStage, setRazorpayStage] = useState<'methods' | 'processing' | 'success'>('methods')
  const [selectedRzpTab, setSelectedRzpTab] = useState<'upi' | 'card' | 'netbanking'>('upi')
  const [upiId, setUpiId] = useState('customer@okaxis')
  const [cardNumber, setCardNumber] = useState('4111 2222 3333 4444')
  const [confirmedOrder, setConfirmedOrder] = useState<ConfirmedOrder | null>(null)

  const delivery = total >= 900 || items.length >= 3 ? 0 : 80
  const grandTotal = total + delivery

  function validateDelivery() {
    const e: Partial<typeof form> = {}
    if (!form.name.trim()) e.name = 'Full name is required'
    const cleanPhone = form.phone.replace(/[^\d]/g, '')
    if (cleanPhone.length !== 10) e.phone = 'Enter a valid 10-digit WhatsApp phone number'
    if (!form.address.trim()) e.address = 'Street address / house details are required'
    if (!/^\d{6}$/.test(form.pincode.trim())) e.pincode = 'Enter a valid 6-digit postal pincode'
    if (!form.city.trim()) e.city = 'City is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  // Format WhatsApp invoice bill message with free gift breakdown
  function buildWhatsAppInvoice(orderNumber: string, dateStr: string, isPaidOnline: boolean) {
    const cleanPhone = form.phone.replace(/[^\d]/g, '')
    const itemsList = items.map(it => {
      const price = parseInt(it.product.price.replace(/[^\d]/g, ''))
      return `• ${it.product.name} (${it.size}) × ${it.qty} — ₹${(price * it.qty).toLocaleString('en-IN')}`
    }).join('\n')

    const freeGiftSection = activeFreeGift
      ? `\n🎁 *PROMOTIONAL FREE GIFT UNLOCKED:*\n• ${activeFreeGift.name} (Qty: 1) — FREE (Worth ₹${activeFreeGift.value})\n`
      : ''

    const message = `🧾 *PANCHAJANYA INVOICE / ORDER BILL*\n━━━━━━━━━━━━━━━━━━━━━━━\n*Invoice No:* #${orderNumber}\n*Date:* ${dateStr}\n\n*Customer Details:*\n*Name:* ${form.name}\n*WhatsApp:* +91 ${cleanPhone}\n*Address:* ${form.address}, ${form.city} — ${form.pincode}\n*Payment Method:* ${isPaidOnline ? 'Online Payment (Razorpay - Paid ✓)' : 'Cash on Delivery (COD - Pay on Delivery)'}\n\n*Items Ordered:*\n${itemsList}\n${freeGiftSection}\n*Subtotal:* ₹${total.toLocaleString('en-IN')}\n*Delivery Charges:* ${delivery === 0 ? 'FREE ✓' : '₹' + delivery}\n*Total Amount:* ₹${grandTotal.toLocaleString('en-IN')}\n━━━━━━━━━━━━━━━━━━━━━━━\n${form.notes.trim() ? `*Special Notes:* ${form.notes.trim()}\n━━━━━━━━━━━━━━━━━━━━━━━\n` : ''}Thank you for supporting our women artisans in Sonarpur, Kolkata! 🙏`

    return `https://wa.me/919088970848?text=${encodeURIComponent(message)}`
  }

  // Submit order to MySQL backend API
  async function submitOrderToDatabase(paymentId?: string): Promise<string> {
    const isPaid = payMethod === 'razorpay'

    try {
      const regularItems = items.map(it => ({
        product_id: it.product.id,
        product_name: it.product.name,
        quantity: it.qty,
        size: it.size,
        unit_price: parseInt(it.product.price.replace(/[^\d]/g, ''))
      }))

      const freeGiftItems = activeFreeGift ? [{
        product_id: activeFreeGift.productId,
        product_name: `[FREE GIFT] ${activeFreeGift.name}`,
        quantity: 1,
        size: 'Free Gift',
        unit_price: 0
      }] : []

      const payload = {
        customer_name: form.name,
        customer_phone: form.phone.replace(/[^\d]/g, ''),
        shipping_address: form.address,
        shipping_city: form.city,
        shipping_pincode: form.pincode,
        order_notes: form.notes,
        payment_method: payMethod,
        payment_status: isPaid ? 'paid' : 'unpaid',
        razorpay_payment_id: paymentId || null,
        total_amount: grandTotal,
        items: [...regularItems, ...freeGiftItems]
      }

      const res = await fetch(`${BACKEND_URL}/api/orders.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        const json = await res.json()
        if (json.success && json.order_number) {
          return json.order_number
        }
      }
    } catch (err) {
      console.warn('Backend API order save error (fallback to local generation):', err)
    }

    return `PCJ-2026-${Math.floor(1000 + Math.random() * 9000)}`
  }

  // Finalize order state and trigger WhatsApp link
  async function finalizeOrder(paymentId?: string) {
    setIsProcessing(true)
    const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    const isPaid = payMethod === 'razorpay'

    const orderNumber = await submitOrderToDatabase(paymentId)
    const waUrl = buildWhatsAppInvoice(orderNumber, dateStr, isPaid)

    const orderSnapshot: ConfirmedOrder = {
      id: orderNumber,
      date: dateStr,
      items: [...items],
      freeGift: activeFreeGift,
      subtotal: total,
      delivery,
      grandTotal,
      paymentMethod: payMethod,
      paymentId,
      address: form.address,
      city: form.city,
      pincode: form.pincode,
      customerName: form.name,
      phone: form.phone,
      notes: form.notes,
      whatsappUrl: waUrl
    }

    // Backup in localStorage
    try {
      const stored = localStorage.getItem('panchajanya_guest_orders')
      const existing = stored ? JSON.parse(stored) : []
      localStorage.setItem('panchajanya_guest_orders', JSON.stringify([orderSnapshot, ...existing]))
    } catch (e) {
      console.error(e)
    }

    setConfirmedOrder(orderSnapshot)
    clear()
    setIsProcessing(false)
    setIsRazorpayModalOpen(false)
    setStep('confirm')

    // Automatically trigger formatted WhatsApp bill link in new tab
    try {
      window.open(waUrl, '_blank')
    } catch (e) {
      console.log('Popup prevented, user can click button:', e)
    }
  }

  // Trigger Razorpay Test Flow or COD
  function handlePlaceOrder() {
    if (payMethod === 'razorpay') {
      setIsRazorpayModalOpen(true)
      setRazorpayStage('methods')
    } else {
      // Cash on Delivery
      finalizeOrder()
    }
  }

  // Simulate Razorpay transaction
  function processRazorpayPayment() {
    setRazorpayStage('processing')
    setTimeout(() => {
      setRazorpayStage('success')
      const mockPayId = 'pay_test_' + Math.random().toString(36).substring(2, 10).toUpperCase()
      setTimeout(() => {
        finalizeOrder(mockPayId)
      }, 1000)
    }, 1200)
  }

  const OrderSummary = () => (
    <div className="order-summary-sticky" style={{ backgroundColor: C.parchment, border: `1px solid rgba(117,24,40,0.1)`, padding: '2rem', position: 'sticky', top: '88px' }}>
      <h2 style={{ fontFamily: D, fontStyle: 'italic', fontSize: '1.4rem', color: C.maroon, margin: '0 0 1.5rem' }}>Order Summary</h2>
      {items.map(({ product, qty, size }) => (
        <div key={`${product.id}-${size}`} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', alignItems: 'center' }}>
          <img
            src={resolveProductImageUrl(product.front_image || product.front)}
            alt={product.name}
            onError={(e) => {
              const target = e.currentTarget
              if (!target.dataset.fallbackTried) {
                target.dataset.fallbackTried = '1'
                const frontSrc = product.front_image || product.front || '1bag.png'
                const filename = frontSrc.split('/').pop() || '1bag.png'
                target.src = resolveProductImageUrl(filename)
              } else if (target.dataset.fallbackTried === '1') {
                target.dataset.fallbackTried = '2'
                target.src = resolveProductImageUrl('1bag.png')
              }
            }}
            style={{ width: '52px', height: '52px', objectFit: 'cover', flexShrink: 0 }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontFamily: B, fontSize: '0.85rem', fontWeight: 600, color: C.maroonDeep, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.name}</p>
            <p style={{ fontFamily: B, fontSize: '0.75rem', opacity: 0.5, margin: '0.1rem 0 0' }}>Qty {qty} · Size {size}</p>
          </div>
          <span style={{ fontFamily: B, fontSize: '0.88rem', fontWeight: 700, color: C.maroon, flexShrink: 0 }}>
            ₹{(parseInt(product.price.replace(/[^\d]/g, '')) * qty).toLocaleString('en-IN')}
          </span>
        </div>
      ))}
      {activeFreeGift && (
        <div style={{
          backgroundColor: '#f0fdf4',
          border: '1px dashed #22c55e',
          padding: '0.75rem 0.85rem',
          marginBottom: '1rem',
          display: 'flex',
          gap: '0.75rem',
          alignItems: 'center',
          borderRadius: '4px'
        }}>
          <img
            src={resolveProductImageUrl(activeFreeGift.image)}
            alt={activeFreeGift.name}
            style={{ width: '46px', height: '46px', objectFit: 'cover', borderRadius: '4px', border: '1px solid rgba(34,197,94,0.3)', flexShrink: 0 }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.15rem' }}>
              <span style={{ fontFamily: B, fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', backgroundColor: '#16a34a', color: '#fff', padding: '0.12rem 0.45rem', borderRadius: '3px' }}>
                🎁 FREE GIFT
              </span>
              <span style={{ fontFamily: B, fontSize: '0.68rem', color: '#6b7280', textDecoration: 'line-through' }}>₹{activeFreeGift.value}</span>
            </div>
            <p style={{ fontFamily: B, fontSize: '0.82rem', fontWeight: 700, color: '#14532d', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {activeFreeGift.name}
            </p>
            <p style={{ fontFamily: B, fontSize: '0.7rem', color: '#166534', margin: 0 }}>
              {activeFreeGift.badge}
            </p>
          </div>
          <span style={{ fontFamily: B, fontSize: '0.88rem', fontWeight: 800, color: '#16a34a', flexShrink: 0 }}>
            ₹0
          </span>
        </div>
      )}
      <div style={{ borderTop: `1px solid rgba(117,24,40,0.1)`, paddingTop: '1rem', marginTop: '0.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: B, fontSize: '0.85rem', marginBottom: '0.5rem', opacity: 0.6 }}>
          <span>Subtotal</span><span>₹{total.toLocaleString('en-IN')}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: B, fontSize: '0.85rem', marginBottom: '1rem', opacity: 0.6 }}>
          <span>Delivery Charges</span>
          <span>{delivery === 0 ? <span style={{ color: '#2a9d2a', fontWeight: 700 }}>Free ✓</span> : `₹${delivery}`}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: B, fontSize: '1.1rem', fontWeight: 700, color: C.maroon, paddingTop: '0.75rem', borderTop: `1px solid rgba(117,24,40,0.1)` }}>
          <span>Total Payable</span><span>₹{grandTotal.toLocaleString('en-IN')}</span>
        </div>
      </div>
    </div>
  )

  // ── CONFIRMED VIEW ──
  if (step === 'confirm') {
    const o = confirmedOrder || {
      id: 'PCJ-2026-0001',
      date: 'Today',
      items: items.map(i => ({ product: i.product, qty: i.qty, size: i.size })),
      subtotal: total,
      delivery,
      grandTotal,
      paymentMethod: payMethod,
      address: form.address,
      city: form.city,
      pincode: form.pincode,
      customerName: form.name,
      phone: form.phone,
      whatsappUrl: `https://wa.me/919088970848?text=Order%20Confirmation`
    }

    return (
      <div style={{ paddingTop: '68px', minHeight: '100vh', backgroundColor: C.fog, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1.5rem' }}>
        <div style={{ textAlign: 'center', padding: '3.5rem 2.5rem', maxWidth: '620px', width: '100%', backgroundColor: C.parchment, border: `1px solid rgba(117,24,40,0.15)`, boxShadow: '0 12px 40px rgba(0,0,0,0.06)' }}>
          
          <div style={{ width: '72px', height: '72px', borderRadius: '50%', backgroundColor: '#1e6b3a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 8px 24px rgba(30,107,58,0.25)' }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
          </div>

          <span style={{ display: 'inline-block', fontFamily: B, fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#1e6b3a', backgroundColor: 'rgba(30,107,58,0.1)', padding: '0.25rem 0.85rem', borderRadius: '20px', marginBottom: '0.75rem', fontWeight: 700 }}>
            Order Placed · #{o.id}
          </span>

          <h1 style={{ fontFamily: D, fontStyle: 'italic', fontSize: '2.5rem', color: C.maroon, margin: '0 0 0.5rem', fontWeight: 400 }}>
            Thank You, {o.customerName}!
          </h1>
          <p style={{ fontFamily: B, fontSize: '0.95rem', lineHeight: 1.6, opacity: 0.75, marginBottom: '0.35rem' }}>
            Your order has been recorded directly in our workshop database.
          </p>
          <p style={{ fontFamily: B, fontSize: '0.85rem', lineHeight: 1.6, opacity: 0.6, marginBottom: '1.5rem' }}>
            We have prepared your formatted itemized WhatsApp bill for <strong>+91 {o.phone}</strong>.
          </p>

          {/* WhatsApp Action Button */}
          <div style={{ marginBottom: '2rem' }}>
            <a
              href={o.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.65rem',
                backgroundColor: '#25D366',
                color: '#ffffff',
                padding: '0.95rem 2rem',
                borderRadius: '6px',
                textDecoration: 'none',
                fontFamily: B,
                fontSize: '0.92rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                boxShadow: '0 4px 14px rgba(37, 211, 102, 0.35)',
                transition: 'transform 0.15s, box-shadow 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-1px)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
              Open WhatsApp Bill / Invoice 💬
            </a>
          </div>

          {/* Invoice Summary Box */}
          <div style={{ backgroundColor: 'rgba(117,24,40,0.03)', border: `1px solid rgba(117,24,40,0.12)`, padding: '1.5rem', marginBottom: '2rem', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: `1px solid rgba(117,24,40,0.1)`, paddingBottom: '0.75rem', marginBottom: '0.75rem' }}>
              <div>
                <span style={{ fontFamily: B, fontSize: '0.7rem', textTransform: 'uppercase', opacity: 0.5, display: 'block' }}>Invoice No</span>
                <strong style={{ fontFamily: B, fontSize: '0.95rem', color: C.maroon }}>#{o.id}</strong>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontFamily: B, fontSize: '0.7rem', textTransform: 'uppercase', opacity: 0.5, display: 'block' }}>Payment Method</span>
                <strong style={{ fontFamily: B, fontSize: '0.88rem', color: o.paymentMethod === 'razorpay' ? '#283593' : C.maroonDeep }}>
                  {o.paymentMethod === 'razorpay' ? 'Razorpay (Paid ✓)' : 'Cash on Delivery'}
                </strong>
              </div>
            </div>

            <div style={{ maxHeight: '160px', overflowY: 'auto', marginBottom: '0.75rem', paddingRight: '0.5rem' }}>
              {o.items.map(({ product, qty, size }) => (
                <div key={`${product.id}-${size}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: B, fontSize: '0.85rem', padding: '0.45rem 0', borderBottom: `1px solid rgba(117,24,40,0.06)` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <img
                      src={resolveProductImageUrl(product.front_image || product.front)}
                      alt=""
                      onError={(e) => {
                        const target = e.currentTarget
                        if (!target.dataset.fallbackTried) {
                          target.dataset.fallbackTried = '1'
                          const frontSrc = product.front_image || product.front || '1bag.png'
                          const filename = frontSrc.split('/').pop() || '1bag.png'
                          target.src = resolveProductImageUrl(filename)
                        } else if (target.dataset.fallbackTried === '1') {
                          target.dataset.fallbackTried = '2'
                          target.src = resolveProductImageUrl('1bag.png')
                        }
                      }}
                      style={{ width: '36px', height: '42px', objectFit: 'cover' }}
                    />
                    <div>
                      <p style={{ margin: 0, fontWeight: 600, color: C.maroonDeep, fontSize: '0.85rem' }}>{product.name}</p>
                      <span style={{ fontSize: '0.75rem', opacity: 0.5 }}>Qty {qty} · Size {size}</span>
                    </div>
                  </div>
                  <span style={{ fontWeight: 700, color: C.maroon }}>₹{(parseInt(product.price.replace(/[^\d]/g, '')) * qty).toLocaleString('en-IN')}</span>
                </div>
              ))}
              {o.freeGift && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f0fdf4', border: '1px dashed #22c55e', padding: '0.5rem 0.65rem', margin: '0.4rem 0', borderRadius: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <img
                      src={resolveProductImageUrl(o.freeGift.image)}
                      alt=""
                      style={{ width: '36px', height: '36px', objectFit: 'cover', borderRadius: '3px', border: '1px solid rgba(34,197,94,0.3)' }}
                    />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{ fontSize: '0.6rem', fontWeight: 700, backgroundColor: '#16a34a', color: '#fff', padding: '0.1rem 0.35rem', borderRadius: '2px' }}>🎁 FREE GIFT</span>
                        <strong style={{ fontSize: '0.82rem', color: '#14532d' }}>{o.freeGift.name}</strong>
                      </div>
                      <span style={{ fontSize: '0.7rem', color: '#166534' }}>Fulfillment: Included in Shiprocket parcel</span>
                    </div>
                  </div>
                  <span style={{ fontWeight: 800, color: '#16a34a', fontSize: '0.85rem' }}>FREE</span>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: B, fontSize: '0.82rem', opacity: 0.65, paddingTop: '0.4rem' }}>
              <span>Delivery Address</span>
              <span style={{ maxWidth: '65%', textAlign: 'right', fontWeight: 500 }}>{o.address}, {o.city} — {o.pincode}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: B, fontSize: '1.05rem', fontWeight: 700, color: C.maroon, paddingTop: '0.75rem', marginTop: '0.5rem', borderTop: `1px solid rgba(117,24,40,0.12)` }}>
              <span>Total Amount</span>
              <span>₹{o.grandTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/shop')}
            style={{ padding: '0.85rem 2rem', backgroundColor: C.maroon, color: C.parchment, fontFamily: B, fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', border: 'none', cursor: 'pointer', transition: 'opacity 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            Back to Collection →
          </button>
        </div>
      </div>
    )
  }

  // ── PAYMENT STEP ──
  if (step === 'payment') {
    return (
      <div style={{ paddingTop: '68px', minHeight: '100vh', backgroundColor: C.fog }}>
        <div className="page-2col" style={{ maxWidth: '1100px', margin: '0 auto', padding: '5rem 3rem', display: 'grid', gridTemplateColumns: '1fr 380px', gap: '4rem', alignItems: 'start' }}>
          <div>
            <button onClick={() => setStep('details')} style={{ fontFamily: B, fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: C.maroonMid, background: 'none', border: 'none', cursor: 'pointer', opacity: 0.5, padding: 0, marginBottom: '1.5rem' }}>
              ← Back to Delivery
            </button>
            <StepBar current="payment" />
            <h1 style={{ fontFamily: D, fontStyle: 'italic', fontSize: '2.25rem', color: C.maroon, margin: '0 0 0.5rem', fontWeight: 400 }}>Choose Payment</h1>
            <p style={{ fontFamily: B, fontSize: '0.85rem', opacity: 0.5, marginBottom: '2rem' }}>Direct bank-grade security & automated order routing.</p>

            {/* Razorpay Online Payment Option */}
            <button
              type="button"
              onClick={() => setPayMethod('razorpay')}
              style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', width: '100%', padding: '1.25rem 1.5rem', border: `2px solid ${payMethod === 'razorpay' ? '#3395ff' : 'rgba(117,24,40,0.15)'}`, backgroundColor: payMethod === 'razorpay' ? 'rgba(51,149,255,0.04)' : C.parchment, cursor: 'pointer', marginBottom: '1rem', textAlign: 'left', transition: 'all 0.15s' }}
            >
              <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: `2px solid ${payMethod === 'razorpay' ? '#3395ff' : 'rgba(117,24,40,0.3)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '3px' }}>
                {payMethod === 'razorpay' && <div style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: '#3395ff' }} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#0c2340" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span style={{ fontFamily: B, fontSize: '1rem', fontWeight: 700, color: '#0c2340' }}>Online Payment (Razorpay)</span>
                  <span style={{ fontFamily: B, fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', backgroundColor: '#e8f5e9', color: '#1b5e20', padding: '0.15rem 0.5rem', borderRadius: '10px' }}>
                    Instant Confirmation
                  </span>
                </div>
                <p style={{ fontFamily: B, fontSize: '0.78rem', opacity: 0.6, margin: 0, lineHeight: 1.5 }}>
                  Pay via UPI (GPay, PhonePe, Paytm), Credit/Debit Cards, NetBanking, or Digital Wallets.
                </p>
              </div>
            </button>

            {/* COD Option */}
            <button
              type="button"
              onClick={() => setPayMethod('cod')}
              style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', width: '100%', padding: '1.25rem 1.5rem', border: `2px solid ${payMethod === 'cod' ? C.maroon : 'rgba(117,24,40,0.15)'}`, backgroundColor: payMethod === 'cod' ? 'rgba(117,24,40,0.04)' : C.parchment, cursor: 'pointer', marginBottom: '1.5rem', textAlign: 'left', transition: 'all 0.15s' }}
            >
              <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: `2px solid ${payMethod === 'cod' ? C.maroon : 'rgba(117,24,40,0.3)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '3px' }}>
                {payMethod === 'cod' && <div style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: C.maroon }} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.maroon} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="6" width="20" height="12" rx="2"/><path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0-6 0"/><path d="M6 12h.01M18 12h.01"/>
                  </svg>
                  <span style={{ fontFamily: B, fontSize: '1rem', fontWeight: 700, color: C.maroonDeep }}>Cash on Delivery (COD)</span>
                </div>
                <p style={{ fontFamily: B, fontSize: '0.78rem', opacity: 0.6, margin: 0, lineHeight: 1.5 }}>
                  Pay cash or UPI upon delivery. Available across all serviceable pincodes.
                </p>
              </div>
            </button>

            {/* Security note */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', marginBottom: '2rem', opacity: 0.55 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.maroon} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
              </svg>
              <span style={{ fontFamily: B, fontSize: '0.75rem', color: C.maroonDeep }}>256-bit SSL encrypted · Razorpay Verified Merchant · NPCI Certified</span>
            </div>

            {/* Place Order CTA Button */}
            <button
              onClick={handlePlaceOrder}
              disabled={isProcessing}
              style={{ width: '100%', padding: '1.1rem', backgroundColor: payMethod === 'razorpay' ? '#0c2340' : C.maroon, color: C.parchment, fontFamily: B, fontSize: '0.92rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', border: 'none', cursor: isProcessing ? 'wait' : 'pointer', transition: 'opacity 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              {isProcessing
                ? 'Confirming Order…'
                : payMethod === 'razorpay'
                  ? `Pay ₹${grandTotal.toLocaleString('en-IN')} via Razorpay →`
                  : 'Place Order with Cash on Delivery →'
              }
            </button>
          </div>

          <OrderSummary />
        </div>

        {/* ── Razorpay Test Gateway Modal ── */}
        {isRazorpayModalOpen && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(12, 35, 64, 0.75)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1.5rem' }}>
            <div style={{ backgroundColor: '#ffffff', borderRadius: '10px', boxShadow: '0 20px 60px rgba(0,0,0,0.35)', maxWidth: '440px', width: '100%', overflow: 'hidden', textAlign: 'left', border: '1px solid #d1d5db' }}>
              
              {/* Razorpay Brand Header */}
              <div style={{ backgroundColor: '#0c2340', color: '#ffffff', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '6px', backgroundColor: '#3395ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1rem', color: '#fff' }}>
                    R
                  </div>
                  <div>
                    <strong style={{ fontSize: '0.95rem', letterSpacing: '0.04em', display: 'block' }}>Razorpay Test Gateway</strong>
                    <span style={{ fontSize: '0.7rem', color: '#93c5fd' }}>Panchajanya D2C Workshop</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.7rem', opacity: 0.75, display: 'block', textTransform: 'uppercase' }}>Amount</span>
                  <strong style={{ fontSize: '1.1rem', color: '#fff' }}>₹{grandTotal.toLocaleString('en-IN')}</strong>
                </div>
              </div>

              {/* Razorpay Body */}
              <div style={{ padding: '1.75rem 1.5rem' }}>
                {razorpayStage === 'methods' && (
                  <div>
                    {/* Payment tabs */}
                    <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', marginBottom: '1.25rem' }}>
                      {[
                        { id: 'upi' as const, label: 'UPI (GPay/PhonePe)' },
                        { id: 'card' as const, label: 'Cards' },
                        { id: 'netbanking' as const, label: 'NetBanking' }
                      ].map(tab => (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setSelectedRzpTab(tab.id)}
                          style={{
                            padding: '0.65rem 0.85rem',
                            border: 'none',
                            background: 'none',
                            cursor: 'pointer',
                            fontFamily: B,
                            fontSize: '0.82rem',
                            fontWeight: selectedRzpTab === tab.id ? 700 : 500,
                            color: selectedRzpTab === tab.id ? '#3395ff' : '#6b7280',
                            borderBottom: selectedRzpTab === tab.id ? '2px solid #3395ff' : 'none',
                          }}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    {selectedRzpTab === 'upi' && (
                      <div>
                        <label style={{ ...labelStyle, color: '#374151' }}>Enter UPI ID / VPA</label>
                        <input
                          value={upiId}
                          onChange={e => setUpiId(e.target.value)}
                          placeholder="yourname@okhdfcbank"
                          style={{ ...inputStyle, backgroundColor: '#f9fafb', borderColor: '#d1d5db', borderRadius: '4px', marginBottom: '1rem' }}
                        />
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                          {['GPay', 'PhonePe', 'Paytm'].map(app => (
                            <button
                              key={app}
                              type="button"
                              onClick={() => setUpiId(`customer@${app.toLowerCase()}`)}
                              style={{ padding: '0.35rem 0.65rem', border: '1px solid #e5e7eb', backgroundColor: '#f3f4f6', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, color: '#374151', cursor: 'pointer' }}
                            >
                              {app}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedRzpTab === 'card' && (
                      <div>
                        <label style={{ ...labelStyle, color: '#374151' }}>Test Card Number</label>
                        <input
                          value={cardNumber}
                          onChange={e => setCardNumber(e.target.value)}
                          style={{ ...inputStyle, backgroundColor: '#f9fafb', borderColor: '#d1d5db', borderRadius: '4px', marginBottom: '0.75rem' }}
                        />
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                          <div>
                            <label style={{ ...labelStyle, color: '#374151' }}>Expiry</label>
                            <input value="12 / 28" readOnly style={{ ...inputStyle, backgroundColor: '#f9fafb', borderColor: '#d1d5db', borderRadius: '4px' }} />
                          </div>
                          <div>
                            <label style={{ ...labelStyle, color: '#374151' }}>CVV</label>
                            <input value="123" readOnly style={{ ...inputStyle, backgroundColor: '#f9fafb', borderColor: '#d1d5db', borderRadius: '4px' }} />
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedRzpTab === 'netbanking' && (
                      <div style={{ marginBottom: '1rem' }}>
                        <label style={{ ...labelStyle, color: '#374151' }}>Popular Banks</label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                          {['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank'].map(bName => (
                            <button
                              key={bName}
                              type="button"
                              style={{ padding: '0.6rem', border: '1px solid #d1d5db', borderRadius: '4px', backgroundColor: '#f9fafb', fontSize: '0.78rem', fontWeight: 600, color: '#1f2937', cursor: 'pointer', textAlign: 'center' }}
                            >
                              {bName}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                      <button
                        type="button"
                        onClick={processRazorpayPayment}
                        style={{ flex: 1, padding: '0.9rem', backgroundColor: '#3395ff', color: '#fff', border: 'none', borderRadius: '6px', fontFamily: B, fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer' }}
                      >
                        Simulate Payment Success →
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsRazorpayModalOpen(false)}
                        style={{ padding: '0.9rem 1.2rem', backgroundColor: '#f3f4f6', color: '#4b5563', border: '1px solid #d1d5db', borderRadius: '6px', fontFamily: B, fontSize: '0.85rem', cursor: 'pointer' }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {razorpayStage === 'processing' && (
                  <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                    <div style={{ width: '48px', height: '48px', margin: '0 auto 1.25rem', border: '3.5px solid #e5e7eb', borderTopColor: '#3395ff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    <h3 style={{ fontSize: '1.15rem', color: '#111827', margin: '0 0 0.5rem' }}>Authorizing with Bank…</h3>
                    <p style={{ fontSize: '0.82rem', color: '#6b7280', margin: 0 }}>Simulating Razorpay 3D-Secure 2.0 verification</p>
                  </div>
                )}

                {razorpayStage === 'success' && (
                  <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#10b981', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', fontSize: '1.5rem' }}>
                      ✓
                    </div>
                    <h3 style={{ fontSize: '1.15rem', color: '#10b981', margin: '0 0 0.5rem' }}>Payment Authorized!</h3>
                    <p style={{ fontSize: '0.82rem', color: '#6b7280', margin: 0 }}>Generating order invoice & updating workshop database…</p>
                  </div>
                )}
              </div>

              {/* Razorpay Footer */}
              <div style={{ backgroundColor: '#f9fafb', padding: '0.75rem 1.5rem', borderTop: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem', color: '#6b7280' }}>
                <span>Secured by Razorpay</span>
                <span>PCI-DSS Level 1 Compliant</span>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // ── DETAILS STEP (GUEST CHECKOUT) ──
  if (step === 'details') {
    return (
      <div style={{ paddingTop: '68px', minHeight: '100vh', backgroundColor: C.fog }}>
        <div className="page-2col" style={{ maxWidth: '1100px', margin: '0 auto', padding: '5rem 3rem', display: 'grid', gridTemplateColumns: '1fr 380px', gap: '4rem', alignItems: 'start' }}>
          <div>
            <button onClick={() => setStep('cart')} style={{ fontFamily: B, fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: C.maroonMid, background: 'none', border: 'none', cursor: 'pointer', opacity: 0.5, padding: 0, marginBottom: '1.5rem' }}>
              ← Back to Bag
            </button>
            <StepBar current="details" />
            <h1 style={{ fontFamily: D, fontStyle: 'italic', fontSize: '2.25rem', color: C.maroon, margin: '0 0 0.5rem', fontWeight: 400 }}>Delivery Details</h1>
            <p style={{ fontFamily: B, fontSize: '0.85rem', opacity: 0.5, marginBottom: '2rem' }}>Quick guest checkout — no password or account creation required.</p>

            {[
              { key: 'name',    label: 'Full Name',              placeholder: 'e.g. Priya Sen',              type: 'text' },
              { key: 'phone',   label: 'WhatsApp Phone Number',  placeholder: '10-digit mobile number',      type: 'tel'  },
              { key: 'address', label: 'Delivery Address',       placeholder: 'House/Flat No, Street, Landmark', type: 'text' },
              { key: 'pincode', label: 'Postal Pincode',         placeholder: '6-digit pincode (e.g. 700045)', type: 'text' },
              { key: 'city',    label: 'City',                   placeholder: 'e.g. Kolkata',                type: 'text' },
              { key: 'notes',   label: 'Delivery Notes (optional)', placeholder: 'Any special instructions for courier/artisans…', type: 'text' },
            ].map(({ key, label, placeholder, type }) => (
              <div key={key} style={{ marginBottom: '1.25rem' }}>
                <label style={labelStyle}>{label}</label>
                <input
                  type={type}
                  placeholder={placeholder}
                  value={form[key as keyof typeof form]}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  style={{ ...inputStyle, border: `1.5px solid ${errors[key as keyof typeof errors] ? '#c0392b' : 'rgba(117,24,40,0.2)'}` }}
                />
                {errors[key as keyof typeof errors] && (
                  <p style={{ fontFamily: B, fontSize: '0.75rem', color: '#c0392b', marginTop: '0.3rem' }}>{errors[key as keyof typeof errors]}</p>
                )}
              </div>
            ))}

            <button
              onClick={() => { if (validateDelivery()) setStep('payment') }}
              style={{ width: '100%', padding: '1rem', backgroundColor: C.maroon, color: C.parchment, fontFamily: B, fontSize: '0.88rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', border: 'none', cursor: 'pointer', marginTop: '1.5rem', transition: 'opacity 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              Continue to Payment →
            </button>
          </div>

          <OrderSummary />
        </div>
      </div>
    )
  }

  // ── CART BAG VIEW ──
  if (count === 0) {
    return (
      <div style={{ paddingTop: '68px', minHeight: '100vh', backgroundColor: C.fog, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        <img src={logoImg} alt="" aria-hidden="true" style={{ position: 'absolute', width: '520px', height: '520px', objectFit: 'contain', opacity: 0.07, pointerEvents: 'none', userSelect: 'none' }} />
        <div style={{ textAlign: 'center', padding: '4rem 2rem', position: 'relative', zIndex: 1 }}>
          <p style={{ fontFamily: D, fontStyle: 'italic', fontSize: '1.5rem', color: C.maroon, opacity: 0.4, marginBottom: '2rem' }}>Your bag is empty.</p>
          <Button variant="primary" onClick={() => navigate('/shop')}>Browse the Collection</Button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ paddingTop: '68px', minHeight: '100vh', backgroundColor: C.fog, position: 'relative', overflow: 'hidden' }}>
      <img src={logoImg} alt="" aria-hidden="true" style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '600px', objectFit: 'contain', opacity: 0.05, pointerEvents: 'none', userSelect: 'none', zIndex: 0 }} />
      <div className="page-2col" style={{ maxWidth: '1100px', margin: '0 auto', padding: '5rem 3rem', display: 'grid', gridTemplateColumns: '1fr 380px', gap: '4rem', alignItems: 'start', position: 'relative', zIndex: 1 }}>

        {/* Cart items */}
        <div>
          <h1 style={{ fontFamily: D, fontStyle: 'italic', fontSize: '2.5rem', color: C.maroon, margin: '0 0 0.4rem', fontWeight: 400 }}>Your Bag</h1>
          <p style={{ fontFamily: B, fontSize: '0.82rem', opacity: 0.45, marginBottom: '1.5rem' }}>{count} item{count !== 1 ? 's' : ''}</p>

          {/* Panchajanya Free-Gift Tier Rewards Banner */}
          <div style={{
            backgroundColor: C.parchment,
            border: `1.5px solid ${activeFreeGift ? '#22c55e' : 'rgba(117,24,40,0.18)'}`,
            padding: '1.25rem 1.5rem',
            marginBottom: '2rem',
            boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
            borderRadius: '2px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.2rem' }}>🎁</span>
                <strong style={{ fontFamily: D, fontStyle: 'italic', fontSize: '1.2rem', color: C.maroon }}>Artisan Promotional Rewards</strong>
              </div>
              <span style={{ fontFamily: B, fontSize: '0.78rem', fontWeight: 700, color: activeFreeGift ? '#15803d' : C.maroonDeep }}>
                {activeFreeGift ? `Active Gift: ${activeFreeGift.name}` : 'Spend ₹1,000+ to unlock gifts'}
              </span>
            </div>

            {/* Motivational message */}
            <p style={{ fontFamily: B, fontSize: '0.84rem', color: C.maroonDeep, margin: '0 0 1rem', lineHeight: 1.5 }}>
              {total >= 3000 ? (
                <span style={{ color: '#15803d', fontWeight: 600 }}>
                  🎉 <strong>Top Tier Unlocked!</strong> You have earned our premium complimentary <strong>Free Special Big Bag</strong> (Valued at ₹599) with your order!
                </span>
              ) : nextTier ? (
                <span>
                  {activeFreeGift && <span style={{ color: '#15803d', fontWeight: 600 }}>Unlocked: {activeFreeGift.name}! </span>}
                  Add <strong style={{ color: C.maroon }}>₹{nextTier.amountNeeded.toLocaleString('en-IN')}</strong> more to unlock the <strong style={{ color: C.maroon }}>{nextTier.tier.name}</strong> (Valued at ₹{nextTier.tier.value})!
                </span>
              ) : null}
            </p>

            {/* Multi-Milestone Progress Bar */}
            <div style={{ position: 'relative', height: '8px', backgroundColor: 'rgba(117,24,40,0.1)', borderRadius: '4px', margin: '1.5rem 0.5rem 2.5rem' }}>
              <div style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: `${Math.min(100, Math.round((total / 3000) * 100))}%`,
                backgroundColor: total >= 3000 ? '#16a34a' : (total >= 1000 ? '#22c55e' : C.maroon),
                borderRadius: '4px',
                transition: 'width 0.4s ease'
              }} />

              {/* Tier 1: ₹1,000 (33.3%) */}
              <div style={{ position: 'absolute', left: '33.3%', top: '50%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{
                  width: '20px', height: '20px', borderRadius: '50%',
                  backgroundColor: total >= 1000 ? '#16a34a' : '#fff',
                  border: `2px solid ${total >= 1000 ? '#16a34a' : 'rgba(117,24,40,0.3)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                }}>
                  {total >= 1000 && <span style={{ color: '#fff', fontSize: '11px', fontWeight: 800 }}>✓</span>}
                </div>
                <div style={{ position: 'absolute', top: '22px', whiteSpace: 'nowrap', textAlign: 'center' }}>
                  <span style={{ display: 'block', fontFamily: B, fontSize: '0.68rem', fontWeight: total >= 1000 ? 700 : 500, color: total >= 1000 ? '#16a34a' : C.maroonDeep, opacity: total >= 1000 ? 1 : 0.6 }}>₹1,000</span>
                  <span style={{ display: 'block', fontFamily: B, fontSize: '0.62rem', color: total >= 1000 ? '#16a34a' : C.maroonDeep, opacity: total >= 1000 ? 1 : 0.45 }}>Coin Purse</span>
                </div>
              </div>

              {/* Tier 2: ₹2,000 (66.6%) */}
              <div style={{ position: 'absolute', left: '66.6%', top: '50%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{
                  width: '20px', height: '20px', borderRadius: '50%',
                  backgroundColor: total >= 2000 ? '#16a34a' : '#fff',
                  border: `2px solid ${total >= 2000 ? '#16a34a' : 'rgba(117,24,40,0.3)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                }}>
                  {total >= 2000 && <span style={{ color: '#fff', fontSize: '11px', fontWeight: 800 }}>✓</span>}
                </div>
                <div style={{ position: 'absolute', top: '22px', whiteSpace: 'nowrap', textAlign: 'center' }}>
                  <span style={{ display: 'block', fontFamily: B, fontSize: '0.68rem', fontWeight: total >= 2000 ? 700 : 500, color: total >= 2000 ? '#16a34a' : C.maroonDeep, opacity: total >= 2000 ? 1 : 0.6 }}>₹2,000</span>
                  <span style={{ display: 'block', fontFamily: B, fontSize: '0.62rem', color: total >= 2000 ? '#16a34a' : C.maroonDeep, opacity: total >= 2000 ? 1 : 0.45 }}>Rectangle Pouch</span>
                </div>
              </div>

              {/* Tier 3: ₹3,000 (100%) */}
              <div style={{ position: 'absolute', left: '100%', top: '50%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{
                  width: '20px', height: '20px', borderRadius: '50%',
                  backgroundColor: total >= 3000 ? '#16a34a' : '#fff',
                  border: `2px solid ${total >= 3000 ? '#16a34a' : 'rgba(117,24,40,0.3)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                }}>
                  {total >= 3000 && <span style={{ color: '#fff', fontSize: '11px', fontWeight: 800 }}>✓</span>}
                </div>
                <div style={{ position: 'absolute', top: '22px', whiteSpace: 'nowrap', textAlign: 'center' }}>
                  <span style={{ display: 'block', fontFamily: B, fontSize: '0.68rem', fontWeight: total >= 3000 ? 700 : 500, color: total >= 3000 ? '#16a34a' : C.maroonDeep, opacity: total >= 3000 ? 1 : 0.6 }}>₹3,000</span>
                  <span style={{ display: 'block', fontFamily: B, fontSize: '0.62rem', color: total >= 3000 ? '#16a34a' : C.maroonDeep, opacity: total >= 3000 ? 1 : 0.45 }}>Special Big Bag</span>
                </div>
              </div>
            </div>

            {/* Unlocked Gift Highlight Card */}
            {activeFreeGift && (
              <div style={{
                backgroundColor: 'rgba(34,197,94,0.06)',
                border: '1px solid rgba(34,197,94,0.25)',
                padding: '0.75rem 1rem',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <img
                  src={resolveProductImageUrl(activeFreeGift.image)}
                  alt={activeFreeGift.name}
                  style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '4px', border: '1px solid rgba(34,197,94,0.4)', flexShrink: 0 }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ fontFamily: B, fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', backgroundColor: '#16a34a', color: '#fff', padding: '0.1rem 0.4rem', borderRadius: '2px' }}>
                      Auto-Attached to Order
                    </span>
                    <span style={{ fontFamily: B, fontSize: '0.7rem', color: '#6b7280', textDecoration: 'line-through' }}>₹{activeFreeGift.value}</span>
                  </div>
                  <h4 style={{ fontFamily: B, fontSize: '0.88rem', fontWeight: 700, color: '#14532d', margin: '0.2rem 0 0' }}>
                    {activeFreeGift.name}
                  </h4>
                  <p style={{ fontFamily: B, fontSize: '0.72rem', color: '#166534', margin: 0 }}>
                    {activeFreeGift.description} · Complimentary Gift (₹0)
                  </p>
                </div>
                <span style={{ fontFamily: B, fontSize: '0.92rem', fontWeight: 800, color: '#16a34a' }}>
                  FREE
                </span>
              </div>
            )}
          </div>

          {items.map(({ product, qty, size }) => {
            const price = parseInt(product.price.replace(/[^\d]/g, ''))
            return (
              <div key={`${product.id}-${size}`} className="cart-item-row" style={{ display: 'grid', gridTemplateColumns: '110px 1fr auto', gap: '2rem', alignItems: 'start', backgroundColor: C.parchment, padding: '1.75rem', marginBottom: '1.25rem', border: `1px solid rgba(117,24,40,0.08)` }}>
                <img
                  src={resolveProductImageUrl(product.front_image || product.front)}
                  alt={product.name}
                  onError={(e) => {
                    const target = e.currentTarget
                    if (!target.dataset.fallbackTried) {
                      target.dataset.fallbackTried = '1'
                      const frontSrc = product.front_image || product.front || '1bag.png'
                      const filename = frontSrc.split('/').pop() || '1bag.png'
                      target.src = resolveProductImageUrl(filename)
                    } else if (target.dataset.fallbackTried === '1') {
                      target.dataset.fallbackTried = '2'
                      target.src = resolveProductImageUrl('1bag.png')
                    }
                  }}
                  style={{ width: '110px', height: '130px', objectFit: 'cover', display: 'block' }}
                />
                <div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.6rem', flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: B, fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', backgroundColor: C.maroon, color: C.parchment, padding: '0.18rem 0.5rem' }}>{product.tag}</span>
                    <span style={{ fontFamily: B, fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em', color: C.maroon, border: `1px solid rgba(117,24,40,0.3)`, padding: '0.12rem 0.45rem' }}>Size {size}</span>
                  </div>
                  <h3 style={{ fontFamily: D, fontStyle: 'italic', fontSize: '1.2rem', color: C.maroon, margin: '0 0 0.25rem', fontWeight: 400 }}>{product.name}</h3>
                  <p style={{ fontFamily: B, fontSize: '0.78rem', opacity: 0.45, marginBottom: '1rem', lineHeight: 1.55 }}>{product.desc.slice(0, 80)}…</p>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <button onClick={() => setQty(product.id, size, qty - 1)} style={{ width: '32px', height: '32px', border: `1.5px solid rgba(117,24,40,0.25)`, background: 'transparent', color: C.maroon, fontSize: '1.1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                    <span style={{ width: '40px', textAlign: 'center', fontFamily: B, fontSize: '0.92rem', fontWeight: 700, color: C.maroonDeep, border: `1.5px solid rgba(117,24,40,0.25)`, borderLeft: 'none', borderRight: 'none', height: '32px', lineHeight: '30px' }}>{qty}</span>
                    <button onClick={() => setQty(product.id, size, qty + 1)} style={{ width: '32px', height: '32px', border: `1.5px solid rgba(117,24,40,0.25)`, background: 'transparent', color: C.maroon, fontSize: '1.1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.6rem' }}>
                  <span style={{ fontFamily: B, fontSize: '1.05rem', fontWeight: 700, color: C.maroon }}>₹{(price * qty).toLocaleString('en-IN')}</span>
                  <span style={{ fontFamily: B, fontSize: '0.72rem', opacity: 0.4 }}>{product.price} each</span>
                  <button onClick={() => remove(product.id, size)} style={{ fontFamily: B, fontSize: '0.7rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: C.maroonMid, background: 'none', border: 'none', cursor: 'pointer', opacity: 0.5, marginTop: 'auto' }}>Remove</button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Order summary + checkout */}
        <div className="order-summary-sticky" style={{ backgroundColor: C.parchment, border: `1px solid rgba(117,24,40,0.1)`, padding: '2rem', position: 'sticky', top: '88px' }}>
          <h2 style={{ fontFamily: D, fontStyle: 'italic', fontSize: '1.5rem', color: C.maroon, margin: '0 0 1.5rem' }}>Order Summary</h2>
          {activeFreeGift && (
            <div style={{
              backgroundColor: '#f0fdf4',
              border: '1px dashed #22c55e',
              padding: '0.75rem 0.85rem',
              marginBottom: '1rem',
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'center',
              borderRadius: '4px'
            }}>
              <img
                src={resolveProductImageUrl(activeFreeGift.image)}
                alt={activeFreeGift.name}
                style={{ width: '44px', height: '44px', objectFit: 'cover', borderRadius: '4px', border: '1px solid rgba(34,197,94,0.3)', flexShrink: 0 }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.15rem' }}>
                  <span style={{ fontFamily: B, fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', backgroundColor: '#16a34a', color: '#fff', padding: '0.12rem 0.45rem', borderRadius: '3px' }}>
                    🎁 FREE GIFT
                  </span>
                  <span style={{ fontFamily: B, fontSize: '0.68rem', color: '#6b7280', textDecoration: 'line-through' }}>₹{activeFreeGift.value}</span>
                </div>
                <p style={{ fontFamily: B, fontSize: '0.82rem', fontWeight: 700, color: '#14532d', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {activeFreeGift.name}
                </p>
                <p style={{ fontFamily: B, fontSize: '0.7rem', color: '#166534', margin: 0 }}>
                  {activeFreeGift.badge}
                </p>
              </div>
              <span style={{ fontFamily: B, fontSize: '0.88rem', fontWeight: 800, color: '#16a34a', flexShrink: 0 }}>
                ₹0
              </span>
            </div>
          )}
          <div style={{ borderTop: `1px solid rgba(117,24,40,0.1)`, paddingTop: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: B, fontSize: '0.88rem', marginBottom: '0.6rem', opacity: 0.6 }}>
              <span>Subtotal ({count} item{count !== 1 ? 's' : ''})</span><span>₹{total.toLocaleString('en-IN')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: B, fontSize: '0.88rem', marginBottom: '1rem', opacity: 0.6 }}>
              <span>Delivery</span>
              <span>{delivery === 0 ? <span style={{ color: '#2a9d2a', fontWeight: 700 }}>Free ✓</span> : `₹${delivery}`}</span>
            </div>
            {delivery > 0 && (
              <p style={{ fontFamily: B, fontSize: '0.72rem', opacity: 0.45, margin: '0 0 1rem' }}>
                Add ₹{(900 - total).toLocaleString('en-IN')} more for free delivery
              </p>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: B, fontSize: '1.15rem', fontWeight: 700, color: C.maroon, paddingTop: '0.75rem', borderTop: `1px solid rgba(117,24,40,0.1)` }}>
              <span>Total</span><span>₹{grandTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <button onClick={() => setStep('details')}
            style={{ width: '100%', padding: '1rem', backgroundColor: C.maroon, color: C.parchment, fontFamily: B, fontSize: '0.88rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', border: 'none', cursor: 'pointer', marginTop: '1.5rem', transition: 'opacity 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
            Proceed to Guest Checkout →
          </button>

          <p style={{ fontFamily: B, fontSize: '0.72rem', opacity: 0.4, textAlign: 'center', margin: '1rem 0 0' }}>
            Free shipping over ₹900 · 100% Cotton & Jute Canvas
          </p>
        </div>
      </div>
    </div>
  )
}
