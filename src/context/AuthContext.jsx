'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const TEST_ACCOUNTS = {
  buyer: {
    id: 6,
    name: 'Dylan Buyer',
    email: 'buyer@gmail.com',
    role: 'buyer',
    status: 'approved',
  },
  seller: {
    id: 2,
    name: 'Raka Pratama',
    email: 'seller1@stride.id',
    role: 'seller',
    status: 'approved',
    store_id: 1,
    store_name: 'Sole Vault Jakarta',
    store_slug: 'sole-vault-jakarta',
  },
  seller_pending: {
    id: 4,
    name: 'Budi Santoso',
    email: 'seller3@pending.com',
    role: 'seller',
    status: 'pending',
    store_id: 3,
    store_name: 'Makassar Kicks',
    store_slug: 'makassar-kicks',
  },
  admin: {
    id: 1,
    name: 'Admin Stride',
    email: 'admin@stride.id',
    role: 'admin',
    status: 'approved',
  },
};

const STORAGE_KEY = 'stride_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      localStorage.removeItem('esports_user');
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setUser(JSON.parse(saved));
      } else {
        setUser(TEST_ACCOUNTS.buyer);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(TEST_ACCOUNTS.buyer));
      }
    } catch {
      setUser(TEST_ACCOUNTS.buyer);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    } catch {}
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  const switchAccount = (key) => {
    if (key === 'guest' || key === 'publicuser') {
      logout();
      return;
    }
    const target = TEST_ACCOUNTS[key];
    if (target) {
      login(target);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, switchAccount }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
