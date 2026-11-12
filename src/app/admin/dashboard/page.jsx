'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  Shield,
  Users,
  Store,
  Clock,
  Package,
  ShoppingBag,
  DollarSign,
  CheckCircle2,
  XCircle,
  Trash2,
  Edit,
  Plus,
  RefreshCw,
  Search,
  AlertTriangle,
  FolderTree,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { user, login } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    stats: {
      total_users: 0,
      total_buyers: 0,
      total_active_sellers: 0,
      total_pending_sellers: 0,
      total_products: 0,
      total_orders: 0,
      total_completed_revenue: 0,
    },
    pendingSellers: [],
    users: [],
    categories: [],
    products: [],
  });

  const [activeTab, setActiveTab] = useState('pending');
  const [statusMessage, setStatusMessage] = useState(null);
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [productSearch, setProductSearch] = useState('');

  const [categoryModal, setCategoryModal] = useState({
    isOpen: false,
    isEdit: false,
    id: null,
    name: '',
    slug: '',
    description: '',
    image_url: '',
  });

  const [deleteConfirm, setDeleteConfirm] = useState({
    isOpen: false,
    type: null,
    id: null,
    title: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAdminData = async () => {
    if (!user || user.role !== 'admin') return;
    try {
      setLoading(true);
      const res = await fetch(`/api/admin?adminId=${user.id}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Gagal memuat data admin.');
      setData(json);
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchAdminData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const showToast = (type, text) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleApproveSeller = async (sellerId, storeName) => {
    try {
      setIsSubmitting(true);
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'approve_seller',
          adminId: user.id,
          sellerId,
        }),
      });
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || 'Gagal menyetujui seller.');

      showToast('success', `Toko "${storeName}" resmi disetujui untuk berjualan!`);
      fetchAdminData();
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRejectSeller = async (sellerId, storeName) => {
    try {
      setIsSubmitting(true);
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reject_seller',
          adminId: user.id,
          sellerId,
        }),
      });
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || 'Gagal menolak seller.');

      showToast('success', `Pengajuan toko "${storeName}" telah ditolak.`);
      fetchAdminData();
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async (targetUserId) => {
    try {
      setIsSubmitting(true);
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete_user',
          adminId: user.id,
          targetUserId,
        }),
      });
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || 'Gagal menghapus user.');

      showToast('success', 'User berhasil dihapus.');
      setDeleteConfirm({ isOpen: false, type: null, id: null, title: '' });
      fetchAdminData();
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      setIsSubmitting(true);
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete_product',
          adminId: user.id,
          productId,
        }),
      });
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || 'Gagal menghapus produk.');

      showToast('success', 'Produk berhasil diturunkan dari katalog.');
      setDeleteConfirm({ isOpen: false, type: null, id: null, title: '' });
      fetchAdminData();
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const action = categoryModal.isEdit ? 'update_category' : 'create_category';
      const payload = {
        action,
        adminId: user.id,
        name: categoryModal.name,
        slug: categoryModal.slug || categoryModal.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
        description: categoryModal.description,
        image_url: categoryModal.image_url,
      };

      if (categoryModal.isEdit) {
        payload.id = categoryModal.id;
      }

      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || 'Gagal menyimpan kategori.');

      showToast('success', `Kategori "${payload.name}" berhasil disimpan.`);
      setCategoryModal({ isOpen: false, isEdit: false, id: null, name: '', slug: '', description: '', image_url: '' });
      fetchAdminData();
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      setIsSubmitting(true);
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete_category',
          adminId: user.id,
          id: categoryId,
        }),
      });
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || 'Gagal menghapus kategori.');

      showToast('success', 'Kategori berhasil dihapus.');
      setDeleteConfirm({ isOpen: false, type: null, id: null, title: '' });
      fetchAdminData();
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#0A0D14] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#10141D] border border-red-500/30 rounded-2xl p-8 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500">
            <Shield className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white uppercase tracking-wider">Akses Terbatas: Super Admin</h1>
            <p className="text-xs text-gray-400 mt-2">
              Halaman ini hanya dapat diakses oleh akun terotorisasi dengan peran <span className="text-purple-400 font-bold">Admin</span>.
            </p>
          </div>
          <div className="pt-2 border-t border-[#1C2331] space-y-3">
            <button
              onClick={() => {
                login({
                  id: 1,
                  name: 'Admin Apex',
                  email: 'admin@esports.com',
                  role: 'admin',
                  status: 'approved',
                });
              }}
              className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-purple-600/30"
            >
              🛡️ Masuk Cepat sebagai Super Admin
            </button>
            <Link
              href="/login"
              className="block w-full py-2.5 bg-[#151A23] hover:bg-[#1E2638] text-gray-300 font-semibold rounded-xl text-xs transition-colors"
            >
              Kembali ke Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const filteredUsers = data.users.filter((u) => {
    if (userRoleFilter === 'all') return true;
    return u.role === userRoleFilter;
  });

  const filteredProducts = data.products.filter((p) => {
    if (!productSearch) return true;
    const term = productSearch.toLowerCase();
    return (
      p.name.toLowerCase().includes(term) ||
      p.store_name?.toLowerCase().includes(term) ||
      p.category_name?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="min-h-screen bg-[#0A0D14] text-gray-200 pb-20">
      <div className="border-b border-[#1C2331] bg-[#0E121A]/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black text-white tracking-wider uppercase font-mono">COMMAND CENTER // ADMIN</h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  ROOT
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Pengelolaan toko, verifikasi seller, dan moderasi marketplace turnamen
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchAdminData}
              disabled={loading}
              className="px-3 py-2 rounded-xl bg-[#151A23] border border-[#262E3D] hover:border-gray-500 text-xs font-semibold text-gray-300 flex items-center gap-2 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <Link
              href="/katalog"
              className="px-3 py-2 rounded-xl bg-[#151A23] border border-[#262E3D] hover:border-[#00F0FF] text-xs font-semibold text-gray-300 flex items-center gap-2 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#00F0FF]" />
              <span>Lihat Katalog</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {statusMessage && (
          <div
            className={`p-4 rounded-xl border flex items-center justify-between animate-fadeIn text-xs font-semibold ${
              statusMessage.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-red-500/10 border-red-500/30 text-red-300'
            }`}
          >
            <span>{statusMessage.text}</span>
            <button onClick={() => setStatusMessage(null)} className="text-gray-400 hover:text-white">
              ✕
            </button>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-[#10141D] border border-[#1C2331] rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between text-gray-400 text-xs">
              <span>Total Pengguna</span>
              <Users className="w-4 h-4 text-cyan-400" />
            </div>
            <p className="text-2xl font-black text-white font-mono">{data.stats.total_users}</p>
            <p className="text-[10px] text-gray-500">{data.stats.total_buyers} Buyer terdaftar</p>
          </div>

          <div className="bg-[#10141D] border border-[#1C2331] rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between text-gray-400 text-xs">
              <span>Seller Aktif</span>
              <Store className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-black text-emerald-400 font-mono">{data.stats.total_active_sellers}</p>
            <p className="text-[10px] text-gray-500">Toko terverifikasi</p>
          </div>

          <div className={`bg-[#10141D] border rounded-2xl p-4 space-y-2 ${
            data.stats.total_pending_sellers > 0 ? 'border-amber-500/40 bg-amber-500/5' : 'border-[#1C2331]'
          }`}>
            <div className="flex items-center justify-between text-gray-400 text-xs">
              <span>Menunggu Review</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-black text-amber-400 font-mono">{data.stats.total_pending_sellers}</p>
              {data.stats.total_pending_sellers > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              )}
            </div>
            <p className="text-[10px] text-amber-300/80 font-medium">Perlu tindakan</p>
          </div>

          <div className="bg-[#10141D] border border-[#1C2331] rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between text-gray-400 text-xs">
              <span>Total Produk</span>
              <Package className="w-4 h-4 text-[#FF5E00]" />
            </div>
            <p className="text-2xl font-black text-white font-mono">{data.stats.total_products}</p>
            <p className="text-[10px] text-gray-500">Across all stores</p>
          </div>

          <div className="bg-[#10141D] border border-[#1C2331] rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between text-gray-400 text-xs">
              <span>Total Pesanan</span>
              <ShoppingBag className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-2xl font-black text-white font-mono">{data.stats.total_orders}</p>
            <p className="text-[10px] text-gray-500">Transaksi dibuat</p>
          </div>

          <div className="bg-[#10141D] border border-[#1C2331] rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between text-gray-400 text-xs">
              <span>Revenue Selesai</span>
              <DollarSign className="w-4 h-4 text-[#00F0FF]" />
            </div>
            <p className="text-lg font-black text-[#00F0FF] font-mono truncate">
              Rp {Number(data.stats.total_completed_revenue).toLocaleString('id-ID')}
            </p>
            <p className="text-[10px] text-gray-500">Order sukses</p>
          </div>
        </div>

        <div className="flex border-b border-[#1C2331] space-x-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('pending')}
            className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'pending'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Verifikasi Seller</span>
            {data.pendingSellers.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                {data.pendingSellers.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'users'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Manajemen Pengguna</span>
            <span className="text-[10px] text-gray-500">({data.users.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'categories'
                ? 'border-emerald-400 text-emerald-300'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <FolderTree className="w-4 h-4" />
            <span>Kategori Produk</span>
            <span className="text-[10px] text-gray-500">({data.categories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'products'
                ? 'border-[#FF5E00] text-[#FF5E00]'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Moderasi Katalog</span>
            <span className="text-[10px] text-gray-500">({data.products.length})</span>
          </button>
        </div>

        {activeTab === 'pending' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white uppercase tracking-wider">
                  Pengajuan Akun Seller Baru
                </h2>
                <p className="text-xs text-gray-400">
                  Verifikasi identitas pendaftar toko sebelum mereka dapat mengunggah katalog perlengkapan turnamen
                </p>
              </div>
            </div>

            {data.pendingSellers.length === 0 ? (
              <div className="p-12 rounded-2xl bg-[#10141D] border border-[#1C2331] text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h3 className="text-sm font-bold text-white">Semua Bersih & Terverifikasi</h3>
                <p className="text-xs text-gray-400 max-w-sm mx-auto">
                  Tidak ada pengajuan seller yang pending saat ini. Semua toko pendaftar sudah ditinjau.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.pendingSellers.map((seller) => (
                  <div
                    key={seller.id}
                    className="p-5 rounded-2xl bg-[#10141D] border border-amber-500/30 space-y-4 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 px-3 py-1 bg-amber-500/20 text-amber-300 text-[10px] font-bold rounded-bl-xl border-l border-b border-amber-500/30 uppercase tracking-wider">
                      Menunggu Verifikasi
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Store className="w-4 h-4 text-amber-400" />
                        <h3 className="font-bold text-white text-base">
                          {seller.store_name || 'Toko Tanpa Nama'}
                        </h3>
                      </div>
                      <p className="text-xs text-gray-400 italic">
                        &quot;{seller.store_description || 'Belum mengisi deskripsi toko'}&quot;
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-[#151A23] border border-[#262E3D] space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Pemilik:</span>
                        <span className="font-semibold text-gray-200">{seller.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Email:</span>
                        <span className="font-mono text-gray-300">{seller.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">No. Telepon:</span>
                        <span className="font-mono text-gray-300">{seller.phone || '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Alamat:</span>
                        <span className="text-gray-300 text-right max-w-[200px] truncate">{seller.address || '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Waktu Daftar:</span>
                        <span className="text-gray-400">
                          {new Date(seller.created_at).toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <button
                        onClick={() => handleApproveSeller(seller.id, seller.store_name || seller.name)}
                        disabled={isSubmitting}
                        className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 shadow-md shadow-emerald-600/20"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Setujui Toko</span>
                      </button>

                      <button
                        onClick={() => handleRejectSeller(seller.id, seller.store_name || seller.name)}
                        disabled={isSubmitting}
                        className="py-2.5 px-4 bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Tolak</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'users' && (
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
                    {filteredUsers.map((u) => {
                      const isCurrentUser = Number(u.id) === Number(user.id);
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
                                    ? 'bg-[#FF5E00]/20 text-[#FF5E00] border-[#FF5E00]/40'
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
                                <Store className="w-3 h-3 text-[#FF5E00]" />
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
                                onClick={() =>
                                  setDeleteConfirm({
                                    isOpen: true,
                                    type: 'user',
                                    id: u.id,
                                    title: `Hapus Akun: ${u.name} (${u.email})`,
                                  })
                                }
                                className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                                title="Hapus User"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-white uppercase tracking-wider">
                  Kategori Perlengkapan Turnamen
                </h2>
                <p className="text-xs text-gray-400">
                  Kelola klasifikasi produk turnamen untuk mempermudah pencarian buyer
                </p>
              </div>

              <button
                onClick={() =>
                  setCategoryModal({
                    isOpen: true,
                    isEdit: false,
                    id: null,
                    name: '',
                    slug: '',
                    description: '',
                    image_url: '',
                  })
                }
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-purple-600/30"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Kategori</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {data.categories.map((cat) => (
                <div
                  key={cat.id}
                  className="p-4 rounded-2xl bg-[#10141D] border border-[#1C2331] space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="w-full h-28 relative rounded-xl overflow-hidden bg-[#151A23] border border-[#1C2331]">
                      {cat.image_url ? (
                        <Image
                          src={cat.image_url}
                          alt={cat.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-600">
                          <FolderTree className="w-8 h-8" />
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="font-bold text-white text-sm">{cat.name}</h3>
                      <p className="text-[11px] text-gray-400 font-mono">/{cat.slug}</p>
                    </div>

                    <p className="text-xs text-gray-400 line-clamp-2">
                      {cat.description || 'Tidak ada deskripsi kategori'}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#1C2331] flex items-center justify-between text-xs">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#151A23] text-gray-400 font-mono">
                      {cat.product_count || 0} Produk
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() =>
                          setCategoryModal({
                            isOpen: true,
                            isEdit: true,
                            id: cat.id,
                            name: cat.name,
                            slug: cat.slug,
                            description: cat.description || '',
                            image_url: cat.image_url || '',
                          })
                        }
                        className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors"
                        title="Edit Kategori"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() =>
                          setDeleteConfirm({
                            isOpen: true,
                            type: 'category',
                            id: cat.id,
                            title: `Hapus Kategori: ${cat.name}`,
                          })
                        }
                        className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                        title="Hapus Kategori"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-white uppercase tracking-wider">
                  Moderasi Seluruh Katalog
                </h2>
                <p className="text-xs text-gray-400">
                  Pantau gear turnamen dan turunkan produk yang melanggar aturan platform
                </p>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Cari produk atau toko..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#10141D] border border-[#1C2331] focus:border-purple-500 text-xs text-white placeholder-gray-500 outline-none"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-[#1C2331] bg-[#10141D] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#151A23] border-b border-[#1C2331] text-gray-400 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-4">Produk</th>
                      <th className="p-4">Toko Penjual</th>
                      <th className="p-4">Kategori</th>
                      <th className="p-4">Harga</th>
                      <th className="p-4">Stok</th>
                      <th className="p-4">Rating</th>
                      <th className="p-4 text-right">Moderasi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1C2331]">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-[#151A23]/50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg overflow-hidden relative bg-[#151A23] flex-shrink-0 border border-[#262E3D]">
                              {p.image_url ? (
                                <Image
                                  src={p.image_url}
                                  alt={p.name}
                                  fill
                                  className="object-cover"
                                  unoptimized
                                />
                              ) : null}
                            </div>
                            <div>
                              <Link
                                href={`/produk/${p.slug}`}
                                target="_blank"
                                className="font-bold text-white hover:text-[#00F0FF] transition-colors flex items-center gap-1"
                              >
                                <span>{p.name}</span>
                                <ExternalLink className="w-3 h-3 opacity-60" />
                              </Link>
                              <span className="text-[10px] text-gray-500 font-mono">ID: #{p.id}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-gray-200 font-medium">{p.store_name}</div>
                          <div className="text-[10px] text-gray-500">Seller ID #{p.seller_id}</div>
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded text-[10px] bg-[#151A23] border border-[#262E3D] text-gray-300">
                            {p.category_name}
                          </span>
                        </td>
                        <td className="p-4 font-mono font-bold text-white">
                          Rp {Number(p.price).toLocaleString('id-ID')}
                        </td>
                        <td className="p-4 font-mono">
                          <span className={p.stock < 5 ? 'text-red-400 font-bold' : 'text-gray-300'}>
                            {p.stock} unit
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1 text-amber-400 font-bold">
                            <span>★</span>
                            <span>{Number(p.rating || 0).toFixed(1)}</span>
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() =>
                              setDeleteConfirm({
                                isOpen: true,
                                type: 'product',
                                id: p.id,
                                title: `Turunkan Produk: "${p.name}" dari ${p.store_name}`,
                              })
                            }
                            className="px-2.5 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold flex items-center gap-1.5 ml-auto transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Hapus</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {categoryModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="max-w-md w-full bg-[#10141D] border border-purple-500/30 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#1C2331]">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <FolderTree className="w-5 h-5 text-purple-400" />
                <span>{categoryModal.isEdit ? 'Edit Kategori' : 'Tambah Kategori Baru'}</span>
              </h3>
              <button
                onClick={() => setCategoryModal({ ...categoryModal, isOpen: false })}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-gray-400 font-semibold">Nama Kategori</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Esports Jersey"
                  value={categoryModal.name}
                  onChange={(e) => setCategoryModal({ ...categoryModal, name: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#151A23] border border-[#262E3D] focus:border-purple-500 text-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-400 font-semibold">Slug URL (Opsional)</label>
                <input
                  type="text"
                  placeholder="e.g. esports-jersey"
                  value={categoryModal.slug}
                  onChange={(e) => setCategoryModal({ ...categoryModal, slug: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#151A23] border border-[#262E3D] focus:border-purple-500 text-white outline-none font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-400 font-semibold">URL Gambar Thumbnail</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={categoryModal.image_url}
                  onChange={(e) => setCategoryModal({ ...categoryModal, image_url: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#151A23] border border-[#262E3D] focus:border-purple-500 text-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-400 font-semibold">Deskripsi</label>
                <textarea
                  rows={3}
                  placeholder="Deskripsi kategori..."
                  value={categoryModal.description}
                  onChange={(e) => setCategoryModal({ ...categoryModal, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#151A23] border border-[#262E3D] focus:border-purple-500 text-white outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#1C2331]">
                <button
                  type="button"
                  onClick={() => setCategoryModal({ ...categoryModal, isOpen: false })}
                  className="px-4 py-2 rounded-xl bg-[#151A23] hover:bg-[#1E2638] text-gray-300 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold disabled:opacity-50"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Kategori'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirm.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="max-w-md w-full bg-[#10141D] border border-red-500/30 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400">
              <AlertTriangle className="w-6 h-6 flex-shrink-0" />
              <h3 className="font-bold text-white text-sm">Konfirmasi Penghapusan</h3>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">
              Apakah Anda yakin ingin menghapus:{' '}
              <span className="font-bold text-white block mt-1">{deleteConfirm.title}</span>
            </p>

            <p className="text-[11px] text-red-400/80 bg-red-500/10 p-2.5 rounded-xl border border-red-500/20">
              Tindakan ini tidak dapat dibatalkan dan akan langsung mempengaruhi data di database.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#1C2331]">
              <button
                type="button"
                onClick={() => setDeleteConfirm({ isOpen: false, type: null, id: null, title: '' })}
                className="px-4 py-2 rounded-xl bg-[#151A23] hover:bg-[#1E2638] text-gray-300 text-xs font-semibold"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => {
                  if (deleteConfirm.type === 'user') handleDeleteUser(deleteConfirm.id);
                  if (deleteConfirm.type === 'product') handleDeleteProduct(deleteConfirm.id);
                  if (deleteConfirm.type === 'category') handleDeleteCategory(deleteConfirm.id);
                }}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold disabled:opacity-50"
              >
                {isSubmitting ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
