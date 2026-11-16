'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Shield, Clock, Users, FolderTree, Package, RefreshCw, X } from 'lucide-react';
import AdminStatsGrid from '@/components/admin/AdminStatsGrid';
import AdminPendingSellers from '@/components/admin/AdminPendingSellers';
import AdminUsersTable from '@/components/admin/AdminUsersTable';
import AdminCategoriesTab from '@/components/admin/AdminCategoriesTab';
import AdminProductsTable from '@/components/admin/AdminProductsTable';
import { CategoryModal, DeleteConfirmModal } from '@/components/admin/AdminModals';

export default function AdminDashboardPage() {
  const { user, switchAccount } = useAuth();
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
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
  });

  const [deleteConfirm, setDeleteConfirm] = useState({
    isOpen: false,
    type: null,
    id: null,
    title: '',
  });

  const showToast = (type, text) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const fetchAdminData = useCallback(async () => {
    if (!user || user.role !== 'admin') return;
    try {
      setLoading(true);
      setLoadError('');
      const res = await fetch(`/api/admin?adminId=${user.id}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Gagal memuat data admin.');
      setData(json);
    } catch (err) {
      setLoadError(err.message || 'Gagal memuat data admin.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchAdminData();
    } else {
      setLoading(false);
    }
  }, [user, fetchAdminData]);

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

      showToast('success', `Toko "${storeName}" telah diverifikasi dan disetujui.`);
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
      if (!res.ok) throw new Error(resData.error || 'Gagal menghapus pengguna.');

      showToast('success', 'Pengguna berhasil dihapus.');
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
      setCategoryModal({ isOpen: false, isEdit: false, id: null, name: '', slug: '', description: '' });
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
      <div className="max-w-md mx-auto my-12 bg-surface border border-line rounded-xl p-8 text-center space-y-5">
        <div className="w-12 h-12 mx-auto rounded-full bg-surface-2 flex items-center justify-center text-ink">
          <Shield className="w-6 h-6" aria-hidden="true" />
        </div>
        <div className="space-y-1">
          <h1 className="font-display uppercase text-2xl">Khusus Administrator</h1>
          <p className="text-sm text-ink-2">
            Halaman ini hanya dapat diakses oleh akun dengan peran Admin.
          </p>
        </div>
        <div className="pt-2 space-y-2">
          <button
            type="button"
            onClick={() => switchAccount('admin')}
            className="w-full min-h-11 bg-ink text-canvas font-semibold rounded-md text-sm hover:opacity-85"
          >
            Masuk cepat sebagai Admin Stride
          </button>
          <Link
            href="/login"
            className="w-full min-h-11 inline-flex items-center justify-center bg-surface-2 text-ink border border-line font-semibold rounded-md text-sm hover:bg-line"
          >
            Kembali ke halaman login
          </Link>
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
    <div className="space-y-8 py-4">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-line pb-4">
        <div>
          <h1 className="font-display uppercase text-3xl sm:text-4xl">Panel Admin</h1>
          <p className="text-sm text-ink-2 mt-1">
            Verifikasi pengajuan seller, kelola pengguna, kategori, dan moderasi produk.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchAdminData}
            disabled={loading}
            className="min-h-11 px-4 rounded-md bg-surface border border-line hover:bg-surface-2 text-xs font-semibold text-ink inline-flex items-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} aria-hidden="true" />
            <span>Muat ulang</span>
          </button>
        </div>
      </div>

      {statusMessage && (
        <div
          role="status"
          className={`p-4 rounded-md border flex items-center justify-between text-xs font-semibold ${
            statusMessage.type === 'success'
              ? 'bg-surface border-ok text-ok'
              : 'bg-surface border-accent text-accent'
          }`}
        >
          <span>{statusMessage.text}</span>
          <button
            type="button"
            onClick={() => setStatusMessage(null)}
            aria-label="Tutup pemberitahuan"
            className="w-8 h-8 inline-flex items-center justify-center rounded hover:bg-surface-2 text-ink"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      )}

      {loadError && (
        <div role="alert" className="p-4 rounded-xl bg-surface border border-accent text-xs flex items-center justify-between">
          <span className="text-accent font-medium">{loadError}</span>
          <button type="button" onClick={fetchAdminData} className="px-3 py-1.5 rounded bg-ink text-canvas font-semibold">
            Coba lagi
          </button>
        </div>
      )}

      {/* Navigasi tab utama */}
      <div className="flex flex-wrap gap-2 border-b border-line pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('pending')}
          className={`min-h-11 px-4 rounded-md text-xs font-semibold inline-flex items-center gap-2 border transition-colors ${
            activeTab === 'pending'
              ? 'bg-ink text-canvas border-ink'
              : 'bg-surface text-ink border-line hover:bg-surface-2'
          }`}
        >
          <Clock className="w-4 h-4" aria-hidden="true" />
          <span>Verifikasi seller ({pendingSellersList.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('users')}
          className={`min-h-11 px-4 rounded-md text-xs font-semibold inline-flex items-center gap-2 border transition-colors ${
            activeTab === 'users'
              ? 'bg-ink text-canvas border-ink'
              : 'bg-surface text-ink border-line hover:bg-surface-2'
          }`}
        >
          <Users className="w-4 h-4" aria-hidden="true" />
          <span>Pengguna ({usersList.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('categories')}
          className={`min-h-11 px-4 rounded-md text-xs font-semibold inline-flex items-center gap-2 border transition-colors ${
            activeTab === 'categories'
              ? 'bg-ink text-canvas border-ink'
              : 'bg-surface text-ink border-line hover:bg-surface-2'
          }`}
        >
          <FolderTree className="w-4 h-4" aria-hidden="true" />
          <span>Kategori ({categoriesList.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('products')}
          className={`min-h-11 px-4 rounded-md text-xs font-semibold inline-flex items-center gap-2 border transition-colors ${
            activeTab === 'products'
              ? 'bg-ink text-canvas border-ink'
              : 'bg-surface text-ink border-line hover:bg-surface-2'
          }`}
        >
          <Package className="w-4 h-4" aria-hidden="true" />
          <span>Moderasi produk ({productsList.length})</span>
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
            setDeleteConfirm({ isOpen: true, type: 'user', id: u.id, title: `Hapus akun: ${u.name} (${u.email})` })
          }
        />
      )}

      {activeTab === 'categories' && (
        <AdminCategoriesTab
          categories={categoriesList}
          onAdd={() => setCategoryModal({ isOpen: true, isEdit: false, id: null, name: '', slug: '', description: '' })}
          onEdit={(cat) => setCategoryModal({ isOpen: true, isEdit: true, id: cat.id, name: cat.name, slug: cat.slug, description: cat.description || '' })}
          onDelete={(cat) => setDeleteConfirm({ isOpen: true, type: 'category', id: cat.id, title: `Hapus kategori: ${cat.name}` })}
        />
      )}

      {activeTab === 'products' && (
        <AdminProductsTable
          products={filteredProducts}
          productSearch={productSearch}
          setProductSearch={setProductSearch}
          onDeleteProduct={(p) =>
            setDeleteConfirm({ isOpen: true, type: 'product', id: p.id, title: `Turunkan produk "${p.name}" dari ${p.store_name}` })
          }
        />
      )}

      <AdminStatsGrid stats={data.stats} />

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
