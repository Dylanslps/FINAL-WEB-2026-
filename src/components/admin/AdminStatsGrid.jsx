export default function AdminStatsGrid({ stats }) {
  const formatIDR = (num) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);

  return (
    <section aria-label="Ringkasan data database" className="pt-6 border-t border-line">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-2 mb-3">
        Ringkasan Data Platform (PostgreSQL)
      </h2>
      <dl className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-surface border border-line rounded-xl p-4 space-y-1">
          <dt className="text-xs text-ink-2">Total pengguna</dt>
          <dd className="text-2xl font-bold tabular-nums">{stats.total_users}</dd>
          <dd className="text-xs text-ink-2">{stats.total_buyers} buyer</dd>
        </div>

        <div className="bg-surface border border-line rounded-xl p-4 space-y-1">
          <dt className="text-xs text-ink-2">Seller aktif</dt>
          <dd className="text-2xl font-bold text-ok tabular-nums">{stats.total_active_sellers}</dd>
          <dd className="text-xs text-ink-2">Toko disetujui</dd>
        </div>

        <div className="bg-surface border border-line rounded-xl p-4 space-y-1">
          <dt className="text-xs text-ink-2">Menunggu tinjauan</dt>
          <dd className="text-2xl font-bold text-warn tabular-nums">{stats.total_pending_sellers}</dd>
          <dd className="text-xs text-ink-2">Seller pending</dd>
        </div>

        <div className="bg-surface border border-line rounded-xl p-4 space-y-1">
          <dt className="text-xs text-ink-2">Total produk</dt>
          <dd className="text-2xl font-bold tabular-nums">{stats.total_products}</dd>
          <dd className="text-xs text-ink-2">Seluruh toko</dd>
        </div>

        <div className="bg-surface border border-line rounded-xl p-4 space-y-1">
          <dt className="text-xs text-ink-2">Total pesanan</dt>
          <dd className="text-2xl font-bold tabular-nums">{stats.total_orders}</dd>
          <dd className="text-xs text-ink-2">Transaksi dibuat</dd>
        </div>

        <div className="bg-surface border border-line rounded-xl p-4 space-y-1">
          <dt className="text-xs text-ink-2">Transaksi selesai</dt>
          <dd className="text-base font-bold tabular-nums truncate">
            {formatIDR(Number(stats.total_completed_revenue))}
          </dd>
          <dd className="text-xs text-ink-2">Status Selesai</dd>
        </div>
      </dl>
    </section>
  );
}
