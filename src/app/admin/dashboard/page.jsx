'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Shield, Clock, Users, FolderTree, Package, RefreshCw, ExternalLink } from 'lucide-react';
import AdminStatsGrid from '@/components/admin/AdminStatsGrid';
import AdminPendingSellers from '@/components/admin/AdminPendingSellers';
import AdminUsersTable from '@/components/admin/AdminUsersTable';
import AdminCategoriesTab from '@/components/admin/AdminCategoriesTab';
import AdminProductsTable from '@/components/admin/AdminProductsTable';
import { CategoryModal, DeleteConfirmModal } from '@/components/admin/AdminModals';

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
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        body: JSON.stringify({ action: 'approve_seller', adminId: user.id, sellerId }),
      });
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || 'Gagal menyetujui seller.');

      showToast('success', `Toko "${storeName}" berhasil diverifikasi dan disetujui.`);
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
        body: JSON.stringify({ action: 'reject_seller', adminId: user.id, sellerId }),
      });
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || 'Gagal menolak seller.');

      showToast('error', `Pengajuan toko "${storeName}" telah ditolak.`);
      fetchAdminData();
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      setIsSubmitting(true);
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_user', adminId: user.id, userId }),
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
        body: JSON.stringify({ action: 'delete_product', adminId: user.id, productId }),
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
      if (categoryModal.isEdit) payload.id = categoryModal.id;

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
        body: JSON.stringify({ action: 'delete_category', adminId: user.id, id: categoryId }),
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
                login({ id: 1, name: 'Admin Apex', email: 'admin@esports.com', role: 'admin', status: 'approved' });
              }}
              className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-purple-600/30"
            >
              🛡️ Masuk Cepat sebagai Super Admin
            </button>
            <Link href="/login" className="block w-full py-2.5 bg-[#151A23] hover:bg-[#1E2638] text-gray-300 font-semibold rounded-xl text-xs transition-colors">
              Kembali ke Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const usersList = Array.isArray(data?.users) ? data.users : [];
  const productsList = Array.isArray(data?.products)
    ? data.products
    : (Array.isArray(data?.products?.products) ? data.products.products : []);
  const pendingSellersList = Array.isArray(data?.pendingSellers) ? data.pendingSellers : [];
  const categoriesList = Array.isArray(data?.categories) ? data.categories : [];

  const filteredUsers = usersList.filter((u) => userRoleFilter === 'all' || u.role === userRoleFilter);
  const filteredProducts = productsList.filter((p) => {
    if (!productSearch) return true;
    const term = productSearch.toLowerCase();
    return p.name?.toLowerCase().includes(term) || p.store_name?.toLowerCase().includes(term) || p.category_name?.toLowerCase().includes(term);
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
              className="px-3 py-2 rounded-xl bg-[#151A23] border border-[#262E3D] hover:border-[#FF1E27] text-xs font-semibold text-gray-300 flex items-center gap-2 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#FF1E27]" />
              <span>Lihat Katalog</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {statusMessage && (
          <div
            className={`p-4 rounded-xl border flex items-center justify-between animate-fadeIn text-xs font-semibold ${
              statusMessage.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-red-500/10 border-red-500/30 text-red-300'
            }`}
          >
            <span>{statusMessage.text}</span>
            <button onClick={() => setStatusMessage(null)} className="text-gray-400 hover:text-white">✕</button>
          </div>
        )}

        <AdminStatsGrid stats={data.stats} />

        <div className="flex border-b border-[#1C2331] space-x-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('pending')}
            className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'pending' ? 'border-amber-400 text-amber-300' : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Verifikasi Seller</span>
            {pendingSellersList.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                {pendingSellersList.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'users' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Manajemen Pengguna</span>
            <span className="text-[10px] text-gray-500">({usersList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'categories' ? 'border-emerald-400 text-emerald-300' : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <FolderTree className="w-4 h-4" />
            <span>Kategori Produk</span>
            <span className="text-[10px] text-gray-500">({categoriesList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'products' ? 'border-[#FF1E27] text-[#FF1E27]' : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Moderasi Katalog</span>
            <span className="text-[10px] text-gray-500">({productsList.length})</span>
          </button>
        </div>

        {activeTab === 'pending' && (
          <AdminPendingSellers
            pendingSellers={pendingSellersList}
            onApprove={handleApproveSeller}
            onReject={handleRejectSeller}
            isSubmitting={isSubmitting}
          />
        )}

        {activeTab === 'users' && (
          <AdminUsersTable
            users={filteredUsers}
            currentUserId={user.id}
            userRoleFilter={userRoleFilter}
            setUserRoleFilter={setUserRoleFilter}
            onDeleteUser={(u) =>
              setDeleteConfirm({ isOpen: true, type: 'user', id: u.id, title: `Hapus Akun: ${u.name} (${u.email})` })
            }
          />
        )}

        {activeTab === 'categories' && (
          <AdminCategoriesTab
            categories={categoriesList}
            onAdd={() => setCategoryModal({ isOpen: true, isEdit: false, id: null, name: '', slug: '', description: '', image_url: '' })}
            onEdit={(cat) => setCategoryModal({ isOpen: true, isEdit: true, id: cat.id, name: cat.name, slug: cat.slug, description: cat.description || '', image_url: cat.image_url || '' })}
            onDelete={(cat) => setDeleteConfirm({ isOpen: true, type: 'category', id: cat.id, title: `Hapus Kategori: ${cat.name}` })}
          />
        )}

        {activeTab === 'products' && (
          <AdminProductsTable
            products={filteredProducts}
            productSearch={productSearch}
            setProductSearch={setProductSearch}
            onDeleteProduct={(p) =>
              setDeleteConfirm({ isOpen: true, type: 'product', id: p.id, title: `Turunkan Produk: "${p.name}" dari ${p.store_name}` })
            }
          />
        )}
      </div>

      <CategoryModal
        modal={categoryModal}
        setModal={setCategoryModal}
        onSave={handleSaveCategory}
        isSubmitting={isSubmitting}
      />

      <DeleteConfirmModal
        modal={deleteConfirm}
        setModal={setDeleteConfirm}
        onConfirm={() => {
          if (deleteConfirm.type === 'user') handleDeleteUser(deleteConfirm.id);
          if (deleteConfirm.type === 'product') handleDeleteProduct(deleteConfirm.id);
          if (deleteConfirm.type === 'category') handleDeleteCategory(deleteConfirm.id);
        }}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
