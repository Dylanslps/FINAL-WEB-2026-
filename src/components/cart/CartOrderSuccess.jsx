import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';

export default function CartOrderSuccess({
  order,
  shippingAddress,
  formatIDR,
}) {
  return (
    <div className="max-w-lg mx-auto my-12 text-center space-y-6 p-8 rounded-xl bg-surface border border-line">
      <div className="w-14 h-14 rounded-full bg-surface-2 text-ok flex items-center justify-center mx-auto border border-line">
        <CheckCircle2 className="w-7 h-7" aria-hidden="true" />
      </div>

      <div className="space-y-1">
        <h1 className="font-display uppercase text-3xl">Pesanan berhasil dibuat</h1>
        <p className="text-sm text-ink-2">
          Nomor pesanan: <strong className="text-ink">{order.order_number}</strong>
        </p>
      </div>

      <div className="p-4 rounded-lg bg-canvas border border-line text-left text-xs space-y-2">
        <div className="flex justify-between">
          <span className="text-ink-2">Status pesanan</span>
          <span className="font-semibold text-warn">{order.status}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-ink-2">Total pembayaran</span>
          <span className="font-bold text-ink tabular-nums">{formatIDR(order.total_amount)}</span>
        </div>
        <div className="pt-2 border-t border-line text-ink-2">
          Alamat pengiriman:
          <p className="text-ink mt-0.5">{shippingAddress}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Link
          href="/orders"
          className="flex-1 min-h-11 inline-flex items-center justify-center rounded-md bg-ink text-canvas font-semibold text-sm hover:opacity-85"
        >
          Lihat dan lacak pesanan
        </Link>
        <Link
          href="/katalog"
          className="min-h-11 px-5 inline-flex items-center justify-center rounded-md bg-surface-2 text-ink border border-line text-sm font-semibold hover:bg-line"
        >
          Lanjut belanja
        </Link>
      </div>
    </div>
  );
}
