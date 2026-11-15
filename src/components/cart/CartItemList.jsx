'use client';

import Link from 'next/link';
import { Trash2, Plus, Minus } from 'lucide-react';

export default function CartItemList({ items, updateQty, removeItem, formatIDR }) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div
          key={item.cart_item_id}
          className="p-4 rounded-2xl bg-[#121722] border border-[#20293A] flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <Link
              href={`/produk/${item.product_slug}`}
              className="w-20 h-20 rounded-xl bg-[#0A0D14] border border-[#20293A] overflow-hidden flex-shrink-0"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.product_image}
                alt={item.product_name}
                className="w-full h-full object-cover"
              />
            </Link>

            <div className="space-y-1">
              <Link
                href={`/produk/${item.product_slug}`}
                className="font-bold text-white text-sm hover:text-[#FF1E27] transition-colors line-clamp-1"
              >
                {item.product_name}
              </Link>
              <p className="text-[10px] text-gray-400 font-mono">
                Seller: <strong className="text-gray-300">{item.store_name}</strong>
              </p>

              {(item.selected_variant || item.selected_color) && (
                <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono text-gray-400 pt-0.5">
                  {item.selected_variant && (
                    <span className="px-2 py-0.5 rounded bg-[#0A0D14] border border-[#20293A] text-gray-300">
                      Varian: <strong>{item.selected_variant}</strong>
                    </span>
                  )}
                  {item.selected_color && (
                    <span className="px-2 py-0.5 rounded bg-[#0A0D14] border border-[#20293A] text-[#FFD000]">
                      Warna: <strong>{item.selected_color}</strong>
                    </span>
                  )}
                </div>
              )}

              <p className="font-bold font-mono text-[#FF1E27] text-xs pt-0.5">
                {formatIDR(item.price)}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#20293A]">
            <div className="flex items-center border border-[#20293A] rounded-xl bg-[#0A0D14] overflow-hidden">
              <button
                type="button"
                onClick={() => updateQty(item.cart_item_id, item.quantity - 1)}
                disabled={item.quantity <= 1}
                className="p-1.5 text-gray-400 hover:text-white disabled:opacity-30"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="px-3 text-xs font-mono font-bold text-white">
                {item.quantity}
              </span>
              <button
                type="button"
                onClick={() => updateQty(item.cart_item_id, item.quantity + 1)}
                disabled={item.quantity >= item.stock}
                className="p-1.5 text-gray-400 hover:text-white disabled:opacity-30"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <span className="font-black font-mono text-white text-sm">
              {formatIDR(item.subtotal)}
            </span>

            <button
              type="button"
              onClick={() => removeItem(item.cart_item_id)}
              className="p-2 rounded-xl text-gray-400 hover:text-rose-400 hover:bg-rose-950/20 transition-colors"
              title="Hapus dari keranjang"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
