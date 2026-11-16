'use client';

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
      className="p-6 rounded-xl bg-surface border border-line space-y-5 sticky top-24"
    >
      <h2 className="font-display uppercase text-xl border-b border-line pb-3">
        Ringkasan Pesanan
      </h2>

      {errorMsg && (
        <div role="alert" className="p-3 rounded-md bg-surface-2 border border-accent text-accent text-xs">
          {errorMsg}
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="checkout-address" className="text-xs font-semibold text-ink block">
            Alamat lengkap pengiriman *
          </label>
          <textarea
            id="checkout-address"
            required
            rows={3}
            value={shippingAddress}
            onChange={(e) => setShippingAddress(e.target.value)}
            placeholder="Tulis nama jalan, nomor rumah, kecamatan, kota, dan kode pos..."
            className="w-full p-3 rounded-md bg-canvas border border-line text-sm text-ink placeholder:text-ink-2 focus:outline-none focus:border-ink"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="checkout-notes" className="text-xs font-semibold text-ink block">
            Catatan untuk penjual (opsional)
          </label>
          <input
            id="checkout-notes"
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Contoh: Bungkus double box, titip di pos satpam..."
            className="w-full h-11 px-3 rounded-md bg-canvas border border-line text-sm text-ink placeholder:text-ink-2 focus:outline-none focus:border-ink"
          />
        </div>
      </div>

      <div className="space-y-2 pt-3 border-t border-line text-sm">
        <div className="flex justify-between text-ink-2">
          <span>Jumlah barang</span>
          <span className="text-ink tabular-nums">{totalItems} unit</span>
        </div>
        <div className="flex justify-between items-baseline pt-2 border-t border-line">
          <span className="font-semibold">Total pembayaran</span>
          <span className="font-bold text-xl tabular-nums">
            {formatIDR(totalAmount)}
          </span>
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full min-h-12 rounded-md bg-ink text-canvas font-semibold text-sm hover:opacity-85 transition-opacity disabled:opacity-50"
      >
        {submitting ? 'Memproses pesanan...' : 'Buat pesanan sekarang'}
      </button>
    </form>
  );
}
