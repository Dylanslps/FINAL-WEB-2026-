import { Store, CheckCircle2, XCircle } from 'lucide-react';

export default function AdminPendingSellers({ pendingSellers, onApprove, onReject, isSubmitting }) {
  if (pendingSellers.length === 0) {
    return (
      <div className="p-10 rounded-xl bg-surface border border-line text-center space-y-2">
        <CheckCircle2 className="w-10 h-10 text-ok mx-auto" aria-hidden="true" />
        <h2 className="text-sm font-semibold">Tidak ada pengajuan seller yang menunggu</h2>
        <p className="text-xs text-ink-2 max-w-sm mx-auto">
          Semua pendaftaran toko seller baru telah ditinjau. Pengajuan baru dari halaman Register akan tampil di sini.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {pendingSellers.map((seller) => (
        <article
          key={seller.id}
          className="p-5 rounded-xl bg-surface border border-line space-y-4"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-ink" aria-hidden="true" />
                <h2 className="font-semibold text-base">
                  {seller.store_name || 'Toko Tanpa Nama'}
                </h2>
              </div>
              <p className="text-xs text-ink-2">
                {seller.store_description || 'Belum mengisi deskripsi toko'}
              </p>
            </div>
            <span className="px-2.5 py-0.5 rounded bg-surface-2 text-warn border border-line text-xs font-semibold">
              Pending
            </span>
          </div>

          <div className="p-3 rounded-lg bg-canvas border border-line space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-ink-2">Pemilik</span>
              <span className="font-semibold">{seller.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-2">Email</span>
              <span>{seller.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-2">Telepon</span>
              <span>{seller.phone || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-2">Alamat</span>
              <span className="text-right max-w-[220px] truncate">{seller.address || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-2">Waktu daftar</span>
              <span className="text-ink-2">
                {new Date(seller.created_at).toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={() => onApprove(seller.id, seller.store_name || seller.name)}
              disabled={isSubmitting}
              className="flex-1 min-h-11 bg-ok text-canvas rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 hover:opacity-85 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
              <span>Setujui toko</span>
            </button>

            <button
              type="button"
              onClick={() => onReject(seller.id, seller.store_name || seller.name)}
              disabled={isSubmitting}
              className="min-h-11 px-4 bg-surface-2 hover:bg-line text-accent border border-line rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <XCircle className="w-4 h-4" aria-hidden="true" />
              <span>Tolak</span>
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
