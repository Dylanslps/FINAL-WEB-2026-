'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Store,
  Package,
  ShoppingBag,
  Check,
  AlertCircle,
} from 'lucide-react';
import SellerProductsTab from '@/components/seller/SellerProductsTab';
import SellerOrdersTab from '@/components/seller/SellerOrdersTab';
import SellerStoreTab from '@/components/seller/SellerStoreTab';
import SellerProductModal from '@/components/seller/SellerProductModal';

export default function SellerDashboardPage() {
  const router = useRouter();
  const { user, switchAccount } = useAuth();

  const [activeTab, setActiveTab] = useState('products');
  const [data, setData] = useState({ store: null, products: [], incomingOrders: [], categories: [] });
  const [loading, setLoading] = useState(true);

  // Modal Tambah/Edit Produk State
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

  // Profil Toko State
  const [storeForm, setStoreForm] = useState({ name: '', description: '', logoUrl: '' });
  const [submitting, setSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState({ type: '', text: '' });

  const formatIDR = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

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
      const res = await fetch(`/api/seller?sellerId=${user.id}`);
      if (res.ok) {
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
      }
    } catch (err) {
      console.error(err);
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
      imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800',
      brand: 'VALIANT PRO',
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
      alert(err.message);
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
      alert(err.message);
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
      <div className="max-w-md mx-auto py-16 text-center space-y-4 p-8 rounded-2xl bg-[#121722] border border-[#20293A]">
        <div className="w-12 h-12 rounded-full bg-[#20293A] flex items-center justify-center mx-auto text-[#FF1E27]">
          <Store className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-white font-sans">Akses Khusus Seller</h2>
        <p className="text-xs text-gray-400">
          Anda belum masuk sebagai Seller yang terverifikasi.
        </p>
        <button
          onClick={() => switchAccount('seller')}
          className="w-full py-2.5 rounded-xl bg-[#FF1E27] text-white font-black text-xs hover:bg-[#FFD000] hover:text-black transition-all uppercase tracking-wider"
        >
          Masuk sebagai Seller Approved (Apex Gear)
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-4">
      {/* Header Dashboard Toko */}
      <div className="p-6 rounded-2xl bg-[#121722] border border-[#20293A] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#0A0D14] border border-[#20293A] text-[#FF1E27] flex items-center justify-center flex-shrink-0">
            <Store className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight font-sans">
                {data.store?.name || 'Toko Esports'}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold">
                Approved Merchant
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1 max-w-xl truncate">
              {data.store?.description || 'Pusat gear turnamen resmi di Indonesia.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-[10px] text-gray-400 font-mono">Owner / Merchant:</p>
            <p className="text-xs font-bold text-white font-mono">{user.name}</p>
          </div>
        </div>
      </div>

      {feedbackMsg.text && (
        <div
          className={`p-3.5 rounded-xl border text-xs flex items-center gap-2 font-medium ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
          }`}
        >
          {feedbackMsg.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* Tabs Menu */}
      <div className="flex items-center gap-2 border-b border-[#20293A] pb-1">
        <button
          onClick={() => setActiveTab('products')}
          className={`py-2.5 px-4 rounded-xl text-xs font-bold flex items-center gap-2 transition-all uppercase tracking-wider font-mono ${
            activeTab === 'products'
              ? 'bg-[#FF1E27] text-white shadow-lg shadow-[#FF1E27]/20'
              : 'text-gray-400 hover:text-white hover:bg-[#121722]'
          }`}
        >
          <Package className="w-4 h-4" /> Kelola Produk ({data.products.length})
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`py-2.5 px-4 rounded-xl text-xs font-bold flex items-center gap-2 transition-all uppercase tracking-wider font-mono ${
            activeTab === 'orders'
              ? 'bg-[#FFD000] text-black shadow-lg shadow-[#FFD000]/20'
              : 'text-gray-400 hover:text-white hover:bg-[#121722]'
          }`}
        >
          <ShoppingBag className="w-4 h-4" /> Pesanan Masuk ({data.incomingOrders.length})
        </button>

        <button
          onClick={() => setActiveTab('store')}
          className={`py-2.5 px-4 rounded-xl text-xs font-bold flex items-center gap-2 transition-all uppercase tracking-wider font-mono ${
            activeTab === 'store'
              ? 'bg-[#20293A] text-white border border-gray-500'
              : 'text-gray-400 hover:text-white hover:bg-[#121722]'
          }`}
        >
          <Store className="w-4 h-4" /> Profil Toko
        </button>
      </div>

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

      {activeTab === 'orders' && (
        <SellerOrdersTab
          orders={data.incomingOrders}
          formatIDR={formatIDR}
          onUpdateOrderStatus={handleUpdateOrderStatus}
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
