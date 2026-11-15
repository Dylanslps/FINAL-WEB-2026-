import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';

export default function CartOrderSuccess({
  order,
  shippingAddress,
  formatIDR,
}) {
  return (
    <div className="max-w-lg mx-auto py-12 text-center space-y-6 p-8 rounded-2xl bg-[#121722] border border-[#FF1E27]/40 shadow-2xl">
      <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
        <CheckCircle2 className="w-8 h-8" />
      </div>

      <div className="space-y-1">
        <h2 className="text-2xl font-black text-white font-sans">Pesanan Berhasil Dibuat!</h2>
        <p className="text-xs text-gray-400 font-mono">
          Nomor Pesanan: <strong className="text-[#FF1E27]">{order.order_number}</strong>
        </p>
      </div>

      <div className="p-4 rounded-xl bg-[#0A0D14] border border-[#20293A] text-left text-xs space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-400">Status Pesanan:</span>
          <span className="font-bold text-amber-400">{order.status}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Total Pembayaran:</span>
          <span className="font-bold text-[#FF1E27]">{formatIDR(order.total_amount)}</span>
        </div>
        <div className="pt-2 border-t border-[#20293A] text-gray-400">
          Alamat Pengiriman: <br />
          <span className="text-gray-200">{shippingAddress}</span>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Link
          href="/orders"
          className="flex-1 py-3 rounded-xl bg-[#FF1E27] text-white font-black text-xs hover:bg-[#FFD000] hover:text-black transition-colors uppercase tracking-wider font-mono"
        >
          Lihat Riwayat & Lacak Pesanan →
        </Link>
        <Link
          href="/katalog"
          className="px-4 py-3 rounded-xl bg-[#0A0D14] text-gray-300 border border-[#20293A] text-xs font-bold hover:text-white"
        >
          Belanja Lagi
        </Link>
      </div>
    </div>
  );
}
