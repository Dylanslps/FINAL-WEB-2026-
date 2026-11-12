'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cartCount, setCartCount] = useState(0);

  const refreshCart = useCallback(async () => {
    if (!user || user.role !== 'buyer') {
      setCartCount(0);
      return;
    }

    try {
      const res = await fetch(`/api/cart?buyerId=${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setCartCount(data.totalItems || 0);
      }
    } catch {
      // silent fallback
    }
  }, [user]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  return (
    <CartContext.Provider value={{ cartCount, refreshCart, setCartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
