'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const TEST_ACCOUNTS = {
  buyer: {
    id: 6,
    name: 'Dylan Gamer',
    email: 'buyer@gmail.com',
    role: 'buyer',
    status: 'approved',
  },
  seller: {
    id: 2,
    name: 'Alex "Apex" Pratama',
    email: 'seller1@apexgear.com',
    role: 'seller',
    status: 'approved',
    store_id: 1,
    store_name: 'Apex Pro Gaming Gear',
    store_slug: 'apex-pro-gaming-gear',
  },
  admin: {
    id: 1,
    name: 'Super Admin Esports',
    email: 'admin@esports.com',
    role: 'admin',
    status: 'approved',
  },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('esports_user');
      if (saved) {
        setUser(JSON.parse(saved));
      } else {
        setUser(TEST_ACCOUNTS.buyer);
        localStorage.setItem('esports_user', JSON.stringify(TEST_ACCOUNTS.buyer));
      }
    } catch {
      setUser(TEST_ACCOUNTS.buyer);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('esports_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('esports_user');
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
