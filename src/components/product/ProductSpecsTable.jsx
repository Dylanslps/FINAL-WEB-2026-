export default function ProductSpecsTable({ specs }) {
  if (!specs || specs.length === 0) return null;

  return (
    <section className="space-y-4 pt-8 border-t border-[#20293A]">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight font-sans">
          Product Specification
        </h2>
        <p className="text-xs text-gray-400 mt-0.5">
          Rincian teknis dan spesifikasi perangkat keras standar kompetisi esports.
        </p>
      </div>

      <div className="rounded-2xl bg-[#121722] border border-[#20293A] overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#20293A] bg-[#0A0D14]/80 text-gray-400 font-mono text-[11px] uppercase tracking-wider">
              <th className="py-3 px-5 font-semibold w-1/3">Features</th>
              <th className="py-3 px-5 font-semibold w-2/3">Detail</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#20293A]/60">
            {specs.map((item, idx) => (
              <tr
                key={item.feature}
                className={`hover:bg-[#1A2232] transition-colors ${
                  idx % 2 === 1 ? 'bg-[#0E131C]/40' : ''
                }`}
              >
                <td className="py-3 px-5 font-semibold text-gray-300 font-sans">
                  {item.feature}
                </td>
                <td className="py-3 px-5 text-gray-400 font-mono">
                  {item.detail}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
