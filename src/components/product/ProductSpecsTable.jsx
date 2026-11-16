export default function ProductSpecsTable({ specs }) {
  if (!specs || specs.length === 0) return null;

  return (
    <section aria-labelledby="specs-heading" className="space-y-4 pt-8 border-t border-line">
      <div>
        <h2 id="specs-heading" className="font-display uppercase text-2xl sm:text-3xl">
          Spesifikasi Produk
        </h2>
        <p className="text-sm text-ink-2 mt-1">
          Rincian material, ukuran, dan informasi toko penjual.
        </p>
      </div>

      <div className="rounded-xl bg-surface border border-line overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-line bg-surface-2 text-ink-2 text-xs uppercase">
              <th className="py-3 px-5 font-semibold w-1/3">Atribut</th>
              <th className="py-3 px-5 font-semibold w-2/3">Rincian</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {specs.map((item) => (
              <tr key={item.feature} className="hover:bg-surface-2/60 transition-colors">
                <td className="py-3 px-5 font-medium text-ink">{item.feature}</td>
                <td className="py-3 px-5 text-ink-2">{item.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
