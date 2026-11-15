import { Store, CheckCircle2, XCircle } from 'lucide-react';

export default function AdminPendingSellers({ pendingSellers, onApprove, onReject, isSubmitting }) {
  if (pendingSellers.length === 0) {
    return (
      <div className="p-12 rounded-2xl bg-[#10141D] border border-[#1C2331] text-center space-y-3">
        <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
        <h3 className="text-sm font-bold text-white">Semua Bersih & Terverifikasi</h3>
        <p className="text-xs text-gray-400 max-w-sm mx-auto">
          Tidak ada pengajuan seller yang pending saat ini. Semua toko pendaftar sudah ditinjau.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {pendingSellers.map((seller) => (
        <div
          key={seller.id}
          className="p-5 rounded-2xl bg-[#10141D] border border-amber-500/30 space-y-4 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 px-3 py-1 bg-amber-500/20 text-amber-300 text-[10px] font-bold rounded-bl-xl border-l border-b border-amber-500/30 uppercase tracking-wider">
            Menunggu Verifikasi
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Store className="w-4 h-4 text-amber-400" />
              <h3 className="font-bold text-white text-base">
                {seller.store_name || 'Toko Tanpa Nama'}
              </h3>
            </div>
            <p className="text-xs text-gray-400 italic">
              &quot;{seller.store_description || 'Belum mengisi deskripsi toko'}&quot;
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#151A23] border border-[#262E3D] space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-400">Pemilik:</span>
              <span className="font-semibold text-gray-200">{seller.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Email:</span>
              <span className="font-mono text-gray-300">{seller.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">No. Telepon:</span>
              <span className="font-mono text-gray-300">{seller.phone || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Alamat:</span>
              <span className="text-gray-300 text-right max-w-[200px] truncate">{seller.address || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Waktu Daftar:</span>
              <span className="text-gray-400">
                {new Date(seller.created_at).toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => onApprove(seller.id, seller.store_name || seller.name)}
              disabled={isSubmitting}
              className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 shadow-md shadow-emerald-600/20"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Setujui Toko</span>
            </button>

            <button
              onClick={() => onReject(seller.id, seller.store_name || seller.name)}
              disabled={isSubmitting}
              className="py-2.5 px-4 bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              <XCircle className="w-4 h-4" />
              <span>Tolak</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
