import Link from 'next/link';
import { Shield } from 'lucide-react';

export default function Footer() {
  return (
    <>
      <footer className="bg-[#070A0F] border-t border-[#20293A] text-gray-400 text-xs mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          
          {/* Main Footer Layout Matching GoodGamingShop Reference */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-12 border-b border-[#20293A]">
            
            {/* Left Column: Slogan, Socials & Brand (6/12) */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* Punchline Header */}
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-4xl font-black italic uppercase tracking-tight text-white font-sans leading-tight">
                  LEVEL UP YOUR GEAR.{' '}
                  <span className="text-[#FF1E27]">GAME LIKE A PRO.</span>
                </h2>
                <p className="text-xs text-gray-400 max-w-md leading-relaxed">
                  Pusat perlengkapan gaming dan peripheral kompetisi turnamen resmi di Indonesia. Keyboard mekanikal kustom, mouse ultralight 8KHz, jersey dry-fit pro kit, dan rig hardware.
                </p>
              </div>

              {/* Social Media Circular Buttons */}
              <div className="flex items-center gap-3 pt-2">
                
                {/* Instagram */}
                <a
                  href="https://instagram.com/bigetronesports"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-[#121722] border border-[#20293A] text-gray-300 hover:text-white hover:border-[#FF1E27] hover:bg-[#FF1E27]/15 flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-sm"
                  title="Instagram @bigetronesports"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>

                {/* TikTok */}
                <a
                  href="https://tiktok.com/@bigetronesports"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-[#121722] border border-[#20293A] text-gray-300 hover:text-white hover:border-[#FF1E27] hover:bg-[#FF1E27]/15 flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-sm"
                  title="TikTok @bigetronesports"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.86.11V9.41a6.33 6.33 0 0 0-.86-.06 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 9.87 5.25 6.27 6.27 0 0 0 2.82-5.25V8.58a8.28 8.28 0 0 0 4.76 1.48V6.69z" />
                  </svg>
                </a>

                {/* Facebook */}
                <a
                  href="https://facebook.com/bigetronesports"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-[#121722] border border-[#20293A] text-gray-300 hover:text-white hover:border-[#FF1E27] hover:bg-[#FF1E27]/15 flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-sm"
                  title="Facebook Bigetron Esports"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>

                {/* Discord */}
                <a
                  href="https://discord.gg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-[#121722] border border-[#20293A] text-gray-300 hover:text-white hover:border-[#FF1E27] hover:bg-[#FF1E27]/15 flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-sm"
                  title="Discord Community"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Right Column: OUR SERVICE & OTHER (6/12) */}
            <div className="lg:col-span-6 grid grid-cols-2 gap-8">
              
              {/* Kolom 1: OUR SERVICE */}
              <div>
                <h5 className="text-white font-extrabold mb-4 text-xs tracking-wider uppercase font-mono">
                  OUR SERVICE
                </h5>
                <ul className="space-y-2.5 text-xs text-gray-400">
                  <li>
                    <Link href="/katalog" className="hover:text-white transition-colors">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <a
                      href="https://wa.me/6281234567890?text=Halo%20VALIANT%20PRO%20Support"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[#FF1E27] transition-colors"
                    >
                      Contact Us
                    </a>
                  </li>
                  <li>
                    <Link href="/orders" className="hover:text-white transition-colors">
                      FAQ
                    </Link>
                  </li>
                  <li>
                    <Link href="/katalog" className="hover:text-white transition-colors">
                      Return and Warranty
                    </Link>
                  </li>
                  <li>
                    <Link href="/katalog" className="hover:text-white transition-colors">
                      Delivery Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/katalog" className="hover:text-white transition-colors">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/katalog" className="hover:text-white transition-colors">
                      Refund & Return Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/katalog" className="hover:text-white transition-colors">
                      Terms & Conditions
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Kolom 2: OTHER */}
              <div>
                <h5 className="text-white font-extrabold mb-4 text-xs tracking-wider uppercase font-mono">
                  OTHER
                </h5>
                <ul className="space-y-2.5 text-xs text-gray-400">
                  <li>
                    <Link href="/orders" className="hover:text-white transition-colors">
                      RMA Page
                    </Link>
                  </li>
                  <li>
                    <Link href="/katalog" className="hover:text-white transition-colors">
                      Driver & Firmware
                    </Link>
                  </li>
                  <li>
                    <Link href="/seller/dashboard" className="hover:text-[#FFD000] transition-colors">
                      Merchant Portal
                    </Link>
                  </li>
                  <li>
                    <Link href="/admin/dashboard" className="hover:text-[#FF1E27] transition-colors">
                      Tournament Admin
                    </Link>
                  </li>
                  <li>
                    <Link href="/katalog" className="hover:text-white transition-colors">
                      Official Arena Locations
                    </Link>
                  </li>
                </ul>
              </div>

            </div>

          </div>

          {/* Bottom Row: Logo & Copyright */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-3">
              <span className="font-mono font-black text-white text-base tracking-wider flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-[#FF1E27] fill-current" />
                VALIANT <span className="text-[#FF1E27]">PRO</span>
              </span>
              <span className="text-gray-700">|</span>
              <p>Copyright © 2026 GoodGamingShop / VALIANT PRO All rights reserved.</p>
            </div>
            <p className="flex items-center gap-1 font-mono text-[11px] text-gray-400">
              <span className="text-[#FF1E27]">BTR x VITALITY RED THEME</span> • <span className="text-[#FFD000]">ESPORTS TOURNAMENT ARENA</span>
            </p>
          </div>

        </div>
      </footer>

      {/* Floating WhatsApp Quick Action Button */}
      <a
        href="https://wa.me/6281234567890?text=Halo%20VALIANT%20PRO%20Support%2C%20saya%20ingin%20tanya%20tentang%20gear%20gaming%20dan%20stok%20toko."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-2xl shadow-[#25D366]/40 hover:scale-110 transition-all duration-300 hover:shadow-emerald-500/60 group"
        title="Chat WhatsApp Customer Support"
      >
        <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm0 18.06c-1.49 0-2.94-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.13 8.13 0 0 1-1.25-4.29c0-4.5 3.66-8.16 8.16-8.16 2.18 0 4.23.85 5.77 2.39a8.106 8.106 0 0 1 2.39 5.77c0 4.5-3.66 8.15-8.08 8.15zm4.47-6.11c-.24-.12-1.45-.71-1.67-.79-.23-.08-.39-.12-.56.12-.17.24-.65.79-.79.95-.15.17-.3.19-.54.07-.24-.12-1.03-.38-1.96-1.21-.72-.64-1.21-1.44-1.35-1.68-.15-.24-.02-.37.11-.49.11-.11.24-.29.37-.43.12-.15.17-.24.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.24-.88.86-.88 2.09 0 1.23.9 2.42 1.02 2.59.12.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.45-.59 1.66-1.16.2-.57.2-1.06.14-1.16-.05-.1-.22-.16-.46-.28z" />
        </svg>

        {/* Tooltip */}
        <span className="absolute right-16 bg-[#121722] text-white text-[11px] font-mono font-bold px-3 py-1.5 rounded-xl border border-[#20293A] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-xl">
          Tanya CS (WhatsApp Live)
        </span>
      </a>
    </>
  );
}
