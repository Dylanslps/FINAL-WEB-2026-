'use client';

import Link from 'next/link';
import { Trash2, Plus, Minus } from 'lucide-react';

export default function CartItemList({ items, updateQty, removeItem, formatIDR }) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <article
          key={item.cart_item_id}
          className="p-4 rounded-xl bg-surface border border-line flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <Link
              href={`/produk/${item.product_slug}`}
              className="w-20 h-20 rounded-lg bg-surface-2 border border-line overflow-hidden flex-shrink-0 flex items-center justify-center p-2"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.product_image}
                alt={item.product_name}
                width={80}
                height={80}
                className="w-full h-full object-contain"
              />
            </Link>

            <div className="space-y-1">
              <Link
                href={`/produk/${item.product_slug}`}
                className="font-semibold text-sm hover:underline line-clamp-1"
              >
                {item.product_name}
              </Link>
              <p className="text-xs text-ink-2">
                Toko: <strong className="text-ink">{item.store_name}</strong>
              </p>

              {(item.selected_variant || item.selected_color) && (
                <div className="flex flex-wrap items-center gap-1.5 text-xs text-ink-2 pt-0.5">
                  {item.selected_variant && (
                    <span className="px-2 py-0.5 rounded bg-surface-2 border border-line text-ink">
                      Ukuran: {item.selected_variant}
                    </span>
                  )}
                  {item.selected_color && (
                    <span className="px-2 py-0.5 rounded bg-surface-2 border border-line text-ink">
                      Warna: {item.selected_color}
                    </span>
                  )}
                </div>
              )}

              <p className="font-semibold text-xs tabular-nums pt-0.5">
                {formatIDR(item.product_price ?? item.price)} / unit
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 pt-3 sm:pt-0 border-t sm:border-t-0 border-line">
            <div className="flex items-center border border-line rounded-md bg-canvas">
              <button
                type="button"
                onClick={() => updateQty(item.cart_item_id, item.quantity - 1)}
                disabled={item.quantity <= 1}
                aria-label={`Kurangi jumlah ${item.product_name}`}
                className="w-10 h-10 flex items-center justify-center text-ink hover:bg-surface-2 disabled:opacity-40"
              >
                <Minus className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
              <span className="px-3 text-xs font-semibold tabular-nums">
                {item.quantity}
              </span>
              <button
                type="button"
                onClick={() => updateQty(item.cart_item_id, item.quantity + 1)}
                disabled={item.quantity >= (item.product_stock ?? item.stock)}
                aria-label={`Tambah jumlah ${item.product_name}`}
                className="w-10 h-10 flex items-center justify-center text-ink hover:bg-surface-2 disabled:opacity-40"
              >
                <Plus className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>

            <span className="font-bold text-sm tabular-nums">
              {formatIDR(item.subtotal)}
            </span>

            <button
              type="button"
              onClick={() => removeItem(item.cart_item_id)}
              aria-label={`Hapus ${item.product_name} dari keranjang`}
              className="w-10 h-10 flex items-center justify-center rounded-md text-ink-2 hover:text-accent hover:bg-surface-2 transition-colors"
            >
              <Trash2 className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
