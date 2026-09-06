// Design Tokens & Static Editorial Content
// Mock PRODUCTS array has been migrated directly into MySQL database and removed from frontend.

export const C = {
  parchment:  '#f2e8d0',
  maroon:     '#751828',
  maroonMid:  '#9e2035',
  maroonDeep: '#3d0c17',
  sand:       '#d4bb8a',
  fog:        '#ede3c4',
  foil:       '#c9a96e',
}

export const D = "'Fraunces', serif"
export const B = "'DM Sans', sans-serif"

export const PILLARS = [
  { num: '01', title: 'Made by Women',     body: 'Every piece is handmade by women artisans trained at our free facility in Sonarpur, South Kolkata.' },
  { num: '02', title: '35+ Varieties',     body: 'Bags, kaftans, jackets, and home decor — all made from natural, unprinted, or plant-dyed canvas.' },
  { num: '03', title: 'Honest Pricing',    body: 'Prices from ₹80 to ₹850. Bundles and bulk tiers mean you always get fair value, never inflated shipping.' },
  { num: '04', title: 'Art-Student Ready', body: 'We supply raw unprinted canvas bags directly to art students and college groups at wholesale rates.' },
]

export const CATEGORIES = [
  { title: 'Canvas Bags',      items: ['Market Tote', 'Messenger Bag', 'Drawstring Pouch', 'Coin Purse', 'Laptop Sleeve', 'Bucket Bag'], image: new URL('./imports/annotation-reference.png', import.meta.url).href, span: '1 / 1 / 2 / 2', tone: '#751828' },
  { title: 'Kaftans & Jackets',items: ['Block Kaftan', 'Quilted Jacket', 'Reversible Jacket', 'Short Kaftan'], image: 'https://images.unsplash.com/photo-1594938298603-c8148c4b4f7c?w=700&h=480&fit=crop&auto=format', span: '1 / 2 / 2 / 3', tone: '#9e2035' },
  { title: 'Home Decor',       items: ['Cushion Covers', 'Wall Hangings', 'Table Runner', 'Storage Basket', 'Fabric Placemat'], image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1400&h=380&fit=crop&auto=format', span: '2 / 1 / 3 / 3', tone: '#3d0c17' },
]

export const BUNDLES = [
  { name: 'Gift Bundle',       items: '1 Canvas Tote + 2 Coin Purses',        price: '₹620',   saving: 'Save ₹40 + free delivery' },
  { name: 'Art Student Set',   items: '5 Unprinted Totes (bulk)',              price: '₹2,100', saving: 'Save ₹400 vs. buying single' },
  { name: 'Wardrobe Starter',  items: '1 Kaftan + 1 Coin Purse + 1 Tote',     price: '₹1,250', saving: 'Save ₹80 + free delivery' },
]
