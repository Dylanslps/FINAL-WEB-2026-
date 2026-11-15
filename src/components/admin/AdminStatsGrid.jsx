import { Users, Store, Clock, Package, ShoppingBag, DollarSign } from 'lucide-react';

export default function AdminStatsGrid({ stats }) {
  const formatIDR = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <div className="bg-[#10141D] border border-[#1C2331] rounded-2xl p-4 space-y-2">
        <div className="flex items-center justify-between text-gray-400 text-xs">
          <span>Total Pengguna</span>
          <Users className="w-4 h-4 text-cyan-400" />
        </div>
        <p className="text-2xl font-black text-white font-mono">{stats.total_users}</p>
        <p className="text-[10px] text-gray-500">{stats.total_buyers} Buyer terdaftar</p>
      </div>

      <div className="bg-[#10141D] border border-[#1C2331] rounded-2xl p-4 space-y-2">
        <div className="flex items-center justify-between text-gray-400 text-xs">
          <span>Seller Aktif</span>
          <Store className="w-4 h-4 text-emerald-400" />
        </div>
        <p className="text-2xl font-black text-emerald-400 font-mono">{stats.total_active_sellers}</p>
        <p className="text-[10px] text-gray-500">Toko terverifikasi</p>
      </div>

      <div
        className={`bg-[#10141D] border rounded-2xl p-4 space-y-2 ${
          stats.total_pending_sellers > 0 ? 'border-amber-500/40 bg-amber-500/5' : 'border-[#1C2331]'
        }`}
      >
        <div className="flex items-center justify-between text-gray-400 text-xs">
          <span>Menunggu Review</span>
          <Clock className="w-4 h-4 text-amber-400" />
        </div>
        <div className="flex items-center gap-2">
          <p className="text-2xl font-black text-amber-400 font-mono">{stats.total_pending_sellers}</p>
          {stats.total_pending_sellers > 0 && (
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          )}
        </div>
        <p className="text-[10px] text-amber-300/80 font-medium">Perlu tindakan</p>
      </div>

      <div className="bg-[#10141D] border border-[#1C2331] rounded-2xl p-4 space-y-2">
        <div className="flex items-center justify-between text-gray-400 text-xs">
          <span>Total Produk</span>
          <Package className="w-4 h-4 text-[#FF1E27]" />
        </div>
        <p className="text-2xl font-black text-white font-mono">{stats.total_products}</p>
        <p className="text-[10px] text-gray-500">Semua katalog toko</p>
      </div>

      <div className="bg-[#10141D] border border-[#1C2331] rounded-2xl p-4 space-y-2">
        <div className="flex items-center justify-between text-gray-400 text-xs">
          <span>Total Pesanan</span>
          <ShoppingBag className="w-4 h-4 text-purple-400" />
        </div>
        <p className="text-2xl font-black text-white font-mono">{stats.total_orders}</p>
        <p className="text-[10px] text-gray-500">Transaksi dibuat</p>
      </div>

      <div className="bg-[#10141D] border border-[#1C2331] rounded-2xl p-4 space-y-2">
        <div className="flex items-center justify-between text-gray-400 text-xs">
          <span>Revenue Selesai</span>
          <DollarSign className="w-4 h-4 text-[#FFD000]" />
        </div>
        <p className="text-lg font-black text-[#FFD000] font-mono truncate">
          {formatIDR(Number(stats.total_completed_revenue))}
        </p>
        <p className="text-[10px] text-gray-500">Order sukses</p>
      </div>
    </div>
  );
}
