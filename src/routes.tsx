import { createBrowserRouter, Navigate } from 'react-router'
import Root from '@/components/Root'
import Home from '@/pages/Home'
import Shop from '@/pages/Shop'
import Story from '@/pages/Story'
import Wholesale from '@/pages/Wholesale'
import Join from '@/pages/Join'
import Cart from '@/pages/Cart'
import Customize from '@/pages/Customize'

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true,         Component: Home      },
      { path: 'shop',        Component: Shop      },
      { path: 'customize',   Component: Customize },
      { path: 'story',       Component: Story     },
      { path: 'wholesale',   Component: Wholesale },
      { path: 'join',        Component: Join      },
      { path: 'cart',        Component: Cart      },
      // Redirect former auth pages to shop
      { path: 'signin',      element: <Navigate to="/shop" replace /> },
      { path: 'account',     element: <Navigate to="/shop" replace /> },
      { path: 'orders',      element: <Navigate to="/shop" replace /> },
      { path: 'saved',       element: <Navigate to="/shop" replace /> },
    ],
  },
])
