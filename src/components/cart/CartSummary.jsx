'use client';

import { MapPin, FileText, ShieldCheck, ArrowRight } from 'lucide-react';

export default function CartSummary({
  totalItems,
  totalAmount,
  shippingAddress,
  setShippingAddress,
  notes,
  setNotes,
  onSubmit,
  submitting,
  errorMsg,
  formatIDR,
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="p-6 rounded-2xl bg-[#121722] border border-[#20293A] space-y-5 sticky top-24"
    >
      <h2 className="text-base font-bold text-white border-b border-[#20293A] pb-3 font-sans">
        Ringkasan Pembelian
      </h2>

      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
          {errorMsg}
        </div>
      )}

      <div className="space-y-3">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#FF1E27]" />
            <span>Alamat Lengkap Pengiriman *</span>
          </label>
          <textarea
            required
            rows={3}
            value={shippingAddress}
            onChange={(e) => setShippingAddress(e.target.value)}
            placeholder="Jl. Peta Selatan No. 12, Kalideres, Jakarta Barat..."
            className="w-full p-2.5 rounded-xl bg-[#0A0D14] border border-[#20293A] text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FF1E27]"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-[#FFD000]" />
            <span>Catatan untuk Penjual (Opsional)</span>
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Packing bubble wrap tebal, switch tested..."
            className="w-full p-2.5 rounded-xl bg-[#0A0D14] border border-[#20293A] text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FF1E27]"
          />
        </div>
      </div>

      <div className="space-y-2 pt-3 border-t border-[#20293A] text-xs">
        <div className="flex justify-between text-gray-400">
          <span>Total Item</span>
          <span className="font-mono text-white">{totalItems} barang</span>
        </div>
        <div className="flex justify-between text-gray-400">
          <span>Biaya Pengiriman</span>
          <span className="font-mono text-emerald-400 font-bold">GRATIS (Turnamen Promo)</span>
        </div>
        <div className="flex justify-between text-gray-400">
          <span>Proteksi Kerusakan</span>
          <span className="font-mono text-gray-300">Termasuk</span>
        </div>
        <div className="flex justify-between items-baseline pt-2 border-t border-[#20293A] text-sm">
          <span className="font-bold text-white">Total Tagihan</span>
          <span className="font-black font-mono text-xl text-[#FF1E27]">
            {formatIDR(totalAmount)}
          </span>
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3.5 rounded-xl bg-[#FF1E27] text-white font-black text-xs hover:bg-[#FFD000] hover:text-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#FF1E27]/25 uppercase tracking-wider disabled:opacity-50"
      >
        <span>{submitting ? 'Memproses Checkout...' : 'Bayar Sekarang'}</span>
        <ArrowRight className="w-4 h-4" />
      </button>

      <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-400 font-mono text-center">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        <span>Transaksi Terenkripsi Standar Kompetisi</span>
      </div>
    </form>
  );
}
