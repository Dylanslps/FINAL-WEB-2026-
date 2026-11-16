'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Store, Package, ShoppingBag, Check, AlertCircle } from 'lucide-react';
import SellerProductsTab from '@/components/seller/SellerProductsTab';
import SellerOrdersTab from '@/components/seller/SellerOrdersTab';
import SellerStoreTab from '@/components/seller/SellerStoreTab';
import SellerProductModal from '@/components/seller/SellerProductModal';

const formatIDR = (num) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);

export default function SellerDashboardPage() {
  const router = useRouter();
  const { user, switchAccount } = useAuth();

  const [activeTab, setActiveTab] = useState('orders');
  const [data, setData] = useState({ store: null, products: [], incomingOrders: [], categories: [] });
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    categoryId: '',
    price: '',
    stock: '',
    imageUrl: '',
    brand: '',
    description: '',
    isFeatured: false,
  });

  const [storeForm, setStoreForm] = useState({ name: '', description: '', logoUrl: '' });
  const [submitting, setSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState({ type: '', text: '' });

  const loadData = useCallback(async () => {
    if (!user || user.role !== 'seller') {
      setLoading(false);
      return;
    }

    if (user.status !== 'approved') {
      router.push('/seller/pending');
      return;
    }

    try {
      setLoadError('');
      const res = await fetch(`/api/seller?sellerId=${user.id}`);
      if (!res.ok) throw new Error('Gagal memuat data toko dari server.');
      const json = await res.json();
      setData({
        store: json.store || null,
        products: Array.isArray(json.products) ? json.products : [],
        incomingOrders: Array.isArray(json.incomingOrders) ? json.incomingOrders : [],
        categories: Array.isArray(json.categories) ? json.categories : [],
      });
      if (json.store) {
        setStoreForm({
          name: json.store.name || '',
          description: json.store.description || '',
          logoUrl: json.store.logo_url || '',
        });
      }
    } catch (err) {
      setLoadError(err.message || 'Gagal memuat data toko.');
    } finally {
      setLoading(false);
    }
  }, [user, router]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const openAddModal = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      categoryId: data.categories[0]?.id || '',
      price: '',
      stock: '',
      imageUrl: 'https://cdn.dummyjson.com/product-images/mens-shoes/nike-air-jordan-1-red-and-black/1.webp',
      brand: 'Stride Studio',
      description: '',
      isFeatured: false,
    });
    setModalOpen(true);
  };

  const openEditModal = (p) => {
    setEditingProduct(p);
    setProductForm({
      name: p.name,
      categoryId: p.category_id,
      price: p.price,
      stock: p.stock,
      imageUrl: p.image_url,
      brand: p.brand || '',
      description: p.description || '',
      isFeatured: Boolean(p.is_featured),
    });
    setModalOpen(true);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedbackMsg({ type: '', text: '' });

    try {
      const action = editingProduct ? 'update_product' : 'create_product';
      const res = await fetch('/api/seller', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          sellerId: user.id,
          productId: editingProduct?.id,
          ...productForm,
        }),
      });

      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || 'Gagal menyimpan produk.');

      setFeedbackMsg({ type: 'success', text: 'Produk berhasil disimpan ke katalog toko.' });
      setModalOpen(false);
      await loadData();
    } catch (err) {
      setFeedbackMsg({ type: 'error', text: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (prodId) => {
    if (!confirm('Hapus produk ini dari katalog toko Anda?')) return;

    try {
      const res = await fetch(`/api/seller?sellerId=${user.id}&productId=${prodId}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const resData = await res.json();
        throw new Error(resData.error || 'Gagal menghapus produk.');
      }
      await loadData();
    } catch (err) {
      setFeedbackMsg({ type: 'error', text: err.message });
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch('/api/seller', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_order_status',
          sellerId: user.id,
          orderId,
          newStatus,
        }),
      });
      if (!res.ok) {
        const resData = await res.json();
        throw new Error(resData.error || 'Gagal mengubah status pesanan.');
      }
      await loadData();
    } catch (err) {
      setFeedbackMsg({ type: 'error', text: err.message });
    }
  };

  const handleStoreSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedbackMsg({ type: '', text: '' });

    try {
      const res = await fetch('/api/seller', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_store',
          sellerId: user.id,
          ...storeForm,
        }),
      });

      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || 'Gagal memperbarui profil toko.');

      setFeedbackMsg({ type: 'success', text: 'Profil toko berhasil diperbarui.' });
      await loadData();
    } catch (err) {
      setFeedbackMsg({ type: 'error', text: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  if (!user || user.role !== 'seller') {
    return (
      <div className="max-w-md mx-auto my-12 text-center space-y-4 p-8 rounded-xl bg-surface border border-line">
        <div className="w-12 h-12 rounded-full bg-surface-2 flex items-center justify-center mx-auto text-ink">
          <Store className="w-6 h-6" aria-hidden="true" />
        </div>
        <h1 className="font-display uppercase text-2xl">Khusus akun Seller</h1>
        <p className="text-sm text-ink-2">
          Masuk dengan akun Seller yang telah disetujui untuk mengelola produk dan memproses pesanan masuk.
        </p>
        <button
          type="button"
          onClick={() => switchAccount('seller')}
          className="w-full min-h-11 rounded-md bg-ink text-canvas font-semibold text-sm hover:opacity-85"
        >
          Masuk sebagai Seller (Sole Vault Jakarta)
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-4">
      <div className="p-6 rounded-xl bg-surface border border-line flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-surface-2 border border-line text-ink flex items-center justify-center flex-shrink-0">
            <Store className="w-6 h-6" aria-hidden="true" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display uppercase text-2xl sm:text-3xl">
                {data.store?.name || 'Toko Seller'}
              </h1>
              <span className="px-2.5 py-0.5 rounded bg-surface-2 text-ok border border-line text-xs font-semibold">
                Disetujui
              </span>
            </div>
            <p className="text-xs text-ink-2 mt-1 max-w-xl">
              {data.store?.description || 'Kelola katalog produk dan proses pesanan masuk dari pembeli.'}
            </p>
          </div>
        </div>

        <div className="md:text-right">
          <p className="text-xs text-ink-2">Pemilik toko</p>
          <p className="text-sm font-semibold">{user.name}</p>
        </div>
      </div>

      {feedbackMsg.text && (
        <div
          role="status"
          className={`p-3.5 rounded-md border text-xs flex items-center gap-2 font-medium ${
            feedbackMsg.type === 'success'
              ? 'bg-surface border-ok text-ok'
              : 'bg-surface border-accent text-accent'
          }`}
        >
          {feedbackMsg.type === 'success' ? (
            <Check className="w-4 h-4" aria-hidden="true" />
          ) : (
            <AlertCircle className="w-4 h-4" aria-hidden="true" />
          )}
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {loadError && (
        <div role="alert" className="p-4 rounded-xl bg-surface border border-accent text-xs flex items-center justify-between">
          <span className="text-accent font-medium">{loadError}</span>
          <button type="button" onClick={loadData} className="px-3 py-1.5 rounded bg-ink text-canvas font-semibold">
            Muat ulang
          </button>
        </div>
      )}

      {/* Navigasi tab: Pesanan masuk diutamakan sebagai keputusan utama seller */}
      <div className="flex flex-wrap items-center gap-2 border-b border-line pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('orders')}
          className={`min-h-11 px-4 rounded-md text-xs font-semibold flex items-center gap-2 border transition-colors ${
            activeTab === 'orders'
              ? 'bg-ink text-canvas border-ink'
              : 'bg-surface text-ink border-line hover:bg-surface-2'
          }`}
        >
          <ShoppingBag className="w-4 h-4" aria-hidden="true" /> Pesanan masuk ({data.incomingOrders.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('products')}
          className={`min-h-11 px-4 rounded-md text-xs font-semibold flex items-center gap-2 border transition-colors ${
            activeTab === 'products'
              ? 'bg-ink text-canvas border-ink'
              : 'bg-surface text-ink border-line hover:bg-surface-2'
          }`}
        >
          <Package className="w-4 h-4" aria-hidden="true" /> Katalog produk ({data.products.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('store')}
          className={`min-h-11 px-4 rounded-md text-xs font-semibold flex items-center gap-2 border transition-colors ${
            activeTab === 'store'
              ? 'bg-ink text-canvas border-ink'
              : 'bg-surface text-ink border-line hover:bg-surface-2'
          }`}
        >
          <Store className="w-4 h-4" aria-hidden="true" /> Profil toko
        </button>
      </div>

      {activeTab === 'orders' && (
        <SellerOrdersTab
          orders={data.incomingOrders}
          formatIDR={formatIDR}
          onUpdateOrderStatus={handleUpdateOrderStatus}
        />
      )}

      {activeTab === 'products' && (
        <SellerProductsTab
          products={data.products}
          loading={loading}
          formatIDR={formatIDR}
          onAddProduct={openAddModal}
          onEditProduct={openEditModal}
          onDeleteProduct={handleDeleteProduct}
        />
      )}

      {activeTab === 'store' && (
        <SellerStoreTab
          storeForm={storeForm}
          setStoreForm={setStoreForm}
          onSubmit={handleStoreSubmit}
          submitting={submitting}
        />
      )}

      <SellerProductModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        editingProduct={editingProduct}
        productForm={productForm}
        setProductForm={setProductForm}
        categories={data.categories}
        onSubmit={handleProductSubmit}
        submitting={submitting}
      />
    </div>
  );
}
