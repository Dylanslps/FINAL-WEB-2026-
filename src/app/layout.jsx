import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'VALIANT Esports Store - Tournament Grade Gear & Merchandise',
  description: 'Toko e-commerce esports resmi untuk pro player dan gamers turnamen.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="bg-[#0B0E14] text-gray-100 min-h-screen flex flex-col antialiased selection:bg-[#00F0FF]/30 selection:text-white">
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
              {children}
            </main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
