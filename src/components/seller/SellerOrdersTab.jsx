'use client';

export default function SellerOrdersTab({
  orders,
  formatIDR,
  onUpdateOrderStatus,
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-white font-sans">Pesanan Masuk dari Pembeli</h2>
        <span className="text-xs text-gray-400 font-mono">{orders.length} Transaksi</span>
      </div>

      {orders.length === 0 ? (
        <div className="p-8 text-center rounded-xl bg-[#121722] border border-[#20293A] text-gray-400 text-xs">
          Belum ada pesanan masuk untuk toko Anda saat ini.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((ord) => (
            <div key={ord.id} className="p-5 rounded-2xl bg-[#121722] border border-[#20293A] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#20293A] pb-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-sm text-[#FF1E27]">{ord.order_number}</span>
                  <span className="text-xs text-gray-400">
                    Pembeli: <strong className="text-white">{ord.buyer_name}</strong> ({ord.buyer_email})
                  </span>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold ${
                    ord.status === 'Selesai'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : ord.status === 'Diproses'
                      ? 'bg-[#FFD000]/10 text-[#FFD000] border border-[#FFD000]/30'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {ord.status}
                </span>
              </div>

              {/* List Barang Milik Toko Ini dengan Selected Variant & Color */}
              <div className="space-y-2">
                {ord.items.map((it) => (
                  <div
                    key={it.order_item_id}
                    className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-[#0A0D14] border border-[#20293A]"
                  >
                    <div className="flex items-center gap-2.5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={it.product_image}
                        alt=""
                        className="w-10 h-10 rounded-lg object-cover border border-[#20293A]"
                      />
                      <div>
                        <span className="text-white font-semibold">{it.product_name}</span>
                        <span className="text-gray-400 ml-1.5 font-mono">({it.quantity}x)</span>
                        {(it.selected_variant || it.selected_color) && (
                          <div className="flex items-center gap-2 text-[10px] font-mono text-gray-400 mt-0.5">
                            {it.selected_variant && (
                              <span>
                                Varian: <strong className="text-gray-200">{it.selected_variant}</strong>
                              </span>
                            )}
                            {it.selected_color && (
                              <span>
                                Warna: <strong className="text-[#FFD000]">{it.selected_color}</strong>
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <span className="font-mono font-bold text-[#FF1E27]">{formatIDR(it.subtotal)}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 text-xs border-t border-[#20293A]">
                <p className="text-gray-400 max-w-md">
                  Alamat Kirim: <span className="text-gray-200">{ord.shipping_address}</span>
                </p>

                {/* Tombol Perubahan Status Pesanan */}
                <div className="flex items-center gap-2">
                  {ord.status === 'Menunggu Pembayaran' && (
                    <button
                      onClick={() => onUpdateOrderStatus(ord.id, 'Diproses')}
                      className="px-3 py-1.5 rounded-lg bg-[#FF1E27] text-white font-bold text-xs hover:bg-[#FFD000] hover:text-black transition-colors"
                    >
                      Proses Pesanan →
                    </button>
                  )}

                  {ord.status === 'Diproses' && (
                    <button
                      onClick={() => onUpdateOrderStatus(ord.id, 'Selesai')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500 text-white font-bold text-xs hover:bg-emerald-600 transition-colors"
                    >
                      Tandai Selesai ✓
                    </button>
                  )}

                  {ord.status === 'Selesai' && (
                    <span className="text-xs text-emerald-400 font-mono font-bold">✓ Transaksi Selesai</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
