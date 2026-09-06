import { RouterProvider } from 'react-router'
import { ThemeProvider } from '@figma/astraui'
import { router } from './routes'
import { ProductProvider } from './ProductContext'
import { CartProvider } from './CartContext'
import { SavedProvider } from './SavedContext'

export default function App() {
  return (
    <ThemeProvider>
      <SavedProvider>
        <ProductProvider>
          <CartProvider>
            <RouterProvider router={router} />
          </CartProvider>
        </ProductProvider>
      </SavedProvider>
    </ThemeProvider>
  )
}
