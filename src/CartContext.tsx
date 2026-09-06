import { createContext, useContext, useState, ReactNode } from 'react'
import type { Product, Size } from '@/types'

export type { Size }

export interface CartItem {
  product: Product
  qty: number
  size: Size
}

export interface FreeGiftTier {
  minSpend: number
  productId: number
  name: string
  image: string
  value: number
  badge: string
  description: string
}

export const FREE_GIFT_TIERS: FreeGiftTier[] = [
  {
    minSpend: 3000,
    productId: 33,
    name: 'Free Special Big Bag',
    image: '/uploads/products/free_gift_special_big_bag.jpg',
    value: 599,
    badge: 'Tier 3 Gift (₹3,000+)',
    description: 'Artisan handcrafted travel pouch & utility bag'
  },
  {
    minSpend: 2000,
    productId: 32,
    name: 'Free Rectangle Pouch',
    image: '/uploads/products/free_gift_rectangle_pouch.jpg',
    value: 349,
    badge: 'Tier 2 Gift (₹2,000+)',
    description: 'Hand block-printed & applique zippered rectangle pouch'
  },
  {
    minSpend: 1000,
    productId: 31,
    name: 'Free Small Round Coin Purse',
    image: '/uploads/products/free_gift_coin_purse.jpg',
    value: 199,
    badge: 'Tier 1 Gift (₹1,000+)',
    description: 'Handmade round zippered coin purse'
  },
]

interface CartCtx {
  items: CartItem[]
  add: (product: Product, size?: Size) => void
  remove: (id: number, size: Size) => void
  setQty: (id: number, size: Size, qty: number) => void
  clear: () => void
  total: number
  count: number
  activeFreeGift: FreeGiftTier | null
  nextTier: { tier: FreeGiftTier; amountNeeded: number } | null
  freeGiftTiers: FreeGiftTier[]
}

const Ctx = createContext<CartCtx | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  const add = (product: Product, size: Size = 'M') =>
    setItems(prev => {
      const existing = prev.find(i => i.product.id === product.id && i.size === size)
      if (existing) return prev.map(i => i.product.id === product.id && i.size === size ? { ...i, qty: i.qty + 1 } : i)
      return [...prev, { product, qty: 1, size }]
    })

  const remove = (id: number, size: Size) =>
    setItems(prev => prev.filter(i => !(i.product.id === id && i.size === size)))

  const setQty = (id: number, size: Size, qty: number) => {
    if (qty < 1) { remove(id, size); return }
    setItems(prev => prev.map(i => i.product.id === id && i.size === size ? { ...i, qty } : i))
  }

  const clear = () => setItems([])

  const total = items.reduce((sum, i) => {
    const price = typeof i.product.numeric_price === 'number' && i.product.numeric_price > 0
      ? i.product.numeric_price
      : parseInt(String(i.product.price).replace(/[^\d]/g, ''), 10) || 0
    return sum + price * i.qty
  }, 0)

  const count = items.reduce((sum, i) => sum + i.qty, 0)

  // Active Free Gift Tier (calculated highest unlocked tier)
  const activeFreeGift = total >= 3000
    ? FREE_GIFT_TIERS[0]
    : total >= 2000
    ? FREE_GIFT_TIERS[1]
    : total >= 1000
    ? FREE_GIFT_TIERS[2]
    : null

  // Next Free Gift Tier to motivate higher order value
  const nextTier = total < 1000
    ? { tier: FREE_GIFT_TIERS[2], amountNeeded: 1000 - total }
    : total < 2000
    ? { tier: FREE_GIFT_TIERS[1], amountNeeded: 2000 - total }
    : total < 3000
    ? { tier: FREE_GIFT_TIERS[0], amountNeeded: 3000 - total }
    : null

  return (
    <Ctx.Provider value={{
      items, add, remove, setQty, clear, total, count,
      activeFreeGift, nextTier, freeGiftTiers: FREE_GIFT_TIERS
    }}>
      {children}
    </Ctx.Provider>
  )
}

export function useCart() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

