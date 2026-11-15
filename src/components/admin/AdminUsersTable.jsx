import { Store, Trash2 } from 'lucide-react';

export default function AdminUsersTable({
  users,
  currentUserId,
  userRoleFilter,
  setUserRoleFilter,
  onDeleteUser,
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-white uppercase tracking-wider">
            Daftar Pengguna Platform
          </h2>
          <p className="text-xs text-gray-400">
            Seluruh akun terdaftar: Buyer, Seller, dan Administrator
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-[#10141D] border border-[#1C2331] rounded-xl text-xs">
          {['all', 'buyer', 'seller', 'admin'].map((role) => (
            <button
              key={role}
              onClick={() => setUserRoleFilter(role)}
              className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-colors ${
                userRoleFilter === role
                  ? 'bg-purple-600 text-white font-bold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {role === 'all' ? 'Semua' : role}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-[#1C2331] bg-[#10141D] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#151A23] border-b border-[#1C2331] text-gray-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Pengguna</th>
                <th className="p-4">Kontak</th>
                <th className="p-4">Peran & Status</th>
                <th className="p-4">Info Toko / Pesanan</th>
                <th className="p-4">Bergabung</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1C2331]">
              {(users || []).length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500 font-mono text-xs">
                    Tidak ada pengguna dalam kategori ini.
                  </td>
                </tr>
              ) : (
                (users || []).map((u) => {
                const isCurrentUser = Number(u.id) === Number(currentUserId);
                return (
                  <tr key={u.id} className="hover:bg-[#151A23]/50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-white flex items-center gap-2">
                        <span>{u.name}</span>
                        {isCurrentUser && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                            Anda
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-gray-500 font-mono">ID: #{u.id}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-mono text-gray-300">{u.email}</div>
                      <div className="text-[10px] text-gray-500">{u.phone || '-'}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                            u.role === 'admin'
                              ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                              : u.role === 'seller'
                              ? 'bg-[#FF1E27]/20 text-[#FF1E27] border-[#FF1E27]/40'
                              : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                          }`}
                        >
                          {u.role}
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                            u.status === 'approved'
                              ? 'text-emerald-400 bg-emerald-500/10'
                              : u.status === 'pending'
                              ? 'text-amber-400 bg-amber-500/10'
                              : 'text-red-400 bg-red-500/10'
                          }`}
                        >
                          {u.status}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      {u.role === 'seller' && (
                        <div className="text-gray-300 flex items-center gap-1">
                          <Store className="w-3 h-3 text-[#FFD000]" />
                          <span>{u.store_name || '-'}</span>
                        </div>
                      )}
                      {u.role === 'buyer' && (
                        <div className="text-gray-400">
                          {u.total_orders} transaksi
                        </div>
                      )}
                      {u.role === 'admin' && (
                        <span className="text-gray-500 italic">Sistem Administrator</span>
                      )}
                    </td>
                    <td className="p-4 text-gray-400">
                      {new Date(u.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="p-4 text-right">
                      {isCurrentUser ? (
                        <span className="text-[11px] text-gray-500 italic">Protected</span>
                      ) : (
                        <button
                          onClick={() => onDeleteUser(u)}
                          className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                          title="Hapus User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              }))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
