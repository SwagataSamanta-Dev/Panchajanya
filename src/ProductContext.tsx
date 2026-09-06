import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import type { Product, Category } from './types'

export const BACKEND_URL = ""

/* export const BACKEND_URL = (
  import.meta.env.VITE_API_URL !== undefined
    ? import.meta.env.VITE_API_URL
    : (import.meta.env.PROD ? '' : 'http://localhost:8000')
).replace(/\/$/, '') */

export function resolveProductImageUrl(url: string | null | undefined): string {
  const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '')
  const fallback = `${base}/uploads/products/1bag.png`

  if (!url || typeof url !== 'string' || !url.trim()) {
    return fallback
  }

  let cleaned = url.trim()

  // If external non-localhost image (e.g. unsplash or data URI), preserve as-is
  if (cleaned.startsWith('data:') || (/^https?:\/\//i.test(cleaned) && !cleaned.includes('localhost') && !cleaned.includes('127.0.0.1'))) {
    return cleaned
  }

  // Strip any absolute local origins (e.g. http://localhost:8000, http://localhost:8443, http://127.0.0.1:8000)
  if (/^https?:\/\/[^/]+/i.test(cleaned)) {
    cleaned = cleaned.replace(/^https?:\/\/[^/]+/, '')
  }

  // Ensure leading slash
  if (!cleaned.startsWith('/')) {
    cleaned = '/' + cleaned
  }

  // If already prefixed with base (for non-root preview deployments), strip it temporarily for standardizing
  if (base && cleaned.startsWith(base + '/')) {
    cleaned = cleaned.slice(base.length)
  }

  // Normalize path to /uploads/products/
  if (!cleaned.startsWith('/uploads/')) {
    if (cleaned.startsWith('/products/')) {
      cleaned = '/uploads' + cleaned
    } else {
      cleaned = '/uploads/products' + cleaned
    }
  }

  // Return clean relative path (with base prefix if preview environment is non-root)
  return base ? `${base}${cleaned}` : cleaned
}

export function normalizeProduct(p: any): Product {
  const numericPrice = typeof p.numeric_price === 'number'
    ? p.numeric_price
    : typeof p.price === 'number'
      ? p.price
      : parseFloat(String(p.price || '0').replace(/[^\d.]/g, '')) || 0

  const rawFront = p.front_image || p.front || (p.images && (p.images.front || p.images.studio || p.images.gallery || p.images.main)) || ''
  const rawBack = p.back_image || p.back || (p.images && (p.images.back || p.images.lifestyle || p.images.detail || p.images.secondary)) || null

  const frontImg = resolveProductImageUrl(rawFront)
  const backImg = rawBack ? resolveProductImageUrl(rawBack) : null
  const formattedPrice = p.formatted_price || (typeof p.price === 'string' && p.price.startsWith('₹') ? p.price : `₹${Math.round(numericPrice)}`)

  return {
    id: Number(p.id),
    name: p.name || 'Unnamed Product',
    slug: p.slug || '',
    price: formattedPrice,
    numeric_price: numericPrice,
    tag: p.tag || '',
    category: p.category_name || p.category || 'Bags',
    category_name: p.category_name || p.category || 'Bags',
    category_id: p.category_id ? Number(p.category_id) : null,
    desc: p.desc || p.description || '',
    description: p.description || p.desc || '',
    front: frontImg,
    back: backImg,
    front_image: frontImg,
    back_image: backImg,
    accent: p.accent || p.accent_color || '#751828',
    stock: Number(p.stock ?? 0),
    is_featured: Boolean(p.is_featured),
    is_active: p.is_active !== undefined ? Boolean(p.is_active) : true,
  }
}

interface ProductCtx {
  products: Product[]
  categories: Category[]
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
  getProductById: (id: number) => Product | undefined
}

const ProductContext = createContext<ProductCtx | null>(null)

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const apiBase = import.meta.env.VITE_API_URL || ''

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      let res: Response
      try {
        res = await fetch(`${BACKEND_URL}/api/products.php`, {
          headers: { Accept: 'application/json' },
        })
      } catch {
        res = await fetch(`${apiBase}/api/products.php`, {
          headers: { Accept: 'application/json' },
        })
      }

      if (!res.ok) {
        throw new Error(`API responded with status ${res.status}`)
      }

      const data = await res.json()
      if (Array.isArray(data)) {
        const normalized = data.map(normalizeProduct)
        setProducts(normalized)
      } else if (data && data.error) {
        throw new Error(data.message || data.error)
      } else {
        throw new Error('Unexpected response format from products API')
      }
    } catch (err: any) {
      console.error('Failed to load products from API:', err)
      setError(err.message || 'Unable to connect to product catalog')
    } finally {
      setLoading(false)
    }
  }, [apiBase])

  const fetchCategories = useCallback(async () => {
    try {
      let res: Response
      try {
        res = await fetch(`${BACKEND_URL}/api/categories.php`, {
          headers: { Accept: 'application/json' },
        })
      } catch {
        res = await fetch(`${apiBase}/api/categories.php`, {
          headers: { Accept: 'application/json' },
        })
      }
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data)) {
          setCategories(data)
        }
      }
    } catch (err) {
      // Non-critical, fallback to categories from products
      console.warn('Categories API unavailable:', err)
    }
  }, [apiBase])

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [fetchProducts, fetchCategories])

  const getProductById = useCallback((id: number) => {
    return products.find(p => p.id === id)
  }, [products])

  return (
    <ProductContext.Provider value={{
      products,
      categories,
      loading,
      error,
      refresh: fetchProducts,
      getProductById,
    }}>
      {children}
    </ProductContext.Provider>
  )
}

export function useProducts() {
  const ctx = useContext(ProductContext)
  if (!ctx) {
    throw new Error('useProducts must be used within a ProductProvider')
  }
  return ctx
}
