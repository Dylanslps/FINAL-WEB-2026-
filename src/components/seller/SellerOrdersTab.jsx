'use client';

export default function SellerOrdersTab({
  orders,
  formatIDR,
  onUpdateOrderStatus,
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-base">Pesanan Masuk dari Pembeli</h2>
        <span className="text-xs text-ink-2 tabular-nums">{orders.length} transaksi</span>
      </div>

      {orders.length === 0 ? (
        <div className="p-8 text-center rounded-xl bg-surface border border-line space-y-1">
          <p className="text-sm font-medium">Belum ada pesanan masuk</p>
          <p className="text-xs text-ink-2">
            Pesanan dari pembeli untuk produk di toko Anda akan muncul di halaman ini.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((ord) => (
            <article key={ord.id} className="p-5 rounded-xl bg-surface border border-line space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-line pb-3">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-semibold text-sm">{ord.order_number}</span>
                  <span className="text-xs text-ink-2">
                    Pembeli: <strong className="text-ink">{ord.buyer_name}</strong> ({ord.buyer_email})
                  </span>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded text-xs font-semibold border border-line bg-surface-2 ${
                    ord.status === 'Selesai'
                      ? 'text-ok'
                      : ord.status === 'Diproses'
                      ? 'text-ink'
                      : 'text-warn'
                  }`}
                >
                  {ord.status}
                </span>
              </div>

              <div className="space-y-2">
                {ord.items.map((it) => (
                  <div
                    key={it.order_item_id}
                    className="flex items-center justify-between text-xs p-3 rounded-lg bg-canvas border border-line"
                  >
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={it.product_image}
                        alt={it.product_name}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded object-contain bg-surface-2 border border-line p-0.5"
                      />
                      <div>
                        <span className="font-semibold">{it.product_name}</span>
                        <span className="text-ink-2 ml-1.5">({it.quantity}x)</span>
                        {(it.selected_variant || it.selected_color) && (
                          <div className="flex flex-wrap items-center gap-2 text-xs text-ink-2 mt-0.5">
                            {it.selected_variant && <span>Ukuran: {it.selected_variant}</span>}
                            {it.selected_color && <span>Warna: {it.selected_color}</span>}
                          </div>
                        )}
                      </div>
                    </div>
                    <span className="font-bold tabular-nums">{formatIDR(it.subtotal)}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 text-xs border-t border-line">
                <p className="text-ink-2 max-w-md">
                  Alamat kirim: <span className="text-ink">{ord.shipping_address}</span>
                </p>

                <div className="flex items-center gap-2">
                  {ord.status === 'Menunggu Pembayaran' && (
                    <button
                      type="button"
                      onClick={() => onUpdateOrderStatus(ord.id, 'Diproses')}
                      className="min-h-10 px-4 rounded-md bg-ink text-canvas font-semibold text-xs hover:opacity-85"
                    >
                      Proses pesanan
                    </button>
                  )}

                  {ord.status === 'Diproses' && (
                    <button
                      type="button"
                      onClick={() => onUpdateOrderStatus(ord.id, 'Selesai')}
                      className="min-h-10 px-4 rounded-md bg-ok text-canvas font-semibold text-xs hover:opacity-85"
                    >
                      Tandai selesai
                    </button>
                  )}

                  {ord.status === 'Selesai' && (
                    <span className="text-xs text-ok font-semibold">Transaksi selesai</span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
