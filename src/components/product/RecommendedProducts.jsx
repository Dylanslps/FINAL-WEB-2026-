import Link from 'next/link';

export default function RecommendedProducts({ products }) {
  if (!products || products.length === 0) return null;

  const formatIDR = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <section className="space-y-6 pt-12 border-t border-[#20293A]">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black italic uppercase tracking-wider text-white font-sans">
          OTHER <span className="text-[#FF1E27]">RECOMMENDED</span>
        </h2>
        <Link
          href="/katalog"
          className="text-xs text-[#FFD000] hover:text-[#FF1E27] font-mono font-bold transition-colors"
        >
          Lihat Semua Gear →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {products.map((rel) => {
          const relOriginalPrice = Math.round(Number(rel.price) * 1.25);
          return (
            <Link
              key={rel.id}
              href={`/produk/${rel.slug}`}
              className="group flex flex-col bg-[#121722] border border-[#20293A] hover:border-[#FF1E27]/60 rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#FF1E27]/10"
            >
              <div className="relative aspect-square w-full bg-[#0A0D14] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={rel.image_url}
                  alt={rel.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {rel.is_featured && (
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-[#FF1E27] text-white text-[9px] font-black uppercase tracking-wider shadow">
                    HOT
                  </span>
                )}
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-2.5">
                {/* Color Dots Indicator Sesuai Good Gaming Shop */}
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-black border border-gray-600" />
                  <span className="w-2.5 h-2.5 rounded-full bg-white border border-gray-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF1E27] border border-[#FF1E27]" />
                  <span className="text-[10px] text-gray-500 font-mono ml-1">+1</span>
                </div>

                <div>
                  <h3 className="font-bold text-white text-xs line-clamp-1 group-hover:text-[#FF1E27] transition-colors">
                    {rel.name}
                  </h3>
                  <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                    Brand: {rel.brand || 'VALIANT PRO'}
                  </p>
                </div>

                <div className="flex items-baseline gap-2 pt-1 border-t border-[#20293A]/60">
                  <span className="font-black text-[#FF1E27] font-mono text-sm">
                    {formatIDR(rel.price)}
                  </span>
                  <span className="text-[11px] text-gray-500 font-mono line-through">
                    {formatIDR(relOriginalPrice)}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
