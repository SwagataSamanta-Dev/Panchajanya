export type Size = 'M' | 'L'

export interface Product {
  id: number
  name: string
  slug?: string
  price: string
  numeric_price: number
  tag: string
  category: string
  category_name?: string
  category_id?: number | null
  desc: string
  description?: string
  front: string
  back: string | null
  front_image?: string
  back_image?: string | null
  accent: string
  stock: number
  is_featured?: boolean
  is_active?: boolean
}

export interface Category {
  id: number
  name: string
  description?: string
  product_count?: number
}
