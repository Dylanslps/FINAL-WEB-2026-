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
          <h2 className="font-semibold text-base">Daftar Pengguna Platform</h2>
          <p className="text-xs text-ink-2">
            Kelola akun Buyer, Seller, dan Administrator.
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-surface border border-line rounded-lg text-xs">
          {['all', 'buyer', 'seller', 'admin'].map((role) => (
            <button
              key={role}
              type="button"
              aria-pressed={userRoleFilter === role}
              onClick={() => setUserRoleFilter(role)}
              className={`min-h-9 px-3 rounded-md capitalize font-semibold transition-colors ${
                userRoleFilter === role
                  ? 'bg-ink text-canvas'
                  : 'text-ink-2 hover:text-ink'
              }`}
            >
              {role === 'all' ? 'Semua' : role}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-line bg-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-2 border-b border-line text-ink-2 uppercase">
              <tr>
                <th className="p-4">Pengguna</th>
                <th className="p-4">Kontak</th>
                <th className="p-4">Peran & Status</th>
                <th className="p-4">Info Toko / Pesanan</th>
                <th className="p-4">Bergabung</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {(users || []).length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-ink-2 text-xs">
                    Tidak ada pengguna pada filter peran ini. Pilih tab Semua untuk menampilkan seluruh pengguna.
                  </td>
                </tr>
              ) : (
                (users || []).map((u) => {
                  const isCurrentUser = Number(u.id) === Number(currentUserId);
                  return (
                    <tr key={u.id} className="hover:bg-surface-2/60 transition-colors">
                      <td className="p-4">
                        <div className="font-semibold text-ink flex items-center gap-2">
                          <span>{u.name}</span>
                          {isCurrentUser && (
                            <span className="text-xs px-2 py-0.5 rounded bg-surface-2 text-ink border border-line">
                              Anda
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-ink-2">ID #{u.id}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-ink">{u.email}</div>
                        <div className="text-xs text-ink-2">{u.phone || '-'}</div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded text-xs font-semibold capitalize border border-line bg-surface-2 text-ink">
                            {u.role}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-semibold capitalize ${
                              u.status === 'approved'
                                ? 'text-ok'
                                : u.status === 'pending'
                                ? 'text-warn'
                                : 'text-accent'
                            }`}
                          >
                            {u.status}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        {u.role === 'seller' && (
                          <div className="text-ink flex items-center gap-1.5">
                            <Store className="w-3.5 h-3.5 text-ink-2" aria-hidden="true" />
                            <span>{u.store_name || '-'}</span>
                          </div>
                        )}
                        {u.role === 'buyer' && (
                          <div className="text-ink-2 tabular-nums">
                            {u.total_orders} pesanan
                          </div>
                        )}
                        {u.role === 'admin' && (
                          <span className="text-ink-2">Administrator</span>
                        )}
                      </td>
                      <td className="p-4 text-ink-2">
                        {new Date(u.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="p-4 text-right">
                        {isCurrentUser ? (
                          <span className="text-xs text-ink-2">Dilindungi</span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onDeleteUser(u)}
                            aria-label={`Hapus akun ${u.name}`}
                            className="w-9 h-9 inline-flex items-center justify-center rounded-md bg-canvas border border-line text-ink-2 hover:text-accent hover:border-accent transition-colors"
                          >
                            <Trash2 className="w-4 h-4" aria-hidden="true" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
