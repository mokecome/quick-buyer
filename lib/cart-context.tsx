"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

export interface CartItem {
  id: string
  slug: string
  title: string
  price: number
  thumbnail?: string
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  clearCart: () => void
  isInCart: (id: string) => boolean
  total: number
  itemCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_STORAGE_KEY = 'quick-buyer-cart'

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isHydrated, setIsHydrated] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(CART_STORAGE_KEY)
    if (stored) {
      try {
        setItems(JSON.parse(stored))
      } catch (e) {
        console.error('Failed to parse cart:', e)
      }
    }
    setIsHydrated(true)
  }, [])

  // Save to localStorage on change
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
    }
  }, [items, isHydrated])

  const addItem = (item: CartItem) => {
    setItems(prev => {
      if (prev.some(i => i.id === item.id)) return prev
      return [...prev, item]
    })
  }

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id))
  }

  const clearCart = () => setItems([])

  const isInCart = (id: string) => items.some(i => i.id === id)

  const total = items.reduce((sum, item) => sum + item.price, 0)

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      clearCart,
      isInCart,
      total,
      itemCount: items.length
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}
